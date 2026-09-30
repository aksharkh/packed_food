import type { Metadata, Viewport } from "next";
import { Anton, Baloo_2 } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Mascot } from "@/components/Mascot";
import { SITE } from "@/lib/config";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin", "devanagari"] });

export const metadata: Metadata = {
  title: `${SITE.full} — ${SITE.tagline}`,
  description: "Desi chips, namkeen & healthy munchies with full-on masala. Order packs, combos, snack boxes, subscriptions & bulk gifting.",
};

export const viewport: Viewport = {
  themeColor: "#140a1f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${baloo.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <CartProvider>
          {children}
          <CartDrawer />
          <Mascot />
        </CartProvider>
      </body>
    </html>
  );
}
