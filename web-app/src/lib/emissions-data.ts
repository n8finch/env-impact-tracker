export interface Plan {
  id: string;
  name: string;
  price: string;
  multiplier: number; // relative to the base plan (1x)
}

export interface Service {
  id: string;
  name: string;
  colorDot: string;
  baselineGrams: number; // grams CO2e per 1,000 standard queries (2026 benchmarks)
  badge: string;
  note: string;
  plans: Plan[];
}

export const SERVICES: Service[] = [
  {
    id: 'claude',
    name: 'Claude',
    colorDot: '#D97706',
    baselineGrams: 400,
    badge: '400g / 1K queries',
    note: 'Claude 3.5 / 3.7 Sonnet baseline',
    plans: [
      { id: 'pro', name: 'Pro', price: '$20/mo', multiplier: 1 },
      { id: 'max5', name: 'Max 5×', price: '$100/mo', multiplier: 5 },
      { id: 'max20', name: 'Max 20×', price: '$200/mo', multiplier: 20 },
    ],
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    colorDot: '#10B981',
    baselineGrams: 250,
    badge: '250g / 1K queries',
    note: 'GPT-4o / o1-mini baseline',
    plans: [
      { id: 'plus', name: 'Plus', price: '$20/mo', multiplier: 1 },
      { id: 'pro', name: 'Pro', price: '$200/mo', multiplier: 10 },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    colorDot: '#3B82F6',
    baselineGrams: 30,
    badge: '30g / 1K queries',
    note: 'TPU-optimized, carbon matched',
    plans: [
      { id: 'advanced', name: 'Advanced', price: '$20/mo', multiplier: 1 },
    ],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    colorDot: '#8B5CF6',
    baselineGrams: 150,
    badge: '150g / 1K queries',
    note: 'GitHub Copilot coding baseline',
    plans: [
      { id: 'individual', name: 'Individual', price: '$10/mo', multiplier: 1 },
      { id: 'business', name: 'Business', price: '$19/mo', multiplier: 2 },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    colorDot: '#F59E0B',
    baselineGrams: 300,
    badge: '300g / 1K queries',
    note: 'Search-augmented baseline',
    plans: [
      { id: 'pro', name: 'Pro', price: '$20/mo', multiplier: 1 },
    ],
  },
];

export interface OffsetProvider {
  tier: 1 | 2 | 3;
  category: string;
  name: string;
  description: string;
  url: string;
}

export const OFFSET_PROVIDERS: OffsetProvider[] = [
  {
    tier: 1,
    category: 'Permanent Removal',
    name: 'Climeworks',
    description:
      'Direct Air Capture with underground mineral storage. The highest-permanence carbon removal available.',
    url: 'https://climeworks.com',
  },
  {
    tier: 2,
    category: 'Verified Offsets',
    name: 'Gold Standard',
    description:
      'WWF-founded registry for rigorously verified global carbon reduction projects.',
    url: 'https://goldstandard.org',
  },
  {
    tier: 2,
    category: 'Verified Offsets',
    name: 'Tradewater',
    description:
      'Prevents leaks of refrigerant gases, thousands of times more potent than CO2.',
    url: 'https://tradewater.us',
  },
  {
    tier: 3,
    category: 'Nature-Based',
    name: 'SeaTrees',
    description:
      'Mangrove and kelp forest restoration, among the fastest carbon sequestration on Earth.',
    url: 'https://onetreeplanted.org/products/seatrees',
  },
  {
    tier: 3,
    category: 'Nature-Based',
    name: 'Ecologi',
    description:
      'Tree planting and carbon reduction project bundles with transparent impact tracking.',
    url: 'https://ecologi.com',
  },
];

export interface Resource {
  title: string;
  author: string;
  description: string;
  url: string;
  tag: string;
}

export const RESOURCES: Resource[] = [
  {
    title: 'Power Hungry Processing',
    author: 'Luccioni, Viguier & Ligozat (2023)',
    description:
      'Measures the energy and carbon cost of training and running popular NLP models, establishing per-query baselines used in this calculator.',
    url: 'https://arxiv.org/abs/2311.16863',
    tag: 'Research Paper',
  },
  {
    title: 'Electricity 2024',
    author: 'International Energy Agency',
    description:
      'IEA analysis of global electricity demand trends, including projections for AI and data center energy consumption through 2026.',
    url: 'https://www.iea.org/reports/electricity-2024',
    tag: 'IEA Report',
  },
  {
    title: 'AI and Energy: The Trends to Watch',
    author: 'Epoch AI',
    description:
      'Tracks compute scaling trends and their relationship to energy use as AI models grow in size and capability.',
    url: 'https://epochai.org/blog/ai-and-energy',
    tag: 'Analysis',
  },
  {
    title: 'Google Environmental Report',
    author: 'Google / Alphabet',
    description:
      "Annual sustainability report covering Google's data center energy mix, carbon commitments, and TPU efficiency gains that underpin Gemini's low baseline.",
    url: 'https://sustainability.google/reports/',
    tag: 'Sustainability Report',
  },
  {
    title: 'Microsoft Environmental Sustainability Report',
    author: 'Microsoft',
    description:
      "Microsoft's annual sustainability report covering Azure data center carbon intensity, which underpins the GitHub Copilot and OpenAI baselines.",
    url: 'https://www.microsoft.com/en-us/sustainability',
    tag: 'Sustainability Report',
  },
];
