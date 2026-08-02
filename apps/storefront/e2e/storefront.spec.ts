/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

// Test fixture list of seeded merchants per sector
const testMerchants = [
  {
    slug: "boutique-chic",
    businessName: "Boutique Chic",
    whatsappNumber: "237677123456",
    productName: "Robe d'été Fleurie",
    encodedProductName: "Robe%20d'%C3%A9t%C3%A9%20Fleurie",
    verified: true,
  },
  {
    slug: "restaurant-ndole",
    businessName: "Saveurs d'Afrique",
    whatsappNumber: "237677123456",
    productName: "Ndole Royal",
    encodedProductName: "Ndole%20Royal",
    verified: true,
  },
  {
    slug: "cosmetics-glow",
    businessName: "Sika Cosmétiques",
    whatsappNumber: "237677123456",
    productName: "Beurre de Karité Premium",
    encodedProductName: "Beurre%20de%20Karit%C3%A9%20Premium",
    verified: true,
  },
  {
    slug: "pharmacy-sante",
    businessName: "Pharmacie Bastos",
    whatsappNumber: "237677123456",
    productName: "Paracétamol 500mg",
    encodedProductName: "Parac%C3%A9tamol%20500mg",
    verified: true,
  },
  {
    slug: "electronics-tech",
    businessName: "Cameroon Tech",
    whatsappNumber: "237677123456",
    productName: "Smartphone Pro Max",
    encodedProductName: "Smartphone%20Pro%20Max",
    verified: true,
  },
  {
    slug: "realestate-bastos",
    businessName: "Bastos Immo",
    whatsappNumber: "237677123456",
    productName: "Splendide Duplex Bastos",
    encodedProductName: "Splendide%20Duplex%20Bastos",
    verified: true,
  },
  {
    slug: "artisan-pottery",
    businessName: "Argile d'Afrique",
    whatsappNumber: "237677123456",
    productName: "Vase en Argile Ciselé",
    encodedProductName: "Vase%20en%20Argile%20Cisel%C3%A9",
    verified: true,
  },
  {
    slug: "trainer-code",
    businessName: "Yaoundé Tech Academy",
    whatsappNumber: "237677123456",
    productName: "Formation React & Next.js",
    encodedProductName: "Formation%20React%20%26%20Next.js",
    verified: true,
  },
  {
    slug: "bookstore-manga",
    businessName: "Manga & Book Club",
    whatsappNumber: "237677123456",
    productName: "Manga One Piece Tome 100",
    encodedProductName: "Manga%20One%20Piece%20Tome%20100",
    verified: true,
  },
  {
    slug: "supermarket-express",
    businessName: "Express Alimentation",
    whatsappNumber: "237677123456",
    productName: "Produit Épicerie #1",
    encodedProductName: "Produit%20%C3%89picerie%20%231",
    verified: true,
  },
];

test.describe("Storefront E2E Critical Path — All Ten Sectors", () => {
  for (const merchant of testMerchants) {
    test(`Sector template verification: ${merchant.slug}`, async ({ page }) => {
      // Go to merchant storefront
      await page.goto(`/${merchant.slug}`);

      // Verify the business name is correctly rendered
      const businessTitle = page.locator("text=" + merchant.businessName);
      await expect(businessTitle.first()).toBeVisible();

      if (merchant.verified) {
        const verifiedBadge = page.locator("text=Vérifié")
          .or(page.locator("text=Vendeur vérifié"))
          .or(page.locator("text=Garantie certifiée"))
          .or(page.locator("text=Artisan d'Afrique"))
          .or(page.locator("text=Formateur Certifié"));
        await expect(verifiedBadge.first()).toBeVisible();
      }

      // Verify product card is visible
      const productCard = page.locator("text=" + merchant.productName);
      await expect(productCard.first()).toBeVisible();

      // Setup window.open spy to capture redirect URL
      await page.evaluate(() => {
        (window as any)._whatsappUrl = "";
        window.open = (url) => {
          (window as any)._whatsappUrl = url;
          return null;
        };
      });

      // Open product details modal
      await productCard.first().click();

      // Trigger order button (depending on whether it is custom or standard CTA)
      const orderBtn = page.locator("text=Commander")
        .or(page.locator("text=S'inscrire"))
        .or(page.locator("text=Réserver ou Visiter"));
      await expect(orderBtn.first()).toBeVisible();
      await orderBtn.first().click();

      // Wait until window._whatsappUrl becomes non-empty (polling)
      let capturedUrl = "";
      for (let i = 0; i < 50; i++) {
        capturedUrl = await page.evaluate(() => (window as any)._whatsappUrl);
        if (capturedUrl) break;
        await page.waitForTimeout(100);
      }

      // Validate WhatsApp redirection parameters
      expect(capturedUrl).not.toBe("");
      expect(capturedUrl).toContain(`https://wa.me/${merchant.whatsappNumber}`);
      expect(capturedUrl).toContain("text=");
      expect(capturedUrl).toContain(merchant.encodedProductName);
      expect(capturedUrl).toContain("R%C3%A9f%3A%20REF-");
    });
  }

  test("should render 404 boutique introuvable page for invalid merchant slug", async ({ page }) => {
    await page.goto("/non-existent-shop");

    const errorHeading = page.locator("h1");
    await expect(errorHeading).toContainText("Boutique introuvable");

    const errorText = page.locator("text=Désolé, la boutique que vous recherchez n'existe pas");
    await expect(errorText).toBeVisible();
  });

  test("should render 404 boutique introuvable page for inactive merchant", async ({ page }) => {
    await page.goto("/boutique-inactive");

    const errorHeading = page.locator("h1");
    await expect(errorHeading).toContainText("Boutique introuvable");
  });
});
