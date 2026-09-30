export type Mood = "happy" | "fire" | "cool" | "wink" | "crazy" | "love" | "shocked";

export type Product = {
  slug: string;
  name: string;
  /** Short word printed big on the pack */
  packLine: [string, string];
  tagline: string;
  desc: string;
  price: number;
  weight: string;
  category: "chips" | "namkeen" | "healthy";
  spice: 0 | 1 | 2 | 3 | 4 | 5;
  tags: string[];
  mood: Mood;
  color: string; // pack colour
  accent: string; // face / label colour
  bg: string; // page background when this flavour is active
  ingredients: { emoji: string; name: string }[];
  nutrition: { energy: number; protein: number; carbs: number; fat: number };
  pairs: string;
  /** Drop a pack photo into /public/packs and set this, e.g. "/packs/masala.png" */
  image?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "masala-magic",
    name: "Masala Magic Chips",
    packLine: ["MASALA", "MAGIC"],
    tagline: "The OG desi masala. Ek packet kabhi kaafi nahi.",
    desc: "Thin-cut potato chips, kettle-cooked in rice bran oil and tossed in our secret 11-spice chatpata masala.",
    price: 40,
    weight: "70g",
    category: "chips",
    spice: 3,
    tags: ["Bestseller"],
    mood: "happy",
    color: "#FF7A00",
    accent: "#FFD23F",
    bg: "#FFB23F",
    ingredients: [
      { emoji: "🥔", name: "Farm potatoes" },
      { emoji: "🌶️", name: "Kashmiri mirch" },
      { emoji: "🧂", name: "Kala namak" },
      { emoji: "🥭", name: "Amchur" },
      { emoji: "🌿", name: "Dhaniya" },
    ],
    nutrition: { energy: 162, protein: 2, carbs: 16, fat: 10 },
    pairs: "Adrak chai & rainy evenings",
  },
  {
    slug: "pudina-punch",
    name: "Pudina Punch Chips",
    packLine: ["PUDINA", "PUNCH"],
    tagline: "Mint so fresh, it's basically a hill station.",
    desc: "Crispy potato chips with fresh mint, jaljeera and a squeeze of nimbu. Thanda-thanda cool-cool.",
    price: 40,
    weight: "70g",
    category: "chips",
    spice: 1,
    tags: ["Fan favourite"],
    mood: "cool",
    color: "#19C27A",
    accent: "#B8F34A",
    bg: "#7FE0A8",
    ingredients: [
      { emoji: "🥔", name: "Farm potatoes" },
      { emoji: "🌿", name: "Pudina" },
      { emoji: "🍋", name: "Nimbu" },
      { emoji: "🧂", name: "Jaljeera" },
    ],
    nutrition: { energy: 158, protein: 2, carbs: 16, fat: 9 },
    pairs: "Chilled nimbu paani",
  },
  {
    slug: "tamatar-tadka",
    name: "Tamatar Tadka Chips",
    packLine: ["TAMATAR", "TADKA"],
    tagline: "Khatta-meetha tomato with a desi tadka twist.",
    desc: "Ridge-cut chips dusted with sun-dried tomato, jaggery, and a jeera-hing tadka.",
    price: 40,
    weight: "70g",
    category: "chips",
    spice: 2,
    tags: [],
    mood: "wink",
    color: "#FF3B3B",
    accent: "#FFD23F",
    bg: "#FF8A80",
    ingredients: [
      { emoji: "🥔", name: "Farm potatoes" },
      { emoji: "🍅", name: "Sun-dried tomato" },
      { emoji: "🍯", name: "Gud" },
      { emoji: "🧄", name: "Hing & jeera" },
    ],
    nutrition: { energy: 160, protein: 2, carbs: 17, fat: 9 },
    pairs: "Tiffin break gossip",
  },
  {
    slug: "peri-peri-pataka",
    name: "Peri Peri Pataka",
    packLine: ["PERI PERI", "PATAKA"],
    tagline: "Itna teekha ki aansu aa jaaye. Diwali in your mouth.",
    desc: "Our hottest chip. Bhut jolokia + peri peri + smoked paprika. Not for the weak-hearted.",
    price: 50,
    weight: "70g",
    category: "chips",
    spice: 5,
    tags: ["🔥 Extra hot"],
    mood: "fire",
    color: "#E0115F",
    accent: "#FF7A00",
    bg: "#FF6FA0",
    ingredients: [
      { emoji: "🥔", name: "Farm potatoes" },
      { emoji: "🌶️", name: "Bhut jolokia" },
      { emoji: "🔥", name: "Smoked paprika" },
      { emoji: "🧄", name: "Garlic" },
    ],
    nutrition: { energy: 165, protein: 2, carbs: 16, fat: 10 },
    pairs: "A full glass of lassi. Trust us.",
  },
  {
    slug: "kerala-banana",
    name: "Kerala Banana Chips",
    packLine: ["KERALA", "KELA"],
    tagline: "Straight from God's own country, fried in coconut oil.",
    desc: "Nendran banana slices, fried in pure coconut oil with a pinch of salt and curry leaves.",
    price: 60,
    weight: "100g",
    category: "namkeen",
    spice: 0,
    tags: ["Coconut oil"],
    mood: "love",
    color: "#FFC300",
    accent: "#19C27A",
    bg: "#FFE066",
    ingredients: [
      { emoji: "🍌", name: "Nendran banana" },
      { emoji: "🥥", name: "Coconut oil" },
      { emoji: "🌿", name: "Curry leaves" },
      { emoji: "🧂", name: "Sea salt" },
    ],
    nutrition: { energy: 155, protein: 1, carbs: 18, fat: 9 },
    pairs: "Filter coffee",
  },
  {
    slug: "bhujia-bomb",
    name: "Bhujia Bomb",
    packLine: ["BHUJIA", "BOMB"],
    tagline: "Bikaner-style bhujia. Thin, crisp, dangerously addictive.",
    desc: "Moth dal & besan bhujia with black pepper, cloves and a lot of attitude.",
    price: 55,
    weight: "150g",
    category: "namkeen",
    spice: 2,
    tags: ["Bestseller"],
    mood: "crazy",
    color: "#E8A33D",
    accent: "#FF3D7F",
    bg: "#F7C873",
    ingredients: [
      { emoji: "🫘", name: "Moth dal" },
      { emoji: "🟡", name: "Besan" },
      { emoji: "⚫", name: "Kali mirch" },
      { emoji: "🌰", name: "Laung" },
    ],
    nutrition: { energy: 170, protein: 5, carbs: 13, fat: 11 },
    pairs: "Poha, sev puri, literally everything",
  },
  {
    slug: "chana-jor",
    name: "Chana Jor Garam",
    packLine: ["CHANA JOR", "GARAM"],
    tagline: "Railway-station classic, now in a pack.",
    desc: "Flattened roasted chana with onion-tomato masala and nimbu. Protein bhi, taste bhi.",
    price: 45,
    weight: "100g",
    category: "healthy",
    spice: 2,
    tags: ["High protein"],
    mood: "happy",
    color: "#7B2FF7",
    accent: "#FFD23F",
    bg: "#B794FF",
    ingredients: [
      { emoji: "🫘", name: "Kala chana" },
      { emoji: "🧅", name: "Pyaaz masala" },
      { emoji: "🍋", name: "Nimbu" },
      { emoji: "🌶️", name: "Laal mirch" },
    ],
    nutrition: { energy: 120, protein: 7, carbs: 15, fat: 3 },
    pairs: "Evening walk + gupshup",
  },
  {
    slug: "ragi-crunchies",
    name: "Ragi Crunchies",
    packLine: ["RAGI", "CRUNCH"],
    tagline: "Baked millet puffs. Maa bhi approve karegi.",
    desc: "Baked (not fried!) ragi & jowar puffs with a light chaat masala dust. Healthy ka naya naam.",
    price: 50,
    weight: "60g",
    category: "healthy",
    spice: 1,
    tags: ["Baked", "Millet"],
    mood: "cool",
    color: "#8B4A2B",
    accent: "#B8F34A",
    bg: "#D9A07A",
    ingredients: [
      { emoji: "🌾", name: "Ragi" },
      { emoji: "🌾", name: "Jowar" },
      { emoji: "🧂", name: "Chaat masala" },
      { emoji: "🫒", name: "Olive oil" },
    ],
    nutrition: { energy: 110, protein: 4, carbs: 20, fat: 2 },
    pairs: "Work-from-home meetings",
  },
  {
    slug: "makhana-masti",
    name: "Makhana Masti",
    packLine: ["MAKHANA", "MASTI"],
    tagline: "Roasted fox nuts in peri-cheese. Guilt? Kaunsa guilt?",
    desc: "Bihar's finest makhana, slow-roasted in ghee and tossed in cheese & herbs.",
    price: 90,
    weight: "60g",
    category: "healthy",
    spice: 1,
    tags: ["New", "Roasted"],
    mood: "love",
    color: "#4CC9F0",
    accent: "#FFD23F",
    bg: "#9BE3F7",
    ingredients: [
      { emoji: "⚪", name: "Makhana" },
      { emoji: "🧀", name: "Cheese" },
      { emoji: "🌿", name: "Herbs" },
      { emoji: "🧈", name: "Desi ghee" },
    ],
    nutrition: { energy: 115, protein: 3, carbs: 17, fat: 4 },
    pairs: "Netflix & munch",
  },
];

export const CATEGORY_FILTERS = [
  { id: "all", label: "Sab kuch", emoji: "✨" },
  { id: "chips", label: "Chips", emoji: "🥔" },
  { id: "namkeen", label: "Namkeen", emoji: "🥨" },
  { id: "healthy", label: "Healthy", emoji: "💪" },
  { id: "spicy", label: "Teekha", emoji: "🌶️" },
] as const;

export type Combo = {
  id: string;
  name: string;
  tagline: string;
  items: string[];
  price: number;
  color: string;
  emoji: string;
};

export const COMBOS: Combo[] = [
  {
    id: "movie-night",
    name: "Movie Night Combo",
    tagline: "4 packs for the full picture, interval included.",
    items: ["masala-magic", "peri-peri-pataka", "makhana-masti", "pudina-punch"],
    price: 199,
    color: "#7B2FF7",
    emoji: "🍿",
  },
  {
    id: "office-munchies",
    name: "Office Munchies",
    tagline: "Healthy-ish desk snacks. Boss ko mat batana.",
    items: ["ragi-crunchies", "chana-jor", "makhana-masti", "kerala-banana", "bhujia-bomb", "ragi-crunchies"],
    price: 299,
    color: "#19C27A",
    emoji: "💼",
  },
  {
    id: "diwali-dhamaka",
    name: "Diwali Dhamaka Box",
    tagline: "8 packs in a festive gift box. Sabko khush karo 🪔",
    items: ["masala-magic", "tamatar-tadka", "pudina-punch", "peri-peri-pataka", "kerala-banana", "bhujia-bomb", "chana-jor", "makhana-masti"],
    price: 379,
    color: "#E0115F",
    emoji: "🪔",
  },
  {
    id: "teekha-trio",
    name: "Teekha Trio",
    tagline: "For those who think 'medium spicy' is an insult.",
    items: ["peri-peri-pataka", "masala-magic", "bhujia-bomb"],
    price: 129,
    color: "#FF3B3B",
    emoji: "🌶️",
  },
];

export const BOX_SIZES = [
  { size: 6, discount: 0.1, label: "Chhota Box", note: "6 packs · 10% off" },
  { size: 10, discount: 0.15, label: "Bada Box", note: "10 packs · 15% off" },
] as const;

export const PLANS = [
  { id: "mini", name: "Mini Munch", packs: 4, price: 169, every: "week", emoji: "🐣", color: "#FFD23F", perks: ["4 packs every week", "Free delivery", "Pause anytime"] },
  { id: "family", name: "Family Pack", packs: 8, price: 319, every: "week", emoji: "👨‍👩‍👧", color: "#FF7A00", perks: ["8 packs every week", "Free delivery", "1 new flavour first", "Pause / skip anytime"], popular: true },
  { id: "party", name: "Party Monthly", packs: 20, price: 749, every: "month", emoji: "🥳", color: "#FF3D7F", perks: ["20 packs every month", "Free delivery", "Surprise festive gift", "Cancel anytime"] },
] as const;

export const PREFS = [
  { id: "surprise", label: "Surprise me 🎁" },
  { id: "spicy", label: "Teekha only 🌶️" },
  { id: "mild", label: "Mild & masaledaar 😋" },
  { id: "healthy", label: "Healthy picks 💪" },
] as const;

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const findCombo = (id: string) => COMBOS.find((c) => c.id === id);
export const findPlan = (id: string) => PLANS.find((p) => p.id === id);
