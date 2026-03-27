import { SERVICES } from '../lib/emissions-data';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export function ServiceSelector({ selected, onSelect }: Props) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
    >
      {SERVICES.map((service) => {
        const isSelected = selected === service.id;
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            aria-pressed={isSelected}
            className="flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-200"
            style={{
              background: isSelected ? 'var(--color-panel-active)' : 'var(--color-panel)',
              borderColor: isSelected ? 'var(--color-eco)' : 'var(--color-rim)',
              boxShadow: isSelected ? '0 0 24px rgba(16,185,129,0.12)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-rim-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-rim)';
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: service.colorDot }}
                />
                <span
                  className="font-display font-semibold text-sm"
                  style={{ color: isSelected ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}
                >
                  {service.name}
                </span>
              </div>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-eco)' }} />
              )}
            </div>
            <span className="font-mono text-xs" style={{ color: 'var(--color-ink-dim)' }}>
              {service.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
