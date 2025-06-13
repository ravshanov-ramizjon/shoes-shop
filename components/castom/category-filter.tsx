"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (categoryId?: string) => {
    onSelectCategory?.(categoryId);
    if (isMobile) setIsOpen(false); // закрыть только при выборе
  };

  if (isMobile) {
    return (
      <div className="relative mb-6">
        <center>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="text-cyan-400 border border-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"
          >
            <Menu className="w-4 h-4" />
            </Button>
        </center>

        <div
          className={`flex flex-col mt-4 gap-3 overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <Button
            variant={selectedCategory === undefined ? "default" : "outline"}
            className="bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black"
            onClick={() => handleCategoryClick(undefined)}
          >
            Все категории
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black ${selectedCategory === category.id
                  ? "bg-cyan-500 text-black drop-shadow-[0_0_20px_cyan]"
                  : ""
                }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Десктопный вид
  return (
    <div className="flex flex-wrap gap-4 mb-12">
      <Button
        variant={selectedCategory === undefined ? "default" : "outline"}
        className="bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black"
        onClick={() => onSelectCategory?.(undefined)}
      >
        Все категории
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black ${selectedCategory === category.id
              ? "bg-cyan-500 text-black drop-shadow-[0_0_20px_cyan]"
              : ""
            }`}
          onClick={() => onSelectCategory?.(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
