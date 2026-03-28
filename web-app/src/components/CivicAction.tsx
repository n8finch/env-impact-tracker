import { useState } from 'react';
import { Phone, Mail, Github } from 'lucide-react';

interface CountryContact {
  name: string;
  flag: string;
  writeRep: { label: string; url: string } | null;
  call: { label: string; number: string; note?: string } | null;
}

const COUNTRIES: CountryContact[] = [
  {
    name: 'United States',
    flag: '🇺🇸',
    writeRep: { label: 'Write Your Representative', url: 'https://www.house.gov/representatives/find-your-representative' },
    call: { label: 'US Capitol Switchboard', number: '(202) 224-3121' },
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    writeRep: { label: 'Contact Your MP', url: 'https://www.writetothem.com/' },
    call: { label: 'House of Commons', number: '+44 20 7219 3000' },
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    writeRep: { label: 'Contact Your MP', url: 'https://www.ourcommons.ca/Members/en/search' },
    call: { label: 'Parliament Hill (toll-free)', number: '1-866-599-4999', note: 'Toll-free from Canada' },
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    writeRep: { label: 'Contact Your MP', url: 'https://www.aph.gov.au/Senators_and_Members/Members' },
    call: { label: 'Parliament House', number: '+61 2 6277 7111' },
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    writeRep: { label: 'Contact Your MP', url: 'https://www.parliament.nz/en/mps-and-electorates/members-of-parliament/' },
    call: { label: 'Parliament switchboard', number: '+64 4 817 9999' },
  },
  {
    name: 'Ireland',
    flag: '🇮🇪',
    writeRep: { label: 'Contact Your TD', url: 'https://www.oireachtas.ie/en/members/' },
    call: { label: 'Leinster House', number: '+353 1 618 3000' },
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    writeRep: { label: 'Contact Your MdB', url: 'https://www.bundestag.de/en/members' },
    call: { label: 'Bundestag', number: '+49 30 227 0' },
  },
  {
    name: 'France',
    flag: '🇫🇷',
    writeRep: { label: 'Contact Your Député', url: 'https://www.assemblee-nationale.fr/dyn/deputes' },
    call: { label: 'Assemblée Nationale', number: '+33 1 40 63 60 00' },
  },
  {
    name: 'Netherlands',
    flag: '🇳🇱',
    writeRep: { label: 'Contact Your MP', url: 'https://www.tweedekamer.nl/kamerleden_en_commissies/alle_kamerleden' },
    call: { label: 'Tweede Kamer', number: '+31 70 318 2211' },
  },
  {
    name: 'Sweden',
    flag: '🇸🇪',
    writeRep: { label: 'Contact Your MP', url: 'https://www.riksdagen.se/en/members-and-parties/' },
    call: { label: 'Riksdag switchboard', number: '+46 8 786 4000' },
  },
  {
    name: 'Norway',
    flag: '🇳🇴',
    writeRep: { label: 'Contact Your MP', url: 'https://www.stortinget.no/en/In-English/Members-of-the-Storting/' },
    call: { label: 'Storting switchboard', number: '+47 23 31 30 50' },
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    writeRep: { label: 'Contact Your MP', url: 'https://www.ft.dk/en/members-of-parliament/members-of-parliament' },
    call: { label: 'Folketing', number: '+45 33 37 55 00' },
  },
  {
    name: 'Finland',
    flag: '🇫🇮',
    writeRep: { label: 'Contact Your MP', url: 'https://www.eduskunta.fi/EN/kansanedustajat/Pages/default.aspx' },
    call: { label: 'Parliament switchboard', number: '+358 9 432 1' },
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    writeRep: { label: 'Contact Your Councillor', url: 'https://www.parlament.ch/en/organe/national-council/members-national-council' },
    call: { label: 'Federal Chancellery', number: '+41 58 462 21 11' },
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    writeRep: { label: 'Contact Your Diet Member', url: 'https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/eng/members.htm' },
    call: { label: 'National Diet', number: '+81 3 3581 5111' },
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    writeRep: { label: 'Contact Your Assembly Member', url: 'https://www.assembly.go.kr/portal/eng/member/memberList.do' },
    call: { label: 'National Assembly', number: '+82 2 788 2114' },
  },
  {
    name: 'India',
    flag: '🇮🇳',
    writeRep: { label: 'Contact Your MP', url: 'https://www.loksabha.nic.in/Members/AlphabeticalList.aspx' },
    call: { label: 'Lok Sabha', number: '+91 11 2300 1844' },
  },
  {
    name: 'Brazil',
    flag: '🇧🇷',
    writeRep: { label: 'Contact Your Deputado', url: 'https://www.camara.leg.br/deputados/quem-sao' },
    call: { label: 'Câmara dos Deputados', number: '+55 61 3215 5080' },
  },
  {
    name: 'Mexico',
    flag: '🇲🇽',
    writeRep: { label: 'Contact Your Diputado', url: 'https://www.diputados.gob.mx/diputados.htm' },
    call: { label: 'Cámara de Diputados', number: '+52 55 5628 1300' },
  },
  {
    name: 'South Africa',
    flag: '🇿🇦',
    writeRep: { label: 'Contact Your MP', url: 'https://www.parliament.gov.za/current-members' },
    call: { label: 'National Assembly', number: '+27 21 403 2911' },
  },
  {
    name: 'European Union',
    flag: '🇪🇺',
    writeRep: { label: 'Contact Your MEP', url: 'https://www.europarl.europa.eu/meps/en/home' },
    call: { label: 'European Parliament', number: '+32 2 284 21 11' },
  },
];

const GITHUB_URL = 'https://github.com/n8finch/env-impact-tracker';

export function CivicAction() {
  const [country, setCountry] = useState('United States');
  const contact = COUNTRIES.find((c) => c.name === country) ?? COUNTRIES[0];
  const isOther = country === '__other__';

  return (
    <div
      className="rounded-xl border p-6"
      style={{ background: 'var(--color-panel)', borderColor: 'var(--color-rim)' }}
    >
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-ink-muted)' }}>
        Individual action matters, but corporate and government decisions have far greater
        environmental impact. Use your voice.
      </p>

      {/* Label above grid so select and buttons share the same top edge */}
      <label
        htmlFor="country-select"
        className="font-mono text-xs uppercase tracking-widest block mb-2"
        style={{ color: 'var(--color-eco)' }}
      >
        Your country
      </label>

      {/* Two-column grid: selector left, buttons right */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', alignItems: 'start' }}
      >
        {/* Left: select + GitHub note stacked */}
        <div className="flex flex-col gap-2">
          <select
            id="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 font-mono text-sm border outline-none"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-rim)',
              color: 'var(--color-ink)',
              cursor: 'pointer',
            }}
            onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--color-eco)'; }}
            onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--color-rim)'; }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
            <option disabled>──────────────────</option>
            <option value="__other__">Other - add yours via GitHub</option>
          </select>

          {/* GitHub PR note lives under the select */}
          <p className="font-mono text-xs" style={{ color: 'var(--color-ink-dim)', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            Missing your country?{' '}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open a PR on GitHub to add your country (opens in new tab)"
              style={{ color: 'var(--color-eco)', textDecoration: 'underline' }}
            >
              Open a PR on GitHub
            </a>{' '}
            to add it.
          </p>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col gap-3">
          {isOther ? (
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open a PR on GitHub to add your country (opens in new tab)"
              className="flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-rim)',
                color: 'var(--color-ink)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-eco)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-rim)'; }}
            >
              <Github size={16} style={{ color: 'var(--color-eco)', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p className="font-mono text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  Open a PR to add your country
                </p>
                <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--color-ink-dim)' }}>
                  {GITHUB_URL}
                </p>
              </div>
            </a>
          ) : (
            <>
              {contact.writeRep && (
                <a
                  href={contact.writeRep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${contact.writeRep.label} (opens in new tab)`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors"
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    borderColor: 'var(--color-eco)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.14)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)'; }}
                >
                  <Mail size={16} style={{ color: 'var(--color-eco)', flexShrink: 0 }} aria-hidden="true" />
                  <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-eco)' }}>
                    {contact.writeRep.label}
                  </span>
                </a>
              )}

              {contact.call && (
                <a
                  href={`tel:${contact.call.number.replace(/[^+\d]/g, '')}`}
                  aria-label={`Call ${contact.call.label}: ${contact.call.number}`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-rim)',
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-eco)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-rim)'; }}
                >
                  <Phone size={16} style={{ color: 'var(--color-ink-dim)', flexShrink: 0 }} aria-hidden="true" />
                  <div>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-ink)' }}>
                      {contact.call.label}
                    </p>
                    <p className="font-mono text-xs" style={{ color: 'var(--color-eco)' }}>
                      {contact.call.number}
                      {contact.call.note && (
                        <span style={{ color: 'var(--color-ink-dim)' }}> ({contact.call.note})</span>
                      )}
                    </p>
                  </div>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
