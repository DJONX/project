"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const RestaurantTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Group products by category
  const categories = Array.from(new Set(config.products.map((p) => p.category)));

  return (
    <div
      className="min-h-screen bg-orange-50/30 text-gray-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Restaurant Hero / Header */}
      <header className="bg-white border-b border-orange-100/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={`${config.businessName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-950">{config.businessName}</h1>
                {config.verifiedBadge && (
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 italic mt-0.5">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xs text-gray-600 max-w-sm text-center sm:text-right">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Restaurant Menu-Card Section */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm">
            <p className="text-gray-500">Le menu est vide pour le moment.</p>
          </div>
        ) : (
          categories.map((category) => (
            <section key={category} className="space-y-6">
              <h2 className="text-xl font-extrabold text-[var(--color-primary)] border-b border-orange-200 pb-2 uppercase tracking-wider">
                {category}
              </h2>
              <div className="space-y-4">
                {config.products
                  .filter((p) => p.category === category)
                  .map((product) => {
                    const rf = product.sectorSpecificFields;
                    const isRest = rf && rf.sector === "Restaurant / food";

                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white rounded-xl p-4 border border-orange-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Thumbnail */}
                        {product.photoUrls?.[0] && (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={product.photoUrls[0]}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=128";
                              }}
                            />
                          </div>
                        )}

                        {/* Text / Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                            <span className="font-extrabold text-[var(--color-primary)] text-lg whitespace-nowrap">
                              {formatPriceXAF(product.priceXAF)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Sector Fields */}
                          {isRest && (
                            <div className="flex gap-2 flex-wrap items-center mt-2 pt-1 text-xs">
                              {rf.spiceLevel && rf.spiceLevel !== "none" && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 font-semibold rounded uppercase">
                                  🌶️ {rf.spiceLevel}
                                </span>
                              )}
                              {rf.prepTimeMinutes && (
                                <span className="text-gray-500 font-medium">
                                  ⏱️ {rf.prepTimeMinutes} mins
                                </span>
                              )}
                              {rf.isDietary?.map((d) => (
                                <span
                                  key={d}
                                  className="px-2 py-0.5 bg-green-50 text-green-700 font-semibold rounded"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Detailed view Modal */}
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
              <h2 className="text-2xl font-black text-gray-950">{selectedProduct.name}</h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-gray-600 mt-2">{selectedProduct.description}</p>
            </div>
            <button
              onClick={() => handleOrderWhatsApp(config, selectedProduct, setIsOrdering)}
              disabled={isOrdering}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-gray-300 text-white font-extrabold rounded-xl transition-all shadow flex items-center justify-center gap-2"
            >
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
