import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import CategoryCircles from "@/components/home/CategoryCircles";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import HowToChoose from "@/components/home/HowToChoose";
import LimitedEdition from "@/components/home/LimitedEdition";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import FindYourScent from "@/components/home/FindYourScent";
import LuxuryQuoteSection from "@/components/home/LuxuryQuoteSection";
import { getActiveCategories } from "@/actions/categories";
import { getFeaturedProducts } from "@/actions/products";
import { getActiveHeroSlides, getActiveTestimonials } from "@/actions/site";
import { getSiteSettings } from "@/actions/settings";

export default async function HomePage() {
  const [categories, featuredProducts, heroSlides, testimonials, settings] =
    await Promise.all([
      getActiveCategories(),
      getFeaturedProducts(8),
      getActiveHeroSlides(),
      getActiveTestimonials(),
      getSiteSettings(),
    ]);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeHeroSlides = JSON.parse(JSON.stringify(heroSlides));
  const safeFeaturedProducts = JSON.parse(JSON.stringify(featuredProducts));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeTestimonials = JSON.parse(JSON.stringify(testimonials));

  const setting = (key) => settings[key]?.value;
  const isOn = (key) => settings[key]?.value !== "false";

  return (
    <>
      <SiteHeader />
      <main>
        {isOn("home_hero_enabled") && (
          <Hero
            slides={safeHeroSlides}
            badgeText={setting("home_hero_badge_text")}
            ratingValue={setting("home_hero_rating_value")}
            reviewsText={setting("home_hero_reviews_text")}
            shippedText={setting("home_hero_shipped_text")}
          />
        )}

        {isOn("home_marquee_enabled") && <MarqueeStrip items={setting("home_marquee_items")} />}

        <CategoryCircles categories={safeCategories} />

        <FeaturedProducts products={safeFeaturedProducts} />

        {isOn("home_choose_enabled") && (
          <HowToChoose
            subtitle={setting("home_choose_subtitle")}
            image={setting("home_choose_image")}
            option1Title={setting("home_choose_option1_title")}
            option1Desc={setting("home_choose_option1_desc")}
            option2Title={setting("home_choose_option2_title")}
            option2Desc={setting("home_choose_option2_desc")}
            option3Title={setting("home_choose_option3_title")}
            option3Desc={setting("home_choose_option3_desc")}
            unsureTitle={setting("home_choose_unsure_title")}
            unsureText={setting("home_choose_unsure_text")}
            unsureButton={setting("home_choose_unsure_button")}
          />
        )}

        {isOn("home_journey_enabled") && (
          <LuxuryQuoteSection
            line1={setting("home_journey_line1")}
            line2={setting("home_journey_line2")}
            line3={setting("home_journey_line3")}
            label1={setting("home_journey_label1")}
            label2={setting("home_journey_label2")}
            label3={setting("home_journey_label3")}
            image={setting("home_journey_image")}
          />
        )}

        {isOn("home_limited_enabled") && (
          <LimitedEdition
            subtitle={setting("home_limited_subtitle")}
            headingLine1={setting("home_limited_heading_line1")}
            headingLine2={setting("home_limited_heading_line2")}
            buttonText={setting("home_limited_button_text")}
            image={setting("home_limited_image")}
          />
        )}

        <WhyUs />

        {isOn("home_testimonials_enabled") && (
          <Testimonials
            testimonials={safeTestimonials}
            subtitle={setting("home_testimonials_subtitle")}
          />
        )}
        {isOn("home_faq_enabled") && (
          <FaqSection
            subtitle={setting("home_faq_subtitle")}
            image={setting("home_faq_image")}
            q1={setting("home_faq_q1")}
            a1={setting("home_faq_a1")}
            q2={setting("home_faq_q2")}
            a2={setting("home_faq_a2")}
            q3={setting("home_faq_q3")}
            a3={setting("home_faq_a3")}
            q4={setting("home_faq_q4")}
            a4={setting("home_faq_a4")}
          />
        )}
        <FindYourScent />
      </main>
      <Footer />
    </>
  );
}
