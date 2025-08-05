import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserInfoPage from "./pages/UserInfoPage";
import ResultsPage from "./pages/ResultsPage";
import DNAUploadPage from "./pages/DNAUploadPage";
import DiseaseDiagnosesSuggestionsPage from "./pages/DiseaseDiagnosesSuggestionsPage";
import { UserInfoProvider } from "./context/UserInfoContext";

export default function App() {
  return (
    <UserInfoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserInfoPage />} />
          <Route path="/dna-upload" element={<DNAUploadPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/diagnoses-suggestions" element={<DiseaseDiagnosesSuggestionsPage />} />
        </Routes>
      </BrowserRouter>
    </UserInfoProvider>
  );
} 
