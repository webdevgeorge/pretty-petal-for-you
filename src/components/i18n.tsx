"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Copy, type Lang } from "./dictionary";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Copy };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is the default (main market); visitors can flip to French.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pp-lang");
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("pp-lang", l);
    } catch {
      /* storage may be unavailable — not worth breaking the toggle over */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
