import { describe, it, expect } from "vitest";
import { MerchantConfigSchema, LeadSchema, ProductSchema } from "./index";

const validMerchantId = "11111111-2222-3333-4444-555555555555";
const validProductId = "22222222-3333-4444-5555-666666666666";

const createValidConfig = () => ({
  id: validMerchantId,
  slug: "boutique-de-paul",
  businessName: "Boutique de Paul",
  sector: "Boutique de vêtements",
  whatsappNumber: "+237677123456",
  logoUrl: "https://example.com/logo.png",
  colorPalette: {
    primary: "#ff0000",
    secondary: "#00ff00",
    accent: "#0000ff",
  },
  tagline: "Le meilleur de la mode à Douala",
  aboutText: "Nous vendons des vêtements de marque importés de France.",
  socialLinks: [{ platform: "facebook", url: "https://facebook.com/boutiquepauly" }],
  verifiedBadge: true,
  isActive: true,
  createdAt: "2026-08-01T12:00:00Z",
  updatedAt: "2026-08-01T12:00:00Z",
  products: [
    {
      id: validProductId,
      name: "Chemise en lin",
      priceXAF: 15000,
      description: "Chemise légère et élégante pour l'été.",
      photoUrls: ["https://example.com/product1.png"],
      category: "Hauts",
      inStock: true,
      sectorSpecificFields: {
        sector: "Boutique de vêtements",
        sizes: ["M", "L", "XL"],
        colors: ["Blanc", "Bleu"],
        brand: "Zara",
        material: "Lin",
      },
    },
  ],
});

describe("MerchantConfigSchema", () => {
  it("should pass for a valid configuration", () => {
    const validConfig = createValidConfig();
    const result = MerchantConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("should fail when a required field is missing", () => {
    const invalidConfig = createValidConfig() as Record<string, unknown>;
    delete invalidConfig.businessName;

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorPaths = result.error.errors.map((e) => e.path.join("."));
      expect(errorPaths).toContain("businessName");
      const errorMessage = result.error.errors.find(
        (e) => e.path.join(".") === "businessName"
      )?.message;
      expect(errorMessage).toBe("Le nom de l'entreprise est requis");
    }
  });

  it("should fail when WhatsApp number format is invalid", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.whatsappNumber = "invalid-phone";

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const whatsappError = result.error.errors.find((e) => e.path.join(".") === "whatsappNumber");
      expect(whatsappError?.message).toBe(
        "Le numéro WhatsApp doit être au format E.164 valide (ex: +237600000000)"
      );
    }
  });

  it("should format and transform a 9-digit local Cameroon WhatsApp number properly", () => {
    const config = createValidConfig();
    config.whatsappNumber = "677123456"; // 9-digit local Cameroon format

    const result = MerchantConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatsappNumber).toBe("+237677123456");
    }
  });

  it("should format and transform a 237-prefixed local Cameroon WhatsApp number properly", () => {
    const config = createValidConfig();
    config.whatsappNumber = "237677123456";

    const result = MerchantConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.whatsappNumber).toBe("+237677123456");
    }
  });

  it("should fail when hex color in colorPalette is invalid", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.colorPalette.primary = "invalid-hex";

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const primaryColorError = result.error.errors.find(
        (e) => e.path.join(".") === "colorPalette.primary"
      );
      expect(primaryColorError?.message).toBe(
        "Le code couleur doit être un format hexadécimal valide (ex: #ffffff ou #fff)"
      );
    }
  });

  it("should fail when color palette accent is missing", () => {
    const invalidConfig = createValidConfig() as Record<string, unknown>;
    delete (invalidConfig.colorPalette as Record<string, unknown>).accent;

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should fail when sector is invalid", () => {
    const invalidConfig = createValidConfig() as Record<string, unknown>;
    invalidConfig.sector = "Unknown Sector";

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const sectorError = result.error.errors.find((e) => e.path.join(".") === "sector");
      expect(sectorError?.message).toBe("Le secteur d'activité spécifié est invalide");
    }
  });

  it("should fail when slug is not URL-safe", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.slug = "Boutique De Paul!"; // uppercase and spaces/symbols

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const slugError = result.error.errors.find((e) => e.path.join(".") === "slug");
      expect(slugError?.message).toBe(
        "Le slug doit être au format URL-safe (minuscules, chiffres et tirets uniquement)"
      );
    }
  });

  it("should fail when a product price is a decimal or float", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.products[0].priceXAF = 1500.5; // decimal float

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const priceError = result.error.errors.find(
        (e) => e.path.join(".") === "products.0.priceXAF"
      );
      expect(priceError?.message).toBe("Le prix doit être un nombre entier (FCFA)");
    }
  });

  it("should fail when product photoUrls array has zero items", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.products[0].photoUrls = []; // empty

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const photoError = result.error.errors.find(
        (e) => e.path.join(".") === "products.0.photoUrls"
      );
      expect(photoError?.message).toBe("Au moins une photo est requise");
    }
  });

  it("should fail when product photoUrls array has more than 6 items", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.products[0].photoUrls = [
      "https://example.com/p1.png",
      "https://example.com/p2.png",
      "https://example.com/p3.png",
      "https://example.com/p4.png",
      "https://example.com/p5.png",
      "https://example.com/p6.png",
      "https://example.com/p7.png",
    ];

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const photoError = result.error.errors.find(
        (e) => e.path.join(".") === "products.0.photoUrls"
      );
      expect(photoError?.message).toBe("Le produit ne peut pas avoir plus de 6 photos");
    }
  });

  it("should fail when a product ID is not a valid UUID", () => {
    const invalidConfig = createValidConfig();
    invalidConfig.products[0].id = "not-a-uuid";

    const result = MerchantConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
    if (!result.success) {
      const idError = result.error.errors.find((e) => e.path.join(".") === "products.0.id");
      expect(idError?.message).toBe("L'identifiant du produit doit être un UUID valide");
    }
  });
});

describe("SectorSpecificFieldsSchema", () => {
  it("should validate and allow correct restaurant specific fields", () => {
    const productFields = {
      sector: "Restaurant / food",
      spiceLevel: "hot",
      prepTimeMinutes: 25,
      isDietary: ["vegan"],
    };

    const product = {
      id: validProductId,
      name: "Ndole",
      priceXAF: 3500,
      description: "Plat traditionnel camerounais",
      photoUrls: ["https://example.com/ndole.jpg"],
      category: "Plats",
      inStock: true,
      sectorSpecificFields: productFields,
    };

    const result = ProductSchema.safeParse(product);
    expect(result.success).toBe(true);
  });

  it("should fail when restaurant spiceLevel is invalid", () => {
    const productFields = {
      sector: "Restaurant / food",
      spiceLevel: "extremely-spicy", // invalid
    };

    const product = {
      id: validProductId,
      name: "Ndole",
      priceXAF: 3500,
      description: "Plat traditionnel",
      photoUrls: ["https://example.com/ndole.jpg"],
      category: "Plats",
      inStock: true,
      sectorSpecificFields: productFields,
    };

    const result = ProductSchema.safeParse(product);
    expect(result.success).toBe(false);
  });

  it("should validate and allow correct real estate specific fields", () => {
    const productFields = {
      sector: "Immobilier",
      surfaceM2: 120,
      rooms: 4,
      location: "Bastos, Yaoundé",
      propertyType: "appartement",
    };

    const product = {
      id: validProductId,
      name: "Duplex de standing",
      priceXAF: 500000,
      description: "Duplex sécurisé avec piscine",
      photoUrls: ["https://example.com/duplex.jpg"],
      category: "Location",
      inStock: true,
      sectorSpecificFields: productFields,
    };

    const result = ProductSchema.safeParse(product);
    expect(result.success).toBe(true);
  });
});

describe("LeadSchema", () => {
  const createValidLead = () => ({
    id: "99999999-8888-7777-6666-555555555555",
    merchantId: validMerchantId,
    productIds: [validProductId],
    referenceCode: "REF-A93K",
    source: "marketplace",
    createdAt: "2026-08-01T12:05:00Z",
  });

  it("should pass for a valid lead", () => {
    const validLead = createValidLead();
    const result = LeadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("should fail if lead productIds is empty", () => {
    const invalidLead = createValidLead();
    invalidLead.productIds = [];

    const result = LeadSchema.safeParse(invalidLead);
    expect(result.success).toBe(false);
    if (!result.success) {
      const productError = result.error.errors.find((e) => e.path.join(".") === "productIds");
      expect(productError?.message).toBe("Au moins un produit doit être associé au lead");
    }
  });

  it("should fail if lead source is invalid", () => {
    const invalidLead = createValidLead() as Record<string, unknown>;
    invalidLead.source = "invalid-source";

    const result = LeadSchema.safeParse(invalidLead);
    expect(result.success).toBe(false);
    if (!result.success) {
      const sourceError = result.error.errors.find((e) => e.path.join(".") === "source");
      expect(sourceError?.message).toBe("Le canal de provenance du lead est invalide");
    }
  });

  it("should fail if lead referenceCode is missing or empty", () => {
    const invalidLead = createValidLead();
    invalidLead.referenceCode = "";

    const result = LeadSchema.safeParse(invalidLead);
    expect(result.success).toBe(false);
    if (!result.success) {
      const refError = result.error.errors.find((e) => e.path.join(".") === "referenceCode");
      expect(refError?.message).toBe("Le code de référence est requis");
    }
  });
});
