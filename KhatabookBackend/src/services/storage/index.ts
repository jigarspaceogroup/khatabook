/**
 * Storage Services
 * Export all storage-related services and types
 */

// Services
export { R2Service } from './R2Service';
export { CloudinaryService } from './CloudinaryService';
export { SupabaseStorageService, SupabaseBucket } from './SupabaseStorageService';
export { StorageFactory } from './StorageFactory';

// Types
export type {
  R2UploadResult,
  CloudinaryUploadResult,
  PresignedUrl,
  CloudinaryTransformation,
  CloudinaryUploadSignature,
  CloudinaryUploadParams,
  FileMetadata,
} from './types';

// Classes and Enums (not types)
export {
  StorageError,
  CloudinaryFolder,
  R2FileType,
} from './types';
