import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Accommodation } from '../types';
import { AVAILABLE_REGIONS, ALL_AMENITIES_OPTIONS } from '../data';
import { UploadCloud, Trash2, Check, Sparkles, MapPin, Phone, AlertCircle, RefreshCw, X } from 'lucide-react';

interface OwnerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccommodation: (item: Accommodation) => void;
}

export default function OwnerRegistration({ isOpen, onClose, onAddAccommodation }: OwnerRegistrationProps) {
  if (!isOpen) return null;
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<"Chambre d'hôte" | "Gîte d'étape">("Chambre d'hôte");
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Diana');
  const [priceAriary, setPriceAriary] = useState<number | ''>('');
  const [priceEuro, setPriceEuro] = useState<number | ''>('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Status States
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate Euro price if Ariary is updated (using ~4500 exchange rate)
  const handleAriaryChange = (val: string) => {
    const num = val === '' ? '' : Number(val);
    setPriceAriary(num);
    if (num !== '') {
      setPriceEuro(Math.round(num / 4500));
    } else {
      setPriceEuro('');
    }
  };

  const handleEuroChange = (val: string) => {
    const num = val === '' ? '' : Number(val);
    setPriceEuro(num);
    if (num !== '') {
      setPriceAriary(num * 4500);
    } else {
      setPriceAriary('');
    }
  };

  // Process and downscale image to keep base64 size compact for localStorage
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner uniquement des images (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create Canvas for downscaling
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to compressed jpeg string
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setPhotoBase64(compressedBase64);
        }
        setIsProcessingImage(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    setPhotoBase64('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle Amenities
  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Validate and Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Le nom de l'hébergement est requis.";
    if (!city.trim()) newErrors.city = "La ville est requise.";
    if (!priceAriary) newErrors.priceAriary = "Le tarif en Ariary est requis.";
    if (!capacity.trim()) newErrors.capacity = "La capacité (ex: 2 personnes) est requise.";
    if (!whatsappNumber.trim()) newErrors.whatsappNumber = "Le numéro WhatsApp est requis.";
    if (!description.trim()) newErrors.description = "Une description est requise.";
    if (!photoBase64) newErrors.photo = "Une photo de vos locaux est requise.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorEl = document.getElementById(`err-${firstErrorKey}`);
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});

    // Create unique ID
    const newId = `owner-lodge-${Date.now()}`;

    // fallback photos if none for some reason, but we validated it
    const defaultPhoto = photoBase64 || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85";

    const newAccommodation: Accommodation = {
      id: newId,
      name,
      type,
      city,
      region,
      priceAriary: Number(priceAriary),
      priceEuro: Number(priceEuro) || Math.round(Number(priceAriary) / 4500),
      photo: defaultPhoto,
      description,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['Moustiquaire', 'Eau chaude'],
      whatsappNumber,
      capacity,
      locationDetails: locationDetails || `Situé à ${city}`,
      isFeatured: isFeatured
    };

    onAddAccommodation(newAccommodation);
    setSuccessMessage(true);

    // Reset Form
    setName('');
    setType("Chambre d'hôte");
    setCity('');
    setRegion('Diana');
    setPriceAriary('');
    setPriceEuro('');
    setCapacity('');
    setDescription('');
    setLocationDetails('');
    setWhatsappNumber('');
    setSelectedAmenities([]);
    setPhotoBase64('');
    setIsFeatured(false);

    // Auto close success message after 8 seconds
    setTimeout(() => {
      setSuccessMessage(false);
    }, 10000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-orange-50 rounded-[32px] sm:rounded-[40px] shadow-2xl max-w-4xl w-full relative overflow-hidden my-8 max-h-[92vh] flex flex-col animate-scaleIn"
      >
        {/* Sticky Header */}
        <div className="p-5 border-b border-orange-50 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Espace Propriétaires
            </span>
            <h2 className="text-lg sm:text-xl font-display font-semibold text-slate-900">Inscrire mon Hébergement</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1 space-y-8">
          
          {/* Subtle decoration inside body */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/20 rounded-full blur-2xl pointer-events-none"></div>
          
          {/* Section Introduction */}
          <div className="text-center max-w-xl mx-auto pb-4">
            <h3 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
              Rejoignez gratuitement notre catalogue de tourisme solidaire
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Bénéficiez de réservations en direct sur votre WhatsApp, sans intermédiaire ni aucune commission prélevée sur vos revenus.
            </p>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[32px] shadow-lg flex flex-col md:flex-row items-center gap-5 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="font-display font-bold text-slate-900 text-lg">Votre hébergement a été enregistré avec succès !</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Félicitations ! Votre gîte/chambre d'hôte est maintenant visible dans notre catalogue général. Il a également été automatiquement synchronisé avec notre simulateur Google Sheets interactif ci-dessous.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      // Smooth scroll to catalog
                      const cat = document.getElementById('catalog-section');
                      if (cat) cat.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Voir dans le catalogue
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage(false)}
                    className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 Heading */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
              Informations Générales
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">Présentez l'essentiel de votre logement aux voyageurs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-9">
            {/* Accommodation Name */}
            <div className="space-y-1.5" id="err-name">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Nom de l'hébergement <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Bungalow Ravinala, Gîte de l'Ankarana..."
                className={`w-full bg-slate-50 border ${errors.name ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium`}
              />
              {errors.name && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</p>}
            </div>

            {/* Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Type de logement <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("Chambre d'hôte")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center ${
                    type === "Chambre d'hôte"
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/10'
                      : 'bg-slate-50 text-slate-600 border-orange-50 hover:bg-slate-100'
                  }`}
                >
                  Chambre d'hôte
                </button>
                <button
                  type="button"
                  onClick={() => setType("Gîte d'étape")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center ${
                    type === "Gîte d'étape"
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                      : 'bg-slate-50 text-slate-600 border-orange-50 hover:bg-slate-100'
                  }`}
                >
                  Gîte d'étape
                </button>
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5" id="err-city">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Ville / Village <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Nosy Be, Ranohira, Antsiranana..."
                className={`w-full bg-slate-50 border ${errors.city ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium`}
              />
              {errors.city && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.city}</p>}
            </div>

            {/* Region Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Province / Région <span className="text-red-500">*</span></label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-50 border border-orange-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 font-medium appearance-none cursor-pointer"
              >
                {AVAILABLE_REGIONS.filter(r => r !== 'Toutes les régions').map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div className="space-y-1.5" id="err-capacity">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Capacité d'accueil <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Ex: 2 personnes, 2 à 4 personnes, Dortoir..."
                className={`w-full bg-slate-50 border ${errors.capacity ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium`}
              />
              {errors.capacity && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.capacity}</p>}
            </div>

            {/* Precise Location Details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Précisions de localisation (Accès)</label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="Ex: À 5min à pied de la plage, Entrée Est du Parc..."
                className="w-full bg-slate-50 border border-orange-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Step 2 Heading */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
              Tarifs, Services & Contacts
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">Combien coûte la nuitée et comment vous contacter directement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-9">
            {/* Price in Ariary */}
            <div className="space-y-1.5" id="err-priceAriary">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Tarif par nuit en Ariary (MGA) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  value={priceAriary}
                  onChange={(e) => handleAriaryChange(e.target.value)}
                  placeholder="Ex: 120000"
                  className={`w-full bg-slate-50 border ${errors.priceAriary ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold`}
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">Ar</span>
              </div>
              {errors.priceAriary && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.priceAriary}</p>}
            </div>

            {/* Price in Euro */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Conversion estimée en Euro (€)</label>
              <div className="relative">
                <input
                  type="number"
                  value={priceEuro}
                  onChange={(e) => handleEuroChange(e.target.value)}
                  placeholder="Ex: 27"
                  className="w-full bg-slate-50 border border-orange-50 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">€</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">Auto-calculé au taux indicatif de Madagascar (~1€ = 4500 Ar).</p>
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5" id="err-whatsappNumber">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Numéro WhatsApp direct <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: +261340000000"
                  className={`w-full bg-slate-50 border ${errors.whatsappNumber ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold`}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Incluez l'indicatif pays de Madagascar (+261) sans espace pour permettre le chat instantané.</p>
              {errors.whatsappNumber && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.whatsappNumber}</p>}
            </div>

            {/* Is Featured Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Visibilité premium</label>
              <label className="flex items-center gap-3 p-3 bg-orange-50/40 hover:bg-orange-50/80 border border-orange-100 rounded-2xl cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 w-5 h-5 cursor-pointer accent-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Afficher en Coup de Cœur ★</span>
                  <span className="text-[10px] text-slate-400">Positionne votre gîte dans le bandeau de recommandation en haut.</span>
                </div>
              </label>
            </div>

            {/* Amenities List */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Équipements & Services disponibles</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {ALL_AMENITIES_OPTIONS.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                        checked
                          ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm font-bold'
                          : 'bg-slate-50 border-orange-50/40 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        checked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3 Heading */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
              Médias & Description
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">Attirez l'œil avec de superbes photos et une description chaleureuse.</p>
          </div>

          <div className="space-y-6 pl-0 sm:pl-9">
            {/* Description */}
            <div className="space-y-1.5" id="err-description">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Description de votre établissement <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez en quelques lignes l'accueil chaleureux, le cadre, les spécialités culinaires, la vue, le calme, les activités à proximité..."
                className={`w-full bg-slate-50 border ${errors.description ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium resize-none`}
              />
              {errors.description && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description}</p>}
            </div>

            {/* Photo Upload Zone (Drag & Drop + Input Click) */}
            <div className="space-y-2" id="err-photo">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Photo de couverture <span className="text-red-500">*</span></label>
              
              {photoBase64 ? (
                // Image Preview Card
                <div className="relative rounded-2xl overflow-hidden border-2 border-orange-200 group max-w-lg aspect-16/9 bg-slate-100">
                  <img
                    src={photoBase64}
                    alt="Aperçu des locaux"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer & Remplacer
                    </button>
                  </div>
                </div>
              ) : (
                // Upload Drag Zone
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed ${
                    isDragActive
                      ? 'border-orange-500 bg-orange-50/30'
                      : errors.photo
                      ? 'border-red-300 bg-red-50/5 hover:bg-red-50/10'
                      : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-slate-50'
                  } rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {isProcessingImage ? (
                    <div className="flex flex-col items-center py-4">
                      <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                      <span className="text-xs font-bold text-slate-600">Traitement et compression de l'image...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 block">
                        Faites glisser votre photo ici, ou <span className="text-orange-500 underline">parcourez vos fichiers</span>
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Format PNG, JPG, WEBP • Idéal pour l'affichage : format Paysage
                      </span>
                    </div>
                  )}
                </div>
              )}
              {errors.photo && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.photo}</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              Inscription 100% Gratuite • Zéro Commission
            </span>
          </div>

        </div>

        {/* Fixed Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
            Sans intermédiaire ni frais d'agence
          </span>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-1/2 sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inscrire mon Hébergement
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
