"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const SupermarketTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Categories extraction
  const categories = ["Tous", ...Array.from(new Set(config.products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "Tous"
      ? config.products
      : config.products.filter((p) => p.category === selectedCategory);

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Supermarket Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-12 h-12 rounded object-cover border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-950 tracking-tight">
                  🛒 {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold text-white bg-[var(--color-primary)]">
                    Vérifié
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xxs text-slate-500 max-w-sm text-center sm:text-right leading-relaxed">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Category Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-4 overflow-x-auto">
          <div className="flex space-x-1.5 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Dense Supermarket Layout (30+ products friendly) */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-400 text-sm">Aucun produit en rayon actuellement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredProducts.map((product) => {
                const rf = product.sectorSpecificFields;
                const isSuper = rf && rf.sector === "Supermarché / épicerie";

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-lg border border-slate-200 p-2.5 hover:shadow transition-all cursor-pointer flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1.5">
                      <div className="aspect-square w-full bg-slate-50 rounded overflow-hidden relative">
                        <img
                          src={product.photoUrls?.[0]}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=128";
                          }}
                        />
                        {!product.inStock && (
                          <span className="absolute inset-0 bg-white/70 backdrop-blur-xxs flex items-center justify-center text-red-600 text-xxs font-black uppercase">
                            Épuisé
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        {isSuper && rf.weightGrams && (
                          <p className="text-xxs text-slate-400 font-semibold mt-0.5">
                            ⚖️ {rf.weightGrams}g
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-950">
                        {formatPriceXAF(product.priceXAF)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
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
              <div className="aspect-square w-32 mx-auto rounded overflow-hidden bg-gray-100">
                <img
                  src={selectedProduct.photoUrls[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-950 text-center">{selectedProduct.name}</h2>
              <p className="text-base font-bold text-[var(--color-primary)] text-center mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-slate-600 mt-2">{selectedProduct.description}</p>

              {/* Supermarket specifics */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Supermarché / épicerie" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-slate-500 font-mono">
                    {selectedProduct.sectorSpecificFields.weightGrams && (
                      <div>
                        <span className="font-bold">Poids:</span>{" "}
                        {selectedProduct.sectorSpecificFields.weightGrams}g
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.brand && (
                      <div>
                        <span className="font-bold">Marque:</span>{" "}
                        {selectedProduct.sectorSpecificFields.brand}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.expirationDate && (
                      <div>
                        <span className="font-bold">Date de péremption:</span>{" "}
                        {selectedProduct.sectorSpecificFields.expirationDate}
                      </div>
                    )}
                  </div>
                )}
            </div>
            <button
              onClick={() => handleOrderWhatsApp(config, selectedProduct, setIsOrdering)}
              disabled={isOrdering || !selectedProduct.inStock}
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
