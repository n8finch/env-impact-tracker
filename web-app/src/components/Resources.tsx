import { ExternalLink } from 'lucide-react';
import { RESOURCES } from '../lib/emissions-data';

export function Resources() {
  return (
    <section>
      <div className="space-y-3">
        {RESOURCES.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-xl border p-4 transition-colors group block"
            style={{
              background: 'var(--color-panel)',
              borderColor: 'var(--color-rim)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-eco)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-rim)';
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: 'var(--color-eco)', flexShrink: 0 }}
                >
                  {r.tag}
                </span>
              </div>
              <p
                className="font-display font-semibold text-sm"
                style={{ color: 'var(--color-ink)' }}
              >
                {r.title}
              </p>
              <p className="font-mono text-xs mt-0.5 mb-2" style={{ color: 'var(--color-ink-dim)' }}>
                {r.author}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {r.description}
              </p>
            </div>
            <ExternalLink
              size={14}
              style={{ color: 'var(--color-ink-dim)', flexShrink: 0, marginTop: '2px' }}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
