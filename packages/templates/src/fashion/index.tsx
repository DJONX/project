"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const BoutiqueTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActivePhotoIndex] = useState<number>(0);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  // Extract unique categories
  const categories = ["Tous", ...Array.from(new Set(config.products.map((p) => p.category)))];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "Tous"
      ? config.products
      : config.products.filter((p) => p.category === selectedCategory);

  return (
    <div
      className="min-h-screen bg-gray-50 text-gray-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Header Landing Section */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={`${config.businessName} Logo`}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=128&h=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
                  {config.businessName}
                </h1>
                {config.verifiedBadge && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]"
                    title="Vendeur Vérifié"
                  >
                    Vendeur vérifié
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Tabs / Filters */}
        <section className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid Section */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setActivePhotoIndex(0);
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  {/* Photo container */}
                  <div className="aspect-[4/5] bg-gray-100 relative w-full overflow-hidden">
                    <img
                      src={product.photoUrls[0]}
                      alt={product.name}
                      loading="lazy"
                      className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=360";
                      }}
                    />
                    {!product.inStock && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                        Rupture
                      </span>
                    )}
                  </div>
                  {/* Card text details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        {formatPriceXAF(product.priceXAF)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 hover:text-black rounded-full p-2 z-10 transition-colors shadow"
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable container for modal content */}
            <div className="overflow-y-auto flex-1">
              {/* Image Gallery */}
              <div className="aspect-[4/5] bg-gray-100 relative w-full">
                <img
                  src={selectedProduct.photoUrls[activeImageIndex]}
                  alt={`${selectedProduct.name} View`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600";
                  }}
                />

                {/* Left/Right controls */}
                {selectedProduct.photoUrls.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === 0 ? selectedProduct.photoUrls.length - 1 : prev - 1
                        )
                      }
                      className="bg-white/80 hover:bg-white rounded-full p-2 text-gray-800 hover:text-black shadow transition-all"
                      aria-label="Photo précédente"
                    >
                      ❮
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === selectedProduct.photoUrls.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="bg-white/80 hover:bg-white rounded-full p-2 text-gray-800 hover:text-black shadow transition-all"
                      aria-label="Photo suivante"
                    >
                      ❯
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.photoUrls.length > 1 && (
                <div className="flex gap-2 p-4 justify-center border-b border-gray-100 overflow-x-auto">
                  {selectedProduct.photoUrls.map((url, idx) => (
                    <button
                      key={url + idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx
                          ? "border-[var(--color-primary)] scale-105"
                          : "border-transparent opacity-75"
                      }`}
                    >
                      <img
                        src={url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=128";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Info */}
              <div className="p-6">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-black text-gray-950 mt-1">{selectedProduct.name}</h2>
                <div className="text-xl font-extrabold text-[var(--color-primary)] mt-2">
                  {formatPriceXAF(selectedProduct.priceXAF)}
                </div>

                <p className="text-sm text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>

                {/* Sector Specific Fields Display */}
                {selectedProduct.sectorSpecificFields &&
                  selectedProduct.sectorSpecificFields.sector === "Boutique de vêtements" && (
                    <div className="mt-6 border-t border-gray-100 pt-4 text-sm space-y-2">
                      {selectedProduct.sectorSpecificFields.sizes && (
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-gray-500">Tailles:</span>
                          <div className="flex gap-1">
                            {selectedProduct.sectorSpecificFields.sizes.map((s) => (
                              <span key={s} className="px-2 py-1 bg-gray-100 text-xs rounded font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProduct.sectorSpecificFields.colors && (
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-gray-500">Couleurs:</span>
                          <div className="flex gap-1">
                            {selectedProduct.sectorSpecificFields.colors.map((c) => (
                              <span key={c} className="px-2 py-1 bg-gray-100 text-xs rounded font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProduct.sectorSpecificFields.brand && (
                        <div>
                          <span className="font-bold text-gray-500">Marque:</span>{" "}
                          <span className="font-medium text-gray-800">
                            {selectedProduct.sectorSpecificFields.brand}
                          </span>
                        </div>
                      )}
                      {selectedProduct.sectorSpecificFields.material && (
                        <div>
                          <span className="font-bold text-gray-500">Matière:</span>{" "}
                          <span className="font-medium text-gray-800">
                            {selectedProduct.sectorSpecificFields.material}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Modal CTA Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button
                onClick={() => handleOrderWhatsApp(config, selectedProduct, setIsOrdering)}
                disabled={isOrdering || !selectedProduct.inStock}
                className="w-full py-4 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl transition-colors shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-93.5-25.7l-6.7-4-69.5 18.3 18.6-67.7-4.4-7c-18.6-29.4-28.4-63.6-28.4-99 0-101.4 102-183.9 227.6-183.9s227.4 82.5 227.4 183.9c0 101.5-101.9 184-227.4 184zm115.1-137.9c-6.1-3-36-17.7-41.5-19.7-5.5-2-9.5-3-13.5 3-4 6-15.5 19.7-19 23.7-3.5 4-7 4.5-13 1.5-6-3-25.3-9.3-48.2-30-17.8-15.9-29.8-35.5-33.3-41.5-3.5-6-.4-9.2 2.6-12.2 2.7-2.7 6-7 9-10.5 3-3.5 4-6 6-10 2-4 1-7.5-.5-10.5-1-3-13.5-32.5-18.5-44.5-4.9-11.7-10-10.1-13.5-10.1-3.5 0-7.5-.5-11.5-.5s-10.5 1.5-16 7.5c-5.5 6-21 20.5-21 50s15 58 17 61c2 3 29.5 45 71.5 63 10 4.3 17.8 6.9 24 8.9 10 3.2 19 2.7 26.2 1.6 8-1.2 26.3-10.7 30-21 3.7-10.3 3.7-19.2 2.5-21-1.1-1.8-4.5-3-10.5-6z" />
                </svg>
                {selectedProduct.inStock ? "Commander sur WhatsApp" : "Rupture de Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
