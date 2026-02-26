'use client';

const tabs = [
  { id: 'all', label: 'すべて' },
  { id: 'models', label: 'モデル' },
  { id: 'features', label: '機能比較' },
  { id: 'updates', label: '最新アップデート' },
  { id: 'pricing', label: '料金' },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export default function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-card-bg border border-card-border p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-white/10 text-white'
              : 'text-muted hover:text-foreground hover:bg-white/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
