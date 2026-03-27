interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  mode: 'slider' | 'token';
  onModeChange: (mode: 'slider' | 'token') => void;
  rawTokens: number;
  onRawTokensChange: (tokens: number) => void;
}

export function UsageSlider({
  value,
  onChange,
  mode,
  onModeChange,
  rawTokens,
  onRawTokensChange,
}: SliderProps) {
  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface)', width: 'fit-content' }}>
        {(['slider', 'token'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="px-3 py-1 rounded-md text-xs font-mono transition-all duration-150"
            style={
              mode === m
                ? { background: 'var(--color-panel-active)', color: 'var(--color-eco)', borderColor: 'var(--color-eco)' }
                : { color: 'var(--color-ink-dim)' }
            }
          >
            {m === 'slider' ? 'Estimate' : 'Token count'}
          </button>
        ))}
      </div>

      {mode === 'slider' ? (
        <>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="usage-slider"
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: 'var(--color-eco)' }}
            >
              % of Monthly Plan
            </label>
            <div className="font-mono tabular-nums" style={{ color: 'var(--color-ink)' }}>
              <span className="text-3xl font-medium">{value}</span>
              <span className="text-xl" style={{ color: 'var(--color-ink-muted)' }}>%</span>
            </div>
          </div>

          <input
            id="usage-slider"
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="eco-slider w-full"
            style={{
              background: `linear-gradient(to right, var(--color-eco) ${value}%, var(--color-rim) ${value}%)`,
            }}
          />

          <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </>
      ) : (
        <>
          <div>
            <label
              htmlFor="token-input"
              className="font-mono text-xs uppercase tracking-widest block mb-3"
              style={{ color: 'var(--color-eco)' }}
            >
              Total raw tokens
            </label>
            <input
              id="token-input"
              type="number"
              min={0}
              value={rawTokens || ''}
              onChange={(e) => onRawTokensChange(parseInt(e.target.value) || 0)}
              placeholder="e.g. 533895781"
              className="w-full rounded-lg px-4 py-3 font-mono text-sm border outline-none transition-colors"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-rim)',
                color: 'var(--color-ink)',
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = 'var(--color-eco)';
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = 'var(--color-rim)';
              }}
            />
          </div>
          <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--color-ink-dim)' }}>
            Paste the <span style={{ color: 'var(--color-ink-muted)' }}>Total raw</span> number
            from <code style={{ color: 'var(--color-eco)' }}>/env-impact</code>. Applies a 16.4%
            cache-adjusted weight (calibrated for Claude Code sessions with ~90% cache reads).
          </p>
          {rawTokens > 0 && (
            <div className="font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
              Effective tokens:{' '}
              <span style={{ color: 'var(--color-ink-muted)' }}>
                ~{Math.round(rawTokens * 0.164).toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
