import { NextRequest, NextResponse } from 'next/server';
import { fetchReleaseNotes } from '@/lib/scraper';
import { structurize } from '@/lib/structurize';
import type { AIProvider } from '@/lib/types';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/providers.json');

function isAuthorized(req: NextRequest): boolean {
  // Check for Vercel Cron secret
  const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (cronSecret && cronSecret === process.env.CRON_SECRET) return true;

  // Check for UPDATE_SECRET
  const updateSecret =
    req.headers.get('x-update-secret') ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (updateSecret && updateSecret === process.env.UPDATE_SECRET) return true;

  return false;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providers: ('gemini' | 'claude' | 'chatgpt')[] = [
    'gemini',
    'claude',
    'chatgpt',
  ];
  const results: AIProvider[] = [];
  const errors: string[] = [];

  // Load existing data as fallback
  let existingData: AIProvider[] = [];
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    existingData = JSON.parse(raw);
  } catch {
    // No existing data
  }

  for (const provider of providers) {
    try {
      const text = await fetchReleaseNotes(provider);
      const structured = await structurize(provider, text);
      results.push(structured);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error processing ${provider}:`, message);
      errors.push(`${provider}: ${message}`);
      // Use existing data as fallback
      const fallback = existingData.find(
        (p) => p.name.toLowerCase() === provider
      );
      if (fallback) {
        results.push(fallback);
      }
    }
  }

  if (results.length > 0) {
    try {
      await writeFile(DATA_PATH, JSON.stringify(results, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write data file:', err);
    }
  }

  return NextResponse.json({
    success: true,
    updated: results.map((r) => r.name),
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}

// Also handle GET for Vercel Cron (crons use GET by default)
export async function GET(req: NextRequest) {
  return POST(req);
}
