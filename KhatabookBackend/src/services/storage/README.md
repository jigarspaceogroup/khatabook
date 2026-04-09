# Storage Services

File storage abstraction layer for Khatabook backend.

## Overview

This module provides two storage services:

1. **R2Service** - Cloudflare R2 (S3-compatible) for PDFs, documents, reports
2. **CloudinaryService** - Cloudinary for images with automatic optimization

## Setup

### 1. Cloudflare R2 Setup

1. Create account at [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** section
3. Create a new bucket (e.g., `khatabook-documents`)
4. Go to **Manage R2 API Tokens** and create a token with:
   - Permissions: Object Read & Write
   - Apply to specific buckets: Select your bucket
5. Copy the credentials:
   - Account ID
   - Access Key ID
   - Secret Access Key
6. Get the endpoint URL: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
7. (Optional) Configure custom domain for public access

Add to `.env`:
```bash
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=khatabook-documents
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.r2.dev  # Optional
```

### 2. Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard > Settings > Access Keys
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

Add to `.env`:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Usage

### Using StorageFactory (Recommended)

```typescript
import { StorageFactory, CloudinaryFolder } from '@/services/storage';

// Get R2 service for PDFs
const r2 = StorageFactory.getR2Storage();

// Get Cloudinary service for images
const cloudinary = StorageFactory.getCloudinaryStorage();
```

### R2 Service Examples

#### Upload a PDF Invoice
```typescript
import { StorageFactory } from '@/services/storage';

const r2 = StorageFactory.getR2Storage();

// Upload invoice PDF
const pdfBuffer = await generateInvoicePDF(invoice);
const result = await r2.uploadFile(
  pdfBuffer,
  `invoices/${userId}/${invoiceId}.pdf`,
  'application/pdf',
  { invoiceId, userId, businessName }
);

console.log('Invoice URL:', result.url);
```

#### Generate Presigned Upload URL (Client Upload)
```typescript
// Server: Generate presigned URL
const presigned = await r2.getPresignedUploadUrl(
  `reports/${userId}/${reportId}.pdf`,
  'application/pdf',
  900 // 15 minutes expiry
);

// Send to client
res.json({
  uploadUrl: presigned.url,
  key: presigned.key,
  expiresAt: presigned.expiresAt
});

// Client: Upload directly to R2
await fetch(presigned.url, {
  method: 'PUT',
  body: pdfFile,
  headers: {
    'Content-Type': 'application/pdf'
  }
});
```

#### Download a File
```typescript
const fileBuffer = await r2.downloadFile(`invoices/${userId}/${invoiceId}.pdf`);

// Send to client
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceId}.pdf"`);
res.send(fileBuffer);
```

#### Delete a File
```typescript
await r2.deleteFile(`invoices/${userId}/${invoiceId}.pdf`);
```

#### List Files in Folder
```typescript
const invoices = await r2.listFiles(`invoices/${userId}/`);
console.log('User invoices:', invoices);
// ['invoices/user123/inv001.pdf', 'invoices/user123/inv002.pdf']
```

### Cloudinary Service Examples

#### Upload Transaction Attachment
```typescript
import { StorageFactory, CloudinaryFolder } from '@/services/storage';

const cloudinary = StorageFactory.getCloudinaryStorage();

const imageBuffer = await readFileBuffer('receipt.jpg');
const result = await cloudinary.uploadImage(
  imageBuffer,
  CloudinaryFolder.TRANSACTION_ATTACHMENTS,
  {
    tags: ['receipt', `transaction-${transactionId}`],
    context: { transactionId, userId }
  }
);

console.log('Image URL:', result.secureUrl);
console.log('Public ID:', result.publicId);
```

#### Upload Business Logo
```typescript
const logoResult = await cloudinary.uploadImage(
  logoBuffer,
  CloudinaryFolder.LOGOS,
  {
    publicId: `business-logo-${businessId}`,
    transformation: {
      width: 500,
      height: 500,
      crop: 'fill',
      quality: 'auto'
    },
    overwrite: true  // Replace existing logo
  }
);
```

#### Get Thumbnail URL
```typescript
const thumbnailUrl = cloudinary.getThumbnailUrl(publicId, 150);
// Returns: https://res.cloudinary.com/.../w_150,h_150,c_fill,q_auto/...
```

#### Get Optimized Web URL
```typescript
const webUrl = cloudinary.getOptimizedUrl(publicId, 1200);
// Returns: https://res.cloudinary.com/.../w_1200,c_limit,q_auto,f_auto/...
```

#### Generate Upload Signature (Client Upload)
```typescript
// Server: Generate signature
const signature = await cloudinary.generateUploadSignature({
  folder: CloudinaryFolder.PRODUCT_IMAGES,
  tags: ['product', 'inventory']
});

// Send to client
res.json(signature);
// {
//   signature: '...',
//   timestamp: 1234567890,
//   apiKey: '...',
//   cloudName: '...'
// }

// Client: Upload directly to Cloudinary
const formData = new FormData();
formData.append('file', imageFile);
formData.append('api_key', signature.apiKey);
formData.append('timestamp', signature.timestamp);
formData.append('signature', signature.signature);
formData.append('folder', 'product_images');

await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
  method: 'POST',
  body: formData
});
```

#### Delete Image
```typescript
await cloudinary.deleteImage(publicId);
```

#### Get Image Details
```typescript
const details = await cloudinary.getImageDetails(publicId);
console.log('Size:', details.bytes, 'bytes');
console.log('Dimensions:', details.width, 'x', details.height);
```

## File Organization

### R2 Folder Structure
```
khatabook-documents/
├── invoices/
│   └── {userId}/
│       └── {invoiceId}.pdf
├── reports/
│   └── {userId}/
│       └── {reportId}.pdf
├── exports/
│   └── {userId}/
│       ├── customers-{timestamp}.csv
│       └── transactions-{timestamp}.xlsx
└── backups/
    └── {userId}/
        └── backup-{timestamp}.json
```

### Cloudinary Folders
```
transaction_attachments/  # Receipt/bill images
logos/                    # Business logos
product_images/           # Product photos
profile_pictures/         # User profile photos
invoice_logos/           # Invoice header logos
```

## Error Handling

All services throw `StorageError` with proper error codes:

```typescript
import { StorageError } from '@/services/storage';

try {
  const result = await r2.uploadFile(buffer, key, contentType);
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Storage error:', error.code, error.message);
    // Error codes: R2_UPLOAD_FAILED, R2_FILE_NOT_FOUND, etc.
  }
}
```

## Testing

Since storage services require valid credentials, you have two options for testing:

### Option 1: Use Real Credentials (Development)
Add your development credentials to `.env` and test with actual uploads.

### Option 2: Mock Services (Unit Tests)
```typescript
import { StorageFactory } from '@/services/storage';

// Mock the services
jest.mock('@/services/storage/R2Service');
jest.mock('@/services/storage/CloudinaryService');

// Reset instances before each test
beforeEach(() => {
  StorageFactory.reset();
});
```

## Configuration Validation

Both services validate configuration on instantiation:

```typescript
// Check if services are configured
if (StorageFactory.isR2Configured()) {
  console.log('R2 storage is ready');
}

if (StorageFactory.isCloudinaryConfigured()) {
  console.log('Cloudinary storage is ready');
}

// If credentials are missing, services will throw StorageError
```

## Best Practices

1. **Use appropriate storage for file type**
   - PDFs, Excel, CSV → R2
   - Images → Cloudinary

2. **Use presigned URLs for client uploads**
   - Reduces server load
   - Faster uploads
   - Direct upload to storage

3. **Add metadata to uploads**
   - userId, transactionId, etc.
   - Helps with tracking and debugging

4. **Use transformations for images**
   - Cloudinary auto-optimizes images
   - Generate thumbnails on-the-fly
   - Save bandwidth

5. **Organize files in folders**
   - Use consistent naming conventions
   - Group by user/resource type
   - Easy to list and manage

6. **Clean up old files**
   - Delete old exports after 7 days
   - Archive old backups
   - Keep storage costs low

7. **Handle errors gracefully**
   - Catch `StorageError`
   - Log errors with context
   - Show user-friendly messages

## Performance Tips

1. **R2 Presigned URLs**: 15-minute expiry (default 900s)
2. **Cloudinary Transformations**: Cached by CDN
3. **Parallel Uploads**: Use `Promise.all()` for multiple files
4. **Compression**: Cloudinary auto-compresses images
5. **Format Optimization**: Use `format: 'auto'` for best format selection

## Security

1. **Never expose credentials** to client
2. **Use presigned URLs** for client uploads (time-limited)
3. **Use upload signatures** for Cloudinary (validates origin)
4. **Validate file types** before upload
5. **Limit file sizes** (e.g., 10MB for images, 50MB for PDFs)
6. **Sanitize file names** to prevent path traversal

## Troubleshooting

### R2 Upload Fails
- Check credentials are correct
- Verify bucket exists
- Check bucket permissions
- Ensure endpoint URL is correct

### Cloudinary Upload Fails
- Verify cloud name, API key, secret
- Check file size limits
- Ensure folder name is valid
- Check upload preset (if using unsigned uploads)

### Presigned URL Expired
- Default expiry is 15 minutes
- Increase expiry if needed
- Generate new URL if expired

### Image Not Loading
- Check public ID is correct
- Verify image was uploaded successfully
- Check Cloudinary dashboard for errors
- Ensure transformation parameters are valid
