"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const ArtisanTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-stone-100/50 text-stone-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Artisan Profile Header */}
      <header className="bg-stone-50 border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-stone-900 tracking-tight">
                  🏺 {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Artisan d'Afrique
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 font-serif italic mt-0.5">{config.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Maker story section */}
      {config.aboutText && (
        <section className="bg-stone-100 py-10 border-b border-stone-200">
          <div className="max-w-2xl mx-auto px-4 text-center space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-black text-[var(--color-primary)]">
              Notre Histoire & Savoir-Faire
            </h2>
            <p className="text-sm italic font-serif leading-relaxed text-stone-700">
              "{config.aboutText}"
            </p>
          </div>
        </section>
      )}

      {/* Craft-forward list grid */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-stone-500">Aucune création en exposition pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isArt = rf && rf.sector === "Artisan / fait-main";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full bg-stone-100 relative">
                    <img
                      src={product.photoUrls?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500";
                      }}
                    />
                    {isArt && rf.productionTimeDays && (
                      <span className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded">
                        ⌛ {rf.productionTimeDays} jours de fabrication
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-extrabold text-stone-400">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-stone-900 text-lg mt-1">{product.name}</h3>
                      <p className="text-stone-600 text-sm line-clamp-2 mt-1 font-serif">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-lg font-black text-[var(--color-primary)]">
                        {formatPriceXAF(product.priceXAF)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-xl p-6 relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
            {selectedProduct.photoUrls?.[0] && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={selectedProduct.photoUrls[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-stone-950">{selectedProduct.name}</h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-stone-600 mt-2 font-serif">
                {selectedProduct.description}
              </p>

              {/* Artisan specs */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Artisan / fait-main" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-stone-500">
                    {selectedProduct.sectorSpecificFields.craftType && (
                      <div>
                        <span className="font-bold">Technique / Type:</span>{" "}
                        {selectedProduct.sectorSpecificFields.craftType}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.productionTimeDays && (
                      <div>
                        <span className="font-bold">Délai de fabrication:</span>{" "}
                        {selectedProduct.sectorSpecificFields.productionTimeDays} jours
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.customizationOptions && (
                      <div>
                        <span className="font-bold">Personnalisations disponibles:</span>{" "}
                        {selectedProduct.sectorSpecificFields.customizationOptions.join(", ")}
                      </div>
                    )}
                  </div>
                )}
            </div>
            <button
              onClick={() => handleOrderWhatsApp(config, selectedProduct, setIsOrdering)}
              disabled={isOrdering}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-gray-300 text-white font-extrabold rounded-xl transition-all shadow flex items-center justify-center gap-2"
            >
              Commander cette création
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
