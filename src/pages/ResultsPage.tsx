import React, { useState } from "react";
import { useUserInfo } from "../context/UserInfoContext";
import NutritionSuggestions from "../components/NutritionSuggestions";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplet, Dumbbell, Leaf, Moon, Sparkles, Home, User, BarChart2, Settings, Search, LogOut, Calendar, Users, Bell, Plus, PieChart, Info, ChevronDown, X, Clock, Dna, AlertCircle } from "lucide-react";
import type { UserInfo } from "../context/UserInfoContext";
import { useRef } from "react";

// --- Modal Component ---
function Modal({ open, onClose, title, content, link }: { open: boolean; onClose: () => void; title: string; content: string; link?: string }) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Focus trap and ESC close
  React.useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" tabIndex={-1}>
      <div ref={modalRef} className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-white/60 flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 focus:outline-none"><X size={24}/></button>
        <div className="text-2xl font-bold text-purple-700 mb-2 flex items-center gap-2"><Info className="text-purple-400" size={22}/>{title}</div>
        <div className="text-base text-gray-700 mb-4 text-center">{content}</div>
        {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline font-semibold hover:text-blue-400">Read the full article</a>}
      </div>
    </div>
  );
}

// --- Expandable Card Wrapper ---
function ExpandableCard({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`rounded-3xl bg-white/80 shadow-2xl border border-white/40 backdrop-blur-2xl transition-all duration-300 ${open ? 'p-10 min-h-[340px]' : 'p-4 min-h-[64px]'} flex flex-col mb-2`}>
      <button className="flex items-center gap-2 text-2xl font-bold text-purple-700 mb-4 focus:outline-none" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={title.replace(/\s/g, "-") + "-content"}>
        {icon} {title}
        <ChevronDown className={`ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={24}/>
      </button>
      <div id={title.replace(/\s/g, "-") + "-content"} className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>{open && children}</div>
    </div>
  );
}

// --- Modal state for science deep-dives ---
// const [modal, setModal] = React.useState<{ open: boolean; title: string; content: string; link?: string }>({ open: false, title: '', content: '', link: undefined });

// --- Tooltip Component (Interactive, triggers modal) ---
function Tooltip({ text, learnMore, children, setModal }: { text: string; learnMore?: string; children: React.ReactNode; setModal: (modal: { open: boolean; title: string; content: string; link?: string }) => void }) {
  return (
    <span className="relative group cursor-pointer">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:flex group-focus:flex flex-col px-3 py-2 rounded-xl bg-black/80 text-white text-xs font-normal shadow-lg min-w-[200px] max-w-xs transition-all duration-200" style={{ top: '100%' }}>
        <span>{text}</span>
        {learnMore && (
          <button
            onClick={() => setModal({ open: true, title: 'Science Deep Dive', content: text, link: learnMore })}
            className="mt-2 text-blue-300 underline hover:text-blue-200 focus:text-blue-200 transition text-xs font-semibold self-end"
            tabIndex={0}
          >
            Learn more
          </button>
        )}
      </span>
    </span>
  );
}

// --- Explanations for tooltips (with learnMore links) ---
const explanations = {
  age: { text: "Age affects metabolism, nutrient needs, and risk for certain conditions.", learnMore: "https://www.cdc.gov/nutrition/infantandtoddlernutrition/older-adult-nutrition/index.html" },
  weight: { text: "Weight is a key factor in energy balance and metabolic health.", learnMore: "https://www.cdc.gov/healthyweight/effects/index.html" },
  height: { text: "Height helps estimate BMI and caloric needs.", learnMore: "https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html" },
  gender: { text: "Biological sex influences hormone levels and nutrient requirements.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/" },
  menstrual: { text: "Menstrual status impacts iron needs, hydration, and energy.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/" },
  allergies: { text: "Allergies are immune responses to specific foods or substances.", learnMore: "https://www.mayoclinic.org/diseases-conditions/food-allergy/symptoms-causes/syc-20355095" },
  activity: { text: "Regular movement reduces risk of chronic disease and boosts mood.", learnMore: "https://www.cdc.gov/physicalactivity/basics/pa-health/index.htm" },
  dna: { text: "Genetic data can reveal predispositions to certain intolerances or needs.", learnMore: "https://www.genome.gov/genetics-glossary/Genetic-Testing" },
  iron: { text: "Iron is essential for oxygen transport, especially important during menstruation.", learnMore: "https://ods.od.nih.gov/factsheets/Iron-Consumer/" },
  hydration: { text: "Proper hydration supports metabolism, energy, and cellular function.", learnMore: "https://www.cdc.gov/healthyweight/healthy_eating/water-and-healthier-drinks.html" },
  sleep: { text: "Consistent sleep improves recovery, hormone balance, and mental clarity.", learnMore: "https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep" },
  muscle: { text: "Muscle mass supports metabolism, strength, and healthy aging.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/" },
  menstrual_reg: { text: "Regular cycles are a sign of hormonal and reproductive health.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/" },
  protein: { text: "Protein is vital for muscle repair, immune function, and satiety.", learnMore: "https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/protein/" },
  lactose: { text: "Lactose intolerance is caused by a genetic variant affecting lactase enzyme.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6463098/" },
  b12: { text: "Vitamin B12 is crucial for nerve function and is often low in vegan diets.", learnMore: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/" },
  stretching: { text: "Stretching improves flexibility, circulation, and reduces injury risk.", learnMore: "https://www.health.harvard.edu/staying-healthy/the-importance-of-stretching" },
  walk: { text: "Walking is a low-impact way to boost cardiovascular and mental health.", learnMore: "https://www.cdc.gov/physicalactivity/walking/index.htm" },
  water: { text: "Water is essential for every cell and process in your body.", learnMore: "https://www.cdc.gov/healthyweight/healthy_eating/water-and-healthier-drinks.html" },
  salt: { text: "Electrolytes like sodium help maintain fluid balance, especially when sweating.", learnMore: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5371633/" },
};

const ProfileSummary: React.FC = () => {
  const { userInfo, setUserInfo } = useUserInfo();
  const navigate = useNavigate();
  if (!userInfo) return null;
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="rounded-3xl bg-white/70 shadow-xl p-8 flex flex-col items-center border border-white/40 backdrop-blur-xl">
        <div className="text-2xl font-bold text-gray-900 mb-2">Your Health Profile</div>
        <div className="text-base text-gray-600 mb-4 text-center">Great job, <span className="font-semibold text-lavender-500" style={{ color: '#a78bfa' }}>{userInfo.name}</span>! Here’s a summary of your info:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div><span className="font-semibold text-gray-700">Age:</span> <span className="text-gray-800">{userInfo.age}</span></div>
          <div><span className="font-semibold text-gray-700">Sex:</span> <span className="text-gray-800">{userInfo.gender}</span></div>
          <div><span className="font-semibold text-gray-700">Height:</span> <span className="text-gray-800">{userInfo.height} cm</span></div>
          <div><span className="font-semibold text-gray-700">Weight:</span> <span className="text-gray-800">{userInfo.weight} kg</span></div>
          {userInfo.dietaryPreferences && <div><span className="font-semibold text-gray-700">Diet:</span> <span className="text-gray-800">{userInfo.dietaryPreferences}</span></div>}
          {userInfo.activityLevel && <div><span className="font-semibold text-gray-700">Activity:</span> <span className="text-gray-800">{userInfo.activityLevel}</span></div>}
          {userInfo.menstrualCycle && <div><span className="font-semibold text-gray-700">Menstrual Cycle:</span> <span className="text-gray-800">{userInfo.menstrualCycle}</span></div>}
          {userInfo.diagnoses && <div><span className="font-semibold text-gray-700">Genetic Mutations:</span> <span className="text-gray-800">{userInfo.diagnoses}</span></div>}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-xl bg-white/30 border border-white/40 text-gray-900 font-semibold shadow-md backdrop-blur transition-all duration-200 hover:bg-white/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lavender-200"
            style={{ minWidth: 120 }}
          >
            Back to Profile
          </button>
          <button
            onClick={() => { setUserInfo(null); navigate("/"); }}
            className="px-6 py-2 rounded-xl bg-white/30 border border-white/40 text-gray-900 font-semibold shadow-md backdrop-blur transition-all duration-200 hover:bg-white/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
            style={{ minWidth: 120 }}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const { userInfo } = useUserInfo();
  // DNA upload state
  const location = useLocation();
  const dnaUploaded = location.state?.dnaUploaded || false;
  const dnaFileName = location.state?.dnaFileName;
  const [hydrationGoal, setHydrationGoal] = useState(2.0);
  const [modal, setModal] = React.useState<{ open: boolean; title: string; content: string; link?: string }>({ open: false, title: '', content: '', link: undefined });
  const name = userInfo?.name || "User";

  if (!userInfo) {
    return (
      <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(120deg, #e9ffd9 0%, #f3fdf6 20%, #e9d5ff 40%, #f3e8ff 60%, #fbcfe8 80%, #f9d6e9 100%)' }}>
        <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-2xl p-12 max-w-xl w-full flex flex-col items-center gap-6 font-sans">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">No Data</h1>
          <p className="text-2xl text-gray-600 text-center">
            Please fill out your information first.
          </p>
        </div>
      </div>
    );
  }

  // Sidebar navigation items
  const navItems = [
    { icon: <Home size={22} />, label: "Dashboard" },
    { icon: <PieChart size={22} />, label: "Project" },
    { icon: <Calendar size={22} />, label: "Calendar" },
    { icon: <Users size={22} />, label: "Team" },
    { icon: <BarChart2 size={22} />, label: "Statistics" },
    { icon: <Settings size={22} />, label: "Setting" },
  ];

  // Placeholder avatars for members
  const members = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/women/46.jpg",
    "https://randomuser.me/api/portraits/men/47.jpg",
  ];

  // Placeholder messages
  const messages = [
    { name: "Davis Vaccaro", text: "Do you need that design?", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Lydia Liphutz", text: `Hello ${name}, how are you?`, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  ];

  // Placeholder activities
  const activities = [
    { name: "UI Design", time: "10:42:23 AM", value: "+154,00", status: "Completed" },
    { name: "Marketing Ads", time: "09:21:45 AM", value: "+144,00", status: "Completed" },
  ];

  // Placeholder project list
  const projects = [
    { icon: <PieChart className="text-purple-400" size={20} />, name: "UI/UX Design" },
    { icon: <Users className="text-pink-400" size={20} />, name: "Art and Sketch" },
    { icon: <BarChart2 className="text-blue-400" size={20} />, name: "Marketing Ads" },
  ];

  // Placeholder stats
  const stats = [
    { label: "Project", value: "50+", color: "from-purple-300 to-pink-300" },
    { label: "Client", value: "45+", color: "from-pink-300 to-purple-300" },
  ];

  // Placeholder progress
  const progress = 89;

  // Placeholder chart (SVG)
  const chart = (
    <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#fbc2eb" />
        </linearGradient>
      </defs>
      <path d="M0,60 Q50,10 100,40 T200,30 T300,60" stroke="url(#chartGradient)" strokeWidth="4" fill="none" />
      <circle cx="100" cy="40" r="5" fill="#c4b5fd" />
      <circle cx="200" cy="30" r="5" fill="#fbc2eb" />
    </svg>
  );

  // Placeholder calendar (static)
  const calendar = (
    <div className="flex flex-col items-center">
      <div className="font-semibold mb-2">Feb, 11 Monday</div>
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500">
        {["S","M","T","W","T","F","S"].map((d,i) => <div key={i}>{d}</div>)}
        {Array.from({length: 28}, (_,i) => i+1).map(day => (
          <div key={day} className={`w-6 h-6 flex items-center justify-center rounded-full ${[11,12,14,15].includes(day) ? 'bg-purple-200 text-purple-700 font-bold' : ''}`}>{day}</div>
        ))}
      </div>
    </div>
  );

  // Placeholder progress circle
  const progressCircle = (
    <div className="flex flex-col items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" stroke="#ede9fe" strokeWidth="8" fill="none" />
        <circle cx="40" cy="40" r="34" stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeDasharray="213.6" strokeDashoffset="23.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#fbc2eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-2xl font-bold text-purple-500">{progress}%</div>
      <div className="mt-2 text-xs text-gray-500">Progress</div>
    </div>
  );

  // --- Personalized Suggestions Logic ---
  function getPersonalizedSuggestions(user: UserInfo) {
    const base = [
      "Eat a variety of colorful fruits and vegetables.",
      "Stay hydrated throughout the day.",
      "Limit processed foods and added sugars."
    ];
    if (user.gender === "Female" && user.menstrualCycle) {
      base.push("Track your cycle and adjust nutrition for each phase.");
    }
    if (user.gender === "Male") {
      base.push("Prioritize lean protein and regular strength training.");
    }
    if (user.activityLevel === "Sedentary") {
      base.push("Try to add short walks or stretching breaks to your day.");
    }
    if (user.dietaryPreferences?.toLowerCase().includes("vegan")) {
      base.push("Consider B12 and iron supplementation.");
    }
    return base;
  }

  // --- Supplements & Recommendations Logic ---
  function getSupplements(user: UserInfo) {
    if (user.gender === "Female" && user.menstrualCycle) {
      return [
        "Iron (especially during menstruation)",
        "Vitamin D",
        "Magnesium",
        "Omega-3 (if not eating fish)",
        "Folate (if planning pregnancy)"
      ];
    }
    if (user.gender === "Male") {
      return [
        "Vitamin D",
        "Zinc",
        "Magnesium",
        "Omega-3 (if not eating fish)"
      ];
    }
    return ["Multivitamin", "Vitamin D", "Omega-3"];
  }
  function getRecommendations(user: UserInfo) {
    if (user.gender === "Female" && user.menstrualCycle) {
      return [
        `Cycle phase: ${user.menstrualCycle}`,
        user.menstrualCycle === "Menstrual" ? "Focus on iron-rich foods and hydration." :
        user.menstrualCycle === "Follicular" ? "Boost protein and probiotics for energy." :
        user.menstrualCycle === "Ovulation" ? "Add antioxidants and eat light meals." :
        user.menstrualCycle === "Luteal" ? "Increase magnesium, reduce caffeine." :
        "Personalize your nutrition for your cycle."
      ];
    }
    return [
      "Aim for 150+ min exercise per week.",
      "Prioritize sleep and stress management.",
      "Include both cardio and strength training."
    ];
  }

  // --- Exercise Progress Graph & Info ---
  const exerciseGraph = (
    <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
      <defs>
        <linearGradient id="exerciseGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#fbc2eb" />
        </linearGradient>
      </defs>
      <path d="M0,70 Q30,40 60,50 T120,30 T180,60 T240,20 T300,40" stroke="url(#exerciseGradient)" strokeWidth="4" fill="none" />
      <circle cx="60" cy="50" r="5" fill="#a78bfa" />
      <circle cx="120" cy="30" r="5" fill="#fbc2eb" />
      <circle cx="180" cy="60" r="5" fill="#a78bfa" />
      <circle cx="240" cy="20" r="5" fill="#fbc2eb" />
    </svg>
  );
  const exerciseInfo = (
    <div className="mt-2 p-3 rounded-xl bg-white/70 text-xs text-gray-700 border border-white/40 shadow-sm">
      <b>Did you know?</b> With consistent exercise, your body can improve cardiovascular health, muscle tone, and energy in as little as 2-4 weeks. Progress is fastest in the first month—keep going!
    </div>
  );

  // --- Recommended Exercises & Sports ---
  function getExerciseSuggestions(user: UserInfo) {
    if (user.gender === "Female" && user.menstrualCycle === "Menstrual") {
      return [
        { name: "Gentle Yoga", time: "20 min", value: "", status: "Recommended" },
        { name: "Walking", time: "30 min", value: "", status: "Recommended" },
      ];
    }
    if (user.gender === "Female" && user.menstrualCycle === "Luteal") {
      return [
        { name: "Pilates", time: "25 min", value: "", status: "Recommended" },
        { name: "Stretching", time: "15 min", value: "", status: "Recommended" },
      ];
    }
    return [
      { name: "Brisk Walk", time: "30 min", value: "", status: "Recommended" },
      { name: "Strength Training", time: "20 min", value: "", status: "Recommended" },
      { name: "Cycling", time: "40 min", value: "", status: "Recommended" },
    ];
  }

  // --- Hydration Tracker Widget (Segmented Bar) ---
  const hydrationMin = 1.0, hydrationMax = 4.0;
  const hydrationSegments = 6;
  const hydrationStep = (hydrationMax - hydrationMin) / (hydrationSegments - 1);
  const hydrationIndex = Math.round((hydrationGoal - hydrationMin) / hydrationStep);
  const hydrationWidget = (
          <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-bold text-lg text-purple-700">Hydration Tracker</div>
          <div className="text-xs text-blue-600 font-medium px-2 py-1 rounded-full bg-blue-100/60 border border-blue-200/40">
            Demo
          </div>
        </div>
      <div className="flex items-center gap-3 w-full">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow">
          <Droplet className="text-blue-500" size={20} />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex gap-1 items-center w-full">
            {[...Array(hydrationSegments)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-full rounded-full transition-all duration-300 ${i <= hydrationIndex ? 'bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300' : 'bg-white/60 border border-white/40'}`}
                style={{ minWidth: 12, maxWidth: 32 }}
              >
                {i === hydrationIndex && (
                  <Droplet className="mx-auto text-blue-600 animate-bounce" size={14} />
                )}
              </div>
            ))}
          </div>
        </div>
        <span className="text-xl font-extrabold text-blue-600 ml-2" style={{ minWidth: 48 }}>{hydrationGoal.toFixed(1)}L</span>
      </div>
      <input
        type="range"
        min={hydrationMin}
        max={hydrationMax}
        step={0.1}
        value={hydrationGoal}
        onChange={e => setHydrationGoal(Number(e.target.value))}
        className="w-full accent-blue-400 mt-2"
      />
      <div className="text-xs text-gray-500 mt-1">Aim for 2–2.5L per day</div>
    </div>
  );

  // --- Overview Section (Modern Chart & Info Card) ---
  const overviewChart = (
    <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbc2eb" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#fbc2eb" />
        </linearGradient>
      </defs>
      <path d="M0,100 Q40,60 80,80 T160,40 T240,70 T320,30" stroke="url(#lineGradient)" strokeWidth="4" fill="none" />
      <path d="M0,100 Q40,60 80,80 T160,40 T240,70 T320,30 L320,120 L0,120 Z" fill="url(#areaGradient)" />
      <circle cx="80" cy="80" r="6" fill="#a78bfa" />
      <circle cx="160" cy="40" r="6" fill="#fbc2eb" />
      <circle cx="240" cy="70" r="6" fill="#a78bfa" />
    </svg>
  );
  const overviewInfo = (
    <div className="mt-4 p-4 rounded-2xl bg-white/80 text-sm text-gray-700 border border-white/40 shadow flex flex-col items-center">
      <span className="font-bold text-purple-700 mb-1">How quickly can your body change?</span>
      <span className="text-center">With consistent exercise, you can see improvements in energy, muscle tone, and health in just a few weeks. The chart shows typical progress for new routines—keep it up for lasting change!</span>
    </div>
  );

  // --- Health News Feed ---
  const healthNews = [
    {
      title: "CRISPR: A New Era in Gene Editing",
      desc: "Scientists have made breakthroughs in treating genetic diseases using CRISPR technology.",
      author: "Dr. Jennifer Doudna",
      date: "Today"
    },
    {
      title: "Meet Dr. Katalin Karikó",
      desc: "Her mRNA research paved the way for COVID-19 vaccines, revolutionizing modern medicine.",
      author: "Health News Desk",
      date: "Yesterday"
    }
  ];

  // --- Personalized Omagie Logo/Section ---
  const omagieIcon = userInfo.gender === "Female"
    ? <Moon className="text-pink-400" size={28} />
    : userInfo.gender === "Male"
      ? <Dumbbell className="text-blue-400" size={28} />
      : <Sparkles className="text-purple-400" size={28} />;
  const omagieLabel = `Omagie for ${userInfo.name || 'You'}`;

  // --- Biology-Themed Background Layer ---
  const biologyBg = (
    <svg className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: 0.13 }} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* DNA Helix */}
        <path d="M100 100 Q200 300 300 100 T500 100 T700 100 T900 100 T1100 100" stroke="#a78bfa" strokeWidth="8" fill="none" opacity="0.18" />
        <path d="M100 200 Q200 400 300 200 T500 200 T700 200 T900 200 T1100 200" stroke="#fbc2eb" strokeWidth="8" fill="none" opacity="0.13" />
        {/* Cells */}
        <circle cx="400" cy="600" r="60" fill="#c4b5fd" opacity="0.08" />
        <circle cx="1200" cy="300" r="40" fill="#fbc2eb" opacity="0.10" />
        {/* Molecules */}
        <circle cx="900" cy="700" r="18" fill="#a7f3d0" opacity="0.12" />
        <circle cx="200" cy="800" r="12" fill="#fbc2eb" opacity="0.10" />
      </g>
    </svg>
  );

  // --- Health Summary Section ---
  function getUserSummary(user: UserInfo) {
    const summary = [];
    if (user.gender === "Female" && user.menstrualCycle) summary.push(`Menstrual status: ${user.menstrualCycle}`);
    if (user.allergies && user.allergies.length > 0) summary.push(`Allergies: ${user.allergies.join(", ")}`);
    if (user.activityLevel) summary.push(`Activity: ${user.activityLevel}`);
    if (user.dietaryPreferences) summary.push(`Diet: ${user.dietaryPreferences}`);
    if (user.diagnoses) summary.push(`DNA: ${user.diagnoses}`);
    return summary;
  }
  function getPersonalizedSummary(user: UserInfo) {
    const lines = [];
    if (user.diagnoses?.toLowerCase().includes("lactose")) lines.push("Lactose intolerance detected — avoid dairy.");
    if (user.activityLevel?.toLowerCase().includes("low")) lines.push("Incorporate light stretching (low activity detected).");
    if (user.gender === "Female" && user.menstrualCycle === "Menstrual") lines.push("Increase iron intake due to menstrual phase.");
    if (user.dietaryPreferences?.toLowerCase().includes("high protein")) lines.push("High protein intake recommended based on DNA and activity.");
    if (lines.length === 0) lines.push("Maintain a balanced diet and regular activity for optimal health.");
    return lines.slice(0, 3);
  }

  // --- Daily Health Tips ---
  function getDailyHealthTips(user: UserInfo) {
    const tips = [];
    if (user.gender === "Female" && user.menstrualCycle === "Menstrual") tips.push("Increase iron intake due to menstrual phase.");
    if (user.activityLevel?.toLowerCase().includes("sedentary")) tips.push("Incorporate light stretching (low activity detected).");
    if (user.allergies && user.allergies.length > 0) tips.push(`Avoid: ${user.allergies.join(", ")}`);
    if (user.dietaryPreferences?.toLowerCase().includes("vegan")) tips.push("Consider B12 and iron supplementation.");
    if (tips.length < 2) tips.push("Stay hydrated and get enough sleep.");
    return tips.slice(0, 3);
  }

  // --- Today's Priorities ---
  function getPrioritiesToday(user: UserInfo) {
    const tasks = [];
    tasks.push("Drink 2.5L water");
    if (user.allergies && user.allergies.length > 0) tasks.push(`Avoid: ${user.allergies[0]}`);
    if (user.activityLevel?.toLowerCase().includes("sedentary")) tasks.push("15-min walk");
    if (user.gender === "Female" && user.menstrualCycle === "Menstrual") tasks.push("Eat iron-rich foods");
    if (tasks.length < 3) tasks.push("Eat a colorful salad");
    return tasks.slice(0, 3);
  }

  // --- Hydration Tips ---
  function getHydrationTips(user: UserInfo) {
    const tips = [];
    tips.push("Add a pinch of salt or electrolyte mix if sweating heavily.");
    if (user.activityLevel?.toLowerCase().includes("active")) tips.push("Increase water intake on workout days.");
    if (user.gender === "Female" && user.menstrualCycle === "Luteal") tips.push("Hydrate more during luteal phase.");
    return tips.slice(0, 2);
  }

  // --- Progress Data (4 weeks) ---
  const progressLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const progressData = [
    { label: "Sleep Quality", values: [6, 7, 7.5, 8] },
    { label: "Muscle Mass", values: [50, 51, 52, 53] },
    { label: "Menstrual Regularity", values: [1, 1, 1, 1] },
  ];
  const progressColors = ["#a78bfa", "#fbc2eb", "#6ee7b7"];
  const progressChart = (
    <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
      {progressData.map((d, idx) => (
        <polyline
          key={d.label}
          fill="none"
          stroke={progressColors[idx]}
          strokeWidth="4"
          points={d.values.map((v, i) => `${i * 100 + 10},${120 - v * 12}`).join(" ")}
          opacity="0.8"
        />
      ))}
      {progressLabels.map((l, i) => (
        <text key={l} x={i * 100 + 10} y={115} fontSize="12" fill="#888" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden" style={{ fontFamily: 'Inter, SF Pro, Manrope, sans-serif' }}>
      {/* Soft pastel gradient background with nature SVGs */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(120deg, #d1fae5 0%, #f3e8ff 50%, #fbcfe8 100%)' }} />
      {/* Nature-inspired SVGs: leaves, waves, flowers */}
      <svg className="fixed left-0 top-0 w-64 h-64 z-0 opacity-20" viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="100" rx="90" ry="60" fill="#a7f3d0" />
        <path d="M40 120 Q100 60 160 120" stroke="#c4b5fd" strokeWidth="8" fill="none" />
        <circle cx="60" cy="60" r="18" fill="#fbcfe8" />
      </svg>
      <svg className="fixed right-0 bottom-0 w-72 h-72 z-0 opacity-20" viewBox="0 0 200 200" fill="none">
        <ellipse cx="100" cy="120" rx="80" ry="40" fill="#f3e8ff" />
        <path d="M30 160 Q100 100 170 160" stroke="#a7f3d0" strokeWidth="8" fill="none" />
        <circle cx="140" cy="60" r="14" fill="#c4b5fd" />
      </svg>
      {/* Hero Section - Modern & Interactive */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-12 pb-4 select-none">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-2 tracking-tight text-gray-900"
        >
          Your Personalized Results
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          className="text-xl md:text-2xl text-gray-900 text-center font-semibold max-w-2xl mb-2"
        >
          Every day is a new chance to nourish your body and thrive.<br/>
          <span className="font-bold text-gray-900">Here’s your DNA-powered health plan!</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center w-full mt-2 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-mint-100 shadow text-lg font-bold text-mint-900 border border-mint-200">
            <span className="text-2xl">🌱</span> You're on track!
          </span>
        </motion.div>
      </div>
      {/* Menstrual Cycle Section for Women */}
      {userInfo.gender === 'Female' && userInfo.menstrualCycle && (
        <div className="relative z-10 w-full max-w-2xl mx-auto mb-8 px-2 md:px-0">
          <div className="rounded-3xl bg-gradient-to-br from-pink-50/80 to-rose-50/60 shadow-2xl p-8 flex flex-col border border-pink-200/40 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-rose-100/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-pink-100/60 border border-pink-200/40">
                  <Moon className="text-pink-600" size={24}/>
                </div>
                <span className="text-xl font-bold text-pink-900">Menstrual Cycle</span>
              </div>
              <div className="text-base text-gray-900 font-semibold mb-4">Current Phase: <span className="text-pink-600 font-bold">{userInfo.menstrualCycle}</span></div>
              <div className="space-y-3">
                {(() => {
                  switch(userInfo.menstrualCycle) {
                    case 'Menstrual':
                      return [
                        'Increase iron-rich foods (spinach, lentils, red meat).',
                        'Stay hydrated and rest as needed.',
                        'Gentle exercise like yoga or walking is beneficial.'
                      ];
                    case 'Follicular':
                      return [
                        'Boost protein and probiotics for energy.',
                        'Try new workouts—energy is higher now.',
                        'Eat plenty of leafy greens and berries.'
                      ];
                    case 'Ovulation':
                      return [
                        'Add antioxidants (berries, nuts) to your meals.',
                        'Eat light, balanced meals.',
                        'Stay hydrated and enjoy moderate exercise.'
                      ];
                    case 'Luteal':
                      return [
                        'Increase magnesium (nuts, seeds, dark chocolate).',
                        'Reduce caffeine and sugar.',
                        'Prioritize sleep and stress management.'
                      ];
                    default:
                      return ['Personalize your nutrition for your cycle.'];
                  }
                })().map((rec, i) => (
                  <div key={i} className="group">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 backdrop-blur-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100/80 border border-pink-200/60 flex items-center justify-center mt-0.5">
                        <Moon className="text-pink-600" size={12}/>
                      </div>
                      <span className="text-sm text-gray-900 font-medium leading-relaxed">{rec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content: Nutrition & Fitness Cards */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-0 mb-10">
        {/* Nutrition Suggestions Card */}
        <div className="rounded-3xl bg-gradient-to-br from-green-50/80 to-emerald-50/60 shadow-2xl p-10 flex flex-col gap-6 border border-green-200/40 backdrop-blur-sm min-h-[380px] relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-emerald-100/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-green-100/60 border border-green-200/40">
                <Sparkles className="text-green-600" size={24}/>
              </div>
              <span className="text-2xl font-bold text-gray-900">Nutrition Suggestions</span>
            </div>
            <div className="space-y-4">
              {[
                "Eat a variety of colorful fruits and vegetables.",
                "Stay hydrated throughout the day.",
                "Limit processed foods and added sugars.",
                "Include healthy fats (avocado, olive oil, nuts).",
                "Prioritize lean proteins (fish, chicken, legumes).",
                "Track your cycle and adjust nutrition for each phase.",
                "Eat whole grains for sustained energy."
              ].map((suggestion, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100/80 border border-green-200/60 flex items-center justify-center mt-0.5">
                      <Sparkles className="text-green-600" size={14}/>
                    </div>
                    <span className="text-lg text-gray-900 font-medium leading-relaxed">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Animated Macro Bars */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold text-gray-900">Daily Macro Goals</div>
                <div className="text-xs text-green-600 font-medium px-2 py-1 rounded-full bg-green-100/60 border border-green-200/40">
                  Demo
                </div>
              </div>
              {[
                { label: 'Calories', value: 1800, color: 'from-yellow-200 to-yellow-400', icon: <Clock className="text-yellow-600" size={18}/> },
                { label: 'Protein', value: 90, color: 'from-purple-200 to-purple-400', icon: <Dna className="text-purple-700" size={18}/> },
                { label: 'Fat', value: 60, color: 'from-pink-200 to-pink-400', icon: <Droplet className="text-pink-600" size={18}/> },
                { label: 'Carbs', value: 220, color: 'from-green-200 to-green-400', icon: <Leaf className="text-green-700" size={18}/> },
              ].map((macro, i) => (
                <div key={macro.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/30 shadow-sm">
                  {macro.icon}
                  <span className="w-20 font-semibold text-gray-900">{macro.label}</span>
                  <div className="flex-1 bg-gray-200/60 rounded-full h-5 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(macro.value / (macro.label === 'Calories' ? 2000 : macro.label === 'Protein' ? 120 : macro.label === 'Fat' ? 80 : 300) * 100, 100)}%` }}
                      transition={{ duration: 1.2, delay: i * 0.2 }}
                      className={`h-5 rounded-full bg-gradient-to-r ${macro.color}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-900">{macro.value}{macro.label === 'Calories' ? ' kcal' : 'g'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Fitness Suggestions Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-50/80 to-indigo-50/60 shadow-2xl p-10 flex flex-col gap-6 border border-blue-200/40 backdrop-blur-sm min-h-[380px] relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-blue-100/60 border border-blue-200/40">
                <Dumbbell className="text-blue-700" size={24}/>
              </div>
              <span className="text-2xl font-bold text-gray-900">Fitness Suggestions</span>
            </div>
            <div className="space-y-4">
              {getExerciseSuggestions(userInfo).map((ex, i) => (
                <div key={i} className="group">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100/80 border border-blue-200/60 flex items-center justify-center mt-0.5">
                      <Dumbbell className="text-blue-700" size={14}/>
                    </div>
                    <div className="flex-1">
                      <span className="text-lg text-gray-900 font-bold">{ex.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{ex.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Animated Progress Bars for Activity */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold text-gray-900">Weekly Progress</div>
                <div className="text-xs text-blue-600 font-medium px-2 py-1 rounded-full bg-blue-100/60 border border-blue-200/40">
                  Demo
                </div>
              </div>
              {[
                { label: 'Weekly Goal', value: progress, color: 'from-purple-200 to-purple-400', icon: <BarChart2 className="text-purple-700" size={18}/> },
                { label: 'Hydration', value: Math.round(hydrationGoal / 2.5 * 100), color: 'from-blue-200 to-blue-400', icon: <Droplet className="text-blue-700" size={18}/> },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/30 shadow-sm">
                  {item.icon}
                  <span className="w-24 font-semibold text-gray-900">{item.label}</span>
                  <div className="flex-1 bg-gray-200/60 rounded-full h-5 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.2, delay: i * 0.2 }}
                      className={`h-5 rounded-full bg-gradient-to-r ${item.color}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-900">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* DNA-based Suggestions Section */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mb-8 px-2 md:px-0">
        {dnaUploaded ? (
          <div className="rounded-3xl bg-gradient-to-br from-purple-50/80 to-violet-50/60 shadow-2xl p-8 flex flex-col border border-purple-200/40 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-violet-100/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-purple-100/60 border border-purple-200/40">
                  <Sparkles className="text-purple-700" size={22}/>
                </div>
                <span className="text-xl font-bold text-purple-900">Suggestions specific to your DNA</span>
              </div>
              <div className="space-y-4">
                {[
                  "You may have increased need for vitamin B12—consider fortified foods or supplements.",
                  "Your DNA suggests a higher sensitivity to lactose—try lactose-free dairy or alternatives.",
                  "You may benefit from more omega-3s (flaxseed, walnuts, fatty fish) for heart health."
                ].map((suggestion, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 backdrop-blur-sm">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100/80 border border-purple-200/60 flex items-center justify-center mt-0.5">
                        <Sparkles className="text-purple-700" size={14}/>
                      </div>
                      <span className="text-base text-gray-900 font-medium leading-relaxed">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-gradient-to-br from-yellow-50/80 to-amber-50/60 shadow-2xl p-6 border border-yellow-200/40 backdrop-blur-sm flex items-center gap-3 justify-center">
            <div className="p-3 rounded-2xl bg-yellow-100/60 border border-yellow-200/40">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <span className="text-base text-yellow-800 font-medium">Please upload your DNA data to see personalized insights.</span>
          </div>
        )}
      </div>
      {/* Under-cards: Motivational Quote, Daily Tips, Progress Tracker */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-0 mb-12">
        {/* Motivational Quote */}
        <div className="rounded-3xl bg-gradient-to-br from-orange-50/80 to-amber-50/60 shadow-2xl p-8 flex flex-col items-center justify-center border border-orange-200/40 backdrop-blur-sm min-h-[220px] relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-amber-100/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="p-3 rounded-2xl bg-orange-100/60 border border-orange-200/40 mb-4 inline-block">
              <Sparkles className="text-orange-600" size={24}/>
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold italic text-center text-gray-900 leading-relaxed">"Success is the sum of small efforts, repeated day in and day out."</blockquote>
          </div>
        </div>
        {/* Daily Tips */}
        <div className="rounded-3xl bg-gradient-to-br from-pink-50/80 to-rose-50/60 shadow-2xl p-8 flex flex-col border border-pink-200/40 backdrop-blur-sm min-h-[220px] relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-rose-100/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-pink-100/60 border border-pink-200/40">
                <Sparkles className="text-pink-700" size={22}/>
              </div>
              <span className="text-lg font-bold text-pink-900">Daily Tips</span>
            </div>
            <div className="space-y-3">
              {[
                "Stay hydrated and get enough sleep.",
                "Include at least 30 minutes of movement daily.",
                "Eat a balanced breakfast to start your day right.",
                "Take short breaks from screens and stretch regularly.",
                "Practice mindful eating—enjoy your meals slowly."
              ].map((tip, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100/80 border border-pink-200/60 flex items-center justify-center mt-0.5">
                      <Sparkles className="text-pink-700" size={12}/>
                    </div>
                    <span className="text-sm text-gray-900 font-medium leading-relaxed">{tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Progress Tracker */}
        <div className="rounded-3xl bg-gradient-to-br from-teal-50/80 to-cyan-50/60 shadow-2xl p-8 flex flex-col border border-teal-200/40 backdrop-blur-sm items-center justify-center min-h-[220px] relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 to-cyan-100/10 rounded-3xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-teal-100/60 border border-teal-200/40">
                <BarChart2 className="text-teal-700" size={22}/>
              </div>
              <span className="text-lg font-bold text-teal-900">Progress Tracker</span>
            </div>
            <div className="text-xs text-teal-600 font-medium mb-4 px-3 py-1 rounded-full bg-teal-100/60 border border-teal-200/40">
              Demo Data
            </div>
            <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-80">
              <circle cx="40" cy="40" r="34" stroke="#e6fffa" strokeWidth="8" fill="none" />
              <circle
                cx="40" cy="40" r="34"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="213.6"
                strokeDashoffset={213.6 - (progress / 100) * 213.6}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a7f3d0" />
                  <stop offset="100%" stopColor="#c4b5fd" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-3xl font-extrabold text-gray-900 mt-2">{progress}%</div>
            <div className="text-base font-semibold text-gray-700 mb-2">Weekly Progress</div>
            <div className="text-xs text-gray-500 text-center">
              Sign up to track your real progress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers for exercise plan
function getExercisePlan(userInfo: UserInfo) {
  if (userInfo.age && userInfo.age < 30) return "Moderate to intense exercise recommended 4-5x/week. Include both cardio and strength training for best results.";
  if (userInfo.conditions && userInfo.conditions.toLowerCase().includes("pcos")) return "Moderate aerobic and strength training 3-4x/week. Focus on consistency and variety.";
  if (userInfo.age && userInfo.age > 50) return "Light to moderate activity 3x/week, focus on flexibility, balance, and joint health.";
  return "Light to moderate exercise 3-4x/week is ideal. Mix walking, cycling, and stretching.";
}
function getWeeklyGoal(userInfo: UserInfo) {
  if (userInfo.age && userInfo.age < 30) return "150+ min exercise";
  if (userInfo.age && userInfo.age > 50) return "90+ min movement";
  return "120+ min activity";
}
function getActivityType(userInfo: UserInfo) {
  if (userInfo.conditions && userInfo.conditions.toLowerCase().includes("anemia")) return "Low-impact cardio, yoga, and gentle strength work";
  if (userInfo.conditions && userInfo.conditions.toLowerCase().includes("pcos")) return "Aerobic + resistance (e.g., brisk walking, pilates, bodyweight)";
  return "Walking, cycling, swimming, yoga, or dance";
} 