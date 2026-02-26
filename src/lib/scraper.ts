import * as cheerio from 'cheerio';
import { subMonths, isAfter, parse } from 'date-fns';

type Provider = 'gemini' | 'claude' | 'chatgpt';

const URLS: Record<Provider, string[]> = {
  gemini: [
    'https://ai.google.dev/gemini-api/docs/changelog',
  ],
  claude: [
    'https://docs.anthropic.com/en/docs/about-claude/models',
  ],
  chatgpt: [
    'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
  ],
};

async function fetchHTML(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(html: string): string {
  const $ = cheerio.load(html);
  // Remove script, style, nav, footer elements
  $('script, style, nav, footer, header, aside').remove();
  // Get main content
  const main = $('main, article, .content, [role="main"]');
  const text = main.length > 0 ? main.text() : $('body').text();
  // Clean up whitespace
  return text.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function trimToRecentMonths(text: string, months = 3): string {
  const cutoff = subMonths(new Date(), months);

  // Try to find date headers and keep only recent ones
  const datePatterns = [
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
    /\d{4}-\d{2}-\d{2}/g,
    /\d{1,2}\/\d{1,2}\/\d{4}/g,
  ];

  let earliestRecentIndex = text.length;

  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      try {
        const dateStr = match[0];
        let parsed: Date | null = null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          parsed = new Date(dateStr);
        } else if (/\//.test(dateStr)) {
          parsed = parse(dateStr, 'M/d/yyyy', new Date());
        } else {
          parsed = new Date(dateStr);
        }
        if (parsed && !isNaN(parsed.getTime()) && isAfter(parsed, cutoff)) {
          earliestRecentIndex = Math.min(earliestRecentIndex, match.index);
        }
      } catch {
        // skip unparseable dates
      }
    }
  }

  // If we found recent dates, include some context before the first one
  if (earliestRecentIndex < text.length) {
    const start = Math.max(0, earliestRecentIndex - 500);
    return text.slice(start);
  }

  // Fallback: return first 8000 chars
  return text.slice(0, 8000);
}

export async function fetchReleaseNotes(provider: Provider): Promise<string> {
  const urls = URLS[provider];
  const results: string[] = [];

  for (const url of urls) {
    try {
      const html = await fetchHTML(url);
      const text = extractText(html);
      results.push(text);
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err);
    }
  }

  if (results.length === 0) {
    throw new Error(`Failed to fetch any release notes for ${provider}`);
  }

  const combined = results.join('\n\n---\n\n');
  return trimToRecentMonths(combined);
}
