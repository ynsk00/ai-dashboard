'use client';

import { useState } from 'react';
import providersData from '@/data/providers.json';
import type { AIProvider } from '@/lib/types';
import TabBar, { type TabId } from '@/components/TabBar';
import ProviderCard from '@/components/ProviderCard';
import FeatureTable from '@/components/FeatureTable';
import UpdateCard from '@/components/UpdateCard';
import PricingCard from '@/components/PricingCard';

const providers = providersData as AIProvider[];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const showSection = (section: TabId) =>
    activeTab === 'all' || activeTab === section;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            3大AI 機能一覧{' '}
            <span className="text-muted text-2xl sm:text-3xl">2026年最新版</span>
          </h1>
          <p className="mt-2 text-sm text-muted font-mono">
            最終更新: {providers[0]?.lastUpdated || '不明'} &middot;
            Gemini / Claude / ChatGPT 比較ダッシュボード
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Tab Bar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Models Section */}
        {showSection('models') && (
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground mb-6">
              モデル概要
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.map((p) => (
                <ProviderCard key={p.name} provider={p} />
              ))}
            </div>
          </section>
        )}

        {/* Feature Comparison */}
        {showSection('features') && (
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground mb-6">
              機能比較
            </h2>
            <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden">
              <FeatureTable providers={providers} />
            </div>
          </section>
        )}

        {/* Recent Updates */}
        {showSection('updates') && (
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground mb-6">
              最新アップデート
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.map((p) => (
                <div key={p.name} className="space-y-4">
                  {p.recentUpdates.map((update, i) => (
                    <UpdateCard
                      key={i}
                      update={update}
                      providerName={p.name}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {showSection('pricing') && (
          <section>
            <h2 className="text-xl font-bold font-heading text-foreground mb-6">
              料金プラン
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {providers.map((p) => (
                <PricingCard key={p.name} provider={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-muted text-center">
            ※ 本サイトの情報は各社の公式リリースノートを基に自動生成されています。正確性を保証するものではありません。
            <br />
            最終更新: {providers[0]?.lastUpdated || '不明'} &middot; データは毎日自動更新されます
          </p>
        </div>
      </footer>
    </div>
  );
}
