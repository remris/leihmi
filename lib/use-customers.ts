"use client";

import { useEffect, useState } from "react";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items)) {
          setCustomers(data.items);
        }
      })
      .catch((err) => console.error("Failed to load customers:", err));
  }, []);

  return customers;
}


