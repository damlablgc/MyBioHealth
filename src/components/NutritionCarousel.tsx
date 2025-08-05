import React, { useRef } from "react";
import { motion } from "framer-motion";

export function TipCard({ tip }: { tip: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: "0 4px 24px 0 rgba(168,85,247,0.12)" }}
      className="min-w-[220px] bg-white rounded-xl shadow p-4 text-purple-700 font-medium text-center transition"
      tabIndex={0}
      aria-label={tip}
    >
      {tip}
    </motion.div>
  );
}

const NutritionCarousel: React.FC = () => {
  const tips = [
    "Vitamin D deficiency risk: High",
    "Increase Omega-3 intake",
    "Limit processed sugars",
    "Consider B12 supplements",
    "Eat more leafy greens",
    "Stay hydrated",
  ];
  const carouselRef = useRef<HTMLDivElement>(null);

  // Arrow navigation: scroll by container width
  const scroll = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-3xl mb-6"
      aria-label="Personalized Nutrition Tips"
    >
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold flex-1">Personalized Nutrition Tips</h3>
        <div className="flex gap-2">
          <button
            aria-label="Scroll left"
            className="rounded-full p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={() => scroll("left")}
            type="button"
          >
            &#8592;
          </button>
          <button
            aria-label="Scroll right"
            className="rounded-full p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onClick={() => scroll("right")}
            type="button"
          >
            &#8594;
          </button>
        </div>
      </div>
      <motion.div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-2"
        drag="x"
        dragConstraints={{ left: -300, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
        aria-label="Swipeable nutrition tips"
        tabIndex={0}
      >
        {tips.map((tip, idx) => (
          <TipCard key={idx} tip={tip} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default NutritionCarousel; 