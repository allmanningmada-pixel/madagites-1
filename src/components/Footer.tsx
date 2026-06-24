import React from 'react';
import { Palmtree, ArrowUp, Heart } from 'lucide-react';

interface FooterProps {
  onRegisterClick: () => void;
}

export default function Footer({ onRegisterClick }: FooterProps) {
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
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl font-display shadow-md shadow-orange-500/20">
              M
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white block">
                Mada<span className="text-orange-400">Gîtes</span>
              </span>
              <span className="text-[9px] text-stone-500 font-sans tracking-wider uppercase block mt-0.5">
                Chambres d'hôtes & Gîtes
              </span>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed max-w-xs">
            Le portail solidaire des chambres d'hôtes et gîtes d'étapes authentiques à Madagascar. Faciliter le tourisme local en éliminant les intermédiaires coûteux.
          </p>
        </div>

        {/* Charte Ethique Column */}
        <div className="space-y-3">
          <h4 className="text-stone-200 font-bold text-xs uppercase tracking-wider font-display">Charte de Confiance</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span><strong>Zéro frais caché :</strong> Vous discutez et payez directement le propriétaire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span><strong>Économie locale :</strong> 100% des revenus de votre séjour reviennent aux habitants de la Grande Île.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400">✓</span>
              <span><strong>Flexibilité :</strong> Conditions d'annulation et détails d'arrivée arrangés par message WhatsApp direct.</span>
            </li>
          </ul>
        </div>

        {/* Info Dev / Sheets Column */}
        <div className="space-y-3">
          <h4 className="text-stone-200 font-bold text-xs uppercase tracking-wider font-display">Simplicité d'administration</h4>
          <p className="text-stone-400 text-xs leading-relaxed">
            Grâce à notre intégration avec Google Sheets, les propriétaires locaux peuvent mettre à jour leurs tarifs, disponibilités, et photos sans aucune connaissance technique, simplement depuis leur téléphone via l'application Google Sheets.
          </p>
          <div className="pt-2 flex flex-col gap-1.5">
            <a
              href="#sheet-simulator-section"
              className="text-orange-400 font-mono text-[11px] underline hover:text-orange-300 transition-colors"
            >
              Voir le simulateur Google Sheets →
            </a>
            <button
              onClick={onRegisterClick}
              className="text-orange-400 font-mono text-[11px] underline hover:text-orange-300 transition-colors text-left cursor-pointer"
            >
              S'inscrire comme propriétaire →
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-stone-500 text-center sm:text-left">
          © {new Date().getFullYear()} MadaGîtes • Fait avec <Heart className="w-3 h-3 text-red-500 inline fill-current" /> pour Madagascar • Tous droits réservés.
        </p>

        <button
          onClick={handleScrollToTop}
          className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 font-semibold text-xs shadow-md border border-stone-700/50"
        >
          <span>Retour en haut</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

    </footer>
  );
}

