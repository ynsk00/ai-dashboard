'use client';

import type { AIProvider } from '@/lib/types';
import Badge from './Badge';

export default function FeatureTable({
  providers,
}: {
  providers: AIProvider[];
}) {
  // Collect all unique categories
  const categories = new Map<string, Set<string>>();
  for (const p of providers) {
    for (const fc of p.features) {
      if (!categories.has(fc.category)) {
        categories.set(fc.category, new Set());
      }
      for (const item of fc.items) {
        categories.get(fc.category)!.add(item.name);
      }
    }
  }

  const accentText: Record<string, string> = {
    Gemini: 'text-accent-gemini',
    Claude: 'text-accent-claude',
    ChatGPT: 'text-accent-chatgpt',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left py-3 px-4 text-muted font-mono text-xs font-medium w-[200px]">
              機能
            </th>
            {providers.map((p) => (
              <th
                key={p.name}
                className={`text-center py-3 px-4 font-bold ${accentText[p.name] || ''}`}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(categories.entries()).map(([category, featureNames]) => (
            <>
              <tr key={`cat-${category}`}>
                <td
                  colSpan={providers.length + 1}
                  className="pt-6 pb-2 px-4 text-xs font-mono font-bold text-muted uppercase tracking-wider"
                >
                  {category}
                </td>
              </tr>
              {Array.from(featureNames).map((featureName) => (
                <tr
                  key={`${category}-${featureName}`}
                  className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 text-foreground">{featureName}</td>
                  {providers.map((p) => {
                    const cat = p.features.find((f) => f.category === category);
                    const item = cat?.items.find((i) => i.name === featureName);
                    return (
                      <td key={p.name} className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant={item?.status || 'no'} />
                          {item?.detail && (
                            <span className="text-xs text-muted">
                              {item.detail}
                            </span>
                          )}
                          {item?.isNew && <Badge variant="new" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
