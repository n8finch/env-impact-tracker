import type { Plan } from '../lib/emissions-data';

interface Props {
  plans: Plan[];
  selected: string;
  onSelect: (id: string) => void;
}

export function PlanSelector({ plans, selected, onSelect }: Props) {
  if (plans.length <= 1) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-4">
      {plans.map((plan) => {
        const isSelected = selected === plan.id;
        return (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            aria-pressed={isSelected}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-150"
            style={{
              background: isSelected ? 'rgba(16,185,129,0.12)' : 'var(--color-surface)',
              borderColor: isSelected ? 'var(--color-eco)' : 'var(--color-rim)',
              color: isSelected ? 'var(--color-eco-bright)' : 'var(--color-ink-dim)',
            }}
          >
            <span className="font-display font-semibold">{plan.name}</span>
            <span className="font-mono opacity-60">{plan.price}</span>
          </button>
        );
      })}
    </div>
  );
}
