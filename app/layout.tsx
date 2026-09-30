import type { Metadata, Viewport } from "next";
import { Baloo_2, Kalam, Luckiest_Guy } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Mascot } from "@/components/Mascot";
import { SITE } from "@/lib/config";
import "./globals.css";

const luckiest = Luckiest_Guy({ variable: "--font-luckiest", subsets: ["latin"], weight: "400" });
const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin", "devanagari"] });
const kalam = Kalam({ variable: "--font-kalam", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: `${SITE.full} — ${SITE.tagline}`,
  description: "Desi chips, namkeen & healthy munchies with full-on masala. Order packs, combos, snack boxes, subscriptions & bulk gifting.",
};

export const viewport: Viewport = {
  themeColor: "#ff3d7f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${luckiest.variable} ${baloo.variable} ${kalam.variable} antialiased`}>
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
