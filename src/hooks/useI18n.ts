
import { useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  'welcome': {
    pt: 'Bem-vindo',
    en: 'Welcome',
    es: 'Bienvenido'
  },
  'chat': {
    pt: 'Chat',
    en: 'Chat',
    es: 'Chat'
  },
  'flashcards': {
    pt: 'Flashcards',
    en: 'Flashcards',
    es: 'Tarjetas'
  },
  'study_plan': {
    pt: 'Plano de Estudo',
    en: 'Study Plan',
    es: 'Plan de Estudio'
  },
  'knowledge_map': {
    pt: 'Mapa de Conhecimento',
    en: 'Knowledge Map',
    es: 'Mapa de Conocimiento'
  },
  'level': {
    pt: 'Nível',
    en: 'Level',
    es: 'Nivel'
  },
  'xp': {
    pt: 'XP',
    en: 'XP',
    es: 'XP'
  },
  'badges': {
    pt: 'Conquistas',
    en: 'Achievements',
    es: 'Logros'
  },
  'dark_mode': {
    pt: 'Modo Escuro',
    en: 'Dark Mode',
    es: 'Modo Oscuro'
  },
  'language': {
    pt: 'Idioma',
    en: 'Language',
    es: 'Idioma'
  },
  'transparency': {
    pt: 'Transparência',
    en: 'Transparency',
    es: 'Transparencia'
  },
  'ai_reasoning': {
    pt: 'Raciocínio da IA',
    en: 'AI Reasoning',
    es: 'Razonamiento de IA'
  }
};

export const useI18n = () => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return { language, changeLanguage, t };
};
