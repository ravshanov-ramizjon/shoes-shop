export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma";
import { HomePage } from "@/components/castom/home";

// Интерфейсы
interface Category {
  id: string;
  name: string;
  // Добавь другие поля, если они есть в таблице Category
}

interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  category: Category;
  description: string; 
  image: string; 
}

export default async function Page() {
  const categories: Category[] = (await prisma.category.findMany() as Category[]).map((category): Category => ({
    ...category,
    id: category.id.toString(),
  }));

  const products = (await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  }) as (Product & { category: Category })[]).map((product): Product => ({
    ...product,
    id: product.id.toString(),
    category: {
      ...product.category,
      id: product.category.id.toString(),
    },
  }));

  return <HomePage categories={categories} products={products} />;
}
