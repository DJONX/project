"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const RealEstateTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

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
      {/* Real Estate Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-950 tracking-tight">
                  🏡 {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Agence Vérifiée
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xs text-slate-600 max-w-sm text-center sm:text-right font-medium">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Hero photography style listings */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm">
            <p className="text-gray-500">Aucun bien disponible actuellement.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isReal = rf && rf.sector === "Immobilier";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row"
                >
                  {/* Hero Photo Column */}
                  <div className="md:w-1/2 aspect-[4/3] md:aspect-auto h-64 md:h-80 relative overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.photoUrls?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform hover:scale-102 duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>

                  {/* Text / Listing details column */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-extrabold text-slate-950 text-xl line-clamp-1">
                          {product.name}
                        </h3>
                        {isReal && rf.location && (
                          <p className="text-sm text-slate-500 mt-1">📍 {rf.location}</p>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Prominent feature grid */}
                      {isReal && (
                        <div className="flex gap-3 flex-wrap text-sm text-slate-700 font-semibold pt-1">
                          {rf.propertyType && (
                            <span className="px-3 py-1 bg-slate-100 rounded-full capitalize">
                              🔑 {rf.propertyType}
                            </span>
                          )}
                          {rf.surfaceM2 && (
                            <span className="px-3 py-1 bg-slate-100 rounded-full">
                              📐 {rf.surfaceM2} m²
                            </span>
                          )}
                          {rf.rooms && (
                            <span className="px-3 py-1 bg-slate-100 rounded-full">
                              🛏️ {rf.rooms} pièces
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-slate-100 mt-4">
                      <span className="text-xl font-black text-[var(--color-primary)]">
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
              <h2 className="text-2xl font-black text-slate-950">{selectedProduct.name}</h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-slate-600 mt-2">{selectedProduct.description}</p>

              {/* Listing specs */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Immobilier" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-slate-500">
                    {selectedProduct.sectorSpecificFields.location && (
                      <div>
                        <span className="font-bold">Localisation:</span>{" "}
                        {selectedProduct.sectorSpecificFields.location}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.surfaceM2 && (
                      <div>
                        <span className="font-bold">Surface:</span>{" "}
                        {selectedProduct.sectorSpecificFields.surfaceM2} m²
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.rooms && (
                      <div>
                        <span className="font-bold">Nombre de pièces:</span>{" "}
                        {selectedProduct.sectorSpecificFields.rooms}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.propertyType && (
                      <div className="capitalize">
                        <span className="font-bold">Type de bien:</span>{" "}
                        {selectedProduct.sectorSpecificFields.propertyType}
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
              Réserver ou Visiter via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
