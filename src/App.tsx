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
import SheetSimulator from './components/SheetSimulator';
import Footer from './components/Footer';
import { Sparkles, MessageCircle, Info, ShieldCheck, MapPin } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'madagites_accommodations_data_2026';

export default function App() {
  // State for accommodations
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

  // Load initial data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setAccommodations(JSON.parse(stored));
      } else {
        setAccommodations(INITIAL_ACCOMMODATIONS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ACCOMMODATIONS));
      }
    } catch (e) {
      console.error('Failed to load accommodations from localStorage', e);
      setAccommodations(INITIAL_ACCOMMODATIONS);
    }
  }, []);

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
    if (confirm('Voulez-vous réinitialiser le tableau aux hébergements d\'origine de Madagascar ? Vos modifications personnalisées seront perdues.')) {
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

      return matchSearch && matchType && matchRegion && matchPrice;
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
  const featuredAccommodations = accommodations.filter(item => item.isFeatured);

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
      />

      {/* Featured / Coup de Coeur Section (Horizontal scrolling list on mobile, grid on desktop) */}
      {featuredAccommodations.length > 0 && (
        <section className="pt-20 pb-4 bg-orange-50/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="p-2 bg-orange-100 text-orange-600 rounded-2xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900">Nos Coups de Cœur à Madagascar</h2>
                <p className="text-xs text-slate-500">Une sélection d'hébergements hautement recommandés par les voyageurs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAccommodations.slice(0, 3).map((item) => (
                <div
                  key={`feat-${item.id}`}
                  className="bg-white rounded-[24px] p-4 border border-orange-50 shadow-sm hover:shadow-md transition-all flex gap-4 items-center group cursor-pointer"
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
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ★ Recommandé
                    </span>
                    <h3 className="font-display font-semibold text-slate-900 text-base mt-1.5 group-hover:text-orange-500 transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      {item.city} • <span className="font-bold text-slate-700">{item.priceEuro} €/nuit</span>
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
      />

      {/* Concept Explanation / "Comment ça marche" Section */}
      <section id="how-it-works" className="py-16 bg-white border-t border-orange-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-slate-950 tracking-tight">
              Comment fonctionne MadaGîtes ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Un circuit court numérique entre les voyageurs et les hôtes locaux de la Grande Île.
            </p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                1
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">Trouvez votre Logement</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Explorez notre catalogue mis à jour. Utilisez les filtres de budget (Ariary / Euro) et de région pour cibler votre gîte idéal.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                2
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">Discutez sur WhatsApp</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Cliquez sur le bouton vert WhatsApp. Un message pré-rempli s'ouvre, vous connectant instantanément au numéro réel du propriétaire.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-display font-bold text-lg border border-orange-100 shadow-sm">
                3
              </div>
              <h3 className="font-display font-semibold text-slate-900 text-base">Zéro Intermédiaire</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Fixez les dates et le règlement en direct avec l'hôte. Aucun intermédiaire, aucune commission prélevée sur le tourisme malgache.
              </p>
            </div>
          </div>

          <div className="mt-12 p-5 bg-sky-50 border border-sky-100 rounded-[28px] flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="p-3 bg-sky-500 rounded-2xl text-white flex-shrink-0 shadow-md shadow-sky-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">Tourisme Solidaire & Durable</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                En favorisant le contact direct par WhatsApp, vous permettez aux gérants de gîtes locaux d'économiser jusqu'à 20% de commission par rapport aux grandes plateformes internationales. 100% de votre argent sert directement à soutenir les communautés locales malgaches.
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
      />

      {/* Google Sheets Live Database Editor Section */}
      <SheetSimulator
        accommodations={accommodations}
        onAdd={handleAddAccommodation}
        onUpdate={handleUpdateAccommodation}
        onDelete={handleDeleteAccommodation}
        onReset={handleResetDatabase}
      />

      {/* Footer information */}
      <Footer onRegisterClick={() => setIsRegisterModalOpen(true)} />

      {/* Selected Accommodation Detail Modal Pop-up */}
      <DetailModal
        item={selectedAccommodation}
        onClose={() => setSelectedAccommodation(null)}
      />

    </div>
  );
}
