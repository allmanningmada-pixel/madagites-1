import { Accommodation } from './types';

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: '1',
    name: 'Bungalow Ravinala',
    type: 'Chambre d\'hôte',
    city: 'Nosy Be',
    region: 'Diana',
    priceAriary: 120000,
    priceEuro: 27,
    photo: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=85',
    description: 'Bungalow traditionnel en bois de palissandre avec toit en feuilles de Ravinala. Situé les pieds dans l\'eau sur la plage d\'Ambatoloaka. Parfait pour admirer les couchers de soleil tropicaux dans un calme absolu.',
    amenities: ['Wi-Fi gratuit', 'Plage privée', 'Ventilateur', 'Eau chaude', 'Petit-déjeuner inclus', 'Transfert aéroport'],
    whatsappNumber: '+261340000001',
    capacity: '2 personnes',
    locationDetails: 'À 5 minutes à pied des restaurants locaux d\'Ambatoloaka, en bordure directe de plage.',
    isFeatured: true
  },
  {
    id: '2',
    name: 'Le Gîte des Tsingy',
    type: 'Gîte d\'étape',
    city: 'Ankarana (Ambilobe)',
    region: 'Diana',
    priceAriary: 80000,
    priceEuro: 18,
    photo: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=85',
    description: 'Une escale chaleureuse et rustique idéale pour les randonneurs visitant le parc national de l\'Ankarana. Cabanes en bois entourées d\'une végétation luxuriante où vous pourrez observer des lémuriens au réveil.',
    amenities: ['Restaurant sur place', 'Moustiquaire', 'Électricité solaire', 'Sanitaires communs', 'Guides touristiques'],
    whatsappNumber: '+261320000002',
    capacity: '2 à 4 personnes',
    locationDetails: 'À seulement 500m de l\'entrée Est du Parc National de l\'Ankarana.',
    isFeatured: false
  },
  {
    id: '3',
    name: 'Villa Baobab',
    type: 'Chambre d\'hôte',
    city: 'Morondava',
    region: 'Menabe',
    priceAriary: 160000,
    priceEuro: 36,
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
    description: 'Une magnifique villa d\'hôtes alliant confort moderne et style traditionnel malgache. Idéalement située pour visiter la célèbre Allée des Baobabs au lever ou au coucher du soleil.',
    amenities: ['Wi-Fi gratuit', 'Piscine extérieure', 'Climatisation', 'Eau chaude', 'Cuisine équipée', 'Parking sécurisé'],
    whatsappNumber: '+261340000003',
    capacity: '2 à 3 personnes',
    locationDetails: 'Dans le quartier résidentiel de Nosy Kely, à 2 minutes de la plage et 30 minutes de l\'Allée des Baobabs.',
    isFeatured: true
  },
  {
    id: '4',
    name: 'Le Chalet des Hautes Terres',
    type: 'Chambre d\'hôte',
    city: 'Antsirabe',
    region: 'Vakinankaratra',
    priceAriary: 95000,
    priceEuro: 21,
    photo: 'https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=800&q=85',
    description: 'Maison d\'hôtes de charme en briques rouges typiques des Hauts Plateaux. Ambiance chaleureuse avec cheminée pour les soirées fraîches d\'Antsirabe, salon de thé et jardin fleuri très soigné.',
    amenities: ['Cheminée', 'Petit-déjeuner inclus', 'Chauffage d\'appoint', 'Eau chaude', 'Bibliothèque', 'Jardin clos'],
    whatsappNumber: '+261330000004',
    capacity: '2 à 4 personnes',
    locationDetails: 'Situé dans un quartier calme et historique d\'Antsirabe, non loin des artisans de miniatures.',
    isFeatured: false
  },
  {
    id: '5',
    name: 'Gîte de l\'Isalo Oasis',
    type: 'Gîte d\'étape',
    city: 'Ranohira (Isalo)',
    region: 'Ihorombe',
    priceAriary: 110000,
    priceEuro: 25,
    photo: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=85',
    description: 'Éco-gîte construit en pierres de l\'Isalo se fondant parfaitement dans le paysage de grès ruiniforme. Un lieu magique pour se ressourcer après une journée de trekking intense dans le canyon.',
    amenities: ['Panneaux solaires', 'Eau chaude', 'Restaurant panoramique', 'Espace feu de camp', 'Moustiquaire', 'Randonnées accompagnées'],
    whatsappNumber: '+261340000005',
    capacity: '1 à 5 personnes (dortoirs & privés)',
    locationDetails: 'Bordure du Parc National de l\'Isalo, à 2km du village de Ranohira.',
    isFeatured: true
  },
  {
    id: '6',
    name: 'L\'Éco-Lodge de Ranomafana',
    type: 'Gîte d\'étape',
    city: 'Ranomafana',
    region: 'Haute Matsiatra',
    priceAriary: 85000,
    priceEuro: 19,
    photo: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=85',
    description: 'Gîte d\'étape d\'inspiration écologique au cœur de la forêt tropicale humide de Ranomafana. Écoutez le chant des oiseaux et le murmure de la rivière Namorona depuis votre balcon en bois.',
    amenities: ['Balcon privé', 'Moustiquaire', 'Restauration bio locale', 'Eau chaude', 'Wi-Fi à l\'accueil', 'Espace de yoga'],
    whatsappNumber: '+261340000006',
    capacity: '2 personnes',
    locationDetails: 'Surplombant la rivière Namorona, à 10 minutes en voiture de l\'entrée principale du parc thermal.',
    isFeatured: false
  }
];

export const AVAILABLE_REGIONS = [
  'Toutes les régions',
  'Diana',
  'Menabe',
  'Vakinankaratra',
  'Ihorombe',
  'Haute Matsiatra'
];

export const ALL_AMENITIES_OPTIONS = [
  'Wi-Fi gratuit',
  'Eau chaude',
  'Petit-déjeuner inclus',
  'Moustiquaire',
  'Restaurant sur place',
  'Parking sécurisé',
  'Plage privée',
  'Piscine extérieure',
  'Climatisation',
  'Cheminée',
  'Électricité solaire'
];
