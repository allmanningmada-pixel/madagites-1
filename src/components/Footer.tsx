import React from 'react';
import { Palmtree, ArrowUp, Heart, Home } from 'lucide-react';

interface FooterProps {
  onRegisterClick: () => void;
  currentLang: "fr" | "en";
}

export default function Footer({ onRegisterClick, currentLang }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs sm:text-sm">
      
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-800">
        
        {/* Brand Column */}
        <div className="space-y-4">
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
              <span className="font-display font-bold text-base tracking-tight text-white block">
                Mada<span className="text-orange-400">Gîtes</span>
              </span>
              <span className="text-[9px] text-stone-500 font-sans tracking-wider uppercase block mt-0.5">
                {currentLang === 'en' ? "B&Bs & Stopover Gites" : "Chambres d'hôtes & Gîtes"}
              </span>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed max-w-xs font-sans">
            {currentLang === 'en' 
              ? "The solidarity gateway to authentic bed & breakfasts and stopover gites in Madagascar. Facilitating local tourism by eliminating costly intermediaries."
              : "Le portail solidaire des chambres d'hôtes et gîtes d'étapes authentiques à Madagascar. Faciliter le tourisme local en éliminant les intermédiaires coûteux."}
          </p>
        </div>

        {/* Charte Ethique Column */}
        <div className="space-y-3">
          <h4 className="text-stone-200 font-bold text-xs uppercase tracking-wider font-display">
            {currentLang === 'en' ? "Trust Charter" : "Charte de Confiance"}
          </h4>
          <ul className="space-y-2 text-xs font-sans">
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span>
                {currentLang === 'en' ? (
                  <><strong>Zero hidden fees:</strong> Chat with and pay the owner directly.</>
                ) : (
                  <><strong>Zéro frais caché :</strong> Vous discutez et payez directement le propriétaire.</>
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span>
                {currentLang === 'en' ? (
                  <><strong>Local economy:</strong> 100% of your stay's income goes directly to local residents.</>
                ) : (
                  <><strong>Économie locale :</strong> 100% des revenus de votre séjour reviennent aux habitants de la Grande Île.</>
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span>
                {currentLang === 'en' ? (
                  <><strong>Flexibility:</strong> Custom cancellation and arrival details arranged by direct WhatsApp.</>
                ) : (
                  <><strong>Flexibilité :</strong> Conditions d'annulation et détails d'arrivée arrangés par message WhatsApp direct.</>
                )}
              </span>
            </li>
          </ul>
        </div>

        {/* Info Dev / Sheets Column */}
        <div className="space-y-3">
          <h4 className="text-stone-200 font-bold text-xs uppercase tracking-wider font-display">
            {currentLang === 'en' ? "Easy Administration" : "Simplicité d'administration"}
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed font-sans">
            {currentLang === 'en'
              ? "With our Google Sheets backend, local owners can update rates, availability, and upload photos instantly from their smartphone, without any technical experience required."
              : "Grâce à notre intégration avec Google Sheets, les propriétaires locaux peuvent mettre à jour leurs tarifs, disponibilités, et photos sans aucune connaissance technique, simplement depuis leur téléphone via l'application Google Sheets."}
          </p>
          <div className="pt-2 flex flex-col gap-1.5">
            <a
              href="#sheet-simulator-section"
              className="text-orange-400 font-mono text-[11px] underline hover:text-orange-300 transition-colors"
            >
              {currentLang === 'en' ? "Open Google Sheets Simulator →" : "Voir le simulateur Google Sheets →"}
            </a>
            <button
              onClick={onRegisterClick}
              className="text-orange-400 font-mono text-[11px] underline hover:text-orange-300 transition-colors text-left cursor-pointer"
            >
              {currentLang === 'en' ? "Register as an owner →" : "S'inscrire comme propriétaire →"}
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-stone-500 text-center sm:text-left">
          {currentLang === 'en' ? (
            <>© {new Date().getFullYear()} MadaGîtes • Made with <Heart className="w-3 h-3 text-red-500 inline fill-current" /> for Madagascar • All rights reserved.</>
          ) : (
            <>© {new Date().getFullYear()} MadaGîtes • Fait avec <Heart className="w-3 h-3 text-red-500 inline fill-current" /> pour Madagascar • Tous droits réservés.</>
          )}
        </p>

        <button
          onClick={handleScrollToTop}
          className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 font-semibold text-xs shadow-md border border-stone-700/50 cursor-pointer"
        >
          <span>{currentLang === 'en' ? "Back to top" : "Retour en haut"}</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

    </footer>
  );
}
