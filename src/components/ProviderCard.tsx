'use client';

import type { AIProvider } from '@/lib/types';

const accentMap: Record<string, { border: string; text: string; glow: string }> = {
  Gemini: { border: 'border-accent-gemini', text: 'text-accent-gemini', glow: 'glow-gemini' },
  Claude: { border: 'border-accent-claude', text: 'text-accent-claude', glow: 'glow-claude' },
  ChatGPT: { border: 'border-accent-chatgpt', text: 'text-accent-chatgpt', glow: 'glow-chatgpt' },
};

export default function ProviderCard({ provider }: { provider: AIProvider }) {
  const accent = accentMap[provider.name] || accentMap.Gemini;

  return (
    <div
      className={`card-hover rounded-2xl border-t-2 ${accent.border} ${accent.glow} bg-card-bg border border-card-border p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-xl font-bold font-heading ${accent.text}`}>
            {provider.name}
          </h3>
          <p className="text-sm text-muted">{provider.company}</p>
        </div>
      </div>

      <div className="space-y-3">
        <InfoRow label="フラッグシップ" value={provider.flagshipModel} />
        <InfoRow label="高速モデル" value={provider.fastModel} />
        <InfoRow label="コンテキスト" value={provider.contextWindow} />
        <InfoRow label="推論モード" value={provider.reasoningMode} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted font-mono text-xs">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
