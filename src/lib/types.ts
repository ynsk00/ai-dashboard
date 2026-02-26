export interface FeatureItem {
  name: string;
  status: 'yes' | 'no' | 'partial';
  detail?: string;
  isNew?: boolean;
}

export interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

export interface RecentUpdate {
  title: string;
  description: string;
  date: string;
}

export interface PricingTier {
  tierName: string;
  price: string;
  features: string[];
}

export interface AIProvider {
  name: string;
  company: string;
  flagshipModel: string;
  fastModel: string;
  contextWindow: string;
  reasoningMode: string;
  lastUpdated: string;
  features: FeatureCategory[];
  recentUpdates: RecentUpdate[];
  pricing: PricingTier[];
}
