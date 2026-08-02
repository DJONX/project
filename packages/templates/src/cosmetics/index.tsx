"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const CosmeticsTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-pink-50/10 text-gray-900 font-serif"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Lifestyle Cosmetique Header */}
      <header className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-10 font-sans">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-950 font-serif">
                  {config.businessName}
                </h1>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Vérifié
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 italic mt-0.5">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xs text-gray-600 max-w-sm text-center sm:text-right font-sans">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Hero lifestyle visual block */}
      <section className="bg-pink-100/30 py-12 text-center border-b border-pink-100/50">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-950 tracking-tight leading-tight">
            La Beauté Pure & Naturelle
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-sans">
            Des formulations haut de gamme adaptées à votre rituel quotidien.
          </p>
        </div>
      </section>

      {/* Main product catalog */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm font-sans">
            <p className="text-gray-500">Aucun soin disponible actuellement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isCos = rf && rf.sector === "Cosmétiques & beauté";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-pink-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col font-sans"
                >
                  <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                    <img
                      src={product.photoUrls?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=360";
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      {isCos && rf.volumeMl && (
                        <p className="text-xs text-gray-400 mt-0.5">{rf.volumeMl} ml</p>
                      )}
                    </div>
                    <p className="text-sm font-black text-[var(--color-primary)]">
                      {formatPriceXAF(product.priceXAF)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
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
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={selectedProduct.photoUrls[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-gray-950 font-serif">
                {selectedProduct.name}
              </h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-gray-600 mt-2">{selectedProduct.description}</p>

              {/* Specific fields */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Cosmétiques & beauté" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-gray-500">
                    {selectedProduct.sectorSpecificFields.skinType && (
                      <div>
                        <span className="font-bold">Types de peau:</span>{" "}
                        {selectedProduct.sectorSpecificFields.skinType.join(", ")}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.ingredients && (
                      <div>
                        <span className="font-bold">Ingrédients:</span>{" "}
                        {selectedProduct.sectorSpecificFields.ingredients.join(", ")}
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
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
