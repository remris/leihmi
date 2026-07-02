"use client";

import { useEffect, useState } from "react";

export type Category = {
  id: string;
  name: string;
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setCategories(data.items);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  return categories;
}

