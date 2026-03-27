import { Car, Flame, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import type { ImpactResult } from '../lib/calculator';

interface Props {
  impact: ImpactResult;
}

function formatKg(v: number): string {
  if (v === 0) return '0.000';
  if (v < 0.001) return '< 0.001';
  if (v < 1) return v.toFixed(3);
  return v.toFixed(2);
}

export function ImpactDashboard({ impact }: Props) {
  const kg = useAnimatedNumber(impact.kg);
  const miles = useAnimatedNumber(impact.miles);
  const kettles = useAnimatedNumber(impact.kettles);
  const smartphones = useAnimatedNumber(impact.smartphones);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: 'var(--color-panel)',
        borderColor: 'var(--color-rim)',
      }}
    >
      {/* Hero metric */}
      <div
        className="p-7 border-b"
        style={{ borderColor: 'var(--color-rim)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-eco)' }}
          >
            Monthly Estimate
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full eco-pulse"
              style={{ background: 'var(--color-eco)' }}
            />
            <span className="font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
              live
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="font-mono font-medium metric-number leading-none"
            style={{ color: 'var(--color-ink)', fontSize: '3.5rem' }}
          >
            {formatKg(kg)}
          </span>
          <span
            className="font-mono text-xl"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            kg CO₂e
          </span>
        </div>

        {impact.grams > 0 && (
          <p className="mt-3 font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
            ≈ {(impact.grams / 1000).toFixed(3)} kg · {impact.grams.toFixed(0)} g total
          </p>
        )}
      </div>

      {/* Equivalence metrics */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderColor: 'var(--color-rim)' }}
      >
        <Metric
          icon={<Car size={13} />}
          label="Miles Driven"
          value={miles.toFixed(1)}
        />
        <Metric
          icon={<Flame size={13} />}
          label="Kettles Boiled"
          value={Math.round(kettles).toLocaleString()}
        />
        <Metric
          icon={<Smartphone size={13} />}
          label="Phone Charges"
          value={Math.round(smartphones).toLocaleString()}
        />
      </div>

      {/* Footer note */}
      <div
        className="px-6 py-3 border-t"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-rim)',
        }}
      >
        <p className="font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
          Baseline × usage% × multipliers. Equivalences are per-month estimates.
        </p>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="p-5"
      style={{ borderColor: 'var(--color-rim)' }}
    >
      <div
        className="flex items-center gap-1.5 mb-2"
        style={{ color: 'var(--color-ink-dim)' }}
      >
        {icon}
        <span className="font-mono text-xs">{label}</span>
      </div>
      <span
        className="font-mono font-medium metric-number text-2xl"
        style={{ color: 'var(--color-ink-muted)' }}
      >
        {value}
      </span>
    </div>
  );
}
