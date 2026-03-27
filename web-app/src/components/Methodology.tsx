export function Methodology() {
  return (
    <section>
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--color-panel)', borderColor: 'var(--color-rim)' }}
      >
        <h2
          className="font-display font-semibold mb-3"
          style={{ color: 'var(--color-ink)', fontSize: '1rem' }}
        >
          How the numbers work
        </h2>

        <div className="space-y-3 font-mono text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          <p>
            <span style={{ color: 'var(--color-ink)' }}>Slider mode</span> uses published
            per-query emission benchmarks (grams CO₂e per 1,000 standard queries) scaled by what
            fraction of your monthly plan you consume. Multipliers stack multiplicatively:{' '}
            <span style={{ color: 'var(--color-eco)' }}>Reasoning Mode ×20</span> reflects
            extended-thinking models that generate long hidden chains of thought before responding.{' '}
            <span style={{ color: 'var(--color-eco)' }}>Long Threads ×3</span> accounts for
            repeated context re-processing as conversation length grows.{' '}
            <span style={{ color: 'var(--color-eco)' }}>Coding Heavy ×1.5</span> covers the longer
            code outputs typical in developer sessions.
          </p>

          <p>
            <span style={{ color: 'var(--color-ink)' }}>Token mode</span> uses the actual raw
            token counts reported by{' '}
            <code style={{ color: 'var(--color-eco)' }}>/env-impact</code> (a Claude Code command).
            Heavy Claude Code sessions run ~90% cache reads, which consume roughly 10% of the
            compute of fresh tokens. Applying a 16.4% effective-weight ratio
            (input + output + cache_created + cache_read×0.1) and 0.3g per 1,000 effective tokens
            matches observed track.py output.
          </p>

          <p>
            <span style={{ color: 'var(--color-ink)' }}>Equivalences:</span> 400g CO₂e ≈ 1 mile
            driven (average passenger vehicle), ÷15g per kettle boiled, ÷8g per smartphone charge.
          </p>
        </div>
      </div>
    </section>
  );
}
