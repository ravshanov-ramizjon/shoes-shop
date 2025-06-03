"use client";

import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <Button
        variant={selectedCategory === undefined ? "default" : "outline"}
        className="bg-black text-white hover:-translate-y-px transition-colors duration-300"
        onClick={() => onSelectCategory?.(undefined)}
      >
        Все категории
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="bg-black text-white hover:-translate-y-px transition-colors duration-300"
          onClick={() => onSelectCategory?.(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
