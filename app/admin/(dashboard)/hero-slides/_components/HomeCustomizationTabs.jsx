"use client";

import { useState } from "react";
import { GalleryHorizontal, Sparkles, Compass, Route, Gem, Quote, HelpCircle } from "lucide-react";
import HeroSlideManager from "./HeroSlideManager";
import HomeSectionsManager from "./HomeSectionsManager";

const TABS = [
  { id: "hero", label: "Hero", icon: GalleryHorizontal },
  { id: "marquee", label: "Marquee Strip", icon: Sparkles, sections: ["marquee"] },
  { id: "choose", label: "Find the Perfect Scent", icon: Compass, sections: ["choose"] },
  { id: "journey", label: "Fragrance Journey", icon: Route, sections: ["journey"] },
  { id: "limited", label: "Limited Edition", icon: Gem, sections: ["limited"] },
  { id: "testimonials", label: "Testimonials", icon: Quote, sections: ["testimonials"] },
  { id: "faq", label: "FAQ", icon: HelpCircle, sections: ["faq"] },
];

export default function HomeCustomizationTabs({ slides, settings }) {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeId);

  return (
    <div>
      <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto border-b border-gold-400/10 px-4 pb-4 scrollbar-thin scrollbar-thumb-gold-400/10 scrollbar-track-transparent sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                active
                  ? "border-gold-400/30 bg-gold-400/10 text-gold-200"
                  : "border-gold-400/10 bg-white/[0.02] text-ivory/50 hover:border-gold-400/20 hover:text-ivory"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.id === "hero" ? (
        <HeroSlideManager slides={slides} settings={settings} />
      ) : (
        <HomeSectionsManager key={activeTab.id} settings={settings} only={activeTab.sections} />
      )}
    </div>
  );
}
