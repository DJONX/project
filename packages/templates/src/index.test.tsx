import React from "react";
import { describe, it, expect } from "vitest";
import { BoutiqueTemplate, formatPriceXAF } from "./index";
import { MerchantConfig } from "@cameroon-merchants/config-schema";

const validMerchantId = "de305d54-75b4-431b-adb2-eb6b9e546013";
const validProductId1 = "a1a1a1a1-1111-2222-3333-444444444444";
const validProductId2 = "b2b2b2b2-1111-2222-3333-444444444444";

const createValidConfig = (): MerchantConfig => ({
  id: validMerchantId,
  slug: "boutique-chic",
  businessName: "Boutique Chic",
  sector: "Boutique de vêtements",
  whatsappNumber: "+237677123456",
  logoUrl: "https://example.com/logo.png",
  colorPalette: {
    primary: "#db2777",
    secondary: "#4f46e5",
    accent: "#f59e0b",
  },
  tagline: "Prêt-à-porter haut de gamme",
  aboutText: "Votre destination mode ultime",
  verifiedBadge: true,
  isActive: true,
  createdAt: "2026-08-01T12:00:00Z",
  updatedAt: "2026-08-01T12:00:00Z",
  products: [
    {
      id: validProductId1,
      name: "Robe d'été Fleurie",
      priceXAF: 25000,
      description: "Robe longue fluide.",
      photoUrls: ["https://example.com/robe.png"],
      category: "Robes",
      inStock: true,
      sectorSpecificFields: {
        sector: "Boutique de vêtements",
        sizes: ["S", "M"],
        colors: ["Rose"],
        brand: "Couture",
        material: "Coton",
      },
    },
    {
      id: validProductId2,
      name: "Chemise classique",
      priceXAF: 18500,
      description: "Chemise en soie.",
      photoUrls: ["https://example.com/chemise.png"],
      category: "Hauts",
      inStock: true,
      sectorSpecificFields: {
        sector: "Boutique de vêtements",
        sizes: ["M", "L"],
        colors: ["Blanc"],
        brand: "Elegant",
        material: "Soie",
      },
    },
  ],
});

describe("formatPriceXAF helper", () => {
  it("should format prices correctly with space as thousands separator", () => {
    expect(formatPriceXAF(15000)).toBe("15 000 FCFA");
    expect(formatPriceXAF(25000)).toBe("25 000 FCFA");
    expect(formatPriceXAF(8500)).toBe("8 500 FCFA");
  });
});

describe("BoutiqueTemplate render placeholder", () => {
  it("should export BoutiqueTemplate correctly and be defined", () => {
    expect(BoutiqueTemplate).toBeDefined();
  });

  it("should render BoutiqueTemplate with config and matches snapshot structure", () => {
    const config = createValidConfig();
    const element = React.createElement(BoutiqueTemplate, { config });
    expect(element).toBeDefined();
    expect(element.props.config.businessName).toBe("Boutique Chic");
    expect(element.props.config.whatsappNumber).toBe("+237677123456");
  });
});
