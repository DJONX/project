"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const PharmacyTemplate: React.FC<TemplateProps> = ({ config }) => {
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
      {/* Serieux Pharmacy Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-lg object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1607619056574-7b8d304a2c06?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  ⚕️ {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Agréé
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

      {/* Trust banner */}
      <section className="bg-emerald-900 text-white py-4 text-center text-xs font-semibold">
        🛡️ Espace Santé Camerounais — Produits & Dispositifs Médicaux Vérifiés
      </section>

      {/* Information dense list/grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm">
            <p className="text-gray-500">Aucun produit médical disponible actuellement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isPharma = rf && rf.sector === "Pharmacie / santé";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                    <img
                      src={product.photoUrls?.[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1607619056574-7b8d304a2c06?w=128";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xxs font-bold text-[var(--color-primary)] uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                        {isPharma && rf.requiresPrescription && (
                          <span className="text-xxs font-bold text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded">
                            Ordonnance
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5 truncate">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-sm font-black text-slate-950">
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
              <div className="flex gap-2 items-center flex-wrap">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded">
                  {selectedProduct.category}
                </span>
                {selectedProduct.sectorSpecificFields &&
                  selectedProduct.sectorSpecificFields.sector === "Pharmacie / santé" &&
                  selectedProduct.sectorSpecificFields.requiresPrescription && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-800 text-xs font-bold rounded">
                      Ordonnance Obligatoire
                    </span>
                  )}
              </div>
              <h2 className="text-2xl font-black text-slate-950 mt-1">{selectedProduct.name}</h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-slate-600 mt-2">{selectedProduct.description}</p>

              {/* Pharma fields */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Pharmacie / santé" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-slate-500">
                    {selectedProduct.sectorSpecificFields.dosage && (
                      <div>
                        <span className="font-bold">Posologie:</span>{" "}
                        {selectedProduct.sectorSpecificFields.dosage}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.expiryDate && (
                      <div>
                        <span className="font-bold">Date de péremption:</span>{" "}
                        {selectedProduct.sectorSpecificFields.expiryDate}
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
