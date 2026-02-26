'use client';

import type { RecentUpdate } from '@/lib/types';
import Badge from './Badge';
import { format, parseISO, isAfter, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';

const accentStyles: Record<string, { border: string; bg: string }> = {
  Gemini: { border: 'border-accent-gemini/30', bg: 'bg-gemini/5' },
  Claude: { border: 'border-accent-claude/30', bg: 'bg-claude/5' },
  ChatGPT: { border: 'border-accent-chatgpt/30', bg: 'bg-chatgpt/5' },
};

export default function UpdateCard({
  update,
  providerName,
}: {
  update: RecentUpdate;
  providerName: string;
}) {
  const accent = accentStyles[providerName] || accentStyles.Gemini;
  const date = parseISO(update.date);
  const isNew = isAfter(date, subMonths(new Date(), 1));

  return (
    <div
      className={`card-hover rounded-xl border ${accent.border} bg-card-bg p-5`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-foreground text-sm leading-tight">
          {update.title}
        </h4>
        {isNew && <Badge variant="new" />}
      </div>
      <p className="text-sm text-muted leading-relaxed mb-3">
        {update.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted">
          {format(date, 'yyyy年M月d日', { locale: ja })}
        </span>
        <span
          className={`text-xs font-mono font-medium ${
            providerName === 'Gemini'
              ? 'text-accent-gemini'
              : providerName === 'Claude'
                ? 'text-accent-claude'
                : 'text-accent-chatgpt'
          }`}
        >
          {providerName}
        </span>
      </div>
    </div>
  );
}
