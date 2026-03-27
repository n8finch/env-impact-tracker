// Core calculation engine - single source of truth.
// Also used by the browser extension (browser-extension/src/shared/calculator.ts).

export interface CalculatorOptions {
  reasoningMode: boolean; // x20 - extended thinking models
  longThreads: boolean;   // x3  - context re-processing per turn
  codingHeavy: boolean;   // x1.5 - longer code outputs
}

export interface ImpactResult {
  grams: number;
  kg: number;
  miles: number;
  kettles: number;
  smartphones: number;
}

const EMISSIONS_MAP: Record<string, number> = {
  claude: 400,      // grams CO2e per 1,000 standard queries (2026 benchmark)
  openai: 250,
  gemini: 30,
  copilot: 150,
  perplexity: 300,
};

const GRAMS_PER_MILE = 400;       // average passenger vehicle
const GRAMS_PER_KETTLE = 15;      // boiling 1 liter of water
const GRAMS_PER_SMARTPHONE = 8;   // one full phone charge

function toResult(grams: number): ImpactResult {
  return {
    grams,
    kg: grams / 1000,
    miles: grams / GRAMS_PER_MILE,
    kettles: grams / GRAMS_PER_KETTLE,
    smartphones: grams / GRAMS_PER_SMARTPHONE,
  };
}

/**
 * Slider-based estimate. planMultiplier scales for higher-tier plans
 * (e.g., Claude Max 5× = 5, Max 20× = 20).
 */
export function calculateImpact(
  service: string,
  usagePercent: number,
  options: CalculatorOptions,
  planMultiplier = 1,
): ImpactResult {
  const baseGrams = EMISSIONS_MAP[service] ?? 200;
  let totalGrams = baseGrams * (usagePercent / 100) * planMultiplier;

  if (options.reasoningMode) totalGrams *= 20;
  if (options.longThreads) totalGrams *= 3;
  if (options.codingHeavy) totalGrams *= 1.5;

  return toResult(totalGrams);
}

/**
 * Token-based estimate using actual token counts from the /env-impact command
 * or any API response. Calibrated against track.py output for Claude Code sessions.
 *
 * Cache adjustment: heavy Claude Code sessions are ~90% cache reads. Cache reads
 * are weighted at 10% compute vs fresh tokens, giving an effective ratio of ~16.4%.
 * This matches the track.py formula:
 *   weighted = input + output + cache_created + cache_read × 0.1
 *
 * For other services or mixed sessions, results will be approximate.
 */
export function calculateImpactFromTokens(
  totalRawTokens: number,
  service: string,
): ImpactResult {
  const baseGrams = EMISSIONS_MAP[service] ?? 200;

  // Scale per-token rate to service baseline (0.3g/1K tokens is the Claude coding rate)
  const serviceScale = baseGrams / 400;

  // Cache-adjusted effective tokens (~16.4% of raw for heavy cache sessions)
  const effectiveTokens = totalRawTokens * 0.164;

  // 0.3g per 1,000 effective tokens (Claude coding baseline, already includes 1.5× coding multiplier)
  const grams = (effectiveTokens / 1000) * 0.3 * serviceScale;

  return toResult(grams);
}
