import React from 'react';
import { Palmtree, MapPin, Search, ChevronRight, Globe, Home } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface HeaderProps {
  totalCount: number;
  featuredCount: number;
  regionsCount: number;
  onSearchFocus: () => void;
  onRegisterClick: () => void;
  currentLang: "fr" | "en";
  onLanguageChange: (lang: "fr" | "en") => void;
  onAdminClick: () => void;
}

export default function Header({
  totalCount,
  featuredCount,
  regionsCount,
  onSearchFocus,
  onRegisterClick,
  currentLang,
  onLanguageChange,
  onAdminClick
}: HeaderProps) {
  const t = (key: any) => getTranslation(key, currentLang);

  return (
    <header className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background with decorative abstract elements to keep loading ultra-fast */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70"
          alt="Plage de Madagascar"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/80 to-stone-950"></div>
      </div>

      {/* Decorative colored blobs for tropical feel */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Top Nav Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 border-b border-white/10 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14l9-9 9 9" />
                <text
                  x="12"
                  y="20"
                  fontSize="8.5"
                  fontWeight="900"
                  fontFamily="Inter, system-ui, sans-serif"
                  textAnchor="middle"
                  fill="currentColor"
                  stroke="none"
                  letterSpacing="-0.2px"
                >
                  MG
                </text>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white block leading-none">
                Mada<span className="text-orange-400">Gîtes</span>
              </span>
              <span className="text-[10px] text-stone-300 font-sans tracking-wider uppercase block mt-1">
                {currentLang === "en" ? "B&Bs & Stopover Gites" : "Chambres d'hôtes & Gîtes"}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-stone-300 uppercase tracking-wider">
            <a href="#catalog-section" className="hover:text-orange-400 transition-colors">{t('discover')}</a>
            <a href="#how-it-works" className="hover:text-orange-400 transition-colors">{t('howItWorks')}</a>
            <button onClick={onRegisterClick} className="hover:text-orange-300 text-orange-400 transition-colors cursor-pointer text-left font-bold uppercase text-sm">{t('registerGite')}</button>
            <a href="#sheet-simulator-section" className="text-orange-400 bg-orange-950/60 border border-orange-800/50 px-3.5 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 hover:bg-orange-900/40 transition-all">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              {t('sheetSimulator')}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* AI Language Selector */}
            <div className="flex items-center gap-1 bg-stone-800/90 border border-stone-700/60 rounded-full p-1 shadow-inner">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentLang === 'fr' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-700/40'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentLang === 'en' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-700/40'
                }`}
                title="AI Automated Translation"
              >
                <span>EN</span>
                <span className="text-[8px] bg-sky-500/20 text-sky-400 px-1 rounded-md border border-sky-500/30 font-mono tracking-normal">
                  AI
                </span>
              </button>
            </div>

            <button
              onClick={onAdminClick}
              className="px-3.5 py-2 bg-stone-850 hover:bg-stone-700/85 border border-stone-700/60 text-orange-400 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title={currentLang === 'en' ? "Open Admin Moderation Portal" : "Ouvrir l'Espace Administration"}
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">{currentLang === 'en' ? "Admin Portal" : "Admin"}</span>
              <span className="sm:hidden">🛠️</span>
            </button>

            <a
              href="#catalog-section"
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
            >
              {t('book')}
            </a>
          </div>
        </div>

        {/* Hero Body Content */}
        <div className="relative z-10 pt-12 pb-16 md:py-24 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50/10 border border-orange-500/30 text-orange-300 text-xs font-semibold rounded-full mb-6">
            <MapPin className="w-3.5 h-3.5 animate-pulse" />
            {t('heroBadge')}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white mb-6 leading-tight">
            {t('heroTitlePre')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 underline decoration-sky-300">{t('heroTitleSpan')}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 mb-8 leading-relaxed font-sans">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <button
              onClick={onSearchFocus}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-orange-500" />
              {t('findStay')}
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl transition-all border border-white/10"
            >
              {t('howToRegisterBtn')}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats Grid Container */}
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 bg-stone-900/90 backdrop-blur border border-white/10 p-4 sm:p-6 rounded-2xl -mb-10 shadow-xl">
          <div className="text-center border-r border-white/10">
            <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-orange-400">
              {totalCount}
            </span>
            <span className="block text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider mt-1">
              {currentLang === "en" ? "Lodgings Available" : "Logements Dispos"}
            </span>
          </div>
          <div className="text-center border-r border-white/10">
            <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-sky-400">
              {regionsCount}
            </span>
            <span className="block text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider mt-1">
              {currentLang === "en" ? "Key Regions" : "Régions Clés"}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
              0%
            </span>
            <span className="block text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider mt-1">
              {currentLang === "en" ? "Service Fee" : "Frais / Commission"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

