import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function main() {
  // Очищаем старые данные
  await db.product.deleteMany();
  await db.user.deleteMany();
  await db.category.deleteMany();

  // Создаём категории с уникальными ID
  const men = await db.category.create({
    data: { id: "men", name: "Мужская обувь" },
  });

  const women = await db.category.create({
    data: { id: "women", name: "Женская обувь" },
  });

  const kids = await db.category.create({
    data: { id: "kids", name: "Детская обувь" },
  });

  // Товары
  await db.product.createMany({
    data: [
      {
        name: "Кожаные ботинки",
        description: "Прочные и стильные ботинки для мужчин",
        price: 320000,
        image: "https://images.unsplash.com/photo-1621665422129-a03cc387bc7d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        categoryId: men.id,
      },
      {
        name: "Nike Air Max 270",
        description: "Комфортные кроссовки для повседневной носки",
        price: 220000,
        image: "https://images.unsplash.com/photo-1592771404380-467f535c7c4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TmlrZSUyMEFpciUyME1heCUyMDI3MCUyMGZvciUyMHdvbWVufGVufDB8fDB8fHww",
        categoryId: women.id,
      },
      {
        name: "Детские кроссовки",
        description: "Яркие и удобные кроссовки для детей",
        price: 180000,
        image: "https://plus.unsplash.com/premium_photo-1669655126440-88ddfc7a4180?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fCVEMCU5NCVEMCVCNSVEMSU4MiVEMSU4MSVEMCVCQSVEMCVCOCVEMCVCNSUyMCVEMCVCQSVEMSU4MCVEMCVCRSVEMSU4MSVEMSU4MSVEMCVCRSVEMCVCMiVEMCVCQSVEMCVCOHxlbnwwfHwwfHx8MA%3D%3D",
        categoryId: kids.id,
      },
    ],
  });

  // Пользователи
  const users = [
    {
      name: "Иван Иванов",
      email: "ivan@example.com",
      password: await bcrypt.hash("password123", 10),
    },
    {
      name: "Мария Смирнова",
      email: "maria@example.com",
      password: await bcrypt.hash("securepassword456", 10),
    },
    {
      name: "Алексей Петров",
      email: "alexey@example.com",
      password: await bcrypt.hash("mypassword789", 10),
    },
  ];

  await db.user.createMany({
    data: users,
  });
}

main()
  .then(() => console.log("✅ Seeding complete"))
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
