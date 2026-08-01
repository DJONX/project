import { MerchantConfig } from "@cameroon-merchants/config-schema";

export const mockMerchants: MerchantConfig[] = [
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546013",
    slug: "boutique-chic",
    businessName: "Boutique Chic",
    sector: "Boutique de vêtements",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#db2777", // pink-600
      secondary: "#4f46e5", // indigo-600
      accent: "#f59e0b", // amber-500
    },
    tagline: "Prêt-à-porter & Accessoires haut de gamme à Douala",
    aboutText: "Votre destination mode ultime pour des styles uniques et élégants adaptés à toutes les occasions.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-1111-2222-3333-444444444444",
        name: "Robe d'été Fleurie",
        priceXAF: 25000,
        description: "Robe longue fluide avec motifs floraux, idéale pour les journées ensoleillées.",
        photoUrls: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
        ],
        category: "Robes",
        inStock: true,
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["S", "M", "L"],
          colors: ["Rose", "Jaune"],
          brand: "Cameroon Couture",
          material: "Coton",
        },
      },
      {
        id: "b2b2b2b2-1111-2222-3333-444444444444",
        name: "Chemise en Soie Classique",
        priceXAF: 18500,
        description: "Chemise élégante en soie naturelle, parfaite pour le bureau ou les soirées.",
        photoUrls: ["https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=500"],
        category: "Hauts",
        inStock: true,
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["M", "L", "XL"],
          colors: ["Blanc", "Noir"],
          brand: "Elegant",
          material: "Soie",
        },
      },
      {
        id: "c3c3c3c3-1111-2222-3333-444444444444",
        name: "Pantalon Large Lin",
        priceXAF: 15000,
        description: "Pantalon en lin de qualité supérieure, taille haute et coupe décontractée.",
        photoUrls: ["https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500"],
        category: "Pantalons",
        inStock: true,
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["S", "M", "L"],
          colors: ["Beige", "Kaki"],
          material: "Lin",
        },
      },
      {
        id: "d4d4d4d4-1111-2222-3333-444444444444",
        name: "Veste Blazer Structurée",
        priceXAF: 35000,
        description: "Blazer ajusté chic à double boutonnage, épaules légèrement structurées.",
        photoUrls: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"],
        category: "Hauts",
        inStock: true,
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["M", "L"],
          colors: ["Marine", "Noir"],
          brand: "Vogue",
          material: "Laine mélangée",
        },
      },
      {
        id: "e5e5e5e5-1111-2222-3333-444444444444",
        name: "Jupe Plissée Midi",
        priceXAF: 12000,
        description: "Jupe plissée longueur midi, ceinture élastique confortable.",
        photoUrls: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500"],
        category: "Robes",
        inStock: true,
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["M", "L", "XL"],
          colors: ["Bleu", "Gris"],
        },
      },
      {
        id: "f6f6f6f6-1111-2222-3333-444444444444",
        name: "Robe de Soirée Somptueuse",
        priceXAF: 45000,
        description: "Robe de soirée élégante en velours avec détails pailletés.",
        photoUrls: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500"],
        category: "Robes",
        inStock: false, // out of stock product to test that state
        sectorSpecificFields: {
          sector: "Boutique de vêtements",
          sizes: ["S", "M"],
          colors: ["Rouge"],
          material: "Velours",
        },
      },
    ],
  },
  {
    id: "ee305d54-75b4-431b-adb2-eb6b9e546013",
    slug: "boutique-inactive",
    businessName: "Boutique Inactive",
    sector: "Boutique de vêtements",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=128&h=128",
    colorPalette: {
      primary: "#000",
      secondary: "#000",
      accent: "#000",
    },
    tagline: "Une boutique de vêtements inactive pour tester",
    aboutText: "Cette boutique ne devrait pas s'afficher car isActive est false.",
    verifiedBadge: false,
    isActive: false, // inactive shop
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [],
  },
];

export const getMerchantBySlug = (slug: string): MerchantConfig | undefined => {
  return mockMerchants.find((m) => m.slug === slug);
};
