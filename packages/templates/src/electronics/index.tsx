"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const ElectronicsTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-slate-900 text-slate-100 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Tech Electronic Header */}
      <header className="bg-slate-950 border-b border-slate-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">
                  ⚡ {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Garantie certifiée
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{config.tagline}</p>
            </div>
          </div>
          {config.aboutText && (
            <p className="text-xs text-slate-400 max-w-sm text-center sm:text-right font-medium">
              {config.aboutText}
            </p>
          )}
        </div>
      </header>

      {/* Spec-forward product listings */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-slate-500">Aucun équipement disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isElec = rf && rf.sector === "Électronique";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between hover:border-[var(--color-primary)] transition-all cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                      <img
                        src={product.photoUrls?.[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=360";
                        }}
                      />
                      {isElec && rf.warrantyMonths && (
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur text-xxs font-bold text-slate-300 px-2 py-0.5 rounded">
                          🛡️ {rf.warrantyMonths} mois de garantie
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xxs uppercase tracking-wider font-extrabold text-[var(--color-primary)]">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-white text-base mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Spec-forward specs container */}
                    {isElec && (
                      <div className="bg-slate-900 rounded-lg p-2.5 text-xs text-slate-300 space-y-1 font-mono">
                        {rf.brand && (
                          <div>
                            <span className="text-slate-500 font-bold">Marque:</span> {rf.brand}
                          </div>
                        )}
                        {rf.model && (
                          <div>
                            <span className="text-slate-500 font-bold">Modèle:</span> {rf.model}
                          </div>
                        )}
                        {rf.specs &&
                          Object.entries(rf.specs)
                            .slice(0, 2)
                            .map(([key, val]) => (
                              <div key={key}>
                                <span className="text-slate-500 font-bold uppercase">{key}:</span> {val}
                              </div>
                            ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-lg font-black text-white">
                      {formatPriceXAF(product.priceXAF)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-slate-950 border border-slate-800 text-slate-100 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
            {selectedProduct.photoUrls?.[0] && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={selectedProduct.photoUrls[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-white">{selectedProduct.name}</h2>
              <p className="text-lg font-bold text-[var(--color-primary)] mt-1">
                {formatPriceXAF(selectedProduct.priceXAF)}
              </p>
              <p className="text-sm text-slate-400 mt-2">{selectedProduct.description}</p>

              {/* Specs */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Électronique" && (
                  <div className="mt-4 border-t border-slate-800 pt-3 text-xs space-y-1.5 text-slate-400 font-mono">
                    {selectedProduct.sectorSpecificFields.brand && (
                      <div>
                        <span className="text-slate-500 font-bold">Marque:</span>{" "}
                        {selectedProduct.sectorSpecificFields.brand}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.model && (
                      <div>
                        <span className="text-slate-500 font-bold">Modèle:</span>{" "}
                        {selectedProduct.sectorSpecificFields.model}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.warrantyMonths && (
                      <div>
                        <span className="text-slate-500 font-bold">Garantie:</span>{" "}
                        {selectedProduct.sectorSpecificFields.warrantyMonths} mois
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.specs &&
                      Object.entries(selectedProduct.sectorSpecificFields.specs).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-slate-500 font-bold uppercase">{k}:</span> {v}
                        </div>
                      ))}
                  </div>
                )}
            </div>
            <button
              onClick={() => handleOrderWhatsApp(config, selectedProduct, setIsOrdering)}
              disabled={isOrdering}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 disabled:bg-gray-800 text-white font-extrabold rounded-xl transition-all shadow flex items-center justify-center gap-2"
            >
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
