/**
 * Khatabook Clone - Database Seed Script
 * Version: 1.0
 * Date: April 6, 2026
 *
 * This script generates realistic test data for development:
 * - 2 test users with Indian names and phone numbers
 * - 2 khatabooks per user (Business, Personal)
 * - 10-15 customers per khatabook with Indian names
 * - 50-100 transactions (mix of GAVE/GOT) over last 90 days
 * - Realistic balances calculated from transactions
 * - 5 inventory items per khatabook
 * - 2 sample invoices with items and tax calculations
 * - Invoice settings per khatabook
 */

import { PrismaClient, TransactionType, InvoiceStatus, ReminderType, ReminderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize PostgreSQL connection pool
const dbUrl = new URL(process.env['DIRECT_URL'] || process.env['DATABASE_URL']!);
const pool = new Pool({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  database: dbUrl.pathname.substring(1),
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password), // Decode URL-encoded password
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter (required for Prisma 7.x)
const prisma = new PrismaClient({ adapter });

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate Indian phone number in E.164 format (+91XXXXXXXXXX)
 */
function generateIndianPhone(): string {
  const prefixes = ['6', '7', '8', '9']; // Valid Indian mobile prefixes
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = prefix + faker.string.numeric(9);
  return `+91${number}`;
}

/**
 * Generate realistic Indian business names
 */
function generateBusinessName(): string {
  const surnames = ['Sharma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Verma', 'Agarwal', 'Joshi', 'Shah', 'Reddy'];
  const businessTypes = [
    'Kirana Store',
    'General Store',
    'Electronics',
    'Medical Store',
    'Hardware Store',
    'Garments',
    'Sweet Shop',
    'Restaurant',
    'Stationery',
    'Mobile Shop',
  ];

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];

  return `${surname} ${type}`;
}

/**
 * Generate realistic Indian names
 */
function generateIndianName(): string {
  const firstNames = [
    'Raj', 'Amit', 'Priya', 'Anjali', 'Vikram', 'Neha', 'Rahul', 'Pooja',
    'Suresh', 'Kavita', 'Anil', 'Deepa', 'Manoj', 'Sunita', 'Ramesh', 'Meera',
  ];
  const lastNames = [
    'Sharma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Verma', 'Agarwal', 'Joshi',
    'Shah', 'Reddy', 'Kapoor', 'Nair', 'Mehta', 'Rao', 'Iyer', 'Desai',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

/**
 * Generate realistic transaction amount in paise (₹100 to ₹50,000)
 */
function generateTransactionAmount(): number {
  // Common amounts: ₹100, ₹500, ₹1000, ₹2000, ₹5000, ₹10000
  const commonAmounts = [10000, 50000, 100000, 200000, 500000, 1000000]; // in paise

  if (Math.random() < 0.6) {
    // 60% chance of common amounts
    return commonAmounts[Math.floor(Math.random() * commonAmounts.length)]!;
  } else {
    // 40% chance of random amounts
    return Math.floor(Math.random() * (5000000 - 10000) + 10000); // ₹100 to ₹50,000
  }
}

/**
 * Generate random date within last N days
 */
function randomDateInLast(days: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return faker.date.between({ from: past, to: now });
}

/**
 * Generate realistic item name for inventory/invoices
 */
function generateItemName(): string {
  const items = [
    'Rice (1kg)',
    'Wheat Flour (5kg)',
    'Sugar (1kg)',
    'Tea Powder (250g)',
    'Cooking Oil (1L)',
    'Pulses (500g)',
    'Soap Bar',
    'Toothpaste',
    'Shampoo Pouch',
    'Biscuit Pack',
    'Salt (1kg)',
    'Spices Mix',
    'Detergent Powder (1kg)',
    'Notebook (Single)',
    'Pen (Pack of 10)',
  ];

  return items[Math.floor(Math.random() * items.length)]!;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in development only)
  console.log('🗑️  Cleaning existing data...');
  await prisma.syncMetadata.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.reminderLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.stockLog.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoiceSettings.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.transactionAttachment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.khatabook.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleaned existing data\n');

  // ============================================================================
  // 1. CREATE USERS
  // ============================================================================
  console.log('👤 Creating users...');
  const users = [];

  for (let i = 0; i < 2; i++) {
    const name = generateIndianName();
    const user = await prisma.user.create({
      data: {
        phone_number: generateIndianPhone(),
        phone_verified: true,
        name,
        email: faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] }).toLowerCase(),
        language_code: 'en',
        profile_image_url: null,
        biometric_enabled: false,
        last_login_at: new Date(),
      },
    });
    users.push(user);
    console.log(`  ✓ Created user: ${user.name} (${user.phone_number})`);
  }
  console.log('');

  // ============================================================================
  // 2. CREATE KHATABOOKS (2 per user)
  // ============================================================================
  console.log('📒 Creating khatabooks...');
  const khatabooks = [];

  for (const user of users) {
    // Business khatabook (default)
    const businessName = generateBusinessName();
    const businessKhatabook = await prisma.khatabook.create({
      data: {
        user_id: user.id,
        name: `${businessName} Ledger`,
        business_name: businessName,
        business_type: businessName.split(' ').slice(-1)[0], // Extract business type
        is_default: true,
        currency_code: 'INR',
      },
    });
    khatabooks.push(businessKhatabook);
    console.log(`  ✓ Created khatabook: ${businessKhatabook.name} (default)`);

    // Personal khatabook
    const personalKhatabook = await prisma.khatabook.create({
      data: {
        user_id: user.id,
        name: 'Personal Ledger',
        business_name: null,
        business_type: null,
        is_default: false,
        currency_code: 'INR',
      },
    });
    khatabooks.push(personalKhatabook);
    console.log(`  ✓ Created khatabook: ${personalKhatabook.name}`);
  }
  console.log('');

  // ============================================================================
  // 3. CREATE CUSTOMERS (10-15 per khatabook)
  // ============================================================================
  console.log('👥 Creating customers...');
  const customers = [];

  for (const khatabook of khatabooks) {
    const customerCount = faker.number.int({ min: 10, max: 15 });

    for (let i = 0; i < customerCount; i++) {
      const name = generateIndianName();
      const hasPhone = Math.random() > 0.3; // 70% have phone numbers
      const hasEmail = Math.random() > 0.7; // 30% have email
      const hasGstin = Math.random() > 0.8; // 20% have GSTIN

      // Random opening balance between -₹500 and ₹1000
      const openingBalance = faker.number.int({ min: -50000, max: 100000 });

      const customer = await prisma.customer.create({
        data: {
          khatabook_id: khatabook.id,
          name,
          phone_number: hasPhone ? generateIndianPhone() : null,
          email: hasEmail ? faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase() : null,
          address: faker.location.streetAddress({ useFullAddress: true }),
          gstin: hasGstin ? faker.string.alphanumeric({ length: 15, casing: 'upper' }) : null,
          opening_balance: openingBalance,
          current_balance: openingBalance, // Will be updated after transactions
          notes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
        },
      });
      customers.push({ ...customer, khatabook_id: khatabook.id });
    }
    console.log(`  ✓ Created ${customerCount} customers for ${khatabook.name}`);
  }
  console.log('');

  // ============================================================================
  // 4. CREATE TRANSACTIONS (50-100 total, distributed across customers)
  // ============================================================================
  console.log('💰 Creating transactions...');
  const transactions = [];

  for (const khatabook of khatabooks) {
    const khatabookCustomers = customers.filter((c) => c.khatabook_id === khatabook.id);
    const transactionCount = faker.number.int({ min: 25, max: 50 }); // 25-50 per khatabook

    for (let i = 0; i < transactionCount; i++) {
      const customer = khatabookCustomers[Math.floor(Math.random() * khatabookCustomers.length)];
      const type = Math.random() > 0.5 ? TransactionType.GAVE : TransactionType.GOT;
      const amount = generateTransactionAmount();
      const transactionDate = randomDateInLast(90);

      if (!customer) continue;

      const transaction = await prisma.transaction.create({
        data: {
          khatabook_id: khatabook.id,
          customer_id: customer.id,
          type,
          amount,
          note: Math.random() > 0.6 ? faker.lorem.sentence() : null,
          transaction_date: transactionDate,
          payment_mode: ['CASH', 'UPI', 'CARD', null][Math.floor(Math.random() * 4)] ?? null,
        },
      });
      transactions.push(transaction);

      // Update customer balance
      const balanceChange = type === TransactionType.GOT ? -amount : amount;
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          current_balance: { increment: balanceChange },
          last_transaction_at: transactionDate,
        },
      });
    }
    console.log(`  ✓ Created ${transactionCount} transactions for ${khatabook.name}`);
  }
  console.log('');

  // ============================================================================
  // 5. CREATE INVOICE SETTINGS (1 per khatabook)
  // ============================================================================
  console.log('⚙️  Creating invoice settings...');

  for (const khatabook of khatabooks) {
    await prisma.invoiceSettings.create({
      data: {
        khatabook_id: khatabook.id,
        business_name: khatabook.business_name,
        business_address: faker.location.streetAddress({ useFullAddress: true }),
        business_phone: generateIndianPhone(),
        business_email: faker.internet.email().toLowerCase(),
        gstin: khatabook.business_type ? faker.string.alphanumeric({ length: 15, casing: 'upper' }) : null,
        invoice_prefix: 'INV',
        next_invoice_number: 1,
        terms_and_conditions: 'Payment due within 30 days. Late payments may incur additional charges.',
        bank_details: {
          bank_name: 'State Bank of India',
          account_number: faker.finance.accountNumber(10),
          ifsc_code: 'SBIN0001234',
          account_holder_name: khatabook.business_name || 'Business Owner',
        },
      },
    });
    console.log(`  ✓ Created invoice settings for ${khatabook.name}`);
  }
  console.log('');

  // ============================================================================
  // 6. CREATE INVENTORY ITEMS (5 per khatabook)
  // ============================================================================
  console.log('📦 Creating inventory items...');
  const inventoryItems = [];

  for (const khatabook of khatabooks) {
    for (let i = 0; i < 5; i++) {
      const itemName = generateItemName();
      const purchasePrice = faker.number.int({ min: 5000, max: 50000 }); // ₹50 to ₹500
      const sellingPrice = Math.floor(purchasePrice * faker.number.float({ min: 1.2, max: 1.8 })); // 20-80% markup

      const item = await prisma.inventoryItem.create({
        data: {
          khatabook_id: khatabook.id,
          item_name: itemName,
          description: faker.commerce.productDescription(),
          sku: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
          barcode: faker.string.numeric(13),
          unit: 'pcs',
          purchase_price: purchasePrice,
          selling_price: sellingPrice,
          current_stock: faker.number.float({ min: 10, max: 100, fractionDigits: 0 }),
          min_stock_level: faker.number.float({ min: 5, max: 20, fractionDigits: 0 }),
          hsn_code: faker.string.numeric(8),
          tax_rate: [0, 5, 12, 18, 28][Math.floor(Math.random() * 5)], // Common GST rates
        },
      });
      inventoryItems.push({ ...item, khatabook_id: khatabook.id });
    }
    console.log(`  ✓ Created 5 inventory items for ${khatabook.name}`);
  }
  console.log('');

  // ============================================================================
  // 7. CREATE INVOICES (2 per khatabook)
  // ============================================================================
  console.log('🧾 Creating invoices...');

  for (const khatabook of khatabooks) {
    const khatabookCustomers = customers.filter((c) => c.khatabook_id === khatabook.id);
    const khatabookInventory = inventoryItems.filter((i) => i.khatabook_id === khatabook.id);

    for (let i = 0; i < 2; i++) {
      const customer = khatabookCustomers[Math.floor(Math.random() * khatabookCustomers.length)];

      if (!customer) continue;

      const invoiceDate = randomDateInLast(30);
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          khatabook_id: khatabook.id,
          customer_id: customer.id,
          invoice_number: `INV-${String(i + 1).padStart(4, '0')}`,
          invoice_date: invoiceDate,
          due_date: dueDate,
          status: [InvoiceStatus.SENT, InvoiceStatus.PAID][Math.floor(Math.random() * 2)]!,
          subtotal: 0, // Will calculate after items
          tax_amount: 0, // Will calculate after items
          total_amount: 0, // Will calculate after items
          notes: 'Thank you for your business!',
          is_gst_invoice: khatabook.business_type !== null,
        },
      });

      // Create 2-4 invoice items
      const itemCount = faker.number.int({ min: 2, max: 4 });
      let subtotal = 0;
      let totalTax = 0;

      for (let j = 0; j < itemCount; j++) {
        const inventoryItem = khatabookInventory[Math.floor(Math.random() * khatabookInventory.length)];

        if (!inventoryItem) continue;

        const quantity = faker.number.int({ min: 1, max: 10 });
        const rate = inventoryItem.selling_price;
        const itemSubtotal = rate * quantity;
        const taxRate = inventoryItem.tax_rate;
        const taxAmount = Math.floor((itemSubtotal * Number(taxRate)) / 100);
        const itemTotal = itemSubtotal + taxAmount;

        await prisma.invoiceItem.create({
          data: {
            invoice_id: invoice.id,
            inventory_item_id: inventoryItem.id,
            item_name: inventoryItem.item_name,
            description: inventoryItem.description || null,
            quantity,
            unit: inventoryItem.unit,
            rate,
            tax_rate: taxRate,
            tax_amount: taxAmount,
            total: itemTotal,
            hsn_code: inventoryItem.hsn_code,
            sort_order: j,
          },
        });

        subtotal += itemSubtotal;
        totalTax += taxAmount;
      }

      // Update invoice with totals
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          subtotal,
          tax_amount: totalTax,
          total_amount: subtotal + totalTax,
        },
      });

      console.log(`  ✓ Created invoice ${invoice.invoice_number} for ${customer.name} (₹${((subtotal + totalTax) / 100).toFixed(2)})`);
    }
  }
  console.log('');

  // ============================================================================
  // 8. CREATE REMINDER LOGS (sample data)
  // ============================================================================
  console.log('📨 Creating reminder logs...');

  for (const khatabook of khatabooks) {
    const khatabookCustomers = customers.filter(
      (c) => c.khatabook_id === khatabook.id && c.current_balance > 0 && c.phone_number
    );

    if (khatabookCustomers.length > 0) {
      const customer = khatabookCustomers[0]!; // Send reminder to first customer with balance

      await prisma.reminderLog.create({
        data: {
          khatabook_id: khatabook.id,
          customer_id: customer.id,
          type: ReminderType.WHATSAPP,
          message: `Dear ${customer.name}, your balance is ₹${(customer.current_balance / 100).toFixed(2)}. Please settle at your earliest convenience.`,
          status: ReminderStatus.SENT,
          balance_at_send: customer.current_balance,
          provider_message_id: faker.string.uuid(),
          sent_at: randomDateInLast(7),
          delivered_at: randomDateInLast(7),
        },
      });

      console.log(`  ✓ Created reminder log for ${customer.name}`);
    }
  }
  console.log('');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`  • Users: ${users.length}`);
  console.log(`  • Khatabooks: ${khatabooks.length}`);
  console.log(`  • Customers: ${customers.length}`);
  console.log(`  • Transactions: ${transactions.length}`);
  console.log(`  • Inventory Items: ${inventoryItems.length}`);
  console.log(`  • Invoices: ${khatabooks.length * 2}`);
  console.log('');
  console.log('🔐 Test User Credentials:');
  for (const user of users) {
    console.log(`  • ${user.name}`);
    console.log(`    Phone: ${user.phone_number}`);
    console.log(`    Email: ${user.email}`);
  }
  console.log('');
  console.log('💡 Next Steps:');
  console.log('  1. Run: npx prisma studio (to view data in GUI)');
  console.log('  2. Test login with one of the phone numbers above');
  console.log('  3. Verify balances and transactions are correct');
  console.log('');
}

// ============================================================================
// EXECUTE SEED
// ============================================================================

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
