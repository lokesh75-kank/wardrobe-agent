// Seed closet catalog. `image_key` maps to a bundled asset in wardrobe.functions.ts.

export type SeedItem = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  color: string;
  image_key: string;
  description: string;
};

export const SEED_CLOSET: SeedItem[] = [
  {
    id: "olive-jacket",
    name: "Olive Field Jacket",
    category: "Outerwear",
    brand: "Aimé Leon Dore",
    price: 480,
    color: "olive",
    image_key: "olive-jacket",
    description:
      "Mid-weight olive cotton field jacket. Works for 10–15°C evenings, dinner-out vibe, layers over a tee or knit.",
  },
  {
    id: "white-tee",
    name: "White Cotton Tee",
    category: "Top",
    brand: "Sunspel",
    price: 90,
    color: "white",
    image_key: "white-tee",
    description: "Heavyweight white cotton tee. Anchor for almost any outfit; pairs with jacket + denim.",
  },
  {
    id: "rot-jeans",
    name: "Selvedge Denim",
    category: "Bottoms",
    brand: "3sixteen",
    price: 240,
    color: "indigo",
    image_key: "rot-jeans",
    description: "Raw indigo selvedge denim, straight leg. Best with boots; reads sharp but lived-in.",
  },
  {
    id: "rot-sweater",
    name: "Cream Cable Knit",
    category: "Knitwear",
    brand: "Drake's",
    price: 320,
    color: "cream",
    image_key: "rot-sweater",
    description: "Cream wool cable-knit. Warm for sub-12°C days, weekend coffee energy, layers under field jacket.",
  },
  {
    id: "rot-boots",
    name: "Chelsea Boots",
    category: "Footwear",
    brand: "R.M. Williams",
    price: 595,
    color: "brown",
    image_key: "rot-boots",
    description: "Brown leather Chelsea boots. Dressier than sneakers, fine for dinner; skip on long walks.",
  },
];
