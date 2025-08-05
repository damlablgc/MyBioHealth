import React from "react";
import { useUserInfo } from "../context/UserInfoContext";
import { motion } from "framer-motion";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "../context/UserInfoContext";

const DIAGNOSES_SUGGESTIONS: Record<string, string[]> = {
  diabetes: [
    "Monitor blood sugar regularly.",
    "Choose whole grains and high-fiber foods.",
    "Limit sugary snacks and drinks.",
    "Stay active with regular exercise.",
    "Consult your doctor about medication and checkups.",
  ],
  hypertension: [
    "Reduce salt intake.",
    "Eat plenty of fruits and vegetables.",
    "Maintain a healthy weight.",
    "Limit alcohol and avoid smoking.",
    "Monitor your blood pressure regularly.",
  ],
  anemia: [
    "Eat iron-rich foods (spinach, lentils, red meat).",
    "Pair iron with vitamin C for better absorption.",
    "Avoid tea/coffee with meals.",
    "Consider iron supplements if recommended by your doctor.",
  ],
  pcos: [
    "Choose low glycemic index foods.",
    "Eat regular, balanced meals.",
    "Prioritize fiber-rich vegetables.",
    "Exercise regularly to support hormone balance.",
  ],
  asthma: [
    "Avoid known triggers (dust, pollen, smoke).",
    "Take medications as prescribed.",
    "Maintain a healthy weight.",
    "Monitor symptoms and peak flow regularly.",
  ],
  hypothyroidism: [
    "Take thyroid medication as prescribed.",
    "Eat a balanced diet with enough iodine.",
    "Monitor thyroid levels regularly.",
    "Watch for symptoms like fatigue and weight changes.",
  ],
  celiac: [
    "Follow a strict gluten-free diet.",
    "Read food labels carefully.",
    "Consult a dietitian for balanced nutrition.",
    "Monitor for nutrient deficiencies.",
  ],
  migraine: [
    "Identify and avoid personal triggers.",
    "Maintain regular sleep and meal times.",
    "Stay hydrated.",
    "Consult your doctor for treatment options.",
  ],
};

export default function DiseaseDiagnosesSuggestionsPage() {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  const diagnoses = (userInfo as UserInfo)?.diagnoses || "";
  const diagnosisList = diagnoses
    .split(/,|;/)
    .map((d: string) => d.trim().toLowerCase())
    .filter(Boolean);

  const suggestions = diagnosisList.flatMap((diag: string) => DIAGNOSES_SUGGESTIONS[diag] || []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-pink-50 flex flex-col items-center justify-start py-8 px-2 font-sans overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-2xl rounded-3xl bg-white/90 shadow-xl p-8 flex flex-col items-center gap-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium mb-2 self-start"><ArrowLeft size={20}/> Back</button>
        <div className="flex items-center gap-3 mb-4">
          <Stethoscope className="text-green-500" size={32} />
          <h1 className="text-3xl font-bold text-center text-green-600">Disease Diagnoses Suggestions</h1>
        </div>
        {diagnosisList.length > 0 && (
          <div className="w-full mb-4">
            <div className="text-base text-gray-700 mb-1 font-semibold">Your Diagnoses:</div>
            <div className="flex flex-wrap gap-2">
              {diagnosisList.map((diag: string, idx: number) => (
                <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm capitalize">{diag}</span>
              ))}
            </div>
          </div>
        )}
        {diagnosisList.length === 0 ? (
          <div className="text-lg text-gray-600 text-center">No diagnoses entered. Please go back and enter your disease diagnoses for personalized suggestions.</div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-4">
              {diagnosisList.map((diag: string, idx: number) => (
                <div key={idx} className="rounded-xl bg-green-50 border border-green-100 shadow p-4 mb-2">
                  <div className="text-lg font-semibold text-green-700 mb-1 capitalize flex items-center gap-2"><Stethoscope className="text-green-400" size={18}/>{diag}</div>
                  <ul className="list-disc pl-5 text-green-900">
                    {(DIAGNOSES_SUGGESTIONS[diag] || ["No specific suggestions available."]).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {suggestions.length === 0 && (
              <div className="text-gray-500 text-center">No specific suggestions found for your diagnoses.</div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
} 