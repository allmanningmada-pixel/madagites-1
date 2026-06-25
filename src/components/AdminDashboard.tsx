/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Accommodation } from '../types';
import { 
  ShieldCheck, 
  Database, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Check, 
  X, 
  Search, 
  AlertTriangle, 
  Calendar, 
  RefreshCw, 
  Scale, 
  Eye, 
  Filter,
  CheckCircle,
  FileText,
  AlertOctagon,
  CalendarRange,
  Lock,
  Key
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  accommodations: Accommodation[];
  onUpdate: (item: Accommodation) => void;
  onDelete: (id: string) => void;
  currentLang: "fr" | "en";
}

export default function AdminDashboard({
  isOpen,
  onClose,
  accommodations,
  onUpdate,
  onDelete,
  currentLang
}: AdminDashboardProps) {
  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('madagites_admin_authenticated') === 'true';
  });

  // Password Modification States
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'expired'>('all');
  const [showOnlyInvalid, setShowOnlyInvalid] = useState(false);
  const [showTermsSection, setShowTermsSection] = useState(false);

  // Helper to retrieve persistent admin password
  const getAdminPassword = () => {
    return localStorage.getItem('madagites_admin_password') || 'MadaGites2026';
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === getAdminPassword()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('madagites_admin_authenticated', 'true');
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError(currentLang === 'en' 
        ? 'Invalid administrator password. Access denied.' 
        : 'Mot de passe administrateur incorrect. Accès refusé.'
      );
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 4) {
      setPasswordChangeSuccess(currentLang === 'en' 
        ? 'Error: Password must be at least 4 characters.' 
        : 'Erreur : Le mot de passe doit faire au moins 4 caractères.'
      );
      return;
    }
    localStorage.setItem('madagites_admin_password', newPasswordInput.trim());
    setPasswordChangeSuccess(currentLang === 'en'
      ? 'Password changed successfully!'
      : 'Mot de passe modifié avec succès !'
    );
    setNewPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(''), 5000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('madagites_admin_authenticated');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl max-w-md w-full p-8 relative overflow-hidden text-slate-100 font-sans"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Lock className="w-8 h-8" />
            </div>
            
            <div>
              <h2 className="text-xl font-display font-semibold tracking-tight text-white">
                {currentLang === 'en' ? "Administrator Authentication" : "Authentification Administrateur"}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {currentLang === 'en'
                  ? "Access to the moderation panel is restricted to the single authorized administrator."
                  : "L'accès au panneau de modération est restreint à l'unique administrateur autorisé."}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4 pt-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'en' ? "Admin Password" : "Mot de passe Administrateur"}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-100 placeholder-slate-700 font-mono text-center tracking-widest"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-semibold bg-red-500/5 border border-red-500/10 p-2.5 rounded-xl flex items-center justify-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all cursor-pointer"
              >
                {currentLang === 'en' ? "Unlock Panel" : "Déverrouiller l'Espace Admin"}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800/60 w-full text-[11px] text-slate-500 flex flex-col gap-1">
              <p>
                {currentLang === 'en'
                  ? "🔒 Single authorized administrator access."
                  : "🔒 Accès unique pour l'administrateur de la Grande Île."}
              </p>
              <p className="bg-slate-950/40 py-1.5 px-3 rounded-lg border border-slate-800/40 text-[10px] text-slate-400">
                {currentLang === 'en'
                  ? "Demonstration Password: "
                  : "Mot de passe de démonstration : "}
                <code className="text-orange-400 font-mono font-bold select-all">MadaGites2026</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Date format helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Format invalide';
    }
  };

  // Helper to check compliance formats
  const checkCompliance = (item: Accommodation) => {
    const statRegex = /^\d{5} \d{2} \d{4} \d \d{5}$/;
    const nifRegex = /^\d{10}$/;
    
    const isStatValid = item.statCardNumber ? statRegex.test(item.statCardNumber) : false;
    const isNifValid = item.nifNumber ? nifRegex.test(item.nifNumber) : false;
    
    return {
      isStatValid,
      isNifValid,
      isFullyCompliant: isStatValid && isNifValid && item.hasAcceptedTerms
    };
  };

  // Process and filter listings
  const processedListings = accommodations.map(item => {
    const isExpired = item.expiresAt ? new Date(item.expiresAt) < new Date() : false;
    const currentStatus = isExpired ? 'expired' : (item.status || 'approved');
    const compliance = checkCompliance(item);
    
    return {
      ...item,
      computedStatus: currentStatus,
      compliance
    };
  });

  const filteredListings = processedListings.filter(item => {
    // 1. Search Query Match (Name, City, NIF, STAT, Region)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' ||
      item.name.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query) ||
      item.region.toLowerCase().includes(query) ||
      (item.nifNumber && item.nifNumber.includes(query)) ||
      (item.statCardNumber && item.statCardNumber.toLowerCase().includes(query));

    // 2. Status Match
    const matchesStatus = statusFilter === 'all' || item.computedStatus === statusFilter;

    // 3. Invalid Format Match
    const matchesInvalid = !showOnlyInvalid || !item.compliance.isFullyCompliant;

    return matchesSearch && matchesStatus && matchesInvalid;
  });

  // Calculate Metrics
  const totalCount = processedListings.length;
  const pendingCount = processedListings.filter(i => i.computedStatus === 'pending').length;
  const approvedCount = processedListings.filter(i => i.computedStatus === 'approved').length;
  const rejectedCount = processedListings.filter(i => i.computedStatus === 'rejected').length;
  const expiredCount = processedListings.filter(i => i.computedStatus === 'expired').length;
  const nonCompliantCount = processedListings.filter(i => !i.compliance.isFullyCompliant).length;

  // Moderation Actions
  const handleApprove = (item: Accommodation) => {
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1); // 1 year date for date
    
    const updated: Accommodation = {
      ...item,
      status: 'approved',
      createdAt: now.toISOString(),
      expiresAt: oneYearLater.toISOString()
    };
    onUpdate(updated);
  };

  const handleReject = (item: Accommodation) => {
    const updated: Accommodation = {
      ...item,
      status: 'rejected'
    };
    onUpdate(updated);
  };

  // Helper to force-expire or extend for simulator testing purposes
  const handleSimulateExpiration = (item: Accommodation, makeExpired: boolean) => {
    const updated: Accommodation = {
      ...item,
      expiresAt: makeExpired 
        ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // expired yesterday
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // renewed for 1 year
    };
    onUpdate(updated);
  };

  const handleDeleteListing = (id: string, name: string) => {
    const confirmMsg = currentLang === 'en'
      ? `Are you sure you want to permanently delete non-regulatory publication "${name}"? This action cannot be undone.`
      : `Êtes-vous sûr de vouloir supprimer définitivement la publication non réglementaire "${name}" ? Cette action est irréversible.`;
    if (confirm(confirmMsg)) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl max-w-7xl w-full relative overflow-hidden my-4 max-h-[95vh] flex flex-col text-slate-100 font-sans"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-semibold tracking-tight">
                  {currentLang === 'en' ? "Admin Moderation Dashboard" : "Tableau de Bord Administrateur"}
                </h2>
                <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-mono rounded">
                  v2.6 SECURE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentLang === 'en'
                  ? "Audit, approve, and delete Madagascar lodge listings according to regulatory standards."
                  : "Contrôlez, approuvez et supprimez les publications de gîtes conformément aux réglementations."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowPasswordSection(!showPasswordSection);
                setShowTermsSection(false);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4 text-orange-400" />
              {currentLang === 'en' ? "Change Password" : "Changer MDP"}
            </button>
            <button
              onClick={() => {
                setShowTermsSection(!showTermsSection);
                setShowPasswordSection(false);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              {currentLang === 'en' ? "Terms of Use" : "Conditions d'Utilisation"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title={currentLang === 'en' ? "Logout Admin" : "Déconnexion Administrateur"}
            >
              <Lock className="w-4 h-4 text-red-400" />
              {currentLang === 'en' ? "Logout" : "Déconnexion"}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title={currentLang === 'en' ? "Close Dashboard" : "Fermer le tableau de bord"}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Workspace */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {/* Regulatory Reminder Alert Banner */}
          <div className="p-4 bg-slate-800/40 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex-shrink-0 mt-0.5 md:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                <strong className="text-amber-300 font-bold block mb-1">
                  {currentLang === 'en' ? "Madagascar Regulatory Mandates" : "Rappel Réglementaire de la Grande Île"}
                </strong>
                {currentLang === 'en'
                  ? "Every host must supply a valid Statistical Card (XXXXX XX XXXX X XXXXX) and NIF (10 digits). Publications are active for exactly 1 year from approval date, after which they automatically transition to Expired status and vanish from the public catalog."
                  : "Chaque hôte doit fournir une Carte Statistique (XXXXX XX XXXX X XXXXX) et un NIF (10 chiffres) valides. La durée de validité est de 1 an pile de date à date à compter de l'approbation, après quoi la publication expire et disparaît du catalogue public."}
              </div>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg font-mono border border-slate-700 font-bold whitespace-nowrap self-stretch md:self-center flex items-center justify-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-orange-400" />
              Solidarity Core
            </span>
          </div>

          {/* Change Admin Password Section (collapsible) */}
          {showPasswordSection && (
            <div className="p-5 bg-orange-500/[0.02] border border-orange-500/20 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2 font-display">
                  <Key className="w-4 h-4" />
                  {currentLang === 'en' ? "Change Administrator Password" : "Changer le mot de passe administrateur"}
                </h4>
                <button 
                  onClick={() => setShowPasswordSection(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
                >
                  {currentLang === 'en' ? "Hide" : "Masquer"}
                </button>
              </div>

              <form onSubmit={handlePasswordChangeSubmit} className="max-w-md space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'en' ? "New Secure Password" : "Nouveau mot de passe sécurisé"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder={currentLang === 'en' ? "Enter new password..." : "Saisir le nouveau mot de passe..."}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-100 placeholder-slate-700 font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      {currentLang === 'en' ? "Update Password" : "Mettre à jour"}
                    </button>
                  </div>
                </div>

                {passwordChangeSuccess && (
                  <p className={`text-xs font-semibold p-2.5 rounded-xl ${
                    passwordChangeSuccess.startsWith('Error') || passwordChangeSuccess.startsWith('Erreur')
                      ? 'text-red-400 bg-red-500/5 border border-red-500/10'
                      : 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10'
                  }`}>
                    {passwordChangeSuccess}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Digital Terms of Use Quick View (collapsible) */}
          {showTermsSection && (
            <div className="p-5 bg-orange-500/[0.02] border border-orange-500/20 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2 font-display">
                  <Scale className="w-4 h-4" />
                  {currentLang === 'en' ? "Digital Terms of Use (Full Content)" : "Conditions Numériques d'Utilisation (Texte Intégral)"}
                </h4>
                <button 
                  onClick={() => setShowTermsSection(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 underline"
                >
                  {currentLang === 'en' ? "Hide" : "Masquer"}
                </button>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto text-xs text-slate-400 font-sans space-y-2 leading-relaxed">
                {currentLang === 'en' ? (
                  <>
                    <p className="font-bold text-slate-300 uppercase">MadaGîtes - Solidarity Terms & Conditions</p>
                    <p>1. <strong>Corporate Identification:</strong> In compliance with the regulations of local tourism authorities in Madagascar, any host listing a property must declare a valid Statistical Card Number (format: XXXXX XX XXXX X XXXXX) and a Fiscal Identity Number / NIF (format: 10 digits).</p>
                    <p>2. <strong>Moderation & Independent Approval:</strong> Every newly registered lodging starts as "Pending Approval". The independent Administrator has exclusive rights to approve, filter, or permanently delete any listings that fail to provide correct regulatory credentials or contain non-compliant materials.</p>
                    <p>3. <strong>Strict Expiration Policy (1-Year Validity):</strong> Approved listings are granted a strict validity period of exactly one year (365 days) from the date of approval, date for date. Upon reaching the expiration date, listings are automatically deactivated.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-300 uppercase">MadaGîtes - Conditions Générales & Réglementation</p>
                    <p>1. <strong>Identification Fiscale Obligatoire :</strong> Afin de garantir la transparence des services touristiques à Madagascar, tout propriétaire s'engage à renseigner un numéro de Carte Statistique valide (format : XXXXX XX XXXX X XXXXX) ainsi qu'un numéro d'Identité Fiscale / NIF valide (format : 10 chiffres consécutifs).</p>
                    <p>2. <strong>Modération et Filtrage de Publication :</strong> Toute nouvelle inscription débute avec le statut "En attente de validation". L'Administrateur de la plateforme dispose d'un pouvoir indépendant de filtrage permettant de valider ou de supprimer immédiatement toute publication non réglementaire ou frauduleuse.</p>
                    <p>3. <strong>Durée de Validité de la Publication (1 an date pour date) :</strong> Chaque publication approuvée est valide pour une période stricte de 1 an de date à date à compter de son approbation. À l'échéance, la publication expire et est retirée du catalogue public.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Total */}
            <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{currentLang === 'en' ? "Total Entries" : "Total Gîtes"}</span>
                <span className="text-lg font-bold font-mono">{totalCount}</span>
              </div>
            </div>

            {/* Card 2: Pending (pulsing if > 0) */}
            <div className={`p-4 border rounded-2xl flex items-center gap-3 transition-all ${
              pendingCount > 0 
                ? 'bg-amber-500/[0.04] border-amber-500/30 ring-1 ring-amber-500/10' 
                : 'bg-slate-800/30 border-slate-800'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                pendingCount > 0 ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{currentLang === 'en' ? "Pending Audit" : "En Attente"}</span>
                <span className={`text-lg font-bold font-mono ${pendingCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>{pendingCount}</span>
              </div>
            </div>

            {/* Card 3: Approved & Active */}
            <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{currentLang === 'en' ? "Approved" : "Approuvés"}</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{approvedCount}</span>
              </div>
            </div>

            {/* Card 4: Expired */}
            <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{currentLang === 'en' ? "Expired" : "Expirés"}</span>
                <span className="text-lg font-bold font-mono text-rose-400">{expiredCount}</span>
              </div>
            </div>

            {/* Card 5: Non-Compliant Formats */}
            <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">{currentLang === 'en' ? "Invalid IDs" : "Non-Conformes"}</span>
                <span className="text-lg font-bold font-mono text-red-400">{nonCompliantCount}</span>
              </div>
            </div>

          </div>

          {/* Table Search & Filtering Controls */}
          <div className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'en' ? "Search by name, city, NIF or STAT..." : "Rechercher par nom, ville, NIF, STAT..."}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors font-medium"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Filtrer :
              </span>
              
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' 
                    ? 'bg-slate-700 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentLang === 'en' ? "All" : "Tous"}
              </button>

              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'pending' 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-900 text-amber-500 hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {currentLang === 'en' ? "Pending" : "En attente"}
                {pendingCount > 0 && <span className="bg-slate-950 text-amber-400 text-[9px] px-1.5 rounded font-bold">{pendingCount}</span>}
              </button>

              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'approved' 
                    ? 'bg-emerald-500 text-slate-950' 
                    : 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {currentLang === 'en' ? "Approved" : "Approuvés"}
              </button>

              <button
                onClick={() => setStatusFilter('expired')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'expired' 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-900 text-rose-400 hover:bg-slate-800'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                {currentLang === 'en' ? "Expired" : "Expirés"}
              </button>

              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === 'rejected' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-900 text-red-400 hover:bg-slate-800'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                {currentLang === 'en' ? "Rejected" : "Rejetés"}
              </button>

              <div className="border-l border-slate-700/60 h-6 mx-1"></div>

              {/* Compliance Filter Toggle */}
              <button
                onClick={() => setShowOnlyInvalid(!showOnlyInvalid)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  showOnlyInvalid 
                    ? 'bg-red-500/10 border-red-500/40 text-red-400 font-bold' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentLang === 'en' ? "Non-Compliant Format Only" : "Formaux Non-Conformes Uniquement"}
              </button>
            </div>
          </div>

          {/* List Table container */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">{currentLang === 'en' ? "Accommodation" : "Hébergement"}</th>
                    <th className="px-4 py-4">{currentLang === 'en' ? "Location / Region" : "Localisation / Région"}</th>
                    <th className="px-4 py-4">{currentLang === 'en' ? "NIF Number (10 d)" : "Identifiant Fiscal NIF (10 c)"}</th>
                    <th className="px-4 py-4">{currentLang === 'en' ? "Statistical Card Number" : "Numéro Carte Statistique"}</th>
                    <th className="px-4 py-4">{currentLang === 'en' ? "Dates / Validity" : "Dates / Validité"}</th>
                    <th className="px-4 py-4 text-center">{currentLang === 'en' ? "Status" : "Statut"}</th>
                    <th className="px-5 py-4 text-right">{currentLang === 'en' ? "Actions" : "Actions Administrateur"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium font-sans">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-500 italic">
                        {currentLang === 'en' 
                          ? "No accommodations found matching criteria." 
                          : "Aucun hébergement ne correspond aux filtres de modération sélectionnés."}
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map((item) => {
                      const { isStatValid, isNifValid, isFullyCompliant } = item.compliance;
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/15 transition-all">
                          {/* Col 1: Accommodation Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.photo} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-display font-bold text-slate-100 text-sm block">{item.name}</span>
                                <span className="text-[10px] text-slate-500 block">{item.type}</span>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Location */}
                          <td className="px-4 py-4">
                            <span className="font-semibold block">{item.city}</span>
                            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{item.region}</span>
                          </td>

                          {/* Col 3: NIF */}
                          <td className="px-4 py-4 font-mono">
                            {item.nifNumber ? (
                              <div className="flex flex-col">
                                <span className={`font-bold text-sm ${isNifValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {item.nifNumber}
                                </span>
                                <span className="text-[9px] text-slate-500 mt-0.5">
                                  {isNifValid ? '✓ NIF Conforme' : '✗ 10 chiffres requis'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-red-400 italic font-sans font-bold">Manquant</span>
                            )}
                          </td>

                          {/* Col 4: Stat Card */}
                          <td className="px-4 py-4 font-mono">
                            {item.statCardNumber ? (
                              <div className="flex flex-col">
                                <span className={`font-bold text-sm ${isStatValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {item.statCardNumber}
                                </span>
                                <span className="text-[9px] text-slate-500 mt-0.5">
                                  {isStatValid ? '✓ Stat Conforme' : '✗ Format incorrect'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-red-400 italic font-sans font-bold">Manquant</span>
                            )}
                          </td>

                          {/* Col 5: Dates */}
                          <td className="px-4 py-4 text-[11px] font-sans">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-slate-400">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>Publié : {formatDate(item.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                <CalendarRange className="w-3.5 h-3.5 text-slate-500" />
                                <span className={item.computedStatus === 'expired' ? 'text-rose-400 font-bold' : ''}>
                                  Expire : {formatDate(item.expiresAt)}
                                </span>
                              </div>
                              {/* Remaining Progress Bar */}
                              {item.expiresAt && item.computedStatus === 'approved' && (
                                <div className="pt-1">
                                  <div className="w-full bg-slate-800 rounded-full h-1">
                                    <div 
                                      className="bg-emerald-500 h-1 rounded-full" 
                                      style={{
                                        width: `${Math.max(0, Math.min(100, ((new Date(item.expiresAt).getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000)) * 100))}%`
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Col 6: Status Badge */}
                          <td className="px-4 py-4 text-center">
                            {item.computedStatus === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                                <Clock className="w-3 h-3" />
                                {currentLang === 'en' ? "Pending Audit" : "En attente"}
                              </span>
                            )}
                            {item.computedStatus === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                {currentLang === 'en' ? "Active / Compliant" : "Actif / Conforme"}
                              </span>
                            )}
                            {item.computedStatus === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                <AlertOctagon className="w-3 h-3" />
                                {currentLang === 'en' ? "Rejected" : "Non-réglementaire"}
                              </span>
                            )}
                            {item.computedStatus === 'expired' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                <AlertTriangle className="w-3 h-3" />
                                {currentLang === 'en' ? "Expired (1 Yr)" : "Expiré (1 An)"}
                              </span>
                            )}
                          </td>

                          {/* Col 7: Action Buttons */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              
                              {/* Quick simulator: force expire / renew to test "1-year date-for-date validity" */}
                              {item.computedStatus === 'approved' && (
                                <button
                                  onClick={() => handleSimulateExpiration(item, true)}
                                  className="p-1 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-slate-700/60"
                                  title="[Simuler] Forcer l'expiration (Mettre à hier) pour tester la validité d'un an"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                              )}
                              
                              {item.computedStatus === 'expired' && (
                                <button
                                  onClick={() => handleSimulateExpiration(item, false)}
                                  className="p-1 bg-slate-800 hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-400 rounded-lg transition-all border border-slate-700/60"
                                  title="[Simuler] Renouveler la publication pour 1 an de plus"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Moderation Validation Actions */}
                              {item.computedStatus !== 'approved' && (
                                <button
                                  onClick={() => handleApprove(item)}
                                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-all font-bold flex items-center justify-center shadow"
                                  title={currentLang === 'en' ? "Approve and Publish (Starts 1 year expiration)" : "Approuver et Publier (Active pour 1 an pile)"}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {item.computedStatus === 'pending' && (
                                <button
                                  onClick={() => handleReject(item)}
                                  className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 rounded-lg transition-all font-bold flex items-center justify-center border border-amber-500/30"
                                  title={currentLang === 'en' ? "Mark Non-Compliant" : "Rejeter (Non-conforme)"}
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              )}

                              {/* Purge Publication (Supprimer de publication non réglementaire) */}
                              <button
                                onClick={() => handleDeleteListing(item.id, item.name)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/20 flex items-center justify-center"
                                title={currentLang === 'en' ? "Delete permanently (Non-regulatory)" : "Supprimer définitivement (Non réglementaire)"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              {currentLang === 'en'
                ? "Pending submissions are NOT visible to travelers in the main catalog until approved."
                : "Les nouvelles demandes d'inscription ne sont PAS visibles par les voyageurs tant qu'un Admin ne les a pas approuvées."}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {currentLang === 'en' ? "Close Admin Panel" : "Fermer l'Espace Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
