import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Motoboot — Canal do Motoboy",
  description:
    "O canal da comunidade motoboy: ferramentas, localização em tempo real, alertas e informações. União e segurança na palma da mão.",
  keywords: ["motoboy", "comunidade", "canal", "motoboot", "ferramentas", "localização"],
  authors: [{ name: "Motoboot" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Motoboot",
  },
  openGraph: {
    title: "Motoboot — Canal do Motoboy",
    description: "Comunidade, ferramentas e localização em tempo real para motoboys.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0D0D0D",
};

import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
