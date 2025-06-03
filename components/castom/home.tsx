"use client";

import { useState } from "react";
import { CategoryFilter } from "@/components/castom/category-filter";
import { ProductCard } from "@/components/castom/product-card";
import { Input } from "../ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface HomePageProps {
  categories: Category[];
  products: Product[];
}

export function HomePage({ categories, products }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Фильтрация по категории и поиску
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.id === selectedCategory : true;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-white min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide drop-shadow-md">
          Обувь магазин
        </h1>

        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск товаров..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Фильтр по категориям */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Карточки товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500 text-lg">
            Ничего не найдено.
          </p>
        )}
      </div>
    </main>
  );
}
