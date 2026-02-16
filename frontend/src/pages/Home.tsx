import { HeroSection } from "../components/home/HeroSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { CollectionsGrid } from "../components/home/CollectionsGrid";
import { WholesalerSection } from "../components/home/WholesalerSection";

export const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CollectionsGrid />
      <WholesalerSection />
    </>
  );
};
