import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "stefan" },
    update: {},
    create: {
      slug: "stefan",
      name: "Stefan Events",
    },
  });

  console.log("✅ Created tenant:", tenant.slug);

  // Create default user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "stefan@example.com" },
    update: {},
    create: {
      email: "stefan@example.com",
      name: "Stefan",
      passwordHash: hashedPassword,
      tenantId: tenant.id,
    },
  });

  console.log("✅ Created user:", user.email);

  // Create categories
  const existingCategories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
  });

  let categories;
  if (existingCategories.length === 0) {
    categories = await Promise.all([
      prisma.category.create({
        data: { name: "Tents", tenantId: tenant.id },
      }),
      prisma.category.create({
        data: { name: "Tables & Chairs", tenantId: tenant.id },
      }),
      prisma.category.create({
        data: { name: "Audio & Video", tenantId: tenant.id },
      }),
    ]);
    console.log(`✅ Created ${categories.length} categories`);
  } else {
    categories = existingCategories;
    console.log(`✅ Found ${categories.length} existing categories`);
  }

  // Create inventory items
  const existingItems = await prisma.inventoryItem.findMany({
    where: { tenantId: tenant.id },
  });

  if (existingItems.length === 0) {
    const inventory = await Promise.all([
      prisma.inventoryItem.create({
        data: {
          name: "Party Tent 6x12m",
          categoryId: categories[0].id,
          tenantId: tenant.id,
          price: 350,
          available: true,
          description: "Large white party tent, seats up to 80 people",
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: "Round Table (10 seats)",
          categoryId: categories[1].id,
          tenantId: tenant.id,
          price: 25,
          available: true,
          description: "Round banquet table with white tablecloth",
        },
      }),
      prisma.inventoryItem.create({
        data: {
          name: "PA System 2000W",
          categoryId: categories[2].id,
          tenantId: tenant.id,
          price: 150,
          available: true,
          description: "Professional PA system with 2 speakers and mixer",
        },
      }),
    ]);
    console.log(`✅ Created ${inventory.length} inventory items`);
  } else {
    console.log(`✅ Found ${existingItems.length} existing inventory items`);
  }

  // Create customer
  const existingCustomer = await prisma.customer.findFirst({
    where: { tenantId: tenant.id, email: "john.doe@example.com" },
  });

  if (!existingCustomer) {
    const customer = await prisma.customer.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+49 123 456789",
        tenantId: tenant.id,
      },
    });
    console.log("✅ Created customer:", customer.name);
  } else {
    console.log("✅ Found existing customer:", existingCustomer.name);
  }

  console.log("\n✨ Seeding completed successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Email: stefan@example.com");
  console.log("   Password: password123");
  console.log("   Subdomain: stefan.leihmi.de (or localhost:3000 in dev)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

