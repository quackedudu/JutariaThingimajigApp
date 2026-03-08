export type EventType = 'chance' | 'fate';
export type EventCategory = 'lucky' | 'unlucky';

export interface GameEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  title: string;
  description: string;
  moneyChange: number; // positive for gain, negative for loss
  emoji: string;
}

// Chance Events (7:3 ratio - 14 lucky, 6 unlucky)
const chanceEvents: GameEvent[] = [
  // Lucky Chance Events (14)
  {
    id: 'chance_lucky_1',
    type: 'chance',
    category: 'lucky',
    title: 'Bank Error in Your Favor!',
    description: 'The bank made a mistake and credited your account.',
    moneyChange: 15000,
    emoji: '💰'
  },
  {
    id: 'chance_lucky_2',
    type: 'chance',
    category: 'lucky',
    title: 'Business Bonus',
    description: 'Your side business is doing well this quarter!',
    moneyChange: 10000,
    emoji: '📈'
  },
  {
    id: 'chance_lucky_3',
    type: 'chance',
    category: 'lucky',
    title: 'Tax Refund',
    description: 'You received a tax refund from the government.',
    moneyChange: 12000,
    emoji: '🎁'
  },
  {
    id: 'chance_lucky_4',
    type: 'chance',
    category: 'lucky',
    title: 'Investment Returns',
    description: 'Your stock portfolio performed exceptionally well!',
    moneyChange: 20000,
    emoji: '📊'
  },
  {
    id: 'chance_lucky_5',
    type: 'chance',
    category: 'lucky',
    title: 'Inheritance',
    description: 'A distant relative left you some money.',
    moneyChange: 25000,
    emoji: '💝'
  },
  {
    id: 'chance_lucky_6',
    type: 'chance',
    category: 'lucky',
    title: 'Contest Winner',
    description: 'You won a local radio contest!',
    moneyChange: 8000,
    emoji: '🏆'
  },
  {
    id: 'chance_lucky_7',
    type: 'chance',
    category: 'lucky',
    title: 'Freelance Job',
    description: 'A quick freelance gig paid well.',
    moneyChange: 7000,
    emoji: '💻'
  },
  {
    id: 'chance_lucky_8',
    type: 'chance',
    category: 'lucky',
    title: 'Found Money',
    description: 'You found money in your old jacket pocket!',
    moneyChange: 5000,
    emoji: '🧥'
  },
  {
    id: 'chance_lucky_9',
    type: 'chance',
    category: 'lucky',
    title: 'Birthday Gift',
    description: 'Family members pooled money for your birthday.',
    moneyChange: 10000,
    emoji: '🎂'
  },
  {
    id: 'chance_lucky_10',
    type: 'chance',
    category: 'lucky',
    title: 'Scholarship Grant',
    description: 'You received an education grant.',
    moneyChange: 15000,
    emoji: '🎓'
  },
  {
    id: 'chance_lucky_11',
    type: 'chance',
    category: 'lucky',
    title: 'Property Sale',
    description: 'You sold an old item for more than expected.',
    moneyChange: 8000,
    emoji: '🏷️'
  },
  {
    id: 'chance_lucky_12',
    type: 'chance',
    category: 'lucky',
    title: 'Referral Bonus',
    description: 'You earned a referral bonus from a friend.',
    moneyChange: 6000,
    emoji: '🤝'
  },
  {
    id: 'chance_lucky_13',
    type: 'chance',
    category: 'lucky',
    title: 'Performance Bonus',
    description: 'Your company gave you a performance bonus!',
    moneyChange: 18000,
    emoji: '⭐'
  },
  {
    id: 'chance_lucky_14',
    type: 'chance',
    category: 'lucky',
    title: 'Lucky Draw',
    description: 'You won a shopping mall lucky draw!',
    moneyChange: 12000,
    emoji: '🎰'
  },
  // Unlucky Chance Events (6)
  {
    id: 'chance_unlucky_1',
    type: 'chance',
    category: 'unlucky',
    title: 'Car Breakdown',
    description: 'Your car needs urgent repairs.',
    moneyChange: -8000,
    emoji: '🚗'
  },
  {
    id: 'chance_unlucky_2',
    type: 'chance',
    category: 'unlucky',
    title: 'Medical Bill',
    description: 'Unexpected medical expenses came up.',
    moneyChange: -10000,
    emoji: '🏥'
  },
  {
    id: 'chance_unlucky_3',
    type: 'chance',
    category: 'unlucky',
    title: 'Home Repair',
    description: 'Your roof started leaking and needs fixing.',
    moneyChange: -12000,
    emoji: '🏠'
  },
  {
    id: 'chance_unlucky_4',
    type: 'chance',
    category: 'unlucky',
    title: 'Parking Fine',
    description: 'You got multiple parking tickets.',
    moneyChange: -3000,
    emoji: '🚫'
  },
  {
    id: 'chance_unlucky_5',
    type: 'chance',
    category: 'unlucky',
    title: 'Phone Replacement',
    description: 'You dropped your phone and need a new one.',
    moneyChange: -5000,
    emoji: '📱'
  },
  {
    id: 'chance_unlucky_6',
    type: 'chance',
    category: 'unlucky',
    title: 'Utility Bills',
    description: 'High electricity bills this month!',
    moneyChange: -4000,
    emoji: '⚡'
  }
];

// Fate Events (2:3 ratio - 8 lucky, 12 unlucky)
const fateEvents: GameEvent[] = [
  // Lucky Fate Events (8)
  {
    id: 'fate_lucky_1',
    type: 'fate',
    category: 'lucky',
    title: 'Lottery Win!',
    description: 'You won a small lottery prize!',
    moneyChange: 30000,
    emoji: '🎫'
  },
  {
    id: 'fate_lucky_2',
    type: 'fate',
    category: 'lucky',
    title: 'Promotion',
    description: 'You got promoted with a signing bonus!',
    moneyChange: 25000,
    emoji: '👔'
  },
  {
    id: 'fate_lucky_3',
    type: 'fate',
    category: 'lucky',
    title: 'Real Estate Profit',
    description: 'Your property value increased significantly!',
    moneyChange: 35000,
    emoji: '🏘️'
  },
  {
    id: 'fate_lucky_4',
    type: 'fate',
    category: 'lucky',
    title: 'Government Grant',
    description: 'You qualified for a special government grant.',
    moneyChange: 20000,
    emoji: '🏛️'
  },
  {
    id: 'fate_lucky_5',
    type: 'fate',
    category: 'lucky',
    title: 'Business Deal',
    description: 'A major business deal went through successfully!',
    moneyChange: 40000,
    emoji: '💼'
  },
  {
    id: 'fate_lucky_6',
    type: 'fate',
    category: 'lucky',
    title: 'Treasure Found',
    description: 'You discovered valuable antiques in your attic!',
    moneyChange: 22000,
    emoji: '🗝️'
  },
  {
    id: 'fate_lucky_7',
    type: 'fate',
    category: 'lucky',
    title: 'Court Settlement',
    description: 'You won a court case and received compensation.',
    moneyChange: 28000,
    emoji: '⚖️'
  },
  {
    id: 'fate_lucky_8',
    type: 'fate',
    category: 'lucky',
    title: 'Crypto Gains',
    description: 'Your cryptocurrency investment paid off!',
    moneyChange: 32000,
    emoji: '₿'
  },
  // Unlucky Fate Events (12)
  {
    id: 'fate_unlucky_1',
    type: 'fate',
    category: 'unlucky',
    title: 'Property Tax',
    description: 'Annual property tax is due!',
    moneyChange: -15000,
    emoji: '📋'
  },
  {
    id: 'fate_unlucky_2',
    type: 'fate',
    category: 'unlucky',
    title: 'Investment Loss',
    description: 'Your investments performed poorly this quarter.',
    moneyChange: -18000,
    emoji: '📉'
  },
  {
    id: 'fate_unlucky_3',
    type: 'fate',
    category: 'unlucky',
    title: 'Legal Fees',
    description: 'You had to pay unexpected legal fees.',
    moneyChange: -20000,
    emoji: '⚖️'
  },
  {
    id: 'fate_unlucky_4',
    type: 'fate',
    category: 'unlucky',
    title: 'Business Setback',
    description: 'Your business faced unexpected losses.',
    moneyChange: -25000,
    emoji: '💸'
  },
  {
    id: 'fate_unlucky_5',
    type: 'fate',
    category: 'unlucky',
    title: 'Flood Damage',
    description: 'Heavy rain caused damage to your property.',
    moneyChange: -22000,
    emoji: '🌊'
  },
  {
    id: 'fate_unlucky_6',
    type: 'fate',
    category: 'unlucky',
    title: 'Theft',
    description: 'Some of your valuables were stolen.',
    moneyChange: -12000,
    emoji: '🚨'
  },
  {
    id: 'fate_unlucky_7',
    type: 'fate',
    category: 'unlucky',
    title: 'Insurance Premium',
    description: 'Your insurance premiums increased drastically.',
    moneyChange: -10000,
    emoji: '🛡️'
  },
  {
    id: 'fate_unlucky_8',
    type: 'fate',
    category: 'unlucky',
    title: 'Renovation Costs',
    description: 'Mandatory building renovations required.',
    moneyChange: -28000,
    emoji: '🔨'
  },
  {
    id: 'fate_unlucky_9',
    type: 'fate',
    category: 'unlucky',
    title: 'Fine & Penalty',
    description: 'You received a hefty fine from authorities.',
    moneyChange: -14000,
    emoji: '⚠️'
  },
  {
    id: 'fate_unlucky_10',
    type: 'fate',
    category: 'unlucky',
    title: 'Loan Payment',
    description: 'A forgotten loan payment is now due.',
    moneyChange: -16000,
    emoji: '💳'
  },
  {
    id: 'fate_unlucky_11',
    type: 'fate',
    category: 'unlucky',
    title: 'Equipment Failure',
    description: 'Your business equipment broke down.',
    moneyChange: -18000,
    emoji: '⚙️'
  },
  {
    id: 'fate_unlucky_12',
    type: 'fate',
    category: 'unlucky',
    title: 'Emergency Expenses',
    description: 'Unexpected family emergency expenses.',
    moneyChange: -20000,
    emoji: '🆘'
  }
];

export function getRandomEvent(eventType: EventType): GameEvent {
  const events = eventType === 'chance' ? chanceEvents : fateEvents;
  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}

export function getRandomEventType(): EventType {
  // 50/50 chance of getting Chance or Fate
  return Math.random() < 0.5 ? 'chance' : 'fate';
}
