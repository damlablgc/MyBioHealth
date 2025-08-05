import React from "react";
import { useUserInfo } from "../context/UserInfoContext";

const ALLERGY_AVOID_MAP: Record<string, string[]> = {
  lactose: ["Milk", "Cheese", "Yogurt", "Ice Cream"],
  gluten: ["Wheat Bread", "Pasta", "Cakes", "Cookies"],
  peanuts: ["Peanuts", "Peanut Butter", "Some Chocolates"],
};

const CONDITION_SUGGESTIONS: Record<string, { rules: string[]; tips: string[]; avoid: string[] }> = {
  anemia: {
    rules: [
      "Eat iron-rich foods daily",
      "Pair iron with vitamin C",
      "Limit tea/coffee with meals",
    ],
    tips: [
      "Include spinach, lentils, and red meat for iron.",
      "Add citrus fruits to boost iron absorption.",
    ],
    avoid: ["Black tea", "Coffee (with meals)", "Calcium supplements (with iron)"]
  },
  pcos: {
    rules: [
      "Choose low glycemic index foods",
      "Eat regular, balanced meals",
      "Prioritize fiber-rich vegetables",
    ],
    tips: [
      "Swap white bread for whole grains.",
      "Add beans and leafy greens to your meals.",
    ],
    avoid: ["Sugary snacks", "White bread", "Fried foods"]
  },
  diabetes: {
    rules: [
      "Monitor carbohydrate intake",
      "Eat small, frequent meals",
      "Stay hydrated",
    ],
    tips: [
      "Choose whole grains over refined carbs.",
      "Snack on nuts and seeds for stable energy.",
    ],
    avoid: ["Sugary drinks", "White rice", "Pastries"]
  },
};

const MENSTRUAL_PHASE_TIPS: Record<string, { tip: string; emoji: string }> = {
  menstruation: {
    tip: "Focus on iron-rich foods (spinach, lentils) and hydrate well.",
    emoji: "🩸"
  },
  follicular: {
    tip: "Enjoy protein-rich foods and probiotics for energy.",
    emoji: "🌱"
  },
  ovulation: {
    tip: "Add antioxidants (berries, nuts) and eat light meals.",
    emoji: "🥚"
  },
  luteal: {
    tip: "Increase magnesium (pumpkin seeds, dark chocolate) and reduce caffeine.",
    emoji: "🌙"
  },
};

export default function NutritionSuggestions() {
  const { userInfo } = useUserInfo();
  if (!userInfo) return null;

  // Dynamic explanation
  const hasConditions = userInfo.conditions && userInfo.conditions.trim().length > 0;
  const hasAllergies = userInfo.allergies && userInfo.allergies.length > 0;
  let explanation = `These nutrition tips are personalized for you`;
  if (userInfo.age || userInfo.gender) {
    explanation += ` as a`;
    if (userInfo.age) explanation += ` ${userInfo.age}-year-old`;
    if (userInfo.gender) explanation += ` ${userInfo.gender.toLowerCase()}`;
    explanation += `.`;
  }
  if (hasConditions) {
    explanation += ` We've included special advice for your health condition${userInfo.conditions.split(/,|;/).length > 1 ? 's' : ''} (${userInfo.conditions}).`;
  }
  if (hasAllergies) {
    explanation += ` Foods to avoid are based on your allergies (${userInfo.allergies.join(', ')}).`;
  }

  // Collect avoid foods from allergies
  const avoidFoods = userInfo.allergies.flatMap(
    (allergy) => ALLERGY_AVOID_MAP[allergy.toLowerCase()] || []
  );

  // Collect avoid foods and suggestions from conditions
  const userConditions = userInfo.conditions
    .split(/,|;/)
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  let rules: string[] = [];
  let tips: string[] = [];
  let avoid: string[] = [...avoidFoods];

  userConditions.forEach((cond) => {
    const condKey = cond.replace(/[^a-z]/g, "");
    if (CONDITION_SUGGESTIONS[condKey]) {
      rules = [...rules, ...CONDITION_SUGGESTIONS[condKey].rules];
      tips = [...tips, ...CONDITION_SUGGESTIONS[condKey].tips];
      avoid = [...avoid, ...CONDITION_SUGGESTIONS[condKey].avoid];
    }
  });

  // Fallbacks if no specific rules
  if (rules.length === 0) {
    rules = [
      "Eat a variety of colorful fruits and vegetables",
      "Stay hydrated throughout the day",
      "Limit processed foods and added sugars",
    ];
  }
  if (tips.length === 0) {
    tips = [
      "Try to include whole grains and lean proteins in your meals.",
      "Snack on nuts, seeds, or yogurt for sustained energy.",
    ];
  }

  // Remove duplicates
  avoid = Array.from(new Set(avoid));

  // Menstrual phase tip
  const phase = userInfo.gender === "Female" && userInfo.menstrualPhase
    ? userInfo.menstrualPhase.toLowerCase()
    : null;
  const phaseTip = phase && MENSTRUAL_PHASE_TIPS[phase];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Dynamic explanation */}
      <div className="rounded-2xl bg-white/60 border border-white/30 shadow p-4 mb-2 text-center text-lg text-gray-800 font-medium backdrop-blur-xl">
        {explanation}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Must-follow rules */}
      <div className="bg-green-100 rounded-2xl shadow-md p-6 flex flex-col">
        <div className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span role="img" aria-label="check">✅</span> Top 3 Must-Follow Rules
        </div>
        <ul className="list-disc pl-5 text-lg text-green-900">
          {rules.slice(0, 3).map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>
      {/* Smart daily tips */}
      <div className="bg-blue-100 rounded-2xl shadow-md p-6 flex flex-col">
        <div className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span role="img" aria-label="bulb">💡</span> Smart Daily Food Tips
        </div>
        <ul className="list-disc pl-5 text-lg text-blue-900">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
      {/* Avoid these foods */}
      <div className="bg-red-100 rounded-2xl shadow-md p-6 flex flex-col md:col-span-2">
        <div className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span role="img" aria-label="warning">❗️</span> Avoid These
        </div>
        {avoid.length > 0 ? (
          <ul className="list-disc pl-5 text-lg text-red-900 flex flex-wrap gap-x-8 gap-y-1">
            {avoid.map((food, i) => (
              <li key={i}>{food}</li>
            ))}
          </ul>
        ) : (
          <div className="text-lg text-red-700">No specific foods to avoid.</div>
        )}
      </div>
      {/* Menstrual phase tip */}
      {phaseTip && (
        <div className="bg-pink-100 rounded-2xl shadow-md p-6 flex flex-col md:col-span-2">
          <div className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span role="img" aria-label="cycle">{phaseTip.emoji}</span> Menstrual Phase Tip
          </div>
          <div className="text-lg text-pink-900">{phaseTip.tip}</div>
        </div>
      )}
      </div>
    </div>
  );
} 