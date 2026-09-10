export interface MenIngredientItem {
  id: string;
  name: string;
  productTag: 'ALPHAMAX' | 'WANTMORE';
  description: string;
  classicalRole: string;
  icon: string;
}

export const ALPHAMAX_INGREDIENTS: MenIngredientItem[] = [
  {
    id: 'shilajit-extract',
    name: 'Shilajit Extract',
    productTag: 'ALPHAMAX',
    description: 'Traditional Ayurvedic ingredient used in vitality-focused formulations.',
    classicalRole: 'Rasayana & Balya',
    icon: '🏔️'
  },
  {
    id: 'safed-musli',
    name: 'Safed Musli',
    productTag: 'ALPHAMAX',
    description: 'Traditional Ayurvedic herb commonly used in strength and vitality formulations.',
    classicalRole: 'Vrishya & Poshan',
    icon: '🌱'
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    productTag: 'ALPHAMAX',
    description: 'Adaptogenic Ayurvedic herb traditionally used to support energy, resilience and recovery.',
    classicalRole: 'Ojas & Stamina',
    icon: '🌿'
  },
  {
    id: 'kaunch-beej',
    name: 'Kaunch Beej',
    productTag: 'ALPHAMAX',
    description: 'Traditional Ayurvedic ingredient used in men’s vitality formulations.',
    classicalRole: 'Dhatu Nourishment',
    icon: '🌰'
  },
  {
    id: 'swaran-bhasma-alphamax',
    name: 'Swaran Bhasma',
    productTag: 'ALPHAMAX',
    description: 'Classical Ayurvedic ingredient used in traditional wellness formulations.',
    classicalRole: 'Suvarna Rasayana',
    icon: '✨'
  },
  {
    id: 'kesar',
    name: 'Kesar',
    productTag: 'ALPHAMAX',
    description: 'Traditional premium Ayurvedic ingredient used in vitality and wellness formulations.',
    classicalRole: 'Varnya & Tridoshic Harmonizer',
    icon: '🌺'
  }
];

export const WANTMORE_INGREDIENTS: MenIngredientItem[] = [
  {
    id: 'swaran-bhasma-wantmore',
    name: 'Swaran Bhasma',
    productTag: 'WANTMORE',
    description: 'Classical Ayurvedic ingredient used in traditional wellness formulations.',
    classicalRole: 'Suvarna Rasayana',
    icon: '✨'
  },
  {
    id: 'chandi-bhasma',
    name: 'Chandi Bhasma',
    productTag: 'WANTMORE',
    description: 'Classical Ayurvedic mineral preparation traditionally used in rejuvenation and vitality formulations.',
    classicalRole: 'Rajat Bhasma / Pitta Shamaka',
    icon: '🌙'
  },
  {
    id: 'moti-pishti',
    name: 'Moti Pishti',
    productTag: 'WANTMORE',
    description: 'Purified pearl preparation traditionally valued in Ayurveda for soothing balance and vitality.',
    classicalRole: 'Mukta Pishti / Calm Vitality',
    icon: '🦪'
  },
  {
    id: 'salam-panja',
    name: 'Salam Panja',
    productTag: 'WANTMORE',
    description: 'Prized Himalayan herb traditionally used in classical strength and stamina formulations.',
    classicalRole: 'Dhatu Vardhak',
    icon: '🌿'
  },
  {
    id: 'siddh-makardhwaj',
    name: 'Siddh Makardhwaj',
    productTag: 'WANTMORE',
    description: 'Classical Ayurvedic Rasayana preparation traditionally used to support vigor and vitality.',
    classicalRole: 'Classical Yogavahi Rasayana',
    icon: '⚡'
  },
  {
    id: 'jayfal',
    name: 'Jayfal',
    productTag: 'WANTMORE',
    description: 'Traditional Ayurvedic spice used to enhance formulation synergy, absorption and warmth.',
    classicalRole: 'Deepana & Pachana Synergist',
    icon: '🍂'
  }
];
