/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accommodation, FilterState } from './types';
import { INITIAL_ACCOMMODATIONS } from './data';
import Header from './components/Header';
import Catalog from './components/Catalog';
import DetailModal from './components/DetailModal';
import OwnerRegistration from './components/OwnerRegistration';
import AdminDashboard from './components/AdminDashboard';
import SheetSimulator from './components/SheetSimulator';
import Footer from './components/Footer';
import { Sparkles, MessageCircle, Info, ShieldCheck, MapPin } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'madagites_accommodations_data_2026';
const LANG_STORAGE_KEY = 'madagites_selected_language';

export default function App() {
  // State for accommodations
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"fr" | "en">('fr');

  // State for search/filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    region: 'Toutes les régions',
    maxPrice: 300000,
    sortBy: 'price-asc',
  });

  // Reference for focusing the search input
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Load language and accommodations data on mount
  useEffect(() => {
    // Language
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (storedLang === 'en' || storedLang === 'fr') {
      setCurrentLang(storedLang);
    }

    // Accommodations
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let loadedListings: Accommodation[] = [];
      if (stored) {
        loadedListings = JSON.parse(stored);
        // Automatically sync default items' photos with current INITIAL_ACCOMMODATIONS photos
        loadedListings = loadedListings.map((item) => {
          const original = INITIAL_ACCOMMODATIONS.find((orig) => orig.id === item.id);
          if (original && original.photo !== item.photo) {
            return { ...item, photo: original.photo };
          }
          return item;
        });
      } else {
        loadedListings = INITIAL_ACCOMMODATIONS;
      }

      // Automatically purge any expired publications on mount without notification
      const now = new Date();
      const activeListings = loadedListings.filter((item) => {
        if (!item.expiresAt) return true;
        return new Date(item.expiresAt) >= now;
      });

      setAccommodations(activeListings);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeListings));
    } catch (e) {
      console.error('Failed to load accommodations from localStorage', e);
      setAccommodations(INITIAL_ACCOMMODATIONS);
    }
  }, []);

  // Periodic automatic silent purge (runs every 4 seconds)
  useEffect(() => {
    if (accommodations.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const hasExpiredItems = accommodations.some(
        (item) => item.expiresAt && new Date(item.expiresAt) < now
      );

      if (hasExpiredItems) {
        const activeListings = accommodations.filter(
          (item) => !item.expiresAt || new Date(item.expiresAt) >= now
        );
        // Save silently without any popup or user interaction
        saveAccommodations(activeListings);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [accommodations]);

  // Language Change handler
  const handleLanguageChange = (lang: "fr" | "en") => {
    setCurrentLang(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  // Update localStorage when accommodations change
  const saveAccommodations = (newAccommodations: Accommodation[]) => {
    setAccommodations(newAccommodations);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAccommodations));
    } catch (e) {
      console.error('Failed to save accommodations to localStorage', e);
    }
  };

  // Handlers for mock database (SheetSimulator)
  const handleAddAccommodation = (newItem: Accommodation) => {
    const updated = [newItem, ...accommodations];
    saveAccommodations(updated);
  };

  const handleUpdateAccommodation = (updatedItem: Accommodation) => {
    const updated = accommodations.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveAccommodations(updated);
  };

  const handleDeleteAccommodation = (id: string) => {
    const updated = accommodations.filter((item) => item.id !== id);
    saveAccommodations(updated);
    if (selectedAccommodation?.id === id) {
      setSelectedAccommodation(null);
    }
  };

  const handleResetDatabase = () => {
    const confirmMsg = currentLang === 'en'
      ? "Do you want to reset the table to original Madagascar accommodations? Your custom changes will be lost."
      : "Voulez-vous réinitialiser le tableau aux hébergements d'origine de Madagascar ? Vos modifications personnalisées seront perdues.";
    if (confirm(confirmMsg)) {
      saveAccommodations(INITIAL_ACCOMMODATIONS);
    }
  };

  // Focus Search Input helper
  const handleFocusSearch = () => {
    const section = document.getElementById('catalog-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 450);
  };

  // Filtering Logic
  const filteredAccommodations = accommodations
    .filter((item) => {
      // 1. Search Query Match
      const searchLower = filters.searchQuery.toLowerCase().trim();
      const matchSearch =
        searchLower === '' ||
        item.name.toLowerCase().includes(searchLower) ||
        item.city.toLowerCase().includes(searchLower) ||
        item.region.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower);

      // 2. Type Match
      const matchType =
        filters.type === 'all' ||
        (filters.type === 'chambre' && item.type === "Chambre d'hôte") ||
        (filters.type === 'gite' && item.type === 'Gîte d\'étape');

      // 3. Region Match
      const matchRegion =
        filters.region === 'Toutes les régions' ||
        item.region === filters.region;

      // 4. Max Price Match (based on Ariary price)
      const matchPrice = item.priceAriary <= filters.maxPrice;

      // 5. Compliance & Status Check
      const isApproved = item.status === undefined || item.status === 'approved';
      const isExpired = item.expiresAt ? new Date(item.expiresAt) < new Date() : false;
      const matchStatus = isApproved && !isExpired;

      return matchSearch && matchType && matchRegion && matchPrice && matchStatus;
    })
    .sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'price-asc') {
        return a.priceAriary - b.priceAriary;
      }
      if (filters.sortBy === 'price-desc') {
        return b.priceAriary - a.priceAriary;
      }
      return a.name.localeCompare(b.name);
    });

  // Featured accommodations (displayed prominently in a mini section)
  const featuredAccommodations = accommodations.filter(item => {
    const isApproved = item.status === undefined || item.status === 'approved';
    const isExpired = item.expiresAt ? new Date(item.expiresAt) < new Date() : false;
    return item.isFeatured && isApproved && !isExpired;
  });

  // Stats counting
  const distinctRegions = new Set(accommodations.map(item => item.region)).size;

  return (
    <div className="min-h-screen bg-orange-50/10 text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Top Banner & Hero Section */}
      <Header
        totalCount={accommodations.length}
        featuredCount={featuredAccommodations.length}
        regionsCount={distinctRegions}
        onSearchFocus={handleFocusSearch}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Featured / Coup de Coeur Section */}
      {featuredAccommodations.length > 0 && (
        <section className="pt-20 pb-4 bg-orange-50/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6 animate-fadeIn">
              <span className="p-2 bg-orange-100 text-orange-600 rounded-2xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900">
                  {currentLang === 'en' ? "Our Top Picks in Madagascar" : "Nos Coups de Cœur à Madagascar"}
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  {currentLang === 'en'
                    ? "A hand-picked selection of lodgings highly recommended by travelers."
                    : "Une sélection d'hébergements hautement recommandés par les voyageurs."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAccommodations.slice(0, 3).map((item) => (
                <div
                  key={`feat-${item.id}`}
                  className="bg-white rounded-[24px] p-4 border border-orange-50 shadow-sm hover:shadow-md transition-all flex gap-4 items-center group cursor-pointer animate-fadeIn"
                  onClick={() => setSelectedAccommodation(item)}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-50/50 flex-shrink-0 relative">
                    <img
                      src={item.photo}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {currentLang === 'en' ? "★ Recommended" : "★ Recommandé"}
                    </span>
                    <h3 className="font-display font-semibold text-slate-900 text-base mt-1.5 group-hover:text-orange-500 transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      {item.city} • <span className="font-bold text-slate-700">{item.priceEuro} €{currentLang === 'en' ? '/night' : '/nuit'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog of Lodgings */}
      <Catalog
        accommodations={filteredAccommodations}
        filters={filters}
        onFilterChange={setFilters}
        onSelectAccommodation={setSelectedAccommodation}
        searchInputRef={searchInputRef}
        currentLang={currentLang}
      />

      {/* Concept Explanation / "Comment ça marche" Section */}
      <section id="how-it-works" className="py-16 bg-white border-t border-orange-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-slate-950 tracking-tight">
              {currentLang === 'en' ? "How does MadaGîtes work?" : "Comment fonctionne MadaGîtes ?"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-sans">
              {currentLang === 'en'
                ? "A direct digital link between travelers and local hosts across Madagascar."
                : "Un circuit court numérique entre les voyageurs et les hôtes locaux de la Grande Île."}
            </p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-3 animate-fadeIn">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                1
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                {currentLang === 'en' ? "Find Your Lodging" : "Trouvez votre Logement"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {currentLang === 'en'
                  ? "Explore our live-updated catalog. Use budget (Ariary/Euro) and region filters to locate your perfect stay."
                  : "Explorez notre catalogue mis à jour. Utilisez les filtres de budget (Ariary / Euro) et de région pour cibler votre gîte idéal."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3 animate-fadeIn">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                2
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                {currentLang === 'en' ? "Chat on WhatsApp" : "Discutez sur WhatsApp"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {currentLang === 'en'
                  ? "Click the green WhatsApp button. A pre-filled template message opens, connecting you instantly to the owner."
                  : "Cliquez sur le bouton vert WhatsApp. Un message pré-rempli s'ouvre, vous connectant instantanément au numéro réel du propriétaire."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-3 animate-fadeIn">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                3
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">
                {currentLang === 'en' ? "Zero Middlemen" : "Zéro Intermédiaire"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                {currentLang === 'en'
                  ? "Arrange dates and payments directly with the host. No middleman and zero commissions taken from local tourism."
                  : "Fixez les dates et le règlement en direct avec l'hôte. Aucun intermédiaire, aucune commission prélevée sur le tourisme malgache."}
              </p>
            </div>
          </div>

          <div className="mt-12 p-5 bg-sky-50 border border-sky-100 rounded-[28px] flex flex-col sm:flex-row items-center gap-4 shadow-sm animate-fadeIn">
            <div className="p-3 bg-sky-500 rounded-2xl text-white flex-shrink-0 shadow-md shadow-sky-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left font-sans">
              <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                {currentLang === 'en' ? "Solidarity & Sustainable Tourism" : "Tourisme Solidaire & Durable"}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentLang === 'en'
                  ? "By favoring direct communication on WhatsApp, you enable local lodge owners to save up to 20% in booking commissions compared to global corporations. 100% of your travel spend directly supports communities in Madagascar."
                  : "En favorisant le contact direct par WhatsApp, vous permettez aux gérants de gîtes locaux d'économiser jusqu'à 20% de commission par rapport aux grandes plateformes internationales. 100% de votre argent sert directement à soutenir les communautés locales malgaches."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Registration Form Section */}
      <OwnerRegistration
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddAccommodation={handleAddAccommodation}
        currentLang={currentLang}
      />

      {/* Admin Moderation Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        accommodations={accommodations}
        onUpdate={handleUpdateAccommodation}
        onDelete={handleDeleteAccommodation}
        currentLang={currentLang}
      />

      {/* Google Sheets Live Database Editor Section */}
      <SheetSimulator
        accommodations={accommodations}
        onAdd={handleAddAccommodation}
        onUpdate={handleUpdateAccommodation}
        onDelete={handleDeleteAccommodation}
        onReset={handleResetDatabase}
        currentLang={currentLang}
      />

      {/* Footer information */}
      <Footer
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        currentLang={currentLang}
      />

      {/* Selected Accommodation Detail Modal Pop-up */}
      <DetailModal
        item={selectedAccommodation}
        onClose={() => setSelectedAccommodation(null)}
        currentLang={currentLang}
      />

    </div>
  );
}
