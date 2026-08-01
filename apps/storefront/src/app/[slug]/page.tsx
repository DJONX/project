import React from "react";
import { getMerchantBySlug } from "../../lib/mock-data";
import { BoutiqueTemplate } from "@cameroon-merchants/templates";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);

  if (!merchant || !merchant.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <div className="text-red-500 text-6xl mb-4 font-bold">404</div>
          <h1 className="text-2xl font-black text-gray-950 mb-2">Boutique introuvable</h1>
          <p className="text-gray-500 mb-6">
            Désolé, la boutique que vous recherchez n'existe pas ou a été désactivée.
          </p>
          <a
            href="/"
            className="inline-flex justify-center items-center px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (merchant.sector === "Boutique de vêtements") {
    return <BoutiqueTemplate config={merchant} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        <h1 className="text-2xl font-black text-gray-950 mb-2">Secteur non supporté</h1>
        <p className="text-gray-500">Ce secteur n'est pas encore disponible.</p>
      </div>
    </div>
  );
}
