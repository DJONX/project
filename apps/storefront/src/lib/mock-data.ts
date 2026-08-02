import { MerchantConfig } from "@cameroon-merchants/config-schema";

// Generates 50 products for the supermarket express mock merchant
const generateSupermarketProducts = () => {
  const products = [];
  for (let i = 1; i <= 52; i++) {
    products.push({
      id: `f6f6f6f6-1111-2222-3333-4444444444${i.toString().padStart(2, "0")}`,
      name: `Produit Épicerie #${i}`,
      priceXAF: 450 + i * 50,
      description: `Description détaillée pour le produit d'épicerie #${i}. Un produit frais et sélectionné de qualité supérieure.`,
      photoUrls: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=128"],
      category: i % 2 === 0 ? "Frais" : "Épicerie Sec",
      inStock: i !== 13, // Product #13 out of stock
      sectorSpecificFields: {
        sector: "Supermarché / épicerie" as const,
        weightGrams: 200 + i * 10,
        brand: "Express Select",
        expirationDate: "2027-12-31",
      },
    });
  }
  return products;
};

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
    aboutText:
      "Votre destination mode ultime pour des styles uniques et élégants adaptés à toutes les occasions.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-1111-2222-3333-444444444444",
        name: "Robe d'été Fleurie",
        priceXAF: 25000,
        description:
          "Robe longue fluide avec motifs floraux, idéale pour les journées ensoleillées.",
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
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546014",
    slug: "restaurant-ndole",
    businessName: "Saveurs d'Afrique",
    sector: "Restaurant / food",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#ea580c", // orange-600
      secondary: "#b45309", // amber-700
      accent: "#16a34a", // green-600
    },
    tagline: "Les meilleures spécialités camerounaises à Yaoundé",
    aboutText:
      "Cuisine authentique, épices sélectionnées, plats généreux faits maison pour toute la famille.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-2222-3333-4444-444444444444",
        name: "Ndole Royal",
        priceXAF: 4500,
        description: "Le célèbre plat national avec crevettes fraîches et viande de bœuf tendre.",
        photoUrls: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"],
        category: "Plats",
        inStock: true,
        sectorSpecificFields: {
          sector: "Restaurant / food",
          spiceLevel: "medium" as const,
          prepTimeMinutes: 30,
          isDietary: ["Sans gluten"],
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546015",
    slug: "cosmetics-glow",
    businessName: "Sika Cosmétiques",
    sector: "Cosmétiques & beauté",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#db2777",
      secondary: "#ec4899",
      accent: "#f472b6",
    },
    tagline: "Révélez votre éclat naturel avec des produits bio",
    aboutText: "Gamme naturelle de soins capillaires et corporels de fabrication artisanale.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-3333-3333-4444-444444444444",
        name: "Beurre de Karité Premium",
        priceXAF: 3500,
        description: "Beurre de karité 100% pur, extrait à froid, enrichi aux huiles essentielles.",
        photoUrls: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"],
        category: "Soins Corps",
        inStock: true,
        sectorSpecificFields: {
          sector: "Cosmétiques & beauté",
          skinType: ["Sèche", "Sensible"],
          volumeMl: 250,
          ingredients: ["Karité", "Huile de coco"],
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546016",
    slug: "pharmacy-sante",
    businessName: "Pharmacie Bastos",
    sector: "Pharmacie / santé",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304a2c06?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#0f766e", // teal-700
      secondary: "#0d9488", // teal-600
      accent: "#10b981", // emerald-500
    },
    tagline: "Votre santé, notre priorité absolue au quotidien",
    aboutText: "Pharmacie agréée fournissant des médicaments sûrs et des conseils professionnels.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-4444-3333-4444-444444444444",
        name: "Paracétamol 500mg",
        priceXAF: 1200,
        description: "Médicament destiné à soulager la douleur et faire baisser la fièvre.",
        photoUrls: ["https://images.unsplash.com/photo-1607619056574-7b8d304a2c06?w=500"],
        category: "Analgésiques",
        inStock: true,
        sectorSpecificFields: {
          sector: "Pharmacie / santé",
          requiresPrescription: false,
          dosage: "1 à 2 comprimés par prise",
          expiryDate: "2028-06-30",
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546017",
    slug: "electronics-tech",
    businessName: "Cameroon Tech",
    sector: "Électronique",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#2563eb", // blue-600
      secondary: "#1d4ed8", // blue-700
      accent: "#f59e0b",
    },
    tagline: "Le meilleur de la haute technologie et informatique",
    aboutText: "Vente d'appareils électroniques garantis et certifiés d'origine.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-5555-3333-4444-444444444444",
        name: "Smartphone Pro Max",
        priceXAF: 450000,
        description:
          "Écran AMOLED, triple capteur photo, performances extrêmes et autonomie géante.",
        photoUrls: ["https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"],
        category: "Téléphonie",
        inStock: true,
        sectorSpecificFields: {
          sector: "Électronique",
          brand: "Sama",
          model: "Pro Max 12",
          warrantyMonths: 12,
          specs: {
            stockage: "256 Go",
            ram: "8 Go",
          },
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546018",
    slug: "realestate-bastos",
    businessName: "Bastos Immo",
    sector: "Immobilier",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#0f172a", // slate-900
      secondary: "#334155", // slate-700
      accent: "#0ea5e9", // sky-500
    },
    tagline: "Votre partenaire immobilier de confiance au Cameroun",
    aboutText:
      "Agence immobilière de standing spécialisée dans la location et vente de propriétés exclusives.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-6666-3333-4444-444444444444",
        name: "Splendide Duplex Bastos",
        priceXAF: 800000,
        description: "Grand duplex moderne sécurisé, jardin luxuriant et parking fermé.",
        photoUrls: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500"],
        category: "Location",
        inStock: true,
        sectorSpecificFields: {
          sector: "Immobilier",
          surfaceM2: 240,
          rooms: 5,
          location: "Bastos, Yaoundé",
          propertyType: "maison" as const,
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546019",
    slug: "artisan-pottery",
    businessName: "Argile d'Afrique",
    sector: "Artisan / fait-main",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#78350f", // amber-900
      secondary: "#92400e", // amber-800
      accent: "#d97706", // amber-600
    },
    tagline: "Poterie et céramique artisanale d'exception",
    aboutText:
      "Chaque pièce est unique, façonnée à la main à l'aide de techniques traditionnelles ancestrales.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-7777-3333-4444-444444444444",
        name: "Vase en Argile Ciselé",
        priceXAF: 15000,
        description: "Vase décoratif en argile cuite naturelle, sculpté entièrement à la main.",
        photoUrls: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500"],
        category: "Céramiques",
        inStock: true,
        sectorSpecificFields: {
          sector: "Artisan / fait-main",
          craftType: "Tournage et ciselage",
          customizationOptions: ["Initiale gravée", "Taille sur mesure"],
          productionTimeDays: 7,
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546020",
    slug: "trainer-code",
    businessName: "Yaoundé Tech Academy",
    sector: "Formateur / cours & coaching",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#0369a1", // sky-700
      secondary: "#0284c7", // sky-600
      accent: "#0ea5e9", // sky-500
    },
    tagline: "Propulsez votre carrière avec le code et la technologie",
    aboutText:
      "Formations certifiantes en développement web, assurées par des experts de l'industrie numérique.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-8888-3333-4444-444444444444",
        name: "Formation React & Next.js",
        priceXAF: 150000,
        description:
          "Maîtrisez le développement d'applications modernes de A à Z avec les meilleurs frameworks.",
        photoUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"],
        category: "Web Dev",
        inStock: true,
        sectorSpecificFields: {
          sector: "Formateur / cours & coaching",
          durationHours: 40,
          format: "hybrid" as const,
          level: "intermediate" as const,
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546021",
    slug: "bookstore-manga",
    businessName: "Manga & Book Club",
    sector: "Librairie / papeterie",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#1c1917", // stone-900
      secondary: "#44403c", // stone-700
      accent: "#ca8a04", // yellow-600
    },
    tagline: "Votre repaire littéraire et mangas à Douala",
    aboutText: "Grande collection de mangas d'importation, romans, et papeterie pour passionnés.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: [
      {
        id: "a1a1a1a1-9999-3333-4444-444444444444",
        name: "Manga One Piece Tome 100",
        priceXAF: 5500,
        description: "L'édition originale officielle en français du centième tome légendaire.",
        photoUrls: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"],
        category: "Manga",
        inStock: true,
        sectorSpecificFields: {
          sector: "Librairie / papeterie",
          author: "Eiichiro Oda",
          isbn: "9782344049581",
          publisher: "Glénat",
          pages: 208,
        },
      },
    ],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546022",
    slug: "supermarket-express",
    businessName: "Express Alimentation",
    sector: "Supermarché / épicerie",
    whatsappNumber: "+237677123456",
    logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&h=128&fit=crop",
    colorPalette: {
      primary: "#16a34a", // green-600
      secondary: "#15803d", // green-700
      accent: "#f59e0b",
    },
    tagline: "Vos courses du quotidien livrées chez vous en un temps record",
    aboutText:
      "Supermarché express en ligne, produits frais, conserves, entretien à prix discount.",
    verifiedBadge: true,
    isActive: true,
    createdAt: "2026-08-01T12:00:00Z",
    updatedAt: "2026-08-01T12:00:00Z",
    products: generateSupermarketProducts(), // Generates 52 dynamic supermarket products
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
