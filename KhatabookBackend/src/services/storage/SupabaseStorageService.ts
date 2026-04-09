/**
 * Supabase Storage Service
 * Handles file storage operations using Supabase Storage
 *
 * Features:
 * - Upload files to Supabase Storage buckets
 * - Download files from buckets
 * - Generate signed URLs for secure access
 * - Delete files
 * - List files in buckets
 *
 * Buckets:
 * - documents: Private bucket for PDFs, invoices, reports
 * - images: Public bucket for product images, logos
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config';
import { StorageError } from './types';
import logger from '../../utils/logger';

export enum SupabaseBucket {
  DOCUMENTS = 'documents',
  IMAGES = 'images',
}

export interface SupabaseUploadResult {
  path: string;
  url: string;
  bucket: string;
}

export interface SupabaseSignedUrlResult {
  signedUrl: string;
  path: string;
  expiresIn: number;
}

export class SupabaseStorageService {
  private client: SupabaseClient;

  constructor() {
    if (!config.supabase.url || !config.supabase.serviceKey) {
      throw new StorageError(
        'Supabase configuration is missing',
        'SUPABASE_CONFIG_MISSING',
        500
      );
    }

    this.client = createClient(
      config.supabase.url,
      config.supabase.serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    logger.info('SupabaseStorageService initialized');
  }

  /**
   * Upload a file to Supabase Storage
   *
   * @param file - File buffer
   * @param path - File path in bucket (e.g., 'invoices/user123/invoice.pdf')
   * @param bucket - Bucket name
   * @param contentType - MIME type
   * @returns Upload result with public/signed URL
   */
  async uploadFile(
    file: Buffer,
    path: string,
    bucket: SupabaseBucket = SupabaseBucket.DOCUMENTS,
    contentType?: string
  ): Promise<SupabaseUploadResult> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          upsert: false,
        });

      if (error) {
        throw new StorageError(
          `Failed to upload file to Supabase: ${error.message}`,
          'SUPABASE_UPLOAD_FAILED',
          500,
          { path, bucket, error: error.message }
        );
      }

      // Get public URL for public buckets, signed URL for private
      const url = bucket === SupabaseBucket.IMAGES
        ? this.getPublicUrl(bucket, path)
        : (await this.getSignedUrl(bucket, path, 3600)).signedUrl;

      logger.info('File uploaded to Supabase', { path, bucket });

      return {
        path: data.path,
        url,
        bucket,
      };
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to upload file to Supabase',
        'SUPABASE_UPLOAD_FAILED',
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Download a file from Supabase Storage
   *
   * @param path - File path in bucket
   * @param bucket - Bucket name
   * @returns File buffer
   */
  async downloadFile(path: string, bucket: SupabaseBucket = SupabaseBucket.DOCUMENTS): Promise<Buffer> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) {
        throw new StorageError(
          `Failed to download file from Supabase: ${error.message}`,
          'SUPABASE_DOWNLOAD_FAILED',
          error.message.includes('not found') ? 404 : 500,
          { path, bucket }
        );
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      logger.debug('File downloaded from Supabase', { path, bucket, size: buffer.length });

      return buffer;
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to download file from Supabase',
        'SUPABASE_DOWNLOAD_FAILED',
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Delete a file from Supabase Storage
   *
   * @param path - File path in bucket
   * @param bucket - Bucket name
   */
  async deleteFile(path: string, bucket: SupabaseBucket = SupabaseBucket.DOCUMENTS): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new StorageError(
          `Failed to delete file from Supabase: ${error.message}`,
          'SUPABASE_DELETE_FAILED',
          500,
          { path, bucket }
        );
      }

      logger.info('File deleted from Supabase', { path, bucket });
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to delete file from Supabase',
        'SUPABASE_DELETE_FAILED',
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get signed URL for private file access
   *
   * @param bucket - Bucket name
   * @param path - File path
   * @param expiresIn - Expiry in seconds (default: 1 hour)
   * @returns Signed URL with expiry
   */
  async getSignedUrl(
    bucket: SupabaseBucket,
    path: string,
    expiresIn: number = 3600
  ): Promise<SupabaseSignedUrlResult> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        throw new StorageError(
          `Failed to generate signed URL: ${error.message}`,
          'SUPABASE_SIGNED_URL_FAILED',
          500,
          { path, bucket }
        );
      }

      return {
        signedUrl: data.signedUrl,
        path,
        expiresIn,
      };
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to generate signed URL',
        'SUPABASE_SIGNED_URL_FAILED',
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get public URL for files in public buckets
   *
   * @param bucket - Bucket name
   * @param path - File path
   * @returns Public URL
   */
  getPublicUrl(bucket: SupabaseBucket, path: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * List files in a bucket
   *
   * @param bucket - Bucket name
   * @param path - Folder path (optional)
   * @returns Array of file objects
   */
  async listFiles(bucket: SupabaseBucket, path: string = ''): Promise<any[]> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .list(path);

      if (error) {
        throw new StorageError(
          `Failed to list files: ${error.message}`,
          'SUPABASE_LIST_FAILED',
          500,
          { bucket, path }
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(
        'Failed to list files',
        'SUPABASE_LIST_FAILED',
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Check if a file exists
   *
   * @param path - File path
   * @param bucket - Bucket name
   * @returns True if file exists
   */
  async fileExists(path: string, bucket: SupabaseBucket = SupabaseBucket.DOCUMENTS): Promise<boolean> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      return !error && !!data;
    } catch {
      return false;
    }
  }
}

// Usage example:
/*
import { SupabaseStorageService, SupabaseBucket } from './SupabaseStorageService';

const storage = new SupabaseStorageService();

// Upload invoice PDF
const result = await storage.uploadFile(
  pdfBuffer,
  `invoices/${userId}/${invoiceId}.pdf`,
  SupabaseBucket.DOCUMENTS,
  'application/pdf'
);

// Get signed URL (valid for 1 hour)
const { signedUrl } = await storage.getSignedUrl(
  SupabaseBucket.DOCUMENTS,
  `invoices/${userId}/${invoiceId}.pdf`,
  3600
);

// Download file
const fileBuffer = await storage.downloadFile(
  `invoices/${userId}/${invoiceId}.pdf`,
  SupabaseBucket.DOCUMENTS
);
*/
