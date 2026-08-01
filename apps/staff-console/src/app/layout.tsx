import React from "react";
import "./globals.css";

export const metadata = {
  title: "Staff Console",
  description: "Cameroon Merchants Staff Console",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
