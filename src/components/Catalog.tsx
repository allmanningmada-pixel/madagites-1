import React, { useId } from 'react';
import { Accommodation, FilterState, AccommodationTypeFilter } from '../types';
import { AVAILABLE_REGIONS } from '../data';
import { Search, MapPin, SlidersHorizontal, Users, ArrowUpDown } from 'lucide-react';
import { getTranslation } from '../lib/translations';

interface CatalogProps {
  accommodations: Accommodation[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSelectAccommodation: (item: Accommodation) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  currentLang: "fr" | "en";
}

export default function Catalog({
  accommodations,
  filters,
  onFilterChange,
  onSelectAccommodation,
  searchInputRef,
  currentLang
}: CatalogProps) {
  const searchId = useId();
  const typeId = useId();
  const regionId = useId();
  const priceId = useId();
  const sortId = useId();

  const t = (key: any) => getTranslation(key, currentLang);

  // Handle various filter field changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleTypeChange = (type: AccommodationTypeFilter) => {
    onFilterChange({ ...filters, type });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, region: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  // Find max price for default range slider limits
  const absMaxPrice = accommodations.reduce((max, item) => Math.max(max, item.priceAriary), 200000);

  return (
    <section id="catalog-section" className="py-16 bg-orange-50/40">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl font-display font-semibold text-slate-900 tracking-tight">
            {t('catalogTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            {t('catalogSub')}
          </p>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-orange-100 rounded-[32px] p-5 md:p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>{t('filtersTitle')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="space-y-1">
              <label htmlFor={searchId} className="block text-xs font-bold text-slate-500">{t('searchLabel')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id={searchId}
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-50 border border-orange-50 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Region Dropdown */}
            <div className="space-y-1">
              <label htmlFor={regionId} className="block text-xs font-bold text-slate-500">{t('regionLabel')}</label>
              <select
                id={regionId}
                value={filters.region}
                onChange={handleRegionChange}
                className="w-full bg-slate-50 border border-orange-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800"
              >
                {AVAILABLE_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region === 'Toutes les régions' && currentLang === 'en' ? t('allRegions') : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <label htmlFor={priceId}>{t('priceMaxLabel')}</label>
                <span className="text-orange-600 font-semibold font-mono">
                  {filters.maxPrice.toLocaleString()} Ar (~{Math.round(filters.maxPrice / 4500)}€)
                </span>
              </div>
              <input
                id={priceId}
                type="range"
                min="50000"
                max={absMaxPrice}
                step="5000"
                value={filters.maxPrice}
                onChange={handlePriceChange}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="space-y-1">
              <label htmlFor={sortId} className="block text-xs font-bold text-slate-500">{t('sortByLabel')}</label>
              <div className="relative">
                <ArrowUpDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  id={sortId}
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-slate-50 border border-orange-50 rounded-xl pl-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 appearance-none"
                >
                  <option value="price-asc">{t('sortByPriceAsc')}</option>
                  <option value="price-desc">{t('sortByPriceDesc')}</option>
                  <option value="name">{t('sortByName')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accommodation Type Toggle Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div id={typeId} className="flex gap-2 p-1 bg-slate-150 rounded-xl">
              {(['all', 'chambre', 'gite'] as const).map((tType) => (
                <button
                  key={tType}
                  type="button"
                  onClick={() => handleTypeChange(tType)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filters.type === tType
                      ? 'bg-orange-500 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-orange-500'
                  }`}
                >
                  {tType === 'all' && t('allAccommodations')}
                  {tType === 'chambre' && t('bedBreakfast')}
                  {tType === 'gite' && t('stopoverGite')}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              {currentLang === "en" ? (
                <>Showing <span className="text-slate-800 font-bold font-mono">{accommodations.length}</span> lodging(s)</>
              ) : (
                <>Affichage de <span className="text-slate-800 font-bold font-mono">{accommodations.length}</span> logement(s)</>
              )}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {accommodations.length === 0 && (
          <div className="text-center py-16 bg-white border border-orange-100 rounded-[32px] p-8 max-w-md mx-auto shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-slate-800 text-lg">{t('noResultsTitle')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('noResultsSub')}
            </p>
          </div>
        )}

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {accommodations.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-orange-50 rounded-[32px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full cursor-pointer"
              onClick={() => onSelectAccommodation(item)}
            >
              {/* Image & Badge Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-orange-50/55">
                <img
                  src={item.photo}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Type Badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${
                  item.type === "Chambre d'hôte"
                    ? 'bg-sky-500 text-white'
                    : 'bg-orange-500 text-white'
                }`}>
                  {item.type === "Chambre d'hôte" ? t('bedBreakfast') : t('stopoverGite')}
                </span>

                {/* Region Badge */}
                <span className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur text-white px-3 py-1 text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {item.city}
                </span>

                {/* Price tag */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-2xl text-right shadow-md">
                  <span className="block text-xs font-bold leading-none font-mono">
                    {item.priceAriary.toLocaleString()} Ar
                  </span>
                  <span className="text-[10px] text-orange-200 font-semibold font-mono leading-none mt-0.5 block">
                    ~{item.priceEuro}€ {t('perNight')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sky-500 font-bold text-[10px] uppercase tracking-widest">{item.city}</span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {item.capacity}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-slate-800 text-xl group-hover:text-orange-500 transition-colors line-clamp-1 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                    {currentLang === "en" ? "Region: " : "Région : "}{item.region}
                  </span>
                  
                  <span className="text-orange-500 text-xs font-bold flex items-center gap-1">
                    {t('viewDetails')}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
