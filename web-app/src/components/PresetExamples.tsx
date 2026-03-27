import type { CalculatorOptions } from '../lib/calculator';

export interface Preset {
  id: string;
  label: string;
  title: string;
  description: string;
  service: string;
  plan: string;
  usage: number;
  options: CalculatorOptions;
}

export const PRESETS: Preset[] = [
  {
    id: 'web-dev',
    label: '👩‍💻 Web Dev',
    title: 'Web Developer — Claude Code + Sonnet',
    description:
      'Claude Code sessions are long and code-heavy. Sonnet (not extended-thinking) keeps Reasoning off. Long Threads and Coding Heavy are both on because agentic coding sessions run deep.',
    service: 'claude',
    plan: 'pro',
    usage: 85,
    options: { reasoningMode: false, longThreads: true, codingHeavy: true },
  },
  {
    id: 'researcher',
    label: '📚 Researcher',
    title: 'ChatGPT Researcher (non-coding)',
    description:
      'Research conversations grow long as context builds up, but there\'s no code output, so Coding Heavy is off. No reasoning model needed for general research queries.',
    service: 'openai',
    plan: 'plus',
    usage: 40,
    options: { reasoningMode: false, longThreads: true, codingHeavy: false },
  },
  {
    id: 'casual-search',
    label: '🔍 Casual Search',
    title: 'Casual AI Web Search',
    description:
      'Short, one-off queries replacing a search engine — no long threads, no code, no reasoning models. Low usage and all multipliers off makes this the lightest footprint of any AI use pattern.',
    service: 'perplexity',
    plan: 'pro',
    usage: 20,
    options: { reasoningMode: false, longThreads: false, codingHeavy: false },
  },
  {
    id: 'datascience',
    label: '🔬 Data Science',
    title: 'Deep Data Science Research',
    description:
      'A heavy Claude user doing iterative analysis likely needs Max 5× for the rate limits alone. All three multipliers apply: extended-thinking for complex analysis, code for data pipelines and notebooks, and long threads across a full research arc.',
    service: 'claude',
    plan: 'max5',
    usage: 70,
    options: { reasoningMode: true, longThreads: true, codingHeavy: true },
  },
];

interface Props {
  activePreset: string | null;
  onSelect: (preset: Preset) => void;
}

export function PresetExamples({ activePreset, onSelect }: Props) {
  return (
    <div>
      {/* Pill row */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className="rounded-full px-4 py-1.5 font-mono text-xs border transition-colors"
              style={{
                background: isActive ? 'var(--color-eco)' : 'var(--color-surface)',
                borderColor: isActive ? 'var(--color-eco)' : 'var(--color-rim)',
                color: isActive ? '#0a0e0b' : 'var(--color-ink-muted)',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {preset.label}
            </button>
          );
        })}
        {activePreset && (
          <button
            onClick={() => onSelect({ id: '', label: '', title: '', description: '', service: 'claude', plan: 'pro', usage: 50, options: { reasoningMode: false, longThreads: false, codingHeavy: false } })}
            className="rounded-full px-4 py-1.5 font-mono text-xs border transition-colors"
            style={{
              background: 'transparent',
              borderColor: 'var(--color-rim)',
              color: 'var(--color-ink-dim)',
              cursor: 'pointer',
            }}
          >
            × clear
          </button>
        )}
      </div>

      {/* Active preset description card */}
      {activePreset && (() => {
        const preset = PRESETS.find((p) => p.id === activePreset);
        if (!preset) return null;
        return (
          <div
            className="rounded-xl border px-5 py-4"
            style={{
              background: 'rgba(16,185,129,0.05)',
              borderColor: 'rgba(16,185,129,0.3)',
            }}
          >
            <p
              className="font-display font-semibold text-sm mb-1"
              style={{ color: 'var(--color-ink)' }}
            >
              {preset.title}
            </p>
            <p
              className="font-mono text-xs leading-relaxed"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              {preset.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {(
                [
                  ['Reasoning Mode ×20', preset.options.reasoningMode],
                  ['Long Threads ×3', preset.options.longThreads],
                  ['Coding Heavy ×1.5', preset.options.codingHeavy],
                ] as [string, boolean][]
              ).map(([label, on]) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-0.5 font-mono text-xs border"
                  style={{
                    background: on ? 'rgba(16,185,129,0.12)' : 'transparent',
                    borderColor: on ? 'rgba(16,185,129,0.4)' : 'var(--color-rim)',
                    color: on ? 'var(--color-eco)' : 'var(--color-ink-dim)',
                    textDecoration: on ? 'none' : 'line-through',
                    opacity: on ? 1 : 0.6,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
