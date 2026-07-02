"use client";

import { useEffect, useState } from "react";

export type InventoryItem = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  available: boolean;
  description?: string;
  imageUrl?: string;
};

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setInventory(data.items);
        }
      })
      .catch((err) => console.error("Failed to load inventory:", err));
  }, []);

  return inventory;
}

