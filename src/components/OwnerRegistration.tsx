import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Accommodation } from '../types';
import { AVAILABLE_REGIONS, ALL_AMENITIES_OPTIONS } from '../data';
import { UploadCloud, Trash2, Check, Sparkles, MapPin, Phone, AlertCircle, RefreshCw, X } from 'lucide-react';

interface OwnerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccommodation: (item: Accommodation) => void;
  currentLang: "fr" | "en";
  exchangeRate?: number;
}

export default function OwnerRegistration({ isOpen, onClose, onAddAccommodation, currentLang, exchangeRate = 4500 }: OwnerRegistrationProps) {
  if (!isOpen) return null;
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<"Chambre d'hôte" | "Gîte d'étape">("Chambre d'hôte");
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Diana');
  const [priceAriary, setPriceAriary] = useState<number | ''>('');
  const [priceUSD, setPriceUSD] = useState<number | ''>('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [statCardNumber, setStatCardNumber] = useState('');
  const [nifNumber, setNifNumber] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);

  // Helper Formatters
  const formatStatCard = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) formatted += digits.substring(0, 5);
    if (digits.length > 5) formatted += ' ' + digits.substring(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.substring(7, 11);
    if (digits.length > 11) formatted += ' ' + digits.substring(11, 12);
    if (digits.length > 12) formatted += ' ' + digits.substring(12, 17);
    return formatted.trim();
  };

  const formatNif = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 10);
  };

  // Status States
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate USD price if Ariary is updated (using exchange rate)
  const handleAriaryChange = (val: string) => {
    const num = val === '' ? '' : Number(val);
    setPriceAriary(num);
    if (num !== '') {
      setPriceUSD(Math.round(num / exchangeRate));
    } else {
      setPriceUSD('');
    }
  };

  const handleUSDChange = (val: string) => {
    const num = val === '' ? '' : Number(val);
    setPriceUSD(num);
    if (num !== '') {
      setPriceAriary(num * exchangeRate);
    } else {
      setPriceAriary('');
    }
  };

  // Process and downscale image to keep base64 size compact for localStorage
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      if (currentLang === 'en') {
        alert('Please select only image files (PNG, JPG, WEBP).');
      } else {
        alert('Veuillez sélectionner uniquement des images (PNG, JPG, WEBP).');
      }
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

    const statRegex = /^\d{5} \d{2} \d{4} \d \d{5}$/;
    const nifRegex = /^\d{10}$/;

    if (currentLang === 'en') {
      if (!name.trim()) newErrors.name = "The accommodation name is required.";
      if (!city.trim()) newErrors.city = "The city is required.";
      if (!priceAriary) newErrors.priceAriary = "The rate in Ariary is required.";
      if (!capacity.trim()) newErrors.capacity = "The capacity (e.g., 2 people) is required.";
      if (!locationDetails.trim()) newErrors.locationDetails = "Location details & access instructions are required.";
      if (!whatsappNumber.trim()) newErrors.whatsappNumber = "The WhatsApp number is required.";
      if (selectedAmenities.length === 0) newErrors.selectedAmenities = "Please select at least one amenity or service.";
      if (!description.trim()) newErrors.description = "A description is required.";
      if (!photoBase64) newErrors.photo = "A photo of your premises is required.";
      
      if (!statCardNumber.trim()) {
        newErrors.statCardNumber = "Statistical card number is required.";
      } else if (!statRegex.test(statCardNumber.trim())) {
        newErrors.statCardNumber = "Format must be XXXXX XX XXXX X XXXXX.";
      }
      if (!nifNumber.trim()) {
        newErrors.nifNumber = "NIF number is required.";
      } else if (!nifRegex.test(nifNumber.trim())) {
        newErrors.nifNumber = "NIF must be exactly 10 digits.";
      }
      if (!acceptedTerms) {
        newErrors.acceptedTerms = "You must open, read, and accept the Digital Terms of Use inside the popup window.";
      }
    } else {
      if (!name.trim()) newErrors.name = "Le nom de l'hébergement est requis.";
      if (!city.trim()) newErrors.city = "La ville est requise.";
      if (!priceAriary) newErrors.priceAriary = "Le tarif en Ariary est requis.";
      if (!capacity.trim()) newErrors.capacity = "La capacité (ex: 2 personnes) est requise.";
      if (!locationDetails.trim()) newErrors.locationDetails = "Les précisions de localisation et d'accès sont requises.";
      if (!whatsappNumber.trim()) newErrors.whatsappNumber = "Le numéro WhatsApp est requis.";
      if (selectedAmenities.length === 0) newErrors.selectedAmenities = "Veuillez sélectionner au moins un équipement ou service.";
      if (!description.trim()) newErrors.description = "Une description est requise.";
      if (!photoBase64) newErrors.photo = "Une photo de vos locaux est requise.";
      
      if (!statCardNumber.trim()) {
        newErrors.statCardNumber = "Le numéro de carte statistique est requis.";
      } else if (!statRegex.test(statCardNumber.trim())) {
        newErrors.statCardNumber = "Le format doit être XXXXX XX XXXX X XXXXX.";
      }
      if (!nifNumber.trim()) {
        newErrors.nifNumber = "Le numéro NIF est requis.";
      } else if (!nifRegex.test(nifNumber.trim())) {
        newErrors.nifNumber = "Le NIF doit comporter exactement 10 chiffres.";
      }
      if (!acceptedTerms) {
        newErrors.acceptedTerms = "Vous devez impérativement ouvrir, lire et accepter les conditions numériques d'utilisation dans la fenêtre popup.";
      }
    }

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
      priceUSD: Number(priceUSD) || Math.round(Number(priceAriary) / exchangeRate),
      photo: defaultPhoto,
      description,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['Moustiquaire', 'Eau chaude'],
      whatsappNumber,
      capacity,
      locationDetails: locationDetails || (currentLang === 'en' ? `Located at ${city}` : `Situé à ${city}`),
      isFeatured: isFeatured,
      statCardNumber: statCardNumber.trim(),
      nifNumber: nifNumber.trim(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending', // Pending approval by Admin
      hasAcceptedTerms: true
    };

    onAddAccommodation(newAccommodation);
    setSuccessMessage(true);

    // Reset Form
    setName('');
    setType("Chambre d'hôte");
    setCity('');
    setRegion('Diana');
    setPriceAriary('');
    setPriceUSD('');
    setCapacity('');
    setDescription('');
    setLocationDetails('');
    setWhatsappNumber('');
    setSelectedAmenities([]);
    setPhotoBase64('');
    setIsFeatured(false);
    setStatCardNumber('');
    setNifNumber('');
    setAcceptedTerms(false);

    // Auto close success message after 10 seconds
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
              {currentLang === 'en' ? "Owners' Space" : "Espace Propriétaires"}
            </span>
            <h2 className="text-lg sm:text-xl font-display font-semibold text-slate-900">
              {currentLang === 'en' ? "Register My Accommodation" : "Inscrire mon Hébergement"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            title={currentLang === 'en' ? "Close" : "Fermer"}
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
              {currentLang === 'en' 
                ? "Join our solidarity tourism catalog for free" 
                : "Rejoignez gratuitement notre catalogue de tourisme solidaire"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-sans">
              {currentLang === 'en'
                ? "Receive direct bookings on your WhatsApp, without any middleman or commission fees deducted from your earnings."
                : "Bénéficiez de réservations en direct sur votre WhatsApp, sans intermédiaire ni aucune commission prélevée sur vos revenus."}
            </p>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[32px] shadow-lg flex flex-col md:flex-row items-center gap-5 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>
              <div className="text-center md:text-left flex-1 font-sans">
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  {currentLang === 'en' ? "Your listing was submitted for review!" : "Votre demande d'inscription a été soumise !"}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {currentLang === 'en'
                    ? "Congratulations! Your lodging has been registered as PENDING. To comply with Madagascar regulations, an Admin must approve your Statistical Card and NIF. You can view or approve it right now in the Admin Dashboard or the Google Sheets spreadsheet simulator below."
                    : "Félicitations ! Votre hébergement a été enregistré avec le statut EN ATTENTE. Conformément aux réglementations de Madagascar, un administrateur doit valider votre Carte Statistique et votre NIF. Vous pouvez le visualiser et l'approuver dès maintenant dans le Tableau de Bord Administrateur ou dans le simulateur Google Sheets ci-dessous."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const sheets = document.getElementById('sheets-simulator-section');
                      if (sheets) sheets.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
                  >
                    {currentLang === 'en' ? "Moderate in Sheets Simulator" : "Modérer dans le Simulateur"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage(false)}
                    className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    {currentLang === 'en' ? "Close" : "Fermer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 Heading */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
              {currentLang === 'en' ? "General Information" : "Informations Générales"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">
              {currentLang === 'en' ? "Present the essentials of your lodging to travelers." : "Présentez l'essentiel de votre logement aux voyageurs."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-9">
            {/* Accommodation Name */}
            <div className="space-y-1.5" id="err-name">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Accommodation Name" : "Nom de l'hébergement"} <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Type of Accommodation" : "Type de logement"} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("Chambre d'hôte")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    type === "Chambre d'hôte"
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/10'
                      : 'bg-slate-50 text-slate-600 border-orange-50 hover:bg-slate-100'
                  }`}
                >
                  {currentLang === 'en' ? "Bed & Breakfast" : "Chambre d'hôte"}
                </button>
                <button
                  type="button"
                  onClick={() => setType("Gîte d'étape")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    type === "Gîte d'étape"
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                      : 'bg-slate-50 text-slate-600 border-orange-50 hover:bg-slate-100'
                  }`}
                >
                  {currentLang === 'en' ? "Stopover Gite" : "Gîte d'étape"}
                </button>
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5" id="err-city">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "City / Village" : "Ville / Village"} <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Province / Region" : "Province / Région"} <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Guest Capacity" : "Capacité d'accueil"} <span className="text-red-500">*</span>
              </label>
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
            <div className="space-y-1.5" id="err-locationDetails">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Location details & access" : "Précisions de localisation (Accès)"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="Ex: À 5min à pied de la plage, Entrée Est du Parc..."
                className={`w-full bg-slate-50 border ${errors.locationDetails ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium`}
              />
              {errors.locationDetails && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.locationDetails}
                </p>
              )}
            </div>
          </div>

          {/* Step 2 Heading */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
              {currentLang === 'en' ? "Rates, Services & Contacts" : "Tarifs, Services & Contacts"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">
              {currentLang === 'en' 
                ? "Specify nightly rates and how guests can contact you directly." 
                : "Combien coûte la nuitée et comment vous contacter directement."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-9">
            {/* Price in Ariary */}
            <div className="space-y-1.5" id="err-priceAriary">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Price per night in Ariary (MGA)" : "Tarif par nuit en Ariary (MGA)"} <span className="text-red-500">*</span>
              </label>
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

            {/* Price in USD */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Estimated Conversion in US Dollars ($)" : "Conversion estimée en Dollar US ($)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={priceUSD}
                  onChange={(e) => handleUSDChange(e.target.value)}
                  placeholder="Ex: 27"
                  className="w-full bg-slate-50 border border-orange-50 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold"
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">$</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                {currentLang === 'en'
                  ? `Auto-calculated at dynamic exchange rate of Madagascar (~1$ = ${exchangeRate} Ar).`
                  : `Auto-calculé au taux dynamique de Madagascar (~1$ = ${exchangeRate} Ar).`}
              </p>
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5" id="err-whatsappNumber">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Direct WhatsApp Number" : "Numéro WhatsApp direct"} <span className="text-red-500">*</span>
              </label>
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
              <p className="text-[10px] text-slate-400 italic">
                {currentLang === 'en'
                  ? "Include the country code (+261) without spaces to enable instant bookings chat."
                  : "Incluez l'indicatif pays de Madagascar (+261) sans espace pour permettre le chat instantané."}
              </p>
              {errors.whatsappNumber && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.whatsappNumber}</p>}
            </div>

            {/* Is Featured Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {currentLang === 'en' ? "Premium visibility" : "Visibilité premium"}
              </label>
              <label className="flex items-center gap-3 p-3 bg-orange-50/40 hover:bg-orange-50/80 border border-orange-100 rounded-2xl cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 w-5 h-5 cursor-pointer accent-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    {currentLang === 'en' ? "Display as Favorite ★" : "Afficher en Coup de Cœur ★"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentLang === 'en' 
                      ? "Positions your lodge in the premium recommendations slider at the top." 
                      : "Positionne votre gîte dans le bandeau de recommandation en haut."}
                  </span>
                </div>
              </label>
            </div>

            {/* Amenities List */}
            <div className="md:col-span-2 space-y-2" id="err-selectedAmenities">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Available Amenities & Services" : "Équipements & Services disponibles"} <span className="text-red-500">*</span>
              </label>
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 p-2 rounded-2xl border transition-all ${
                errors.selectedAmenities 
                  ? 'border-red-300 bg-red-50/5' 
                  : 'border-transparent'
              }`}>
                {ALL_AMENITIES_OPTIONS.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        handleToggleAmenity(amenity);
                        // Clear error once at least one item is chosen
                        if (errors.selectedAmenities) {
                          setErrors(prev => {
                            const copy = { ...prev };
                            delete copy.selectedAmenities;
                            return copy;
                          });
                        }
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 cursor-pointer ${
                        checked
                          ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm font-bold'
                          : errors.selectedAmenities
                          ? 'bg-red-50/10 border-red-200/50 text-slate-500 hover:bg-slate-100'
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
              {errors.selectedAmenities && (
                <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.selectedAmenities}
                </p>
              )}
            </div>
          </div>

          {/* Step 3 Heading */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
              {currentLang === 'en' ? "Media & Description" : "Médias & Description"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">
              {currentLang === 'en' 
                ? "Attract travelers' eyes with a gorgeous photo and a warm description." 
                : "Attirez l'œil avec de superbes photos et une description chaleureuse."}
            </p>
          </div>

          <div className="space-y-6 pl-0 sm:pl-9">
            {/* Description */}
            <div className="space-y-1.5" id="err-description">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Accommodation Description" : "Description de votre établissement"} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentLang === 'en' 
                  ? "Describe in a few sentences the warm welcome, setting, food specialities, local activities, tranquility..." 
                  : "Décrivez en quelques lignes l'accueil chaleureux, le cadre, les spécialités culinaires, la vue, le calme, les activités à proximité..."}
                className={`w-full bg-slate-50 border ${errors.description ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-medium resize-none`}
              />
              {errors.description && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description}</p>}
            </div>

            {/* Photo Upload Zone (Drag & Drop + Input Click) */}
            <div className="space-y-2" id="err-photo">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Cover Photo" : "Photo de couverture"} <span className="text-red-500">*</span>
              </label>
              
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
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-105 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {currentLang === 'en' ? "Delete & Replace" : "Supprimer & Remplacer"}
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
                    <div className="flex flex-col items-center py-4 font-sans">
                      <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                      <span className="text-xs font-bold text-slate-600">
                        {currentLang === 'en' ? "Processing and compressing image..." : "Traitement et compression de l'image..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 font-sans">
                      <div className="w-12 h-12 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 block">
                        {currentLang === 'en' 
                          ? <>Drag and drop your photo here, or <span className="text-orange-500 underline">browse files</span></>
                          : <>Faites glisser votre photo ici, ou <span className="text-orange-500 underline">parcourez vos fichiers</span></>}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {currentLang === 'en'
                          ? "Format PNG, JPG, WEBP • Ideal orientation: Landscape"
                          : "Format PNG, JPG, WEBP • Idéal pour l'affichage : format Paysage"}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {errors.photo && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.photo}</p>}
            </div>
          </div>

          {/* Step 4 Heading */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">4</span>
              {currentLang === 'en' ? "Legal Compliance & Terms of Use" : "Conformité Légale & Conditions d'Utilisation"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 pl-9">
              {currentLang === 'en' 
                ? "Enter your Madagascar corporate identifier numbers and accept our publication policy." 
                : "Renseignez vos identifiants fiscaux malgaches et validez les conditions de publication."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-9">
            {/* Statistical Card Number */}
            <div className="space-y-1.5" id="err-statCardNumber">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Statistical Card Number" : "Numéro carte statistique"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={statCardNumber}
                onChange={(e) => setStatCardNumber(formatStatCard(e.target.value))}
                placeholder="Ex: 12345 12 1234 1 12345"
                maxLength={21}
                className={`w-full bg-slate-50 border ${errors.statCardNumber ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold`}
              />
              <p className="text-[10px] text-slate-400 italic">
                {currentLang === 'en' ? "Format: XXXXX XX XXXX X XXXXX" : "Format requis : XXXXX XX XXXX X XXXXX"}
              </p>
              {errors.statCardNumber && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.statCardNumber}</p>}
            </div>

            {/* NIF Number */}
            <div className="space-y-1.5" id="err-nifNumber">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {currentLang === 'en' ? "Fiscal Identity Number (NIF)" : "Numéro d'Identité Fiscale (NIF)"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nifNumber}
                onChange={(e) => setNifNumber(formatNif(e.target.value))}
                placeholder="Ex: 3001245678"
                maxLength={10}
                className={`w-full bg-slate-50 border ${errors.nifNumber ? 'border-red-400 focus:ring-red-500' : 'border-orange-50 focus:ring-orange-500'} rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all text-slate-800 placeholder-slate-400 font-mono font-bold`}
              />
              <p className="text-[10px] text-slate-400 italic">
                {currentLang === 'en' ? "Format: 10 digits" : "Format requis : 10 chiffres consécutifs"}
              </p>
              {errors.nifNumber && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.nifNumber}</p>}
            </div>
          </div>

          {/* Digital Terms of Use Box */}
          <div className="space-y-3 pl-0 sm:pl-9" id="err-acceptedTerms">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              {currentLang === 'en' ? "Digital Terms of Use Contract (MadaGîtes)" : "Conditions Numériques d'Utilisation (MadaGîtes)"} <span className="text-red-500">*</span>
            </label>

            <div className={`border rounded-2xl p-4 transition-all ${
              acceptedTerms 
                ? 'bg-emerald-50/50 border-emerald-200/60 shadow-sm' 
                : errors.acceptedTerms 
                  ? 'bg-red-50/50 border-red-200 shadow-sm animate-pulse' 
                  : 'bg-slate-50/80 border-slate-200/60 hover:bg-slate-50'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-sans space-y-1">
                  <span className={`text-xs font-bold block ${acceptedTerms ? 'text-emerald-800' : 'text-slate-700'}`}>
                    {acceptedTerms 
                      ? (currentLang === 'en' ? "✓ Terms of Use Read & Accepted" : "✓ Conditions d'utilisation lues et acceptées")
                      : (currentLang === 'en' ? "Mandatory Terms Review Required" : "Lecture et approbation obligatoire des conditions")}
                  </span>
                  <span className="text-[10px] text-slate-500 block max-w-md">
                    {currentLang === 'en' 
                      ? "You must open the popup, read our corporate regulatory framework (Stat/NIF), and agree before publishing." 
                      : "Vous devez impérativement ouvrir le popup, lire nos clauses de conformité (Carte Stat/NIF) et accepter."}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsTermsPopupOpen(true)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                    acceptedTerms 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10' 
                      : errors.acceptedTerms
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/10'
                  }`}
                >
                  {acceptedTerms 
                    ? (currentLang === 'en' ? "Review Accepted Terms" : "Revoir les Conditions")
                    : (currentLang === 'en' ? "Read & Accept Terms" : "Lire & Accepter les Conditions")}
                </button>
              </div>
            </div>

            {/* Checkbox itself is read-only but visually confirms agreement */}
            {acceptedTerms && (
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold font-sans mt-1">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                {currentLang === 'en' 
                  ? "Certified Stat Card & NIF accuracy accepted." 
                  : "Authenticité de la Carte Statistique & NIF certifiée et acceptée."}
              </div>
            )}
            
            {errors.acceptedTerms && (
              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.acceptedTerms}
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-sans">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              {currentLang === 'en' ? "100% Free Listing • Zero Commissions" : "Inscription 100% Gratuite • Zéro Commission"}
            </span>
          </div>

        </div>

        {/* Fixed Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-sans font-medium">
            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
            {currentLang === 'en' ? "Direct relations and zero middleman fees" : "Sans intermédiaire ni frais d'agence"}
          </span>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {currentLang === 'en' ? "Cancel" : "Annuler"}
            </button>
            <button
              type="submit"
              className="w-1/2 sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {currentLang === 'en' ? "Publish My Lodging" : "Inscrire mon Hébergement"}
            </button>
          </div>
        </div>

      </form>

      {/* Terms and Conditions Popup Window */}
      {isTermsPopupOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" onClick={() => setIsTermsPopupOpen(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Check className="w-5 h-5 text-amber-200 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base leading-none">
                    {currentLang === 'en' ? "Digital Terms of Use Contract" : "Contrat de Conditions Numériques d'Utilisation"}
                  </h3>
                  <p className="text-[10px] text-orange-100 mt-1 font-sans">
                    {currentLang === 'en' ? "MadaGîtes Mandatory Regulatory Framework" : "Cadre réglementaire obligatoire de MadaGîtes"}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsTermsPopupOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body / Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-600 space-y-4 font-sans leading-relaxed">
              {currentLang === 'en' ? (
                <>
                  <p className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                    MADAG&Icirc;TES - DIGITAL TERMS OF USE (REGULATORY FRAMEWORK)
                  </p>
                  <div className="space-y-3.5">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">1. Corporate Identification & Fiscal Mandate</p>
                      <p className="text-slate-600">To maintain list integrity and adhere to the regulations of local tourism authorities in Madagascar, any host listing a property on MadaG&icirc;tes must declare a valid Statistical Card Number (format: XXXXX XX XXXX X XXXXX) and a Fiscal Identity Number / NIF (format: 10 digits).</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">2. Moderation &amp; Independent Approval</p>
                      <p className="text-slate-600">Every newly registered lodging is subject to a review process and will start in a &quot;Pending Approval&quot; state. An independent Administrator has exclusive rights to approve, filter, suspend, or permanently delete any listings that fail to provide correct regulatory credentials, or contain non-compliant materials (&quot;publication non r&eacute;glementaire&quot;).</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">3. Strict Expiration Policy (1-Year Validity)</p>
                      <p className="text-slate-600">Approved listings are granted a strict validity period of exactly one year (365 days) from the date of Administrator approval, date for date (&quot;validit&eacute; de 1 an date pour date&quot;). Upon reaching the expiration date, listings are automatically deactivated and must be renewed by submitting up-to-date fiscal details.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">4. Direct Relations Policy (Zero Intermediary)</p>
                      <p className="text-slate-600">MadaG&icirc;tes acts as a free solidarity directory, promoting sustainable direct commerce between travelers and local owners without commissions. Both parties must communicate in good faith via WhatsApp and resolve booking agreements directly.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                    MADAG&Icirc;TES - CONTRAT DE CONDITIONS NUM&Eacute;RIQUES D'UTILISATION (R&Eacute;GULATION DES G&Icirc;TES)
                  </p>
                  <div className="space-y-3.5">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">1. Identification Fiscale Obligatoire</p>
                      <p className="text-slate-600">Afin de garantir la transparence des services touristiques à Madagascar, tout propriétaire s'engage à renseigner un numéro de Carte Statistique valide (format : XXXXX XX XXXX X XXXXX) ainsi qu'un numéro d'Identité Fiscale / NIF valide (format : 10 chiffres consécutifs).</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">2. Modération et Filtrage de Publication</p>
                      <p className="text-slate-600">Toute nouvelle inscription débute avec le statut &quot;En attente de validation&quot;. L'Administrateur de la plateforme dispose d'un pouvoir indépendant de filtrage permettant de valider ou de supprimer immédiatement toute publication non réglementaire ou frauduleuse.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">3. Durée de Validité de la Publication (1 an date pour date)</p>
                      <p className="text-slate-600">Conformément à la réglementation solidaire de MadaGîtes, chaque publication approuvée est valide pour une période stricte de 1 an (365 jours) de date à date à compter de son approbation. À l'échéance de cette période, la publication expire et est retirée du catalogue public jusqu'à sa prochaine validation réglementaire.</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
                      <p className="font-bold text-slate-800 mb-1">4. Zéro Commission &amp; Responsabilité</p>
                      <p className="text-slate-600">La plateforme facilite une mise en relation directe via WhatsApp sans intermédiaire. Les hôtes restent seuls responsables du respect de la législation fiscale en vigueur à Madagascar quant à leurs revenus d'hébergement.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer / Actions inside Popup */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 italic">
                {currentLang === 'en' 
                  ? "By clicking accept, you commit to legal conformity." 
                  : "En acceptant, vous vous engagez à la conformité légale."}
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(false);
                    setIsTermsPopupOpen(false);
                  }}
                  className="w-1/2 sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  {currentLang === 'en' ? "Decline" : "Refuser"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedTerms(true);
                    setIsTermsPopupOpen(false);
                    // clear error if any
                    if (errors.acceptedTerms) {
                      setErrors(prev => {
                        const copy = { ...prev };
                        delete copy.acceptedTerms;
                        return copy;
                      });
                    }
                  }}
                  className="w-1/2 sm:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  {currentLang === 'en' ? "Accept and Certify" : "Accepter et Certifier"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
