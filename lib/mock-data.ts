// Shared mock data for the Leihmi demo. Replace with real fetches later.
export type ItemStatus = "available" | "rented" | "reserved" | "maintenance" | "archived";

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  quantity: number;
  available: number;
  reserved: number;
  rented: number;
  status: ItemStatus;
  description: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  openRentals: number;
  totalRentals: number;
  since: string;
  avatarColor: string;
};

export type RentalStatus = "active" | "upcoming" | "returned" | "late";
export type Rental = {
  id: string;
  customerId: string;
  customerName: string;
  itemIds: string[];
  itemsLabel: string;
  start: string; // ISO
  end: string;
  status: RentalStatus;
  total: number;
  notes?: string;
};

export type Reservation = {
  id: string;
  customerName: string;
  itemsLabel: string;
  start: string;
  end: string;
  status: "pending" | "confirmed" | "conflict";
  total: number;
};

export const tenant = {
  slug: "stefan",
  name: "Stefan Events GmbH",
  plan: "Growth",
  email: "team@stefan-events.de",
};

export const tenants = [
  { slug: "stefan", name: "Stefan Events GmbH" },
  { slug: "mecka", name: "Mecka Rentals" },
  { slug: "kranich", name: "Kranich Tools" },
];

export const categories = [
  { id: "c1", name: "Bouncy castles", count: 14, color: "oklch(0.78 0.15 75)" },
  { id: "c2", name: "Event equipment", count: 42, color: "oklch(0.55 0.1 158)" },
  { id: "c3", name: "Tools", count: 88, color: "oklch(0.55 0.08 220)" },
  { id: "c4", name: "Party supplies", count: 56, color: "oklch(0.65 0.15 30)" },
  { id: "c5", name: "Machines", count: 23, color: "oklch(0.5 0.1 280)" },
  { id: "c6", name: "Camera equipment", count: 31, color: "oklch(0.5 0.05 95)" },
];

const imgs = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=70",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=70",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=70",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=70",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=70",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=70",
];

export const inventory: InventoryItem[] = [
  ["Castle Royal XL", "Bouncy castles", 4, 2, 1, 1, "available", 189],
  ["Mega Slide Tropical", "Bouncy castles", 3, 1, 0, 2, "rented", 219],
  ["Round Tent 8m", "Event equipment", 6, 4, 1, 1, "available", 145],
  ["Folding Chair Set (50)", "Event equipment", 20, 12, 4, 4, "available", 35],
  ["Bar Table Highboy", "Event equipment", 40, 30, 5, 5, "available", 18],
  ["Bosch GSR 18V Drill", "Tools", 12, 7, 1, 4, "available", 14],
  ["Makita Circular Saw", "Tools", 8, 3, 1, 4, "rented", 22],
  ["DJ Booth Pro", "Party supplies", 2, 0, 1, 1, "reserved", 320],
  ["LED Par Light Set", "Party supplies", 18, 10, 3, 5, "available", 28],
  ["Smoke Machine 1500W", "Party supplies", 5, 2, 1, 2, "available", 24],
  ["Honda Generator EU22i", "Machines", 6, 2, 1, 3, "rented", 65],
  ["Pressure Washer 180bar", "Machines", 4, 1, 1, 2, "maintenance", 48],
  ["Sony FX3 Cinema Kit", "Camera equipment", 3, 1, 1, 1, "available", 280],
  ["DJI Ronin 4D", "Camera equipment", 2, 0, 1, 1, "reserved", 340],
  ["Aputure 600x Light", "Camera equipment", 6, 3, 1, 2, "available", 95],
  ["Octagon Trampoline", "Bouncy castles", 2, 1, 0, 1, "available", 165],
].map((row, i) => {
  const [name, category, qty, avail, res, rent, status, price] = row as [
    string, string, number, number, number, number, ItemStatus, number,
  ];
  return {
    id: `inv-${i + 1}`,
    sku: `LHM-${(1000 + i).toString()}`,
    name,
    category,
    image: imgs[i % imgs.length],
    pricePerDay: price,
    quantity: qty,
    available: avail,
    reserved: res,
    rented: rent,
    status,
    description:
      "Premium rental unit, professionally maintained. Includes delivery options, setup instructions, and damage waiver coverage on request.",
  };
});

export const customers: Customer[] = [
  ["Anna Bauer", "anna@bauer.de", "+49 30 1234 5678", "Bauer Events", "Berlin", 2, 14, "Jan 2023", "oklch(0.78 0.15 75)"],
  ["Tobias Klein", "tobias.k@gmail.com", "+49 89 2233 4455", undefined, "Munich", 0, 6, "Mar 2023", "oklch(0.55 0.1 158)"],
  ["Marie Schulz", "marie@partyzeit.de", "+49 40 1122 3344", "Partyzeit Hamburg", "Hamburg", 1, 22, "Sep 2022", "oklch(0.65 0.15 30)"],
  ["Lukas Weber", "lukas.weber@me.com", "+49 711 5566 778", undefined, "Stuttgart", 0, 3, "Jun 2024", "oklch(0.55 0.08 220)"],
  ["Jana Hoffmann", "jana@hoffmann.org", "+49 221 9988 776", "Hoffmann Catering", "Cologne", 3, 31, "Feb 2022", "oklch(0.5 0.1 280)"],
  ["Felix Braun", "felix@braun.dev", "+49 351 1234 567", undefined, "Dresden", 1, 8, "Nov 2023", "oklch(0.6 0.12 200)"],
  ["Sarah Krüger", "sarah.k@startup.io", "+49 30 9988 6677", "Startup HQ", "Berlin", 0, 11, "Aug 2023", "oklch(0.5 0.05 95)"],
  ["Mehmet Demir", "demir@gastro.de", "+49 69 3344 5566", "Demir Gastro", "Frankfurt", 2, 18, "Apr 2023", "oklch(0.6 0.13 40)"],
].map((row, i) => {
  const [name, email, phone, company, city, openRentals, totalRentals, since, avatarColor] = row as [
    string, string, string, string | undefined, string, number, number, string, string,
  ];
  return {
    id: `cus-${i + 1}`,
    name, email, phone, company, city, openRentals, totalRentals, since, avatarColor,
  };
});

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export const rentals: Rental[] = [
  ["cus-1", ["inv-2"], "Mega Slide Tropical", -2, 3, "active", 1095],
  ["cus-3", ["inv-7"], "Makita Circular Saw", -5, -1, "late", 132],
  ["cus-5", ["inv-11"], "Honda Generator EU22i ×2", 1, 4, "upcoming", 390],
  ["cus-8", ["inv-9", "inv-10"], "LED Lights + Smoke", -1, 2, "active", 156],
  ["cus-2", ["inv-13"], "Sony FX3 Cinema Kit", 3, 6, "upcoming", 840],
  ["cus-6", ["inv-1"], "Castle Royal XL", -10, -4, "returned", 1134],
  ["cus-7", ["inv-15"], "Aputure 600x Light", -8, -2, "returned", 570],
  ["cus-4", ["inv-3"], "Round Tent 8m", 5, 9, "upcoming", 580],
  ["cus-1", ["inv-5"], "Bar Table Highboy ×8", -1, 1, "active", 288],
  ["cus-3", ["inv-14"], "DJI Ronin 4D", -3, -1, "late", 680],
].map((row, i) => {
  const [cid, itemIds, itemsLabel, s, e, status, total] = row as [
    string, string[], string, number, number, RentalStatus, number,
  ];
  const cust = customers.find((c) => c.id === cid)!;
  return {
    id: `R-${(2401 + i).toString()}`,
    customerId: cid,
    customerName: cust.name,
    itemIds,
    itemsLabel,
    start: isoDay(s),
    end: isoDay(e),
    status,
    total,
    notes: i % 3 === 0 ? "Delivery requested. Confirm setup window with client." : undefined,
  };
});

export const reservations: Reservation[] = [
  ["Anna Bauer", "Castle Royal XL", 0, 0, "confirmed", 189],
  ["Mehmet Demir", "Round Tent 8m + 50 Chairs", 0, 1, "confirmed", 725],
  ["Jana Hoffmann", "DJ Booth Pro", 0, 2, "pending", 640],
  ["Lukas Weber", "Sony FX3 Cinema Kit", 1, 3, "conflict", 840],
  ["Sarah Krüger", "Aputure 600x ×2", 2, 4, "confirmed", 380],
  ["Felix Braun", "Bosch Drill + Saw", 4, 6, "pending", 96],
].map((row, i) => {
  const [customerName, itemsLabel, s, e, status, total] = row as [
    string, string, number, number, "pending" | "confirmed" | "conflict", number,
  ];
  return {
    id: `RSV-${(881 + i).toString()}`,
    customerName, itemsLabel,
    start: isoDay(s), end: isoDay(e),
    status, total,
  };
});

export const activity = [
  { who: "Anna Bauer", what: "picked up Mega Slide Tropical", when: "2 min ago", tone: "rented" },
  { who: "Mehmet Demir", what: "confirmed reservation RSV-882", when: "18 min ago", tone: "reserved" },
  { who: "System", what: "marked Makita Circular Saw as late", when: "1 hr ago", tone: "late" },
  { who: "Jana Hoffmann", what: "requested DJ Booth Pro", when: "3 hrs ago", tone: "pending" },
  { who: "Felix Braun", what: "returned LED Par Light Set", when: "Yesterday", tone: "returned" },
  { who: "You", what: "added Aputure 600x Light to inventory", when: "Yesterday", tone: "neutral" },
];

export const rentalsOverTime = [
  { day: "Mon", rentals: 12, returns: 9 },
  { day: "Tue", rentals: 18, returns: 11 },
  { day: "Wed", rentals: 14, returns: 16 },
  { day: "Thu", rentals: 22, returns: 13 },
  { day: "Fri", rentals: 31, returns: 18 },
  { day: "Sat", rentals: 38, returns: 24 },
  { day: "Sun", rentals: 27, returns: 30 },
];

export const utilizationByCategory = categories.map((c, i) => ({
  category: c.name.split(" ")[0],
  utilization: [62, 78, 41, 84, 55, 70][i] ?? 60,
}));

export const monthlyRevenue = [
  { m: "Jan", rev: 18400 }, { m: "Feb", rev: 21200 }, { m: "Mar", rev: 26800 },
  { m: "Apr", rev: 31400 }, { m: "May", rev: 42800 }, { m: "Jun", rev: 51200 },
  { m: "Jul", rev: 47600 }, { m: "Aug", rev: 44900 }, { m: "Sep", rev: 39800 },
  { m: "Oct", rev: 35100 }, { m: "Nov", rev: 29400 }, { m: "Dec", rev: 33700 },
];

export function statusTone(s: ItemStatus | RentalStatus | "pending" | "confirmed" | "conflict") {
  switch (s) {
    case "available":
    case "confirmed":
    case "returned":
      return "success";
    case "rented":
    case "active":
      return "primary";
    case "reserved":
    case "upcoming":
    case "pending":
      return "accent";
    case "late":
    case "conflict":
      return "destructive";
    case "maintenance":
      return "warning";
    default:
      return "muted";
  }
}
