/**
 * Cloudflare R2 Storage Service
 * S3-compatible storage for PDFs, documents, and reports
 *
 * Features:
 * - Upload/download files
 * - Generate presigned URLs for secure client uploads
 * - Delete files
 * - List files in bucket
 *
 * Credentials Setup:
 * 1. Create R2 bucket in Cloudflare dashboard
 * 2. Generate API tokens with R2 permissions
 * 3. Add credentials to .env:
 *    - CLOUDFLARE_R2_ACCOUNT_ID
 *    - CLOUDFLARE_R2_ACCESS_KEY_ID
 *    - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *    - CLOUDFLARE_R2_BUCKET_NAME
 *    - CLOUDFLARE_R2_PUBLIC_URL (optional, for public access)
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../../config';
import { R2UploadResult, PresignedUrl, StorageError } from './types';

export class R2Service {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl?: string;

  constructor() {
    this.validateConfig();

    // Initialize S3 client with R2 endpoint
    this.s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto' region
      endpoint: config.cloudflareR2.endpoint,
      credentials: {
        accessKeyId: config.cloudflareR2.accessKey!,
        secretAccessKey: config.cloudflareR2.secretKey!,
      },
    });

    this.bucketName = config.cloudflareR2.bucketName!;
    this.publicUrl = config.cloudflareR2.publicUrl;
  }

  /**
   * Validate that required R2 credentials are configured
   */
  private validateConfig(): void {
    const required = [
      'accessKey',
      'secretKey',
      'bucketName',
      'endpoint',
    ] as const;

    const missing = required.filter(
      (key) => !config.cloudflareR2[key]
    );

    if (missing.length > 0) {
      throw new StorageError(
        `Missing R2 configuration: ${missing.join(', ')}. ` +
        'Please check your environment variables.',
        'R2_CONFIG_MISSING',
        500
      );
    }
  }

  /**
   * Upload a file to R2
   * @param file - File buffer
   * @param key - File key (path) in bucket
   * @param contentType - MIME type of the file
   * @param metadata - Optional metadata
   * @returns Upload result with URL
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<R2UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);

      const url = this.publicUrl
        ? `${this.publicUrl}/${key}`
        : `${config.cloudflareR2.endpoint}/${this.bucketName}/${key}`;

      return {
        key,
        url,
        bucket: this.bucketName,
        contentType,
        size: file.length,
      };
    } catch (error) {
      throw new StorageError(
        `Failed to upload file to R2: ${(error as Error).message}`,
        'R2_UPLOAD_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Download a file from R2
   * @param key - File key (path) in bucket
   * @returns File buffer
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new StorageError(
          'File has no content',
          'R2_EMPTY_FILE',
          404
        );
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      if ((error as any).name === 'NoSuchKey') {
        throw new StorageError(
          `File not found: ${key}`,
          'R2_FILE_NOT_FOUND',
          404
        );
      }

      throw new StorageError(
        `Failed to download file from R2: ${(error as Error).message}`,
        'R2_DOWNLOAD_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Delete a file from R2
   * @param key - File key (path) in bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new StorageError(
        `Failed to delete file from R2: ${(error as Error).message}`,
        'R2_DELETE_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Check if a file exists in R2
   * @param key - File key (path) in bucket
   * @returns True if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if ((error as any).name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata
   * @param key - File key (path) in bucket
   * @returns File metadata
   */
  async getFileMetadata(key: string): Promise<{
    contentType: string;
    size: number;
    lastModified: Date;
    metadata?: Record<string, string>;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType || 'application/octet-stream',
        size: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        metadata: response.Metadata,
      };
    } catch (error) {
      if ((error as any).name === 'NotFound') {
        throw new StorageError(
          `File not found: ${key}`,
          'R2_FILE_NOT_FOUND',
          404
        );
      }

      throw new StorageError(
        `Failed to get file metadata: ${(error as Error).message}`,
        'R2_METADATA_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Generate a presigned URL for downloading a file
   * @param key - File key (path) in bucket
   * @param expiresIn - URL expiry time in seconds (default: 900 = 15 minutes)
   * @returns Presigned URL
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 900
  ): Promise<PresignedUrl> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        url,
        key,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      };
    } catch (error) {
      throw new StorageError(
        `Failed to generate presigned download URL: ${(error as Error).message}`,
        'R2_PRESIGNED_URL_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Generate a presigned URL for uploading a file directly from client
   * @param key - File key (path) in bucket
   * @param contentType - MIME type of the file
   * @param expiresIn - URL expiry time in seconds (default: 900 = 15 minutes)
   * @returns Presigned URL for PUT request
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 900
  ): Promise<PresignedUrl> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        url,
        key,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      };
    } catch (error) {
      throw new StorageError(
        `Failed to generate presigned upload URL: ${(error as Error).message}`,
        'R2_PRESIGNED_UPLOAD_FAILED',
        500,
        error
      );
    }
  }

  /**
   * List files in a folder (prefix)
   * @param prefix - Folder prefix
   * @param maxKeys - Maximum number of keys to return
   * @returns List of file keys
   */
  async listFiles(
    prefix?: string,
    maxKeys: number = 1000
  ): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const response = await this.s3Client.send(command);

      return response.Contents?.map((item) => item.Key!) || [];
    } catch (error) {
      throw new StorageError(
        `Failed to list files: ${(error as Error).message}`,
        'R2_LIST_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Get public URL for a file (if bucket has public access configured)
   * @param key - File key (path) in bucket
   * @returns Public URL
   */
  getPublicUrl(key: string): string {
    if (!this.publicUrl) {
      throw new StorageError(
        'Public URL not configured for R2 bucket',
        'R2_PUBLIC_URL_NOT_CONFIGURED',
        500
      );
    }

    return `${this.publicUrl}/${key}`;
  }
}

/**
 * Example Usage:
 *
 * // Initialize service
 * const r2 = new R2Service();
 *
 * // Upload a PDF invoice
 * const pdfBuffer = await generateInvoicePDF(invoice);
 * const result = await r2.uploadFile(
 *   pdfBuffer,
 *   `invoices/${userId}/${invoiceId}.pdf`,
 *   'application/pdf',
 *   { invoiceId, userId }
 * );
 * console.log('Invoice uploaded:', result.url);
 *
 * // Generate presigned URL for client upload
 * const presigned = await r2.getPresignedUploadUrl(
 *   `reports/${userId}/${reportId}.pdf`,
 *   'application/pdf',
 *   900 // 15 minutes
 * );
 * // Send presigned.url to client for direct upload
 *
 * // Download a file
 * const fileBuffer = await r2.downloadFile(`invoices/${userId}/${invoiceId}.pdf`);
 *
 * // Delete a file
 * await r2.deleteFile(`invoices/${userId}/${invoiceId}.pdf`);
 *
 * // Check if file exists
 * const exists = await r2.fileExists(`invoices/${userId}/${invoiceId}.pdf`);
 *
 * // Get file metadata
 * const metadata = await r2.getFileMetadata(`invoices/${userId}/${invoiceId}.pdf`);
 * console.log('File size:', metadata.size, 'bytes');
 *
 * // List all invoices for a user
 * const invoices = await r2.listFiles(`invoices/${userId}/`);
 * console.log('User invoices:', invoices);
 */
