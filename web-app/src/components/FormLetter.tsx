import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const LETTER = `Dear [REP'S NAME],

I am a constituent from [CITY], [STATE / PROVINCE / TERRITORY] writing to urge you to support stronger environmental accountability for the artificial intelligence industry. AI data centers are among the fastest-growing sources of energy consumption and carbon emissions globally, yet they remain largely unregulated.

I ask that you support legislation requiring AI companies to publicly disclose their energy use and carbon emissions, set measurable reduction targets, and invest in renewable energy infrastructure. The environmental cost of AI is real and growing — our communities and future generations deserve transparency and meaningful action from the companies driving this growth.

[ADD YOUR OWN WORDS: Why is this personal to you? One or two sentences in your own voice — a local data center, your utility bill, your kids, your work in tech. Personal notes make these letters stand out.]

As your constituent, I am actively tracking and reducing my own AI carbon footprint. I ask you to hold corporations to the same standard. Thank you for your time and service.

Sincerely,

[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE / PROVINCE / TERRITORY]
[YOUR EMAIL]`;

export function FormLetter() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(LETTER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--color-panel)', borderColor: 'var(--color-rim)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
            Sample letter to your representative
          </p>
          <p className="font-mono text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-ink-dim)' }}>
            Replace all <span style={{ color: 'var(--color-eco)' }}>[BRACKETED]</span> placeholders
            before sending. Personalize with a local angle — a nearby data center, your utility
            provider, or a specific bill — for the most impact.
          </p>
        </div>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Letter copied to clipboard' : 'Copy letter to clipboard'}
          className="flex items-center gap-2 rounded-lg px-3 py-2 border font-mono text-xs flex-shrink-0 transition-colors"
          style={{
            background: copied ? 'rgba(16,185,129,0.12)' : 'var(--color-surface)',
            borderColor: copied ? 'var(--color-eco)' : 'var(--color-rim)',
            color: copied ? 'var(--color-eco)' : 'var(--color-ink-muted)',
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          <span aria-live="polite" aria-atomic="true">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>
      </div>

      <pre
        className="font-mono text-sm leading-relaxed whitespace-pre-wrap rounded-lg p-4"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-rim)',
          border: '1px solid var(--color-rim)',
          color: 'var(--color-ink-muted)',
        }}
      >
        {LETTER}
      </pre>
    </div>
  );
}
