import React, { useEffect, useId } from 'react';
import { Accommodation } from '../types';
import { X, Check, Phone, Users, MapPin, Compass } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface DetailModalProps {
  item: Accommodation | null;
  onClose: () => void;
  currentLang: "fr" | "en";
  exchangeRate?: number;
}

export default function DetailModal({ item, onClose, currentLang, exchangeRate = 4500 }: DetailModalProps) {
  const titleId = useId();
  const t = (key: any) => getTranslation(key, currentLang);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  // Format WhatsApp Link
  const cleanPhone = item.whatsappNumber.replace(/\D/g, '');
  
  const greetingText = currentLang === 'en'
    ? `Hello! I am contacting you from the MadaGîtes website regarding the accommodation "${item.name}" in ${item.city}. Is it available for a stay soon? Thank you!`
    : `Bonjour ! Je vous contacte depuis le site vitrine MadaGîtes concernant le logement "${item.name}" à ${item.city}. Est-il disponible pour un séjour prochainement ? Merci !`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greetingText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleUp border border-orange-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Image */}
        <div className="relative h-56 sm:h-72 bg-orange-50/20 flex-shrink-0">
          <img
            src={item.photo}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-orange-100 hover:text-orange-600 text-slate-500 rounded-full flex items-center justify-center transition-all focus:outline-none shadow-sm cursor-pointer"
            aria-label={t('modalClose')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Info Overlays */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm ${
              item.type === "Chambre d'hôte" ? 'bg-sky-500' : 'bg-orange-500'
            }`}>
              {item.type === "Chambre d'hôte" ? t('bedBreakfast') : t('stopoverGite')}
            </span>
            <h2 id={titleId} className="text-2xl sm:text-3xl font-display font-semibold tracking-tight leading-tight">{item.name}</h2>
            <p className="text-xs text-orange-200 mt-1.5 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              {item.city}, {item.region} (Madagascar)
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl text-center">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('capacityMetric')}</span>
              <span className="text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 mt-1 font-display">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                {item.capacity}
              </span>
            </div>
            <div className="border-l border-r border-orange-100">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('priceMetric')}</span>
              <span className="text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-0.5 mt-1 font-mono">
                {item.priceAriary.toLocaleString()} Ar
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('dollarMetric')}</span>
              <span className="text-orange-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-0.5 mt-1 font-mono">
                ~{Math.round(item.priceAriary / exchangeRate)} $
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('descriptionHeader')}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>

          {/* Location details */}
          {item.locationDetails && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('locationHeader')}</h3>
              <div className="flex gap-2 p-3 bg-sky-50/40 border border-sky-100 rounded-2xl">
                <Compass className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-normal">
                  {item.locationDetails}
                </p>
              </div>
            </div>
          )}

          {/* Amenities & Equipments */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t('amenitiesHeader')}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {item.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
                  <span className="p-1 bg-orange-50 text-orange-600 rounded-md">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-orange-50/30 border border-orange-100 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-700 mb-2 font-display">
              {currentLang === 'en' ? "Direct Host Contact" : "Contact Direct Propriétaire"}
            </h4>
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-mono font-bold text-slate-700">
                <Phone className="w-4 h-4 text-orange-400" />
                {item.whatsappNumber}
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full font-bold">
                {currentLang === 'en' ? "WhatsApp Available" : "WhatsApp Disponible"}
              </span>
            </div>
          </div>

        </div>

        {/* Footer WhatsApp Button */}
        <div className="p-6 border-t border-orange-100 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between flex-shrink-0">
          <div className="text-center sm:text-left">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('directContactSub')}</span>
            <span className="text-xs text-slate-600 font-bold">
              {currentLang === 'en' ? "Book direct with zero commission fees" : "Transaction directe avec l'hôte local"}
            </span>
          </div>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-2xl shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            {t('contactOwner')}
          </a>
        </div>

      </div>
    </div>
  );
}
