import type { CalculatorOptions } from '../lib/calculator';

interface Props {
  options: CalculatorOptions;
  onChange: (options: CalculatorOptions) => void;
}

const TOGGLES: Array<{
  key: keyof CalculatorOptions;
  label: string;
  multiplier: string;
  description: string;
}> = [
  {
    key: 'reasoningMode',
    label: 'Reasoning Mode',
    multiplier: '×20',
    description:
      'Extended "thinking" models generate long hidden chains of thought before each response.',
  },
  {
    key: 'longThreads',
    label: 'Long Threads',
    multiplier: '×3',
    description:
      'Full context is re-processed every turn; costs compound with conversation length.',
  },
  {
    key: 'codingHeavy',
    label: 'Coding Heavy',
    multiplier: '×1.5',
    description:
      'Code outputs are 2-4x longer than prose, requiring significantly more generation.',
  },
];

export function MultiplierToggles({ options, onChange }: Props) {
  const toggle = (key: keyof CalculatorOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <div>
      {TOGGLES.map(({ key, label, multiplier, description }, i) => {
        const enabled = options[key];
        return (
          <div
            key={key}
            className="flex items-start gap-4 p-5"
            style={{
              borderBottom:
                i < TOGGLES.length - 1 ? '1px solid var(--color-rim)' : 'none',
            }}
          >
            {/* Toggle switch */}
            <button
              role="switch"
              aria-checked={enabled}
              aria-label={`Toggle ${label}`}
              onClick={() => toggle(key)}
              className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 mt-0.5 cursor-pointer"
              style={{ background: enabled ? 'var(--color-eco)' : 'var(--color-rim)' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: enabled ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>

            {/* Label + description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-display font-semibold text-sm transition-colors"
                  style={{ color: enabled ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}
                >
                  {label}
                </span>
                <span
                  className="font-mono text-xs px-1.5 py-0.5 rounded border transition-colors"
                  style={
                    enabled
                      ? {
                          background: 'rgba(16,185,129,0.15)',
                          color: 'var(--color-eco-bright)',
                          borderColor: 'rgba(16,185,129,0.3)',
                        }
                      : {
                          background: 'transparent',
                          color: 'var(--color-ink-muted)',
                          borderColor: 'var(--color-rim)',
                        }
                  }
                >
                  {multiplier}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-dim)' }}>
                {description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
