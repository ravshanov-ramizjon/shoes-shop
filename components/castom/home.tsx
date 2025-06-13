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

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.id === selectedCategory : true;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-900">
      <main className=" min-h-screen p-8 max-w-7xl mx-auto text-white font-mono select-none">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-5xl font-extrabold tracking-wide text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
            Обувь маркет
          </h1>

          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск товаров..."
            className="border border-cyan-600 rounded-lg px-4 py-2 text-sm w-full sm:w-72 bg-gray-800 text-cyan-300 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition"
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6 mb-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {filteredProducts.length === 0 && (
            <p className="text-center col-span-full text-cyan-400 text-lg tracking-wide drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
              Ничего не найдено.
            </p>
          )}
        </div>
      </main>
    </div>

  );
}
