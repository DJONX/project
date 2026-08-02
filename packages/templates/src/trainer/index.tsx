"use client";

import React, { useState } from "react";
import { MerchantConfig, Product } from "@cameroon-merchants/config-schema";
import { formatPriceXAF, handleOrderWhatsApp } from "../shared/utils";

export interface TemplateProps {
  config: MerchantConfig;
}

export const TrainerTemplate: React.FC<TemplateProps> = ({ config }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-sky-50/30 text-slate-900 font-sans"
      style={
        {
          "--color-primary": config.colorPalette.primary,
          "--color-secondary": config.colorPalette.secondary,
          "--color-accent": config.colorPalette.accent,
        } as React.CSSProperties
      }
    >
      {/* Education/Training Profile Header */}
      <header className="bg-white border-b border-sky-100/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {config.logoUrl && (
              <img
                src={config.logoUrl}
                alt={config.businessName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-primary)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&fit=crop";
                }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  🎓 {config.businessName}
                </span>
                {config.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white bg-[var(--color-primary)]">
                    Formateur Certifié
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

      {/* Curriculum style list of course modules */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {config.products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border shadow-sm">
            <p className="text-gray-500">Aucune session d'apprentissage planifiée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {config.products.map((product) => {
              const rf = product.sectorSpecificFields;
              const isTrain = rf && rf.sector === "Formateur / cours & coaching";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl p-5 border border-sky-100 hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs font-bold uppercase">
                      <span className="text-[var(--color-primary)] bg-sky-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      {isTrain && rf.level && (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          📶 {rf.level}
                        </span>
                      )}
                      {isTrain && rf.format && (
                        <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          🌐 {rf.format}
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{product.name}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex sm:flex-col items-baseline sm:items-end gap-2 flex-shrink-0">
                    {isTrain && rf.durationHours && (
                      <span className="text-xs text-slate-400 font-semibold font-mono">
                        ⏱️ {rf.durationHours} Heures
                      </span>
                    )}
                    <span className="text-lg font-black text-[var(--color-primary)] whitespace-nowrap">
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

              {/* Coaching specific parameters */}
              {selectedProduct.sectorSpecificFields &&
                selectedProduct.sectorSpecificFields.sector === "Formateur / cours & coaching" && (
                  <div className="mt-4 border-t pt-3 text-xs space-y-1.5 text-slate-500">
                    {selectedProduct.sectorSpecificFields.durationHours && (
                      <div>
                        <span className="font-bold">Durée de la formation:</span>{" "}
                        {selectedProduct.sectorSpecificFields.durationHours} Heures
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.format && (
                      <div className="capitalize">
                        <span className="font-bold">Format:</span>{" "}
                        {selectedProduct.sectorSpecificFields.format}
                      </div>
                    )}
                    {selectedProduct.sectorSpecificFields.level && (
                      <div className="capitalize">
                        <span className="font-bold">Niveau:</span>{" "}
                        {selectedProduct.sectorSpecificFields.level}
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
              S'inscrire / Demander via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
