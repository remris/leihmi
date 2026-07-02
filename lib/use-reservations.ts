"use client";

import { useEffect, useState } from "react";

export type Reservation = {
  id: string;
  customerId: string;
  itemId: string;
  status: string;
  startDate: string;
  endDate: string;
};

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/reservations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReservations(data);
        }
      })
      .catch((err) => console.error("Failed to load reservations:", err));
  }, []);

  return { reservations };
}

