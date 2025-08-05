import React, { createContext, useContext, useState } from "react";

export type UserInfo = {
  name: string;
  age: number | "";
  gender: "Male" | "Female" | "Other";
  weight: number | "";
  height: number | "";
  allergies: string[];
  conditions: string;
  lastPeriod?: string;
  menstrualPhase?: string;
  diagnoses?: string;
  menstrualCycle?: string;
  activityLevel?: string;
  dietaryPreferences?: string;
};

type UserInfoContextType = {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
};

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const useUserInfo = () => {
  const ctx = useContext(UserInfoContext);
  if (!ctx) throw new Error("useUserInfo must be used within UserInfoProvider");
  return ctx;
};

export const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}; 