import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider } from './types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたはAI業界のアナリストです。リリースノーステキストから、指定されたJSON構造で情報を抽出してください。

ルール:
- 日本語で出力
- 最新の情報を優先
- 不明な項目はnullではなく「不明」と記載
- 機能の有無は公式情報に基づいて判断
- JSONのみを出力（マークダウンのコードブロック不要）`;

function buildUserPrompt(provider: string, text: string): string {
  return `以下は${provider}のリリースノート・ドキュメントから抽出したテキストです。

このテキストから以下のJSON構造で情報を抽出してください:

{
  "name": "プロバイダ名（Gemini/Claude/ChatGPT）",
  "company": "会社名",
  "flagshipModel": "最上位モデル名",
  "fastModel": "高速モデル名",
  "contextWindow": "コンテキストウィンドウサイズ",
  "reasoningMode": "推論モード名",
  "lastUpdated": "ISO date（今日の日付）",
  "features": [
    {
      "category": "カテゴリ名（テキスト・推論 / マルチモーダル / コーディング / ファイル生成 / 外部連携 / ユニーク機能）",
      "items": [
        {
          "name": "機能名",
          "status": "yes/no/partial",
          "detail": "具体的な製品名やモデル名",
          "isNew": true/false（直近1ヶ月の新機能かどうか）
        }
      ]
    }
  ],
  "recentUpdates": [
    {
      "title": "アップデートタイトル",
      "description": "日本語で2-3行の説明",
      "date": "YYYY-MM-DD"
    }
  ],
  "pricing": [
    {
      "tierName": "プラン名",
      "price": "価格",
      "features": ["含まれる機能リスト"]
    }
  ]
}

---テキスト---
${text.slice(0, 6000)}
---`;
}

export async function structurize(
  provider: string,
  text: string
): Promise<AIProvider> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(provider, text),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  // Clean up potential markdown code blocks
  let jsonStr = content.text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(jsonStr) as AIProvider;
}
