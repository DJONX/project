"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const BookstoreTemplate: React.FC<TemplateProps> = ({ config }) => {
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
      className="min-h-screen bg-stone-50/50 text-stone-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Librairie Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-950">
                  📚 {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Librairie Vérifiée
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 mt-0.5">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xs text-stone-600 max-w-sm text-center sm:text-right font-medium">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Category Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Dense Grid Appropriate for Books */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-stone-500">Aucun livre ou fourniture disponible.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const rf = product.sectorSpecificFields;
                const isBook = rf && rf.sector === "Librairie / papeterie";

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-xl border border-stone-200/60 p-3 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-[3/4] w-full bg-stone-100 rounded overflow-hidden">
                        <img
                          src={product.photoUrls?.[0]}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=240";
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider font-extrabold text-stone-400">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-stone-900 text-xs line-clamp-2 mt-0.5">
                          {product.name}
                        </h3>
                        {isBook && rf.author && (
                          <p className="text-xs text-stone-500 italic mt-0.5 truncate">
                            Par {rf.author}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-stone-100">
                      <span className="text-xs font-bold text-[var(--color-primary)]">
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
              <div className="aspect-[3/4] w-32 mx-auto rounded overflow-hidden bg-gray-100">
                <img
                  src={selectedProduct.photoUrls[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-stone-950 text-center">
                {selectedProduct.name}
              </h2>
              <p className="text-lg font-bold text-[var(--color-primary)] text-center mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-stone-600 mt-2">{selectedProduct.description}</p>

              {/* Book metadata */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Librairie / papeterie" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-stone-500 font-mono">
                    {selectedProduct.sectorSpecificFields.author && (
                      <div>
                        <span className="font-bold">Auteur:</span>{" "}
                        {selectedProduct.sectorSpecificFields.author}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.isbn && (
                      <div>
                        <span className="font-bold">ISBN:</span>{" "}
                        {selectedProduct.sectorSpecificFields.isbn}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.publisher && (
                      <div>
                        <span className="font-bold">Éditeur:</span>{" "}
                        {selectedProduct.sectorSpecificFields.publisher}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.pages && (
                      <div>
                        <span className="font-bold">Nombre de pages:</span>{" "}
                        {selectedProduct.sectorSpecificFields.pages}
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
              Commander cet ouvrage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
