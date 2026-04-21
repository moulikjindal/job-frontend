import React from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import CTABanner from "./CTABanner";

const Home = () => (
  <>
    <HeroSection />
    <PopularCategories />
    <HowItWorks />
    <PopularCompanies />
    <CTABanner />
  </>
);

export default Home;
