import type { Metadata } from "next";
import "./globals.css";
import "./site-polish.css";
import "./home-v2.css";
import "./arco-updates.css";
import "./editorial.css";

export const metadata: Metadata = {
  title: "ARCO Representações | Especialistas na seção churrasco",
  description:
    "Desde 2018, conectando indústrias ao varejo de Pernambuco. Alimentos, acessórios e equipamentos para a seção churrasco da sua loja.",
  icons: {
    icon: [
      { url: "/arco-logo-icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/arco-logo-icon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/arco-logo-icon.png", type: "image/png", sizes: "256x256" },
      { url: "/arco-logo-icon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 64x64 256x256" },
    ],
    shortcut: "/arco-logo-icon.ico",
    apple: "/arco-logo-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
