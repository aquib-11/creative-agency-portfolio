// lib/data.ts
// ─── Types ───────────────────────────────────────────────────────────────────

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  platform: "instagram" | "facebook" | "youtube" | "tiktok";
  url: string;
}

export interface Client {
  id: string;
  name: string;
  slug: string; // e.g. "tesla", "bmw"
  description: string;
  coverImage: string;
  industry: string; // must match an Industry name exactly
  videos: Video[];
}

export interface Industry {
  id: string;
  name: string;
}

// ─── Industries ──────────────────────────────────────────────────────────────

export const industriesData: Industry[] = [
  { id: "1", name: "Automobile" },
  { id: "2", name: "Healthcare" },
  { id: "3", name: "Real Estate" },
  { id: "4", name: "Food & Beverage" },
  { id: "5", name: "Fashion" },
  { id: "6", name: "Technology" },
  { id: "7", name: "Hospitality" },
  { id: "8", name: "Fitness" },
];

// ─── Clients + their Videos ──────────────────────────────────────────────────

export const clientsData: Client[] = [
  // ── Automobile ──────────────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Tesla",
    slug: "tesla",
    description: "EV brand redefining sustainable mobility",
    coverImage:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
    industry: "Automobile",
    videos: [
      {
        id: "v1",
        title: "Tesla Model S Launch",
        thumbnail:
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
      {
        id: "v2",
        title: "Autopilot Feature Reel",
        thumbnail:
          "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
    ],
  },
  {
    id: "c2",
    name: "BMW",
    slug: "bmw",
    description: "Luxury performance vehicles and driving experiences",
    coverImage:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    industry: "Automobile",
    videos: [
      {
        id: "v3",
        title: "BMW M Series Campaign",
        thumbnail:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
      {
        id: "v4",
        title: "The Ultimate Drive",
        thumbnail:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
        platform: "facebook",
        url: "https://facebook.com",
      },
    ],
  },
  {
    id: "c3",
    name: "Maruti Suzuki",
    slug: "maruti-suzuki",
    description: "India's most trusted mass-market car brand",
    coverImage:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=400&fit=crop",
    industry: "Automobile",
    videos: [
      {
        id: "v5",
        title: "Swift New Generation",
        thumbnail:
          "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },

  // ── Healthcare ───────────────────────────────────────────────────────────────
  {
    id: "c4",
    name: "Apollo Hospitals",
    slug: "apollo-hospitals",
    description: "Asia's foremost integrated healthcare services provider",
    coverImage:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
    industry: "Healthcare",
    videos: [
      {
        id: "v6",
        title: "Patient Success Stories",
        thumbnail:
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
      {
        id: "v7",
        title: "World Heart Day Campaign",
        thumbnail:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
    ],
  },
  {
    id: "c5",
    name: "Practo",
    slug: "practo",
    description: "Digital health platform connecting patients & doctors",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    industry: "Healthcare",
    videos: [
      {
        id: "v8",
        title: "Book a Doctor in 60 Seconds",
        thumbnail:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
        platform: "tiktok",
        url: "https://tiktok.com",
      },
    ],
  },

  // ── Real Estate ───────────────────────────────────────────────────────────────
  {
    id: "c6",
    name: "DLF",
    slug: "dlf",
    description: "India's largest real estate developer",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    industry: "Real Estate",
    videos: [
      {
        id: "v9",
        title: "DLF The Ultima – Walkthrough",
        thumbnail:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "c7",
    name: "Prestige Group",
    slug: "prestige-group",
    description: "Premium residential and commercial projects",
    coverImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    industry: "Real Estate",
    videos: [
      {
        id: "v10",
        title: "Prestige City Launch",
        thumbnail:
          "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop",
        platform: "facebook",
        url: "https://facebook.com",
      },
    ],
  },

  // ── Food & Beverage ───────────────────────────────────────────────────────────
  {
    id: "c8",
    name: "Zomato",
    slug: "zomato",
    description: "India's leading food delivery platform",
    coverImage:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop",
    industry: "Food & Beverage",
    videos: [
      {
        id: "v11",
        title: "Order in 30 Minutes",
        thumbnail:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
      {
        id: "v12",
        title: "Zomato Gold Campaign",
        thumbnail:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "c9",
    name: "Starbucks India",
    slug: "starbucks-india",
    description: "Premium coffee experience crafted for India",
    coverImage:
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&h=400&fit=crop",
    industry: "Food & Beverage",
    videos: [
      {
        id: "v13",
        title: "Monsoon Drinks Reveal",
        thumbnail:
          "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop",
        platform: "tiktok",
        url: "https://tiktok.com",
      },
    ],
  },

  // ── Fashion ───────────────────────────────────────────────────────────────────
  {
    id: "c10",
    name: "Myntra",
    slug: "myntra",
    description: "India's leading fashion e-commerce destination",
    coverImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=400&fit=crop",
    industry: "Fashion",
    videos: [
      {
        id: "v14",
        title: "End of Reason Sale",
        thumbnail:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
    ],
  },
  {
    id: "c11",
    name: "Fabindia",
    slug: "fabindia",
    description: "Handcrafted Indian textiles and lifestyle products",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    industry: "Fashion",
    videos: [
      {
        id: "v15",
        title: "Festive Collection 2024",
        thumbnail:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },

  // ── Technology ────────────────────────────────────────────────────────────────
  {
    id: "c12",
    name: "Razorpay",
    slug: "razorpay",
    description: "India's leading payments and fintech platform",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    industry: "Technology",
    videos: [
      {
        id: "v16",
        title: "Razorpay for Startups",
        thumbnail:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "c13",
    name: "Freshworks",
    slug: "freshworks",
    description: "Cloud-based business software for teams worldwide",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    industry: "Technology",
    videos: [
      {
        id: "v17",
        title: "CRM That Works For You",
        thumbnail:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
        platform: "facebook",
        url: "https://facebook.com",
      },
    ],
  },

  // ── Hospitality ───────────────────────────────────────────────────────────────
  {
    id: "c14",
    name: "Taj Hotels",
    slug: "taj-hotels",
    description: "Iconic luxury hospitality with Indian heritage",
    coverImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    industry: "Hospitality",
    videos: [
      {
        id: "v18",
        title: "The Taj Experience",
        thumbnail:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
      {
        id: "v19",
        title: "Diwali at Taj",
        thumbnail:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
    ],
  },
  {
    id: "c15",
    name: "OYO",
    slug: "oyo",
    description: "Budget and premium stays reimagined at scale",
    coverImage:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    industry: "Hospitality",
    videos: [
      {
        id: "v20",
        title: "OYO – Feel at Home",
        thumbnail:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
        platform: "tiktok",
        url: "https://tiktok.com",
      },
    ],
  },

  // ── Fitness ───────────────────────────────────────────────────────────────────
  {
    id: "c16",
    name: "Cult.fit",
    slug: "cult-fit",
    description: "India's largest fitness and wellness platform",
    coverImage:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    industry: "Fitness",
    videos: [
      {
        id: "v21",
        title: "Train Like a Champion",
        thumbnail:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
        platform: "instagram",
        url: "https://instagram.com",
      },
      {
        id: "v22",
        title: "Cult.fit App Walkthrough",
        thumbnail:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        platform: "youtube",
        url: "https://youtube.com",
      },
    ],
  },
  {
    id: "c17",
    name: "Gold's Gym",
    slug: "golds-gym",
    description: "Premium gym chain with global legacy",
    coverImage:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
    industry: "Fitness",
    videos: [
      {
        id: "v23",
        title: "Gold's Gym Transformation Stories",
        thumbnail:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop",
        platform: "facebook",
        url: "https://facebook.com",
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const getClientBySlug = (slug: string): Client | undefined =>
  clientsData.find((c) => c.slug === slug);

export const fromSlug = (slug: string): string | null =>
  industriesData.find((i) => toSlug(i.name) === slug)?.name ?? null;