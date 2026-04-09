/**
 * Cloudinary Image Storage Service
 * Cloud-based image storage with automatic optimization and transformations
 *
 * Features:
 * - Upload images with automatic format optimization
 * - Apply transformations (resize, crop, compress)
 * - Generate transformed URLs
 * - Secure upload signatures for client-side uploads
 * - Delete images
 *
 * Credentials Setup:
 * 1. Create account at cloudinary.com
 * 2. Get credentials from dashboard
 * 3. Add to .env:
 *    - CLOUDINARY_CLOUD_NAME
 *    - CLOUDINARY_API_KEY
 *    - CLOUDINARY_API_SECRET
 *
 * Upload Presets:
 * - transaction_attachments: Receipt/bill images
 * - logos: Business logos
 * - product_images: Product photos for inventory
 * - profile_pictures: User profile photos
 */

import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';
import { config } from '../../config';
import {
  CloudinaryUploadResult,
  CloudinaryUploadSignature,
  CloudinaryUploadParams,
  CloudinaryTransformation,
  CloudinaryFolder,
  StorageError,
} from './types';

export class CloudinaryService {
  constructor() {
    this.validateConfig();
    this.configureCloudinary();
  }

  /**
   * Validate that required Cloudinary credentials are configured
   */
  private validateConfig(): void {
    const required = ['cloudName', 'apiKey', 'apiSecret'] as const;

    const missing = required.filter(
      (key) => !config.cloudinary[key]
    );

    if (missing.length > 0) {
      throw new StorageError(
        `Missing Cloudinary configuration: ${missing.join(', ')}. ` +
        'Please check your environment variables.',
        'CLOUDINARY_CONFIG_MISSING',
        500
      );
    }
  }

  /**
   * Configure Cloudinary SDK
   */
  private configureCloudinary(): void {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true, // Always use HTTPS
    });
  }

  /**
   * Convert buffer to readable stream for Cloudinary upload
   */
  private bufferToStream(buffer: Buffer): Readable {
    const readable = new Readable();
    readable._read = () => {}; // No-op
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  /**
   * Upload an image to Cloudinary
   * @param file - Image buffer
   * @param folder - Cloudinary folder (e.g., 'transaction_attachments')
   * @param options - Upload options (publicId, tags, etc.)
   * @returns Upload result with URLs
   */
  async uploadImage(
    file: Buffer,
    folder: CloudinaryFolder | string,
    options?: {
      publicId?: string;
      tags?: string[];
      context?: Record<string, string>;
      transformation?: CloudinaryTransformation;
      overwrite?: boolean;
    }
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions: UploadApiOptions = {
        folder,
        resource_type: 'image',
        use_filename: false,
        unique_filename: true,
        overwrite: options?.overwrite || false,
      };

      if (options?.publicId) {
        uploadOptions.public_id = options.publicId;
      }

      if (options?.tags) {
        uploadOptions['tags'] = options.tags.join(',');
      }

      if (options?.context) {
        uploadOptions['context'] = options.context;
      }

      if (options?.transformation) {
        uploadOptions.transformation = this.buildTransformation(options.transformation);
      }

      // Upload via stream
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('No result from Cloudinary'));
            }
          }
        );

        this.bufferToStream(file).pipe(uploadStream);
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        resourceType: result.resource_type,
        createdAt: result.created_at,
      };
    } catch (error) {
      throw new StorageError(
        `Failed to upload image to Cloudinary: ${(error as Error).message}`,
        'CLOUDINARY_UPLOAD_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param publicId - Cloudinary public ID
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new StorageError(
        `Failed to delete image from Cloudinary: ${(error as Error).message}`,
        'CLOUDINARY_DELETE_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Delete multiple images from Cloudinary
   * @param publicIds - Array of Cloudinary public IDs
   */
  async deleteImages(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      throw new StorageError(
        `Failed to delete images from Cloudinary: ${(error as Error).message}`,
        'CLOUDINARY_DELETE_BULK_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Build transformation object for Cloudinary
   */
  private buildTransformation(transform: CloudinaryTransformation): any {
    const transformation: any = {};

    if (transform.width) transformation.width = transform.width;
    if (transform.height) transformation.height = transform.height;
    if (transform.crop) transformation.crop = transform.crop;
    if (transform.quality) transformation.quality = transform.quality;
    if (transform.format) transformation.format = transform.format;
    if (transform.gravity) transformation.gravity = transform.gravity;
    if (transform.effect) transformation.effect = transform.effect;

    return transformation;
  }

  /**
   * Get a transformed image URL
   * @param publicId - Cloudinary public ID
   * @param transformations - Transformations to apply
   * @returns Transformed image URL
   */
  getTransformedUrl(
    publicId: string,
    transformations: CloudinaryTransformation
  ): string {
    try {
      return cloudinary.url(publicId, {
        secure: true,
        ...this.buildTransformation(transformations),
      });
    } catch (error) {
      throw new StorageError(
        `Failed to generate transformed URL: ${(error as Error).message}`,
        'CLOUDINARY_TRANSFORM_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Get thumbnail URL (preset transformation)
   * @param publicId - Cloudinary public ID
   * @param size - Thumbnail size in pixels (default: 150)
   * @returns Thumbnail URL
   */
  getThumbnailUrl(publicId: string, size: number = 150): string {
    return this.getTransformedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Get optimized URL for web display
   * @param publicId - Cloudinary public ID
   * @param maxWidth - Maximum width in pixels (default: 1200)
   * @returns Optimized URL
   */
  getOptimizedUrl(publicId: string, maxWidth: number = 1200): string {
    return this.getTransformedUrl(publicId, {
      width: maxWidth,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    });
  }

  /**
   * Generate upload signature for secure client-side uploads
   * This allows clients to upload directly to Cloudinary without exposing API secret
   *
   * @param params - Upload parameters
   * @returns Signature and timestamp for client upload
   */
  async generateUploadSignature(
    params: CloudinaryUploadParams
  ): Promise<CloudinaryUploadSignature> {
    try {
      const timestamp = Math.round(Date.now() / 1000);

      // Build parameters for signature
      const signatureParams: Record<string, any> = {
        timestamp,
      };

      if (params.folder) {
        signatureParams['folder'] = params.folder;
      }

      if (params.publicId) {
        signatureParams['public_id'] = params.publicId;
      }

      if (params.tags && params.tags.length > 0) {
        signatureParams['tags'] = params.tags.join(',');
      }

      if (params.context) {
        signatureParams['context'] = Object.entries(params.context)
          .map(([key, value]) => `${key}=${value}`)
          .join('|');
      }

      if (params.uploadPreset) {
        signatureParams['upload_preset'] = params.uploadPreset;
      }

      // Generate signature
      const signature = cloudinary.utils.api_sign_request(
        signatureParams,
        config.cloudinary.apiSecret!
      );

      return {
        signature,
        timestamp,
        apiKey: config.cloudinary.apiKey!,
        cloudName: config.cloudinary.cloudName!,
      };
    } catch (error) {
      throw new StorageError(
        `Failed to generate upload signature: ${(error as Error).message}`,
        'CLOUDINARY_SIGNATURE_FAILED',
        500,
        error
      );
    }
  }

  /**
   * Get image details
   * @param publicId - Cloudinary public ID
   * @returns Image metadata
   */
  async getImageDetails(publicId: string): Promise<{
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    url: string;
    secureUrl: string;
    createdAt: string;
  }> {
    try {
      const result = await cloudinary.api.resource(publicId);

      return {
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        url: result.url,
        secureUrl: result.secure_url,
        createdAt: result.created_at,
      };
    } catch (error) {
      if ((error as any).error?.http_code === 404) {
        throw new StorageError(
          `Image not found: ${publicId}`,
          'CLOUDINARY_IMAGE_NOT_FOUND',
          404
        );
      }

      throw new StorageError(
        `Failed to get image details: ${(error as Error).message}`,
        'CLOUDINARY_DETAILS_FAILED',
        500,
        error
      );
    }
  }

  /**
   * List images in a folder
   * @param folder - Cloudinary folder
   * @param maxResults - Maximum results (default: 100)
   * @returns Array of image public IDs
   */
  async listImages(
    folder: CloudinaryFolder | string,
    maxResults: number = 100
  ): Promise<string[]> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults,
      });

      return result.resources.map((resource: any) => resource.public_id);
    } catch (error) {
      throw new StorageError(
        `Failed to list images: ${(error as Error).message}`,
        'CLOUDINARY_LIST_FAILED',
        500,
        error
      );
    }
  }
}

/**
 * Example Usage:
 *
 * // Initialize service
 * const cloudinary = new CloudinaryService();
 *
 * // Upload a transaction attachment
 * const imageBuffer = await readFileBuffer('receipt.jpg');
 * const result = await cloudinary.uploadImage(
 *   imageBuffer,
 *   CloudinaryFolder.TRANSACTION_ATTACHMENTS,
 *   {
 *     tags: ['receipt', 'transaction-123'],
 *     context: { transactionId: '123', userId: '456' }
 *   }
 * );
 * console.log('Image uploaded:', result.secureUrl);
 *
 * // Upload with transformation (resize)
 * const logoResult = await cloudinary.uploadImage(
 *   logoBuffer,
 *   CloudinaryFolder.LOGOS,
 *   {
 *     publicId: 'my-business-logo',
 *     transformation: {
 *       width: 500,
 *       height: 500,
 *       crop: 'fill',
 *       quality: 'auto'
 *     }
 *   }
 * );
 *
 * // Get thumbnail URL
 * const thumbnailUrl = cloudinary.getThumbnailUrl(result.publicId, 150);
 *
 * // Get optimized URL for web
 * const webUrl = cloudinary.getOptimizedUrl(result.publicId, 1200);
 *
 * // Generate signature for client upload
 * const signature = await cloudinary.generateUploadSignature({
 *   folder: CloudinaryFolder.PRODUCT_IMAGES,
 *   tags: ['product', 'inventory']
 * });
 * // Send signature to client for direct upload
 *
 * // Delete an image
 * await cloudinary.deleteImage(result.publicId);
 *
 * // Get image details
 * const details = await cloudinary.getImageDetails(result.publicId);
 * console.log('Image size:', details.bytes, 'bytes');
 *
 * // List all transaction attachments
 * const attachments = await cloudinary.listImages(
 *   CloudinaryFolder.TRANSACTION_ATTACHMENTS
 * );
 */
