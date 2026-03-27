import { ExternalLink } from 'lucide-react';
import { OFFSET_PROVIDERS } from '../lib/emissions-data';

const TIER_STYLES: Record<number, { dot: string; badge: string; badgeBorder: string; badgeText: string }> = {
  1: {
    dot: '#10b981',
    badge: 'rgba(16,185,129,0.12)',
    badgeBorder: 'rgba(16,185,129,0.3)',
    badgeText: '#34d399',
  },
  2: {
    dot: '#f59e0b',
    badge: 'rgba(245,158,11,0.12)',
    badgeBorder: 'rgba(245,158,11,0.3)',
    badgeText: '#fbbf24',
  },
  3: {
    dot: '#3b82f6',
    badge: 'rgba(59,130,246,0.12)',
    badgeBorder: 'rgba(59,130,246,0.3)',
    badgeText: '#60a5fa',
  },
};

export function OffsetLinks() {
  return (
    <div className="space-y-3">
      {OFFSET_PROVIDERS.map((provider) => {
        const s = TIER_STYLES[provider.tier];
        return (
          <div
            key={provider.name}
            className="flex items-center gap-4 rounded-xl p-5 border transition-colors duration-200"
            style={{
              background: 'var(--color-panel)',
              borderColor: 'var(--color-rim)',
            }}
          >
            {/* Tier dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: s.dot }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="font-display font-semibold text-sm"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {provider.name}
                </span>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border"
                  style={{
                    background: s.badge,
                    borderColor: s.badgeBorder,
                    color: s.badgeText,
                  }}
                >
                  {provider.category}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--color-ink-dim)' }}>
                {provider.description}
              </p>
            </div>

            {/* CTA */}
            <a
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 font-mono text-xs transition-colors duration-150"
              style={{ color: 'var(--color-eco)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-eco-bright)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-eco)';
              }}
            >
              Offset
              <ExternalLink size={12} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
