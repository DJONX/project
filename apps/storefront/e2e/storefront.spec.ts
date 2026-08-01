/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

test.describe("Storefront E2E Critical Path", () => {
  test("should load storefront, open product details, and click order to open WhatsApp", async ({ page }) => {
    // Go to our mock merchant boutique
    await page.goto("/boutique-chic");

    // Verify the landing elements are correctly rendered
    const businessTitle = page.locator("h1");
    await expect(businessTitle).toContainText("Boutique Chic");

    const verifiedBadge = page.locator("text=Vendeur vérifié");
    await expect(verifiedBadge).toBeVisible();

    // Verify there are product cards visible
    const productCard = page.locator("text=Robe d'été Fleurie");
    await expect(productCard).toBeVisible();

    // Setup window.open spy/mock to capture the whatsapp URL
    await page.evaluate(() => {
      (window as any)._whatsappUrl = "";
      window.open = (url) => {
        (window as any)._whatsappUrl = url;
        return null;
      };
    });

    // Click on the product card to open the detailed view modal
    await productCard.click();

    // Verify product details inside modal are visible
    const modalTitle = page.locator("h2");
    await expect(modalTitle).toContainText("Robe d'été Fleurie");

    const description = page.locator("text=Robe longue fluide avec motifs floraux");
    await expect(description).toBeVisible();

    // Click on the WhatsApp Order button
    const orderBtn = page.locator("text=Commander sur WhatsApp");
    await expect(orderBtn).toBeVisible();
    await orderBtn.click();

    // Wait until window._whatsappUrl becomes non-empty (polling)
    let capturedUrl = "";
    for (let i = 0; i < 50; i++) {
      capturedUrl = await page.evaluate(() => (window as any)._whatsappUrl);
      if (capturedUrl) break;
      await page.waitForTimeout(100);
    }

    // Validate WhatsApp URL structure
    expect(capturedUrl).not.toBe("");
    expect(capturedUrl).toContain("https://wa.me/237677123456");
    expect(capturedUrl).toContain("text=");
    expect(capturedUrl).toContain("Robe%20d'%C3%A9t%C3%A9%20Fleurie");
    expect(capturedUrl).toContain("R%C3%A9f%3A%20REF-"); // contains REF- reference code prefix
  });

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
