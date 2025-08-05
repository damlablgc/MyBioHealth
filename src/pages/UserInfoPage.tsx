import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Info, Dumbbell, Leaf, Moon } from "lucide-react";
import { useUserInfo } from "../context/UserInfoContext";

// Types for form state and errors
interface FormState {
  age: string;
  sex: string;
  height: string;
  weight: string;
  mutations: string;
  activity: string;
  diet: string;
  cycle: string;
}
interface FormErrors {
  age?: string;
  sex?: string;
  height?: string;
  weight?: string;
}

const ACCORDION = [
  {
    key: "activity",
    label: "Activity Level (Optional)",
    icon: <Dumbbell className="text-purple-400 mr-2" size={20} />, // purple
    content: (
      (form: FormState, handleChange: any) => (
        <select name="activity" value={form.activity} onChange={handleChange} className="p-3 rounded-lg border-none bg-white shadow focus:ring-2 focus:ring-purple-100 text-base text-gray-900 font-normal transition-all duration-150 w-full">
          <option value="">Select Activity Level (Optional)</option>
          <option value="Sedentary">Sedentary</option>
          <option value="Lightly Active">Lightly Active</option>
          <option value="Moderately Active">Moderately Active</option>
          <option value="Very Active">Very Active</option>
        </select>
      )
    )
  },
  {
    key: "diet",
    label: "Dietary Preferences",
    icon: <Leaf className="text-green-400 mr-2" size={20} />, // green
    content: (
      (form: FormState, handleChange: any) => (
        <input name="diet" value={form.diet} onChange={handleChange} className="p-3 rounded-lg border-none bg-white shadow focus:ring-2 focus:ring-green-100 text-base text-gray-900 font-normal transition-all duration-150 w-full" placeholder="Dietary Preferences (e.g. vegan, gluten-free)" />
      )
    )
  },
  {
    key: "cycle",
    label: "Menstrual Cycle",
    icon: <Moon className="text-pink-400 mr-2" size={20} />, // pink
    content: (
      (form: FormState, handleChange: any) => (
        <select name="cycle" value={form.cycle} onChange={handleChange} className="p-3 rounded-lg border-none bg-white shadow focus:ring-2 focus:ring-pink-200 text-base text-gray-900 font-normal transition-all duration-150 border border-pink-200 w-full">
          <option value="">Select Menstrual Cycle</option>
          <option value="Regular">Regular</option>
          <option value="Irregular">Irregular</option>
          <option value="Menopausal">Menopausal</option>
          <option value="Not Applicable">Not Applicable</option>
        </select>
      )
    )
  }
];

export default function UserInfoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    age: "",
    sex: "",
    height: "",
    weight: "",
    mutations: "",
    activity: "",
    diet: "",
    cycle: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { setUserInfo } = useUserInfo();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!form.age) newErrors.age = "Required";
    if (!form.sex) newErrors.sex = "Required";
    if (!form.height) newErrors.height = "Required";
    if (!form.weight) newErrors.weight = "Required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setUserInfo({
        name: "", // You can add a name field to the form if needed
        age: form.age === "" ? "" : Number(form.age),
        gender: form.sex as "Male" | "Female" | "Other",
        weight: form.weight === "" ? "" : Number(form.weight),
        height: form.height === "" ? "" : Number(form.height),
        allergies: [], // Add allergies field if needed
        conditions: "", // Add conditions field if needed
        diagnoses: form.mutations,
        menstrualCycle: form.cycle,
        activityLevel: form.activity,
        dietaryPreferences: form.diet,
      });
      navigate("/dna-upload");
    }
  }

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden" style={{ fontFamily: 'Inter, SF Pro, Manrope, sans-serif' }}>
      {/* Vibrant multi-stop gradient background */}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(120deg, #e9ffd9 0%, #f3fdf6 20%, #e9d5ff 40%, #f3e8ff 60%, #fbcfe8 80%, #f9d6e9 100%)' }} />
      {/* Main content wrapper */}
      <div className="relative z-10 flex flex-col items-center min-h-screen w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center pt-10 pb-4 w-full">
          <div className="w-20 h-20 rounded-full bg-white/60 shadow-2xl flex items-center justify-center mb-4 relative" style={{ boxShadow: '0 8px 32px 0 rgba(168,85,247,0.10)', backdropFilter: 'blur(8px)' }}>
            <User className="text-purple-400 relative z-10" size={44} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 text-center tracking-tight leading-tight" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 8px #f3e8ff' }}>Your Health Profile</h1>
          <p className="text-lg md:text-xl text-gray-500 text-center mb-4 max-w-2xl font-semibold tracking-wide" style={{ letterSpacing: '0.01em', lineHeight: 1.4 }}>Help us understand your unique health needs for personalized nutrition advice</p>
        </div>
        {/* Main Content Row */}
        <div className="w-full flex flex-col md:flex-row gap-10 px-4 pb-16 items-start justify-center">
          {/* Health Profile Panel (widest and most dominant) */}
          <form onSubmit={handleSubmit} className="flex-1 rounded-[3rem] bg-white/70 shadow-2xl p-16 md:p-28 flex flex-col items-center min-h-[700px] justify-center mx-auto mb-10 md:mb-0" style={{ backdropFilter: 'blur(24px)', maxWidth: '100%', width: '100%', boxShadow: '0 12px 48px 0 rgba(168,85,247,0.10)' }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 via-pink-100 to-green-100 flex items-center justify-center mb-6 shadow" style={{ boxShadow: '0 4px 24px 0 rgba(168,85,247,0.10)' }}>
              <User className="text-purple-400" size={40} />
            </div>
            <div className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight text-center" style={{ letterSpacing: '-0.01em' }}>Your Health Profile</div>
            <div className="text-base text-gray-600 mb-6 text-center font-semibold">Personalize your nutrition journey</div>
            <div className="w-full flex flex-col gap-4 mb-6">
              <div>
                <input name="age" value={form.age} onChange={handleChange} className="p-4 rounded-xl border-none bg-white/80 text-lg md:text-xl placeholder-gray-400 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all duration-150 text-gray-900" placeholder="Age" />
                {errors.age && <div className="text-pink-500 text-xs mt-1">{errors.age}</div>}
              </div>
              <div>
                <select name="sex" value={form.sex} onChange={handleChange} className="p-4 rounded-xl border-none bg-white/80 text-lg md:text-xl text-gray-900 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all duration-150">
                  <option value="">Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.sex && <div className="text-pink-500 text-xs mt-1">{errors.sex}</div>}
              </div>
              <div>
                <input name="height" value={form.height} onChange={handleChange} className="p-4 rounded-xl border-none bg-white/80 text-lg md:text-xl placeholder-gray-400 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all duration-150 text-gray-900" placeholder="Height (cm)" />
                {errors.height && <div className="text-pink-500 text-xs mt-1">{errors.height}</div>}
              </div>
              <div>
                <input name="weight" value={form.weight} onChange={handleChange} className="p-4 rounded-xl border-none bg-white/80 text-lg md:text-xl placeholder-gray-400 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all duration-150 text-gray-900" placeholder="Weight (kg)" />
                {errors.weight && <div className="text-pink-500 text-xs mt-1">{errors.weight}</div>}
              </div>
              <input name="mutations" value={form.mutations} onChange={handleChange} className="p-4 rounded-xl border-none bg-white/80 text-lg md:text-xl placeholder-gray-400 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-sm transition-all duration-150 text-gray-900" placeholder="Known Genetic Mutations (Optional)" />
            </div>
            {/* Accordion for subtle options - glassmorphic, soft, modern */}
            <div className="w-full flex flex-col gap-4 mt-2">
              {ACCORDION.map((section) => (
                <div key={section.key} className="rounded-xl bg-white/70 shadow flex flex-col border border-gray-200 transition-all duration-200">
                  <button
                    type="button"
                    className={`flex items-center w-full px-5 py-4 text-lg font-semibold focus:outline-none transition-all duration-150 rounded-xl 
                      ${openAccordion === section.key ? 'text-gray-900 bg-gradient-to-r from-green-50 via-white to-mint-50' : 'text-gray-700 bg-white/70 hover:bg-white/90'}
                    `}
                    onClick={() => setOpenAccordion(openAccordion === section.key ? null : section.key)}
                    style={{ boxShadow: openAccordion === section.key ? '0 2px 12px 0 rgba(34,197,94,0.10)' : undefined }}
                  >
                    {section.icon}
                    <span className="flex-1 text-left">{section.label}</span>
                    <span className={`ml-2 transition-transform duration-200 ${openAccordion === section.key ? 'rotate-90' : ''}`}>▶</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openAccordion === section.key ? 'max-h-40 py-3 px-5' : 'max-h-0 py-0 px-5'}`}
                    style={{ background: openAccordion === section.key ? 'linear-gradient(90deg, #d1fae5 0%, #f0fdfa 100%)' : undefined }}
                  >
                    {openAccordion === section.key && section.content(form, handleChange)}
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="mt-12 w-full py-6 rounded-2xl bg-white/60 text-gray-900 font-extrabold text-2xl shadow-lg border border-white/40 backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-200" style={{ boxShadow: '0 4px 32px 0 rgba(168,85,247,0.08)', border: '1.5px solid rgba(255,255,255,0.18)' }}>
              Continue
            </button>
          </form>
          {/* Health Facts & Tips Panel (keep at current size) */}
          <div className="md:w-[370px] w-full rounded-[2rem] bg-white/70 shadow-xl p-8 flex flex-col items-center min-h-[420px] justify-center border border-white/40" style={{ backdropFilter: 'blur(14px)', boxShadow: '0 4px 24px 0 rgba(168,85,247,0.06)' }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 via-purple-100 to-pink-100 flex items-center justify-center mb-7 shadow-lg" style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.10)' }}>
              <Info className="text-green-400" size={44} />
            </div>
            <div className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight" style={{ letterSpacing: '-0.01em' }}>Health Facts & Tips</div>
            <div className="w-full flex flex-col gap-5 mt-2">
              <div className="rounded-2xl bg-white/60 border border-white/40 shadow-md p-5 flex flex-col transition-all duration-200 hover:shadow-xl hover:bg-white/80 backdrop-blur-xl">
                <span className="font-semibold text-gray-800 mb-2 text-lg">🧬 How accurate is DNA-based nutrition?</span>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-500 tracking-wide shadow-sm">Science</span>
              </div>
              <div className="rounded-2xl bg-white/60 border border-white/40 shadow-md p-5 flex flex-col transition-all duration-200 hover:shadow-xl hover:bg-white/80 backdrop-blur-xl">
                <span className="font-semibold text-gray-800 mb-2 text-lg">⚡ What foods boost natural energy?</span>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-500 tracking-wide shadow-sm">Energy</span>
              </div>
              <div className="rounded-2xl bg-white/60 border border-white/40 shadow-md p-5 flex flex-col transition-all duration-200 hover:shadow-xl hover:bg-white/80 backdrop-blur-xl">
                <span className="font-semibold text-gray-800 mb-2 text-lg">😴 How does sleep affect nutrition?</span>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-pink-100 text-pink-400 tracking-wide shadow-sm">Sleep</span>
              </div>
              <div className="rounded-2xl bg-white/60 border border-white/40 shadow-md p-5 flex flex-col transition-all duration-200 hover:shadow-xl hover:bg-white/80 backdrop-blur-xl">
                <span className="font-semibold text-gray-800 mb-2 text-lg">🌱 What are adaptogenic foods?</span>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-400 tracking-wide shadow-sm">Nature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 