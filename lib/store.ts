"use client";

import { create } from "zustand";

// Types
export type CreateKind = "item" | "customer" | "rental" | "reservation" | "category";

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    pricePerDay: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    city: string;
}

export interface Rental {
    id: string;
    customerId: string;
    itemIds: string[];
    start: string;
    end: string;
    notes?: string;
    status: "active" | "returned" | "overdue";
}

export interface Reservation {
    id: string;
    customerName: string;
    customerId: string;
    itemsLabel: string;
    start: string;
    end: string;
    status: "pending" | "confirmed" | "cancelled";
}

export interface Category {
    id: string;
    name: string;
}

// Store
interface AppStore {
    inventory: InventoryItem[];
    customers: Customer[];
    rentals: Rental[];
    reservations: Reservation[];
    categories: Category[];
}

const useAppStore = create<AppStore>(() => ({
    inventory: [],
    customers: [],
    rentals: [],
    reservations: [],
    categories: [
        { id: "1", name: "Tents" },
        { id: "2", name: "Tables & Chairs" },
        { id: "3", name: "Audio & Video" },
    ],
}));

// Selectors
export const useInventory = () => useAppStore((s) => s.inventory);
export const useCustomers = () => useAppStore((s) => s.customers);
export const useRentals = () => useAppStore((s) => s.rentals);
export const useReservations = () => useAppStore((s) => s.reservations);
export const useCategoriesStore = () => useAppStore((s) => s.categories);

// Create dialog subscription
let createListeners: ((kind: CreateKind) => void)[] = [];
export const subscribeCreate = (fn: (kind: CreateKind) => void) => {
    createListeners.push(fn);
    return () => {
        createListeners = createListeners.filter((l) => l !== fn);
    };
};
export const triggerCreate = (kind: CreateKind) => createListeners.forEach((fn) => fn(kind));

// Actions
export const addItem = (item: Omit<InventoryItem, "id">) => {
    useAppStore.setState((s) => ({
        inventory: [...s.inventory, { ...item, id: crypto.randomUUID() }],
    }));
};

export const addCustomer = (customer: Omit<Customer, "id">) => {
    useAppStore.setState((s) => ({
        customers: [...s.customers, { ...customer, id: crypto.randomUUID() }],
    }));
};

export const addRental = (rental: Omit<Rental, "id" | "status">) => {
    useAppStore.setState((s) => ({
        rentals: [...s.rentals, { ...rental, id: crypto.randomUUID(), status: "active" }],
    }));
};

export const addReservation = (reservation: Omit<Reservation, "id" | "status">) => {
    useAppStore.setState((s) => ({
        reservations: [...s.reservations, { ...reservation, id: crypto.randomUUID(), status: "pending" }],
    }));
};

export const addCategory = (category: Omit<Category, "id">) => {
    useAppStore.setState((s) => ({
        categories: [...s.categories, { ...category, id: crypto.randomUUID() }],
    }));
};

