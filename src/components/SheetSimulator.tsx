import React, { useState } from 'react';
import { Accommodation } from '../types';
import { ALL_AMENITIES_OPTIONS, AVAILABLE_REGIONS } from '../data';
import { Plus, Trash2, Edit2, Check, X, FileSpreadsheet, RefreshCw, Layers } from 'lucide-react';

interface SheetSimulatorProps {
  accommodations: Accommodation[];
  onAdd: (item: Accommodation) => void;
  onUpdate: (item: Accommodation) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  currentLang: "fr" | "en";
}

export default function SheetSimulator({
  accommodations,
  onAdd,
  onUpdate,
  onDelete,
  onReset,
  currentLang
}: SheetSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states for editing or adding
  const [formData, setFormData] = useState<Partial<Accommodation>>({
    name: '',
    type: 'Chambre d\'hôte',
    city: '',
    region: 'Diana',
    priceAriary: 100000,
    priceEuro: 22,
    photo: '',
    description: '',
    amenities: [],
    whatsappNumber: '+261340000000',
    capacity: '2 personnes',
    locationDetails: '',
    isFeatured: false
  });

  const handleStartEdit = (item: Accommodation) => {
    setEditingId(item.id);
    setFormData(item);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'Chambre d\'hôte',
      city: '',
      region: 'Diana',
      priceAriary: 90000,
      priceEuro: 20,
      photo: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=85',
      description: '',
      amenities: ['Wi-Fi gratuit', 'Eau chaude', 'Petit-déjeuner inclus'],
      whatsappNumber: '+261340000000',
      capacity: '2 personnes',
      locationDetails: '',
      isFeatured: false,
      status: 'approved',
      nifNumber: '3000123456',
      statCardNumber: '12345 12 1234 1 12345',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.city || !formData.description) {
      if (currentLang === 'en') {
        alert('Please fill in at least the name, city, and description.');
      } else {
        alert('Veuillez remplir au moins le nom, la ville et la description.');
      }
      return;
    }

    if (isAdding) {
      const newItem: Accommodation = {
        ...(formData as Accommodation),
        id: Date.now().toString(),
      };
      onAdd(newItem);
      setIsAdding(false);
    } else if (editingId) {
      onUpdate(formData as Accommodation);
      setEditingId(null);
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    if (currentAmenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: currentAmenities.filter((a) => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...currentAmenities, amenity]
      });
    }
  };

  return (
    <div id="sheet-simulator-section" className="bg-white border-t border-b border-orange-100 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toggle Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-800 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display font-semibold text-slate-800 text-base sm:text-lg">
                  {currentLang === 'en' 
                    ? 'Database Simulator (Google Sheets Style)' 
                    : 'Simulateur de Base de Données (Style Google Sheets)'}
                </h3>
                <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping"></span>
                  {currentLang === 'en' ? 'Live sync' : 'Synchro en direct'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {currentLang === 'en'
                  ? 'Simulate real-time editing of accommodations as if using a connected Google Sheets spreadsheet.'
                  : 'Simulez la modification en temps réel des logements comme si vous utilisiez un Google Sheets connecté.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 self-stretch sm:self-auto">
            <button
              id="reset-database-btn"
              onClick={onReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Reset to default data' : 'Réinitialiser les données par défaut'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {currentLang === 'en' ? 'Reset' : 'Réinitialiser'}
            </button>
            <button
              id="toggle-simulator-btn"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isOpen
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10'
                  : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {isOpen 
                ? (currentLang === 'en' ? 'Hide Table' : 'Masquer la table') 
                : (currentLang === 'en' ? 'Show Google Sheets Table' : 'Afficher la table Google Sheets')}
            </button>
          </div>
        </div>

        {/* Spreadsheet Simulator Table */}
        {isOpen && (
          <div className="mt-6 border border-orange-100 rounded-[24px] overflow-hidden bg-slate-50">
            {/* Header Controls */}
            <div className="bg-slate-100 p-4 border-b border-orange-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-slate-200 px-2.5 py-1 rounded text-slate-700 font-bold">
                  Document ID: 1_MadaHotesSheetsSimulated2026
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  • {accommodations.length} {currentLang === 'en' ? 'rows found' : 'lignes trouvées'}
                </span>
              </div>
              {!isAdding && !editingId && (
                <button
                  id="add-sheet-row-btn"
                  onClick={handleStartAdd}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {currentLang === 'en' ? 'Insert new accommodation' : 'Insérer un nouveau logement'}
                </button>
              )}
            </div>

            {/* Editing / Adding Form Panel */}
            {(isAdding || editingId) && (
              <div className="bg-orange-50/30 p-5 border-b border-orange-100 animate-fadeIn">
                <h4 className="text-sm font-bold text-orange-600 font-display uppercase tracking-wider mb-4">
                  {isAdding 
                    ? (currentLang === 'en' ? '➕ Add row to Google Sheet' : '➕ Ajouter une ligne au Google Sheet') 
                    : (currentLang === 'en' ? '✏️ Edit row in Google Sheet' : '✏️ Modifier la ligne du Google Sheet')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Accommodation Name' : 'Nom du Logement'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Villa l'Ananas"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Type of Lodging' : 'Type de Logement'}
                    </label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    >
                      <option value="Chambre d'hôte">{currentLang === 'en' ? 'Bed & Breakfast' : "Chambre d'hôte"}</option>
                      <option value="Gîte d'étape">{currentLang === 'en' ? 'Stopover Gite' : "Gîte d'étape"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'City' : 'Ville'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: Antsirabe, Foulpointe..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Region (Province)' : 'Région (Province)'}
                    </label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    >
                      {AVAILABLE_REGIONS.filter(r => r !== 'Toutes les régions').map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Price in Ariary (MGA)' : 'Prix en Ariary (MGA)'}
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.priceAriary || ''}
                      onChange={(e) => {
                        const mga = Number(e.target.value);
                        setFormData({
                          ...formData,
                          priceAriary: mga,
                          priceEuro: Math.round(mga / 4500) // approx 1 EUR = 4500 MGA
                        });
                      }}
                      placeholder="Ex: 100000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Price in Euro (€)' : 'Prix en Euro (€)'}
                    </label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.priceEuro || ''}
                      onChange={(e) => {
                        const eur = Number(e.target.value);
                        setFormData({
                          ...formData,
                          priceEuro: eur,
                          priceAriary: eur * 4500
                        });
                      }}
                      placeholder="Ex: 22"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Cover Photo URL' : 'URL Photo de couverture'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.photo || ''}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="URL d'une image d'hébergement..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Capacity' : 'Capacité (personnes/lits)'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="Ex: 2 à 4 personnes, Dortoir..."
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Detailed Description' : 'Description Détaillée'}
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-slate-800"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={currentLang === 'en' ? 'Describe the charm, the hospitality, activities...' : "Décrivez l'endroit, le charme, l'accueil, les activités..."}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Location details & access' : 'Précisions de localisation'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.locationDetails || ''}
                      onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                      placeholder="Ex: À 10min à pied de la plage..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Owner WhatsApp (intl. format)' : 'WhatsApp du Propriétaire (format int.)'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      value={formData.whatsappNumber || ''}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="Ex: +261340000000"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="block text-xs font-bold text-slate-500 mb-2">
                      {currentLang === 'en' ? 'Amenities & Services (Check)' : 'Équipements & Services (Cochez)'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ALL_AMENITIES_OPTIONS.map((amenity) => {
                        const checked = (formData.amenities || []).includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleToggleAmenity(amenity)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 border cursor-pointer ${
                              checked
                                ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* NIF */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'NIF Number [col J]' : 'Numéro NIF [col J]'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 font-mono font-bold"
                      value={formData.nifNumber || ''}
                      onChange={(e) => setFormData({ ...formData, nifNumber: e.target.value })}
                      placeholder="Ex: 3001245678"
                      maxLength={10}
                    />
                  </div>

                  {/* STAT Card */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 mb-1">
                      {currentLang === 'en' ? 'Statistical Card [col K]' : 'Carte Statistique [col K]'}
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 font-mono font-bold"
                      value={formData.statCardNumber || ''}
                      onChange={(e) => setFormData({ ...formData, statCardNumber: e.target.value })}
                      placeholder="Ex: 12345 12 1234 1 12345"
                      maxLength={21}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured || false}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {currentLang === 'en' ? 'Featured accommodation (Displayed at the top)' : 'Mettre en vedette (Affiché en haut du site)'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 border-t border-orange-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    {currentLang === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-1 px-5 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 shadow-md transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {currentLang === 'en' ? 'Save to Base' : 'Enregistrer dans la base'}
                  </button>
                </div>
              </div>
            )}

            {/* Table Grid View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-200/80 border-b border-orange-100 text-slate-700">
                    <th className="p-2 border-r border-slate-200 text-center w-10">#</th>
                    <th className="p-2 border-r border-slate-200 min-w-[120px]">
                      {currentLang === 'en' ? 'Name [col A]' : 'Nom [col A]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 min-w-[90px]">
                      {currentLang === 'en' ? 'Type [col B]' : 'Type [col B]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 min-w-[90px]">
                      {currentLang === 'en' ? 'City [col C]' : 'Ville [col C]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 min-w-[80px]">
                      {currentLang === 'en' ? 'Region [col D]' : 'Région [col D]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 text-right min-w-[90px]">
                      {currentLang === 'en' ? 'Ariary [col E]' : 'Ariary [col E]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 text-right min-w-[70px]">
                      {currentLang === 'en' ? 'Euro [col F]' : 'Euro [col F]'}
                    </th>
                    <th className="p-2 border-r border-slate-200 min-w-[100px]">WhatsApp [col G]</th>
                    <th className="p-2 border-r border-slate-200 min-w-[150px]">Description [col H]</th>
                    <th className="p-2 border-r border-slate-200 text-center min-w-[90px]">Status [col I]</th>
                    <th className="p-2 border-r border-slate-200 min-w-[100px]">NIF [col J]</th>
                    <th className="p-2 border-r border-slate-200 min-w-[130px]">STAT [col K]</th>
                    <th className="p-2 text-center min-w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {accommodations.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-orange-50/20 transition-colors ${
                        item.isFeatured ? 'bg-orange-50/15' : 'bg-white'
                      }`}
                    >
                      <td className="p-2 border-r border-slate-200 text-center text-slate-400 bg-slate-100 font-sans">
                        {index + 1}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-sans font-semibold text-slate-950">
                        {item.name}
                        {item.isFeatured && (
                          <span className="block text-[9px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">
                        {item.type === "Chambre d'hôte" && currentLang === 'en' ? 'Bed & Breakfast' : item.type === "Gîte d'étape" && currentLang === 'en' ? 'Stopover Gite' : item.type}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{item.city}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{item.region}</td>
                      <td className="p-2 border-r border-slate-200 text-right text-slate-800 font-bold">
                        {item.priceAriary.toLocaleString()} Ar
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right text-slate-800 font-bold">
                        {item.priceEuro} €
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-500">{item.whatsappNumber}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-500 truncate max-w-[180px] font-sans" title={item.description}>
                        {item.description}
                      </td>
                      
                      {/* Status Column */}
                      <td className="p-2 border-r border-slate-200 text-center font-sans font-semibold">
                        {(() => {
                          const isExpired = item.expiresAt ? new Date(item.expiresAt) < new Date() : false;
                          const currentStatus = isExpired ? 'expired' : (item.status || 'approved');
                          if (currentStatus === 'pending') {
                            return <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold uppercase tracking-wider animate-pulse">En attente</span>;
                          } else if (currentStatus === 'approved') {
                            return <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold uppercase tracking-wider">Approuvé</span>;
                          } else if (currentStatus === 'rejected') {
                            return <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800 rounded font-bold uppercase tracking-wider">Rejeté</span>;
                          } else {
                            return <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold uppercase tracking-wider">Expiré</span>;
                          }
                        })()}
                      </td>

                      {/* NIF Column */}
                      <td className="p-2 border-r border-slate-200 text-slate-600 font-mono">
                        {item.nifNumber || <span className="text-red-400 italic font-sans font-bold">Manquant</span>}
                      </td>

                      {/* STAT Column */}
                      <td className="p-2 border-r border-slate-200 text-slate-600 font-mono">
                        {item.statCardNumber || <span className="text-red-400 italic font-sans font-bold">Manquant</span>}
                      </td>

                      <td className="p-2 flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-600 rounded transition-colors cursor-pointer"
                          title={currentLang === 'en' ? 'Edit row' : 'Modifier la ligne'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const confirmText = currentLang === 'en' 
                              ? `Delete ${item.name} from the sheet?` 
                              : `Supprimer ${item.name} de la table ?`;
                            if (confirm(confirmText)) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-1 bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 rounded transition-colors cursor-pointer"
                          title={currentLang === 'en' ? 'Delete row' : 'Supprimer la ligne'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note on Google Sheets replication */}
            <div className="bg-slate-100 border-t border-orange-100 p-3 text-[10px] text-slate-500 flex items-center gap-2 font-sans">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>
                {currentLang === 'en' ? (
                  <>
                    <strong>Technical Note:</strong> This table simulates real-time bi-directional read/write syncing via Google Sheets API. In true production, a Node.js worker polls the spreadsheet and writes back, leveraging an edge CDN cache to secure sub-second page rendering for mobile travelers on slow 3G/4G networks across Madagascar.
                  </>
                ) : (
                  <>
                    <strong>Note technique :</strong> Cette table simule une lecture et écriture bidirectionnelle via l'API Google Sheets. En production réelle, un script Node.js lit directement un Google Sheet public ou privé, et l'application utilise une mise en cache CDN pour garantir un temps de chargement ultra-rapide à Madagascar, même en connexion 3G/4G lente.
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
