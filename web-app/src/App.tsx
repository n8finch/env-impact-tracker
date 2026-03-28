import { useState, type ReactNode } from 'react';
import { ServiceSelector } from './components/ServiceSelector';
import { PlanSelector } from './components/PlanSelector';
import { UsageSlider } from './components/UsageSlider';
import { MultiplierToggles } from './components/MultiplierToggles';
import { ImpactDashboard } from './components/ImpactDashboard';
import { OffsetLinks } from './components/OffsetLinks';
import { Methodology } from './components/Methodology';
import { Resources } from './components/Resources';
import { CivicAction } from './components/CivicAction';
import { FormLetter } from './components/FormLetter';
import { PresetExamples, type Preset } from './components/PresetExamples';
import { calculateImpact, calculateImpactFromTokens, type CalculatorOptions } from './lib/calculator';
import { SERVICES } from './lib/emissions-data';

const NAV_LINKS = [
  { href: '#calculator', label: 'Calculator' },
  { href: '#impact',     label: 'Impact' },
  { href: '#offset',     label: 'Offset' },
  { href: '#contact',    label: 'Contact Gov' },
  { href: '#sources',    label: 'Sources' },
];

export default function App() {
  const [service, setService] = useState('claude');
  const [plan, setPlan] = useState('pro');
  const [usage, setUsage] = useState(50);
  const [inputMode, setInputMode] = useState<'slider' | 'token'>('slider');
  const [rawTokens, setRawTokens] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [options, setOptions] = useState<CalculatorOptions>({
    reasoningMode: false,
    longThreads: false,
    codingHeavy: false,
  });

  function handleServiceChange(id: string) {
    setService(id);
    setActivePreset(null);
    const svc = SERVICES.find((s) => s.id === id);
    setPlan(svc?.plans[0]?.id ?? 'pro');
  }

  function handlePresetSelect(preset: Preset) {
    if (!preset.id) { setActivePreset(null); return; }
    setActivePreset(preset.id);
    setService(preset.service);
    setPlan(preset.plan);
    setUsage(preset.usage);
    setOptions(preset.options);
    setInputMode('slider');
  }

  const selectedService = SERVICES.find((s) => s.id === service);
  const selectedPlan = selectedService?.plans.find((p) => p.id === plan);
  const planMultiplier = selectedPlan?.multiplier ?? 1;

  const impact =
    inputMode === 'token'
      ? calculateImpactFromTokens(rawTokens, service)
      : calculateImpact(service, usage, options, planMultiplier);

  return (
    <>
      {/* Skip link — visible on keyboard focus only (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div style={{ minHeight: '100vh', background: 'var(--color-base)', position: 'relative' }}>
        {/* Subtle grid background */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Jump nav ── */}
        <nav
          aria-label="Jump to section"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderBottom: '1px solid var(--color-rim)',
            background: 'rgba(10,15,24,0.92)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              maxWidth: '1024px',
              margin: '0 auto',
              padding: '0 1.5rem',
              display: 'flex',
              gap: '0.25rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-xs uppercase tracking-widest"
                style={{
                  display: 'inline-block',
                  padding: '0.625rem 0.875rem',
                  color: 'var(--color-ink-dim)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  borderBottom: '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--color-eco)';
                  el.style.borderBottomColor = 'var(--color-eco)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--color-ink-dim)';
                  el.style.borderBottomColor = 'transparent';
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <main
          id="main-content"
          className="relative"
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '3rem 1.5rem 5rem',
            zIndex: 1,
          }}
        >
          {/* ── Header ── */}
          <header style={{ marginBottom: '3rem' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: '1.25rem' }}>
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-eco)' }}
                aria-hidden="true"
              >
                My Environmental Impact
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-rim)' }} />
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-ink-dim)' }}
                aria-hidden="true"
              >
                2026 Benchmarks
              </span>
            </div>

            <h1
              className="font-display font-bold leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', color: 'var(--color-ink)' }}
            >
              Your AI's Environmental Cost,{' '}
              <span style={{ color: 'var(--color-eco)' }}>Quantified.</span>
            </h1>
            <p
              className="mt-3 max-w-lg"
              style={{ color: 'var(--color-ink-muted)', lineHeight: 1.6 }}
            >
              Select your primary AI service, set your monthly usage, and apply realistic
              multipliers. The numbers don't lie.
            </p>

            {/* Personal note */}
            <blockquote
              className="mt-5 rounded-xl border-l-4 pl-5 pr-4 py-4"
              style={{
                borderLeftColor: 'var(--color-eco)',
                background: 'rgba(16,185,129,0.06)',
                maxWidth: '640px',
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                While these tools are meant to track personal AI use by individual contributors and
                inspire individual awareness and action. As individuals we are a drop in the bucket
                compared to major corporations' environmental impact. Just as putting solar panels on
                your home or driving an EV helps in some way, the major environmental impacts come
                from companies and governments. They should be held accountable and encouraged to
                change. This is me and us doing our part.
              </p>
              <p className="mt-3 font-mono text-xs" style={{ color: 'var(--color-eco)' }}>
                For the next generations,<br />Nate
              </p>
            </blockquote>
          </header>

          {/* ── Presets ── */}
          <section aria-labelledby="heading-examples" style={{ marginBottom: '2rem' }}>
            <SectionLabel id="heading-examples">Quick Examples</SectionLabel>
            <PresetExamples activePreset={activePreset} onSelect={handlePresetSelect} />
          </section>

          {/* ── Service Selector ── */}
          <section id="calculator" aria-labelledby="heading-service" style={{ marginBottom: '2.5rem' }}>
            <SectionLabel id="heading-service" step="01">Select Service</SectionLabel>
            <ServiceSelector selected={service} onSelect={handleServiceChange} />
            {selectedService && selectedService.plans.length > 1 && (
              <PlanSelector
                plans={selectedService.plans}
                selected={plan}
                onSelect={setPlan}
              />
            )}
          </section>

          {/* ── Two-column layout ── */}
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', alignItems: 'start' }}
          >
            {/* Left: controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section aria-labelledby="heading-usage">
                <SectionLabel id="heading-usage" step="02">Monthly Usage</SectionLabel>
                <div
                  className="rounded-xl border p-6"
                  style={{ background: 'var(--color-panel)', borderColor: 'var(--color-rim)' }}
                >
                  <UsageSlider
                    value={usage}
                    onChange={(v) => { setUsage(v); setActivePreset(null); }}
                    mode={inputMode}
                    onModeChange={setInputMode}
                    rawTokens={rawTokens}
                    onRawTokensChange={setRawTokens}
                  />
                </div>
              </section>

              {inputMode === 'slider' && (
                <section aria-labelledby="heading-multipliers">
                  <SectionLabel id="heading-multipliers" step="03">Usage Multipliers</SectionLabel>
                  <div
                    className="rounded-xl border"
                    style={{ background: 'var(--color-panel)', borderColor: 'var(--color-rim)' }}
                  >
                    <MultiplierToggles options={options} onChange={(o) => { setOptions(o); setActivePreset(null); }} />
                  </div>
                </section>
              )}
            </div>

            {/* Right: impact dashboard */}
            <div id="impact" style={{ position: 'sticky', top: '3.5rem' }}>
              <SectionLabel id="heading-impact">Impact Estimate</SectionLabel>
              <ImpactDashboard impact={impact} />
            </div>
          </div>

          {/* ── Methodology ── */}
          <section aria-labelledby="heading-methodology" style={{ marginTop: '3rem' }}>
            <SectionLabel id="heading-methodology">Methodology</SectionLabel>
            <Methodology />
          </section>

          {/* ── Offset links ── */}
          <section id="offset" aria-labelledby="heading-offset" style={{ marginTop: '3rem' }}>
            <SectionLabel id="heading-offset" step="04">Take Action: Offset Your Impact</SectionLabel>
            <OffsetLinks />
          </section>

          {/* ── Civic action ── */}
          <section id="contact" aria-labelledby="heading-contact" style={{ marginTop: '3rem' }}>
            <SectionLabel id="heading-contact" step="05">Take Action: Contact Your Government</SectionLabel>
            <CivicAction />
          </section>

          {/* ── Form letter ── */}
          <section aria-labelledby="heading-letter" style={{ marginTop: '2rem' }}>
            <SectionLabel id="heading-letter">Sample Letter</SectionLabel>
            <FormLetter />
          </section>

          {/* ── Resources ── */}
          <section id="sources" aria-labelledby="heading-sources" style={{ marginTop: '3rem' }}>
            <SectionLabel id="heading-sources">Sources &amp; Research</SectionLabel>
            <Resources />
          </section>

          {/* ── Footer ── */}
          <footer
            className="font-mono text-xs"
            style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-rim)',
              color: 'var(--color-ink-dim)',
              lineHeight: 1.8,
            }}
          >
            <p>
              Emissions data based on 2026 industry benchmarks. Multipliers are estimates derived from
              published research on LLM compute scaling.
            </p>
            <p>No backend. No tracking. All calculations run locally in your browser.</p>
            <p className="text-sm" style={{ marginTop: '0.75rem', color: 'var(--color-ink-dim)' }}>
              Disclaimer: all figures are estimates and best guesses based on publicly available
              benchmarks. Exact energy use varies by data center, model version, request type, and
              provider. Where uncertainty exists, inputs are intentionally biased toward
              overestimation. It is better to assume a larger footprint and act accordingly than to
              undercount and do nothing.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              &copy; {new Date().getFullYear()}{' '}
              <a
                href="https://n8finch.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nate Finch (opens in new tab)"
                style={{ color: 'var(--color-eco)', textDecoration: 'none' }}
              >
                Nate Finch
              </a>
            </p>
            <div style={{ marginTop: '1rem' }}>
              <div id="wcb" className="carbonbadge wcb-d"></div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

function SectionLabel({
  id,
  step,
  children,
}: {
  id?: string;
  step?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: '0.875rem' }}>
      {step && (
        <span
          className="font-mono text-xs uppercase tracking-widest flex-shrink-0"
          style={{ color: 'var(--color-eco)' }}
          aria-hidden="true"
        >
          {step} /
        </span>
      )}
      <h2
        id={id}
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: 'var(--color-ink-dim)', margin: 0 }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'var(--color-rim)' }} aria-hidden="true" />
    </div>
  );
}
