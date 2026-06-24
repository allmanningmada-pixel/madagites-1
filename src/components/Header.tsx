import React from 'react';
import { Palmtree, MapPin, Search, ChevronRight } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  featuredCount: number;
  regionsCount: number;
  onSearchFocus: () => void;
}

export default function Header({
  totalCount,
  featuredCount,
  regionsCount,
  onSearchFocus
}: HeaderProps) {
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
        <div className="flex items-center justify-between py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl font-display shadow-md shadow-orange-500/20">
              M
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white block leading-none">
                Mada<span className="text-orange-400">Gîtes</span>
              </span>
              <span className="text-[10px] text-stone-300 font-sans tracking-wider uppercase block mt-1">
                Chambres d'hôtes & Gîtes
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-stone-300 uppercase tracking-wider">
            <a href="#catalog-section" className="hover:text-orange-400 transition-colors">Découvrir les Logements</a>
            <a href="#how-it-works" className="hover:text-orange-400 transition-colors">Comment ça marche ?</a>
            <a href="#sheet-simulator-section" className="text-orange-400 bg-orange-950/60 border border-orange-800/50 px-3.5 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 hover:bg-orange-900/40 transition-all">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              Simulateur Google Sheets
            </a>
          </nav>

          <a
            href="#catalog-section"
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
          >
            Réserver
          </a>
        </div>

        {/* Hero Body Content */}
        <div className="relative z-10 pt-12 pb-16 md:py-24 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold rounded-full mb-6">
            <MapPin className="w-3.5 h-3.5" />
            Séjours Authentiques à Madagascar
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white mb-6 leading-tight">
            Séjours d'exception à <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 underline decoration-sky-300">Madagascar</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 mb-8 leading-relaxed font-sans">
            Trouvez des hébergements locaux d'exception, du bungalow les pieds dans l'eau aux gîtes d'étapes pour randonneurs. Connectez-vous directement avec les propriétaires locaux sans commission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <button
              onClick={onSearchFocus}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <Search className="w-4 h-4 text-orange-500" />
              Rechercher un logement
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl transition-all border border-white/10"
            >
              Comment ça marche
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
              Logements Dispos
            </span>
          </div>
          <div className="text-center border-r border-white/10">
            <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-sky-400">
              {regionsCount}
            </span>
            <span className="block text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider mt-1">
              Régions Clés
            </span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
              0%
            </span>
            <span className="block text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider mt-1">
              Frais / Commission
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

