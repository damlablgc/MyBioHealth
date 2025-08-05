import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const UploadCard: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate upload progress
  const simulateUpload = () => {
    setProgress(0);
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      setProgress(val);
      if (val >= 100) clearInterval(interval);
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      simulateUpload();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      simulateUpload();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-3xl bg-white/80 rounded-2xl shadow-md p-6 mb-6 flex flex-col items-center"
      aria-label="Upload your genetic data"
    >
      <h3 className="text-lg font-semibold mb-2">Upload Your Genetic Data</h3>
      <p className="text-gray-500 mb-4 text-center">Supported: .txt, .csv, .vcf</p>
      <motion.label
        tabIndex={0}
        htmlFor="file-upload"
        className={`w-full flex flex-col items-center px-4 py-6 bg-gradient-to-tr from-purple-50 to-pink-50 text-purple-600 rounded-lg shadow-md tracking-wide uppercase border-2 border-dashed transition
          ${dragActive ? "border-purple-400 bg-purple-100" : "border-purple-200"}
          cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400`}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        aria-label="Drag and drop your file here or click to select"
      >
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
        </svg>
        <span className="text-base leading-normal">
          {file ? "Change file" : "Select or drag a file"}
        </span>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleChange}
          accept=".txt,.csv,.vcf"
        />
      </motion.label>
      {file && (
        <div className="mt-4 w-full max-w-xs text-center">
          <div className="text-sm text-gray-700 font-medium">{file.name}</div>
          <div className="text-xs text-gray-400 mb-2">{file.type || "Unknown type"}</div>
          <motion.div
            className="h-2 rounded bg-purple-100 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-2 bg-gradient-to-r from-purple-400 to-pink-300 rounded"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          {progress === 100 && (
            <div className="text-green-600 font-semibold mt-2">Upload complete!</div>
          )}
        </div>
      )}
    </motion.section>
  );
};

export default UploadCard; 