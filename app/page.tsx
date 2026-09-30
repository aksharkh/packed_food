import { MobileCartBar } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Combos, Duo, Flavours, Hero, HowMade, Inside, Marquees, Reviews, TruckBanner } from "@/components/Home";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquees />
        <Flavours />
        <Inside />
        <HowMade />
        <Combos />
        <TruckBanner />
        <Duo />
        <Reviews />
      </main>
      <Footer />
      <MobileCartBar />
    </>
  );
}
