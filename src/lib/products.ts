import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export const BRAND = "Saanvi Fashion";

export type Review = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  images: string[];
  colours: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  work: string;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  description: string;
  details: string[];
  isNew?: boolean;
  reviews: Review[];
};

export const CATEGORIES = [
  "Suits",
  "Kurtis",
  "Salwar Suits",
  "Anarkali",
  "Party Wear",
  "New Arrivals",
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const COLOUR_SWATCHES: Record<string, string> = {
  Maroon: "#6b1636",
  Rose: "#d4859b",
  Mint: "#a9d8c2",
  Navy: "#1f2a52",
  Mustard: "#d99a1c",
  Ivory: "#f2e6d4",
  Teal: "#1a7f95",
  Black: "#1a1a1a",
  Pink: "#e39cb2",
  Beige: "#e3d3bd",
};

const rv = (name: string, rating: number, date: string, text: string): Review => ({
  name,
  rating,
  date,
  text,
});

export const PRODUCTS: Product[] = [
  {
    id: "maroon-zari-anarkali",
    name: "Meherbani Maroon Zari Anarkali Suit Set",
    brand: BRAND,
    category: "Anarkali",
    price: 3499,
    mrp: 6999,
    images: [p1, p6, p8],
    colours: [{ name: "Maroon", hex: COLOUR_SWATCHES.Maroon }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Art Silk",
    work: "Gold Zari Embroidery",
    rating: 4.5,
    ratingCount: 2841,
    reviewCount: 312,
    isNew: true,
    description:
      "A festive-ready anarkali in deep maroon art silk, hand-finished with gold zari floral motifs across the yoke and hem. Comes with matching straight pants and a heavily bordered dupatta — the kind of set that works for a sangeet as easily as a Diwali lunch.",
    details: [
      "Kurta length: 46 in (calf length)",
      "Includes kurta, pants and 2.2 m dupatta",
      "Cotton-lined bodice for all-day comfort",
      "Dry clean only",
      "Model is 5'7\" and wears size M",
    ],
    reviews: [
      rv("Ananya R.", 5, "12 Aug 2026", "Wore it for my cousin's engagement — the zari work looks far richer than the price. Fit was true to size."),
      rv("Divya S.", 4, "2 Aug 2026", "Beautiful colour, slightly long for me at 5'2\" so I got it hemmed. Dupatta is gorgeous."),
      rv("Kirti M.", 5, "24 Jul 2026", "Third order from this store and quality is consistent. Lining is soft, no itching."),
    ],
  },
  {
    id: "mint-cotton-kurti-set",
    name: "Sanjh Mint Cotton Straight Kurti with Palazzo",
    brand: BRAND,
    category: "Kurtis",
    price: 1299,
    mrp: 2499,
    images: [p2, p7, p5],
    colours: [
      { name: "Mint", hex: COLOUR_SWATCHES.Mint },
      { name: "Ivory", hex: COLOUR_SWATCHES.Ivory },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Breathable Cotton",
    work: "Solid with Mandarin Placket",
    rating: 4.3,
    ratingCount: 1567,
    reviewCount: 188,
    description:
      "An everyday mint cotton kurti cut straight and clean, with a buttoned mandarin placket and side slits for movement. Paired with wide palazzo pants — the workday set you end up reaching for twice a week.",
    details: [
      "Kurta length: 44 in",
      "Includes kurta and palazzo",
      "Side pockets on palazzo",
      "Machine wash cold, do not bleach",
      "Model is 5'6\" and wears size S",
    ],
    reviews: [
      rv("Meera P.", 4, "18 Aug 2026", "Cotton is genuinely breathable, survived a Chennai summer commute."),
      rv("Sneha J.", 5, "5 Aug 2026", "Pockets! Finally. Colour is exactly as shown."),
    ],
  },
  {
    id: "rose-chikankari-salwar",
    name: "Gulaab Rose Chikankari Salwar Suit",
    brand: BRAND,
    category: "Salwar Suits",
    price: 2799,
    mrp: 4999,
    images: [p3, p1, p6],
    colours: [
      { name: "Rose", hex: COLOUR_SWATCHES.Rose },
      { name: "Ivory", hex: COLOUR_SWATCHES.Ivory },
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Viscose Muslin",
    work: "Lucknowi Chikankari",
    rating: 4.6,
    ratingCount: 3210,
    reviewCount: 421,
    isNew: true,
    description:
      "Fine white thread chikankari on a dusty rose muslin base, made by karigars in Lucknow. Soft, light and quietly elegant — a suit for temple mornings, house pujas and long family lunches.",
    details: [
      "Kurta length: 45 in",
      "Includes kurta, salwar and embroidered dupatta",
      "Hand embroidered — slight variation is natural",
      "Gentle hand wash separately",
      "Model is 5'7\" and wears size M",
    ],
    reviews: [
      rv("Ritika A.", 5, "20 Aug 2026", "The chikan work is real hand work, you can see it on the reverse. Worth every rupee."),
      rv("Pooja V.", 5, "11 Aug 2026", "Feather light. Got compliments all day at a family function."),
      rv("Nisha K.", 4, "30 Jul 2026", "Lovely, but the salwar ran a bit loose. Kurta fit perfectly."),
    ],
  },
  {
    id: "navy-sequin-party-suit",
    name: "Raat Navy Sequin Party Wear Suit",
    brand: BRAND,
    category: "Party Wear",
    price: 4599,
    mrp: 8999,
    images: [p4, p8, p1],
    colours: [
      { name: "Navy", hex: COLOUR_SWATCHES.Navy },
      { name: "Black", hex: COLOUR_SWATCHES.Black },
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Georgette",
    work: "Hand-set Sequin & Zardozi",
    rating: 4.7,
    ratingCount: 1094,
    reviewCount: 143,
    description:
      "Midnight navy georgette scattered with hand-set sequins that catch every bit of light, finished with a sheer pearl-dotted dupatta. Built for receptions, cocktail evenings and photographs that keep getting reposted.",
    details: [
      "Fully flared skirt with can-can lining",
      "Includes blouse, skirt and net dupatta",
      "Concealed side zip",
      "Dry clean only",
      "Model is 5'8\" and wears size M",
    ],
    reviews: [
      rv("Tanvi B.", 5, "22 Aug 2026", "Absolutely stunning in person. The flare is heavy in a good way."),
      rv("Aditi G.", 4, "9 Aug 2026", "Gorgeous but needs a petticoat underneath for comfort."),
    ],
  },
  {
    id: "mustard-printed-kurti",
    name: "Sarson Mustard Printed Rayon Kurti Set",
    brand: BRAND,
    category: "Kurtis",
    price: 1099,
    mrp: 2199,
    images: [p5, p2, p7],
    colours: [
      { name: "Mustard", hex: COLOUR_SWATCHES.Mustard },
      { name: "Teal", hex: COLOUR_SWATCHES.Teal },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    fabric: "Rayon",
    work: "Floral Block Print",
    rating: 4.2,
    ratingCount: 2210,
    reviewCount: 265,
    description:
      "Warm mustard rayon printed with fine ivory florals and paired with slim ankle pants. Drapes beautifully, doesn't crease on a long day, and needs almost no ironing.",
    details: [
      "Kurta length: 45 in",
      "Includes kurta and ankle-length pants",
      "Notched neckline with tassel tie",
      "Machine wash cold",
      "Model is 5'6\" and wears size M",
    ],
    reviews: [
      rv("Harleen S.", 4, "16 Aug 2026", "Great value. Print doesn't fade after three washes."),
      rv("Shruti D.", 4, "1 Aug 2026", "Nice fabric for the price, pants slightly long."),
    ],
  },
  {
    id: "ivory-banarasi-suit",
    name: "Sona Ivory & Gold Banarasi Silk Suit",
    brand: BRAND,
    category: "Suits",
    price: 5299,
    mrp: 9999,
    images: [p6, p1, p3],
    colours: [
      { name: "Ivory", hex: COLOUR_SWATCHES.Ivory },
      { name: "Beige", hex: COLOUR_SWATCHES.Beige },
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Banarasi Silk",
    work: "Handwoven Gold Brocade",
    rating: 4.8,
    ratingCount: 876,
    reviewCount: 121,
    description:
      "Handwoven in Varanasi, this ivory silk suit carries real gold-toned brocade butis and a wide woven border on the dupatta. An heirloom-grade piece for weddings where you want understated luxury rather than loud colour.",
    details: [
      "Genuine Banarasi handloom weave",
      "Includes kurta, pants and brocade dupatta",
      "Silk-lined for structure and fall",
      "Dry clean only, store folded in muslin",
      "Model is 5'7\" and wears size M",
    ],
    reviews: [
      rv("Lakshmi N.", 5, "19 Aug 2026", "Genuine banarasi weave, my mother confirmed. Beautiful fall."),
      rv("Ishita C.", 5, "6 Aug 2026", "Wore it as the bride's sister. Elegant without competing with her."),
    ],
  },
  {
    id: "teal-palazzo-suit",
    name: "Neel Teal Printed Palazzo Suit Set",
    brand: BRAND,
    category: "Suits",
    price: 1899,
    mrp: 3499,
    images: [p7, p5, p2],
    colours: [
      { name: "Teal", hex: COLOUR_SWATCHES.Teal },
      { name: "Maroon", hex: COLOUR_SWATCHES.Maroon },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "Cotton Silk Blend",
    work: "Silver Foil Print",
    rating: 4.4,
    ratingCount: 1782,
    reviewCount: 209,
    isNew: true,
    description:
      "Deep teal cotton-silk with a delicate silver foil buti print, matched with printed palazzos and a tasselled dupatta. Festive enough for an office Diwali party, comfortable enough to wear all evening.",
    details: [
      "Kurta length: 46 in",
      "Includes kurta, palazzo and tasselled dupatta",
      "Woven border at hem and sleeves",
      "Hand wash first wash, then machine wash cold",
      "Model is 5'7\" and wears size M",
    ],
    reviews: [
      rv("Preeti L.", 5, "21 Aug 2026", "The teal is so rich. Foil print hasn't chipped at all."),
      rv("Ayesha F.", 4, "3 Aug 2026", "Comfortable and looks expensive. Dupatta is a little short."),
    ],
  },
  {
    id: "black-velvet-anarkali",
    name: "Shab Black Velvet Embroidered Anarkali Gown",
    brand: BRAND,
    category: "Anarkali",
    price: 6499,
    mrp: 12999,
    images: [p8, p4, p6],
    colours: [
      { name: "Black", hex: COLOUR_SWATCHES.Black },
      { name: "Navy", hex: COLOUR_SWATCHES.Navy },
    ],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Micro Velvet",
    work: "Silver Dori & Stone Work",
    rating: 4.9,
    ratingCount: 542,
    reviewCount: 87,
    description:
      "Floor-length black velvet with silver dori vines climbing from the hem and a sheer stone-dotted dupatta. The most dramatic piece in the collection — best kept for the wedding you actually want to be photographed at.",
    details: [
      "Full length: 56 in floor-grazing gown",
      "Includes gown and embellished net dupatta",
      "Boned bodice with concealed back zip",
      "Dry clean only",
      "Model is 5'8\" and wears size S",
    ],
    reviews: [
      rv("Rhea T.", 5, "23 Aug 2026", "Showstopper. The velvet weight makes the fall perfect."),
      rv("Simran K.", 5, "14 Aug 2026", "Expensive-looking in the best way. Fits like it was stitched for me."),
    ],
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function inCategory(p: Product, category: string) {
  if (category === "New Arrivals") return !!p.isNew;
  return p.category === category;
}

export function discountPercent(p: Product) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
