/**
 * Storage Factory
 * Factory pattern for accessing storage services
 *
 * Usage:
 * - Use R2 for PDFs, documents, and reports
 * - Use Cloudinary for images (receipts, logos, products)
 *
 * Benefits:
 * - Singleton instances (one instance per service type)
 * - Centralized access to storage services
 * - Easy to mock for testing
 */

import { R2Service } from './R2Service';
import { CloudinaryService } from './CloudinaryService';
import { SupabaseStorageService } from './SupabaseStorageService';

export class StorageFactory {
  private static r2Instance: R2Service | null = null;
  private static cloudinaryInstance: CloudinaryService | null = null;
  private static supabaseInstance: SupabaseStorageService | null = null;

  /**
   * Get R2 storage service instance (singleton)
   * Use for: PDFs, Excel files, CSV exports, JSON backups
   */
  static getR2Storage(): R2Service {
    if (!this.r2Instance) {
      this.r2Instance = new R2Service();
    }
    return this.r2Instance;
  }

  /**
   * Get Cloudinary storage service instance (singleton)
   * Use for: Images (receipts, logos, product photos, profile pictures)
   */
  static getCloudinaryStorage(): CloudinaryService {
    if (!this.cloudinaryInstance) {
      this.cloudinaryInstance = new CloudinaryService();
    }
    return this.cloudinaryInstance;
  }

  /**
   * Get Supabase storage service instance (singleton)
   * Use for: PDFs, documents, images (all file types)
   */
  static getSupabaseStorage(): SupabaseStorageService {
    if (!this.supabaseInstance) {
      this.supabaseInstance = new SupabaseStorageService();
    }
    return this.supabaseInstance;
  }

  /**
   * Reset all instances (useful for testing)
   */
  static reset(): void {
    this.r2Instance = null;
    this.cloudinaryInstance = null;
    this.supabaseInstance = null;
  }

  /**
   * Check if Supabase is configured
   */
  static isSupabaseConfigured(): boolean {
    try {
      this.getSupabaseStorage();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if R2 is configured
   */
  static isR2Configured(): boolean {
    try {
      this.getR2Storage();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Cloudinary is configured
   */
  static isCloudinaryConfigured(): boolean {
    try {
      this.getCloudinaryStorage();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Example Usage:
 *
 * // Upload invoice PDF to R2
 * const r2 = StorageFactory.getR2Storage();
 * const pdfResult = await r2.uploadFile(
 *   pdfBuffer,
 *   `invoices/${userId}/${invoiceId}.pdf`,
 *   'application/pdf'
 * );
 *
 * // Upload receipt image to Cloudinary
 * const cloudinary = StorageFactory.getCloudinaryStorage();
 * const imageResult = await cloudinary.uploadImage(
 *   imageBuffer,
 *   CloudinaryFolder.TRANSACTION_ATTACHMENTS,
 *   { tags: ['receipt'] }
 * );
 *
 * // Generate presigned URL for client upload (PDF)
 * const presignedPdf = await r2.getPresignedUploadUrl(
 *   `reports/${userId}/${reportId}.pdf`,
 *   'application/pdf',
 *   900
 * );
 *
 * // Generate signature for client image upload
 * const imageSignature = await cloudinary.generateUploadSignature({
 *   folder: CloudinaryFolder.PRODUCT_IMAGES
 * });
 *
 * // Check if services are configured
 * if (StorageFactory.isR2Configured()) {
 *   console.log('R2 storage is ready');
 * }
 *
 * if (StorageFactory.isCloudinaryConfigured()) {
 *   console.log('Cloudinary storage is ready');
 * }
 */
