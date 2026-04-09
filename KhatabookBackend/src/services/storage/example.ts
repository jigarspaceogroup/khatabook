/**
 * Storage Services - Example Usage
 *
 * This file demonstrates how to use R2Service and CloudinaryService
 * Run with: ts-node src/services/storage/example.ts
 *
 * NOTE: Requires valid credentials in .env file
 */

import { StorageFactory, CloudinaryFolder, R2FileType } from './index';

/**
 * Example 1: Upload and download PDF to R2
 */
async function exampleR2Upload() {
  console.log('\n=== R2 Example: Upload PDF ===');

  const r2 = StorageFactory.getR2Storage();

  // Create a sample PDF buffer (in real app, this would be generated PDF)
  const samplePDF = Buffer.from('Sample PDF content');
  const userId = 'user-123';
  const invoiceId = 'inv-456';
  const key = `invoices/${userId}/${invoiceId}.pdf`;

  try {
    // Upload PDF
    const result = await r2.uploadFile(
      samplePDF,
      key,
      R2FileType.PDF,
      {
        userId,
        invoiceId,
        createdAt: new Date().toISOString(),
      }
    );

    console.log('Upload successful!');
    console.log('Key:', result.key);
    console.log('URL:', result.url);
    console.log('Size:', result.size, 'bytes');

    // Download the file back
    const downloaded = await r2.downloadFile(key);
    console.log('Downloaded:', downloaded.length, 'bytes');

    // Get file metadata
    const metadata = await r2.getFileMetadata(key);
    console.log('Content-Type:', metadata.contentType);
    console.log('Last Modified:', metadata.lastModified);

    // Check if file exists
    const exists = await r2.fileExists(key);
    console.log('File exists:', exists);

    // Clean up - delete the file
    await r2.deleteFile(key);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('R2 Error:', error);
  }
}

/**
 * Example 2: Generate presigned URL for client upload
 */
async function examplePresignedUpload() {
  console.log('\n=== R2 Example: Presigned URL ===');

  const r2 = StorageFactory.getR2Storage();

  try {
    const userId = 'user-123';
    const reportId = 'report-789';
    const key = `reports/${userId}/${reportId}.pdf`;

    // Generate presigned URL (valid for 15 minutes)
    const presigned = await r2.getPresignedUploadUrl(
      key,
      R2FileType.PDF,
      900 // 15 minutes
    );

    console.log('Presigned Upload URL generated!');
    console.log('URL:', presigned.url.substring(0, 100) + '...');
    console.log('Key:', presigned.key);
    console.log('Expires at:', presigned.expiresAt);

    // In a real app, you would send this URL to the client
    // Client would upload directly using PUT request:
    // await fetch(presigned.url, {
    //   method: 'PUT',
    //   body: pdfFile,
    //   headers: { 'Content-Type': 'application/pdf' }
    // });
  } catch (error) {
    console.error('Presigned URL Error:', error);
  }
}

/**
 * Example 3: Upload image to Cloudinary
 */
async function exampleCloudinaryUpload() {
  console.log('\n=== Cloudinary Example: Upload Image ===');

  const cloudinary = StorageFactory.getCloudinaryStorage();

  // Create a sample image buffer (in real app, this would be actual image data)
  const sampleImage = Buffer.from('Sample image content');
  const transactionId = 'txn-123';

  try {
    // Upload image
    const result = await cloudinary.uploadImage(
      sampleImage,
      CloudinaryFolder.TRANSACTION_ATTACHMENTS,
      {
        tags: ['receipt', `transaction-${transactionId}`],
        context: {
          transactionId,
          uploadedBy: 'user-123',
        },
      }
    );

    console.log('Upload successful!');
    console.log('Public ID:', result.publicId);
    console.log('Secure URL:', result.secureUrl);
    console.log('Format:', result.format);
    console.log('Dimensions:', result.width, 'x', result.height);
    console.log('Size:', result.bytes, 'bytes');

    // Get thumbnail URL
    const thumbnailUrl = cloudinary.getThumbnailUrl(result.publicId, 150);
    console.log('Thumbnail URL:', thumbnailUrl);

    // Get optimized URL
    const webUrl = cloudinary.getOptimizedUrl(result.publicId, 1200);
    console.log('Optimized URL:', webUrl);

    // Get custom transformation
    const customUrl = cloudinary.getTransformedUrl(result.publicId, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 80,
      format: 'webp',
    });
    console.log('Custom transformation URL:', customUrl);

    // Get image details
    const details = await cloudinary.getImageDetails(result.publicId);
    console.log('Image details retrieved:', details.publicId);

    // Clean up - delete the image
    await cloudinary.deleteImage(result.publicId);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Cloudinary Error:', error);
  }
}

/**
 * Example 4: Generate Cloudinary upload signature
 */
async function exampleCloudinarySignature() {
  console.log('\n=== Cloudinary Example: Upload Signature ===');

  const cloudinary = StorageFactory.getCloudinaryStorage();

  try {
    // Generate signature for client-side upload
    const signature = await cloudinary.generateUploadSignature({
      folder: CloudinaryFolder.PRODUCT_IMAGES,
      tags: ['product', 'inventory'],
      context: {
        category: 'electronics',
      },
    });

    console.log('Upload signature generated!');
    console.log('Signature:', signature.signature.substring(0, 20) + '...');
    console.log('Timestamp:', signature.timestamp);
    console.log('API Key:', signature.apiKey);
    console.log('Cloud Name:', signature.cloudName);

    // In a real app, you would send this to the client
    // Client would use it to upload directly to Cloudinary:
    // const formData = new FormData();
    // formData.append('file', imageFile);
    // formData.append('api_key', signature.apiKey);
    // formData.append('timestamp', signature.timestamp);
    // formData.append('signature', signature.signature);
    // formData.append('folder', 'product_images');
    //
    // await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    //   method: 'POST',
    //   body: formData
    // });
  } catch (error) {
    console.error('Signature Error:', error);
  }
}

/**
 * Example 5: List files in R2
 */
async function exampleListFiles() {
  console.log('\n=== R2 Example: List Files ===');

  const r2 = StorageFactory.getR2Storage();

  try {
    const userId = 'user-123';

    // List all invoices for a user
    const invoices = await r2.listFiles(`invoices/${userId}/`);
    console.log('User invoices:', invoices.length, 'files');
    console.log('Files:', invoices);

    // List all reports
    const reports = await r2.listFiles('reports/');
    console.log('Total reports:', reports.length, 'files');
  } catch (error) {
    console.error('List Files Error:', error);
  }
}

/**
 * Example 6: Check service configuration
 */
function exampleCheckConfiguration() {
  console.log('\n=== Configuration Check ===');

  if (StorageFactory.isR2Configured()) {
    console.log('✓ R2 storage is configured');
  } else {
    console.log('✗ R2 storage is NOT configured');
    console.log('  Add R2 credentials to .env file');
  }

  if (StorageFactory.isCloudinaryConfigured()) {
    console.log('✓ Cloudinary storage is configured');
  } else {
    console.log('✗ Cloudinary storage is NOT configured');
    console.log('  Add Cloudinary credentials to .env file');
  }
}

/**
 * Main function - Run all examples
 */
async function main() {
  console.log('Storage Services - Example Usage\n');
  console.log('=' .repeat(50));

  // Check configuration first
  exampleCheckConfiguration();

  // Only run upload examples if services are configured
  if (StorageFactory.isR2Configured()) {
    await exampleR2Upload();
    await examplePresignedUpload();
    await exampleListFiles();
  } else {
    console.log('\nSkipping R2 examples (not configured)');
  }

  if (StorageFactory.isCloudinaryConfigured()) {
    await exampleCloudinaryUpload();
    await exampleCloudinarySignature();
  } else {
    console.log('\nSkipping Cloudinary examples (not configured)');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Examples complete!\n');
}

// Run examples if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  exampleR2Upload,
  examplePresignedUpload,
  exampleCloudinaryUpload,
  exampleCloudinarySignature,
  exampleListFiles,
  exampleCheckConfiguration,
};
