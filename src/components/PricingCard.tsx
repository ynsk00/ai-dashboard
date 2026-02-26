'use client';

import type { AIProvider } from '@/lib/types';

const accentMap: Record<string, { border: string; text: string; glow: string; bg: string }> = {
  Gemini: {
    border: 'border-accent-gemini',
    text: 'text-accent-gemini',
    glow: 'glow-gemini',
    bg: 'bg-gemini/10',
  },
  Claude: {
    border: 'border-accent-claude',
    text: 'text-accent-claude',
    glow: 'glow-claude',
    bg: 'bg-claude/10',
  },
  ChatGPT: {
    border: 'border-accent-chatgpt',
    text: 'text-accent-chatgpt',
    glow: 'glow-chatgpt',
    bg: 'bg-chatgpt/10',
  },
};

export default function PricingCard({ provider }: { provider: AIProvider }) {
  const accent = accentMap[provider.name] || accentMap.Gemini;

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-bold font-heading ${accent.text}`}>
        {provider.name}
      </h3>
      {provider.pricing.map((tier) => (
        <div
          key={tier.tierName}
          className={`card-hover rounded-xl border border-card-border bg-card-bg p-5`}
        >
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-bold text-foreground">{tier.tierName}</span>
            <span className={`text-lg font-bold font-mono ${accent.text}`}>
              {tier.price}
            </span>
          </div>
          <ul className="space-y-1.5">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <span className={`mt-0.5 ${accent.text}`}>&#x2713;</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
