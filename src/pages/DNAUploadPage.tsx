import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserInfo } from "../context/UserInfoContext";

const DNAUploader: React.FC<{ onUpload: (file: File) => void; uploading: boolean; file: File | null }> = ({ onUpload, uploading, file }) => {
  const [dragActive, setDragActive] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1200);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1200);
    }
  };
  return (
    <motion.label
      tabIndex={0}
      htmlFor="dna-upload"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring' }}
      className={`w-full flex flex-col items-center px-6 py-8 bg-gradient-to-tr from-purple-50 to-pink-50 text-purple-600 rounded-xl shadow-xl border-dashed border-2 transition-all duration-300
        ${dragActive ? "border-purple-400 bg-purple-100 scale-105" : "border-purple-300"}
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 hover:shadow-2xl hover:scale-105`}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
      aria-label="Drag and drop your DNA file here or click to select"
    >
      <motion.svg
        className="w-10 h-10 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
        animate={{ rotate: dragActive ? 20 : 0, scale: dragActive ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </motion.svg>
      <span className="text-lg font-bold leading-normal mb-2 text-purple-700">
        {file ? "Change file" : "Select or drag a DNA file (.txt, .csv, .vcf)"}
      </span>
      <div className="text-xs text-purple-600 font-medium px-2 py-1 rounded-full bg-purple-100/60 border border-purple-200/40 mb-2">
        Demo Mode
      </div>
      <input
        id="dna-upload"
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".txt,.csv,.vcf"
      />
      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="mt-4 flex flex-col items-center"
          >
            <span className="text-green-500 text-3xl">✔</span>
            <span className="text-green-600 font-bold mt-1">Uploaded!</span>
          </motion.div>
        )}
      </AnimatePresence>
      {file && !showCheck && (
        <div className="mt-4 w-full max-w-xs text-center">
          <div className="text-sm text-gray-700 font-medium">{file.name}</div>
          <div className="text-xs text-gray-400 mb-2">✔ Uploaded</div>
        </div>
      )}
    </motion.label>
  );
};

const SkipButton: React.FC<{ onSkip: () => void }> = ({ onSkip }) => (
  <button
    onClick={onSkip}
    className="w-full mt-8 py-3 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 font-semibold rounded-xl shadow hover:from-purple-300 hover:to-pink-300 transition text-lg"
  >
    Skip DNA Upload
  </button>
);

const ProfileSummary: React.FC = () => {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  if (!userInfo) return null;
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="rounded-3xl bg-white/70 shadow-xl p-8 flex flex-col items-center border border-white/40 backdrop-blur-xl">
        <div className="text-2xl font-bold text-gray-900 mb-2">Your Health Profile</div>
        <div className="text-base text-gray-600 mb-4 text-center">Review your info before uploading DNA</div>
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
        <button onClick={() => navigate("/")} className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-green-100 to-pink-100 text-gray-800 font-semibold shadow hover:from-green-200 hover:to-pink-200 transition">Back to Profile</button>
      </div>
    </div>
  );
};

const DNAUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (f: File) => {
    setUploading(true);
    setFile(f);
    setTimeout(() => {
      setUploading(false);
    }, 1000);
  };

  const handleContinue = () => {
    navigate("/results", { state: { dnaUploaded: !!file, dnaFileName: file?.name } });
  };

  const handleSkip = () => {
    navigate("/results", { state: { dnaUploaded: false } });
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 flex items-center justify-center overflow-auto animate-gradient-move">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-xl bg-white/80 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-white/40 backdrop-blur-xl"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-4 text-center tracking-tight">Upload Your DNA Data</h1>
        <p className="text-lg text-gray-700 mb-6 text-center font-semibold">Get personalized nutrition and fitness insights based on your unique DNA.</p>
        <DNAUploader onUpload={handleUpload} uploading={uploading} file={file} />
        <div className="flex flex-col md:flex-row gap-4 w-full mt-8">
          <button
            onClick={handleContinue}
            disabled={!file || uploading}
            className={`flex-1 py-4 rounded-xl text-lg font-bold shadow transition-all duration-200 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 ${file ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:scale-105 hover:shadow-xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Continue
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow border border-purple-100 hover:from-purple-200 hover:to-pink-200 hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Skip DNA Upload
          </button>
        </div>
      </motion.div>
      <style>{`
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default DNAUploadPage; 