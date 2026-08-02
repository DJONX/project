import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";

export const formatPriceXAF = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price).replace(/\s/g, " ") + " FCFA";
};

export const handleOrderWhatsApp = async (
  config: MerchantConfig,
  product: Product,
  setIsOrdering: (val: boolean) => void
) => {
  setIsOrdering(true);
  let referenceCode = `REF-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantId: config.id,
        productIds: [product.id],
        source: "storefront",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.referenceCode) {
        referenceCode = data.referenceCode;
      }
    }
  } catch (err) {
    console.error("Failed to log lead, proceeding with fallback code", err);
  } finally {
    setIsOrdering(false);
  }

  const message = `Bonjour ${config.businessName}, je souhaite commander le produit "${product.name}" au prix de ${formatPriceXAF(product.priceXAF)} (Réf: ${referenceCode}).`;
  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};
