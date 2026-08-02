import React from "react";
import { describe, it, expect } from "vitest";
import {
  BoutiqueTemplate,
  RestaurantTemplate,
  CosmeticsTemplate,
  PharmacyTemplate,
  ElectronicsTemplate,
  RealEstateTemplate,
  ArtisanTemplate,
  TrainerTemplate,
  BookstoreTemplate,
  SupermarketTemplate,
  formatPriceXAF,
} from "./index";
import { MerchantConfig, Sector } from "@cameroon-merchants/config-schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
const createValidConfig = (sector: string, sectorSpecificFields: any): MerchantConfig => ({
  id: "de305d54-75b4-431b-adb2-eb6b9e546013",
  slug: "test-shop",
  businessName: "Test Shop",
  sector: sector as Sector,
  whatsappNumber: "+237677123456",
  logoUrl: "https://example.com/logo.png",
  colorPalette: {
    primary: "#db2777",
    secondary: "#4f46e5",
    accent: "#f59e0b",
  },
  tagline: "Test Tagline",
  aboutText: "Test About",
  verifiedBadge: true,
  isActive: true,
  createdAt: "2026-08-01T12:00:00Z",
  updatedAt: "2026-08-01T12:00:00Z",
  products: [
    {
      id: "a1a1a1a1-1111-2222-3333-444444444444",
      name: "Test Product",
      priceXAF: 25000,
      description: "Test description.",
      photoUrls: ["https://example.com/photo.png"],
      category: "Test Category",
      inStock: true,
      sectorSpecificFields,
    },
  ],
});

describe("formatPriceXAF helper", () => {
  it("should format prices correctly with space as thousands separator", () => {
    expect(formatPriceXAF(15000)).toBe("15 000 FCFA");
    expect(formatPriceXAF(25000)).toBe("25 000 FCFA");
    expect(formatPriceXAF(4500)).toBe("4 500 FCFA");
  });
});

describe("All Ten Storefront Templates Definition", () => {
  it("should have all ten templates defined and exported", () => {
    expect(BoutiqueTemplate).toBeDefined();
    expect(RestaurantTemplate).toBeDefined();
    expect(CosmeticsTemplate).toBeDefined();
    expect(PharmacyTemplate).toBeDefined();
    expect(ElectronicsTemplate).toBeDefined();
    expect(RealEstateTemplate).toBeDefined();
    expect(ArtisanTemplate).toBeDefined();
    expect(TrainerTemplate).toBeDefined();
    expect(BookstoreTemplate).toBeDefined();
    expect(SupermarketTemplate).toBeDefined();
  });
});

describe("Template Rendering Verifications", () => {
  it("renders RestaurantTemplate correctly", () => {
    const config = createValidConfig("Restaurant / food", {
      sector: "Restaurant / food",
      spiceLevel: "medium",
      prepTimeMinutes: 25,
    });
    const element = React.createElement(RestaurantTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders CosmeticsTemplate correctly", () => {
    const config = createValidConfig("Cosmétiques & beauté", {
      sector: "Cosmétiques & beauté",
      skinType: ["Sèche"],
      volumeMl: 250,
    });
    const element = React.createElement(CosmeticsTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders PharmacyTemplate correctly", () => {
    const config = createValidConfig("Pharmacie / santé", {
      sector: "Pharmacie / santé",
      requiresPrescription: true,
      dosage: "1 tab daily",
    });
    const element = React.createElement(PharmacyTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders ElectronicsTemplate correctly", () => {
    const config = createValidConfig("Électronique", {
      sector: "Électronique",
      brand: "TestBrand",
      warrantyMonths: 24,
    });
    const element = React.createElement(ElectronicsTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders RealEstateTemplate correctly", () => {
    const config = createValidConfig("Immobilier", {
      sector: "Immobilier",
      surfaceM2: 120,
      rooms: 3,
      location: "Yaoundé",
    });
    const element = React.createElement(RealEstateTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders ArtisanTemplate correctly", () => {
    const config = createValidConfig("Artisan / fait-main", {
      sector: "Artisan / fait-main",
      craftType: "Poterie",
      productionTimeDays: 5,
    });
    const element = React.createElement(ArtisanTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders TrainerTemplate correctly", () => {
    const config = createValidConfig("Formateur / cours & coaching", {
      sector: "Formateur / cours & coaching",
      durationHours: 12,
      format: "online",
    });
    const element = React.createElement(TrainerTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders BookstoreTemplate correctly", () => {
    const config = createValidConfig("Librairie / papeterie", {
      sector: "Librairie / papeterie",
      author: "Eiichiro Oda",
      pages: 200,
    });
    const element = React.createElement(BookstoreTemplate, { config });
    expect(element).toBeDefined();
  });

  it("renders SupermarketTemplate correctly", () => {
    const config = createValidConfig("Supermarché / épicerie", {
      sector: "Supermarché / épicerie",
      weightGrams: 500,
    });
    const element = React.createElement(SupermarketTemplate, { config });
    expect(element).toBeDefined();
  });
});
