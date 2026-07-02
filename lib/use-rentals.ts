"use client";

import { useEffect, useState } from "react";

export type Rental = {
  id: string;
  customerId: string;
  itemId: string;
  status: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
};

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/rentals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRentals(data);
        }
      })
      .catch((err) => console.error("Failed to load rentals:", err));
  }, []);

  return { rentals };
}

