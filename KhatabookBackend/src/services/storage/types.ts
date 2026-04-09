/**
 * Storage Service Types
 * Shared interfaces and types for file storage operations
 */

/**
 * Result from uploading a file to R2
 */
export interface R2UploadResult {
  key: string;
  url: string;
  bucket: string;
  contentType: string;
  size?: number;
}

/**
 * Result from uploading an image to Cloudinary
 */
export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: string;
  createdAt: string;
}

/**
 * Presigned URL for direct client uploads
 */
export interface PresignedUrl {
  url: string;
  key: string;
  expiresAt: Date;
  fields?: Record<string, string>;
}

/**
 * Cloudinary transformation options
 */
export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'fill' | 'limit' | 'pad' | 'crop' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  effect?: string;
}

/**
 * Cloudinary upload signature for secure client uploads
 */
export interface CloudinaryUploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}

/**
 * Parameters for generating Cloudinary upload signature
 */
export interface CloudinaryUploadParams {
  folder?: string;
  publicId?: string;
  tags?: string[];
  context?: Record<string, string>;
  uploadPreset?: string;
}

/**
 * File upload metadata
 */
export interface FileMetadata {
  originalName?: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  uploadedAt?: Date;
}

/**
 * Storage operation error
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Cloudinary folder presets
 */
export enum CloudinaryFolder {
  TRANSACTION_ATTACHMENTS = 'transaction_attachments',
  LOGOS = 'logos',
  PRODUCT_IMAGES = 'product_images',
  PROFILE_PICTURES = 'profile_pictures',
  INVOICE_LOGOS = 'invoice_logos',
}

/**
 * R2 file types
 */
export enum R2FileType {
  PDF = 'application/pdf',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV = 'text/csv',
  JSON = 'application/json',
}
