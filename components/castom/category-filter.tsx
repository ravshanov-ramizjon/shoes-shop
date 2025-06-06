"use client";

import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-12">
      <Button
        variant={selectedCategory === undefined ? "default" : "outline"}
        className="bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:drop-shadow-[0_0_15px_cyan] transition-transform duration-300 hover:-translate-y-1"
        onClick={() => onSelectCategory?.(undefined)}
      >
        Все категории
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:drop-shadow-[0_0_15px_cyan] transition-transform duration-300 hover:-translate-y-1
            ${selectedCategory === category.id ? "bg-cyan-500 text-black drop-shadow-[0_0_20px_cyan]" : ""}
          `}
          onClick={() => onSelectCategory?.(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
