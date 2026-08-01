import React from "react";
import "./globals.css";

export const metadata = {
  title: "Storefront",
  description: "Cameroon Merchants Storefront",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
