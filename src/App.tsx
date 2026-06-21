import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const WORKER_URL = 'https://liradjag-api.fhuliradjagskladopalu.workers.dev'

const PRODUCTS_FALLBACK = [
  { id: 'pellet',   name: 'Pellet drzewny',  icon: '🌿', unit: 'paleta', color: '#22c55e', desc: 'Certyfikowany pellet drzewny ENplus A1. Wysoka wartość opałowa, niskie emisje.', dostepny: true, cena: 1365 },
  { id: 'kamienny', name: 'Węgiel kamienny',  icon: '⚫', unit: 'tona',   color: '#94a3b8', desc: 'Węgiel kamienny orzech/kostka. Wysoka kaloryczność i długie palenie.',           dostepny: true, cena: 1150 },
  { id: 'groszek',  name: 'Eko-groszek',      icon: '🔥', unit: 'tona',   color: '#f59e0b', desc: 'Drobnoziarnisty węgiel do kotłów automatycznych z podajnikiem.',               dostepny: true, cena: 1050 },
]

const DELIVERY_ZONES = [
  { range: '0 – 30 km', price: 'GRATIS', color: '#22c55e' },
  { range: '31 – 75 km', price: '50 zł', color: '#f59e0b' },
  { range: '76 – 100 km', price: '100 zł', color: '#f59e0b' },
  { range: 'powyżej 100 km', price: '📞 Zadzwoń', color: '#e85c0d' },
]

const FAQ = [
  { q: 'Jak złożyć zamówienie?', a: 'Zadzwoń na numer 694 232 935. Ustalimy dostępność, cenę i termin dostawy lub odbioru.' },
  { q: 'Na jaki obszar dostarczacie?', a: 'Dostarczamy głównie na terenie gminy Rudniki i okolic. Przy większych zamówieniach możliwy transport dalej — zapytaj telefonicznie.' },
  { q: 'Jaka jest minimalna ilość zamówienia?', a: 'Minimalne zamówienie to 1 tona (lub 1 paleta pelletu) — zarówno przy dostawie, jak i odbiorze własnym.' },
  { q: 'Jak mogę zapłacić?', a: 'Akceptujemy przelew bankowy oraz gotówkę przy dostawie lub odbiorze na składzie.' },
  { q: 'Czy wystawiacie fakturę VAT?', a: 'Tak, do każdego zamówienia wystawiamy fakturę VAT. Jeśli potrzebujesz faktury na firmę, podaj NIP przy składaniu zamówienia.' },
  { q: 'Ile czasu trzeba czekać na realizację?', a: 'Standardowo 24–48 godzin od potwierdzenia. W sezonie grzewczym warto dzwonić z wyprzedzeniem.' },
  { q: 'Czy ceny na stronie są aktualne?', a: 'Ceny są orientacyjne i aktualizowane na bieżąco. Przed zamówieniem zawsze potwierdzamy aktualną cenę telefonicznie.' },
]

type Product = {
  id: string
  name: string
  icon: string
  unit: string
  color: string
  desc: string
  dostepny: boolean
  cena: number
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return scrolled
}

function Nav() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#oferta', label: 'Oferta' },
    { href: '#dostawa', label: 'Dostawa' },
    { href: '#faq', label: 'FAQ' },
    { href: '#kontakt', label: 'Kontakt' },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-8">
        {/* Logo */}
        <a href="#hero" className="font-black text-xl tracking-widest text-white shrink-0" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.12em' }}>
          LIRA<span style={{ color: '#e85c0d' }}>DJAG</span>
        </a>

        {/* Desktop nav — centered */}
        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 group"
                style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                <span className="relative z-10">{l.label}</span>
                <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="tel:+48694232935"
          className="hidden md:flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 shrink-0"
          style={{ background: '#e85c0d', color: 'white', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(232,92,13,0.35)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#d14f09'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e85c0d'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none' }}
        >
          📞 694 232 935
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md transition-colors"
          onClick={() => setOpen(!open)}
          style={{ color: 'white' }}
        >
          <span className="block w-6 h-0.5 bg-white transition-all duration-200" style={{ transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span className="block w-6 h-0.5 bg-white transition-all duration-200" style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-6 h-0.5 bg-white transition-all duration-200" style={{ transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden overflow-hidden transition-all duration-300" style={{ maxHeight: open ? '300px' : '0', background: '#111' }}>
        <div className="px-6 py-4 flex flex-col gap-1 border-t border-white/[0.06]">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-3 rounded-lg font-medium text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}
              onClick={() => setOpen(false)}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              {l.label}
            </a>
          ))}
          <a href="tel:+48694232935" className="mt-2 px-3 py-3 rounded-lg font-bold text-sm" style={{ color: '#e85c0d', background: 'rgba(232,92,13,0.1)' }}>
            📞 694 232 935
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#111' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 80% at 65% 50%, rgba(232,92,13,0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 85% 15%, rgba(245,158,11,0.08) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Floating embers */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-20" style={{
            width: `${8 + i * 4}px`, height: `${8 + i * 4}px`,
            background: i % 2 === 0 ? '#e85c0d' : '#f59e0b',
            left: `${10 + i * 15}%`, top: `${20 + i * 10}%`,
            animation: `float ${3 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-16 items-center w-full">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: '#e85c0d' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#e85c0d' }}>Skład Opału · Dalachów · od 2010</span>
          </div>
          <h1 className="font-black leading-[0.88] mb-6 text-white" style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
            CIEPŁO<br />
            NA <span style={{ color: '#e85c0d' }}>KAŻDĄ</span><br />
            ZIMĘ
          </h1>
          <p className="text-lg mb-8 leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Pellet, węgiel kamienny i inne paliwa stałe z pewnego źródła. Dostawa pod drzwi lub odbiór w Dalachowie.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#oferta" className="inline-block font-bold px-6 py-3 rounded text-white text-sm tracking-wide transition-all hover:-translate-y-0.5" style={{ background: '#e85c0d' }}>
              Sprawdź ceny →
            </a>
            <a href="tel:+48694232935" className="inline-block font-bold px-6 py-3 rounded text-sm tracking-wide transition-all hover:-translate-y-0.5 border" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
              📞 Zadzwoń teraz
            </a>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '15+', label: 'Lat doświadczenia', icon: '🏆' },
            { num: '48h', label: 'Czas realizacji', icon: '⚡' },
            { num: '100%', label: 'Gwarancja jakości', icon: '✅' },
            { num: '4', label: 'Rodzaje paliw', icon: '🔥' },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-lg border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-white" style={{ fontFamily: 'Georgia, serif', color: i === 0 ? '#e85c0d' : 'white' }}>{s.num}</div>
              <div className="text-xs mt-1 tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#oferta" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-widest uppercase transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span>Przewiń</span>
        <div className="w-6 h-10 rounded-full border flex items-start justify-center pt-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <div className="w-1 h-2 rounded-full" style={{ background: '#e85c0d', animation: 'scrollDot 2s infinite' }} />
        </div>
      </a>
    </section>
  )
}

function TrustBar() {
  const items = [
    { icon: '🚛', text: 'Dostawa w okolicy' },
    { icon: '📞', text: 'Szybki kontakt' },
    { icon: '✅', text: 'Faktura VAT' },
    { icon: '🏗️', text: 'Odbiór własny' },
    { icon: '🔒', text: 'Sprawdzone paliwa' },
    { icon: '⭐', text: 'Ponad 15 lat na rynku' },
  ]
  return (
    <div style={{ background: '#131313', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap gap-x-6 gap-y-2 justify-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            <span className="text-sm">{item.icon}</span>
            <span>{item.text}</span>
            {i < items.length - 1 && <span className="ml-6 hidden sm:block" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ p }: { p: Product }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered ? '#222' : '#1a1a1a',
        border: `1px solid ${hovered ? p.color + '40' : 'rgba(255,255,255,0.07)'}`,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.color}20` : 'none',
        opacity: p.dostepny ? 1 : 0.6,
      }}
    >
      <div className="h-1 w-full transition-all duration-300" style={{
        background: `linear-gradient(90deg, ${p.color}, ${p.color}80)`,
        opacity: hovered ? 1 : 0.4,
      }} />

      <div className="p-6 flex flex-col flex-1">
        <div className="text-4xl mb-4">{p.icon}</div>
        <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>{p.name}</h3>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.desc}</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full" style={{ background: p.dostepny ? '#22c55e' : '#ef4444', boxShadow: p.dostepny ? '0 0 6px #22c55e' : 'none' }} />
          <span className="text-xs font-bold tracking-wide uppercase" style={{ color: p.dostepny ? '#22c55e' : '#ef4444' }}>
            {p.dostepny ? 'Dostępny' : 'Chwilowo niedostępny'}
          </span>
        </div>

        <div className="mt-auto">
          <div className="text-3xl font-black" style={{ color: '#f59e0b', fontFamily: 'Georgia, serif' }}>
            {p.cena.toLocaleString('pl-PL')} zł
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>/ {p.unit} brutto · cena orientacyjna</div>
          <div className="text-xs mt-2 px-3 py-1.5 rounded" style={{ background: 'rgba(232,92,13,0.1)', color: '#e85c0d', border: '1px solid rgba(232,92,13,0.2)' }}>
            Min. zamówienie: 1 {p.unit}
          </div>
        </div>
      </div>
    </div>
  )
}

function Products() {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    fetch(`${WORKER_URL}/produkty`)
      .then(r => r.json())
      .then((raw: Record<string, Product>) => {
        const firstVal = Object.values(raw)[0]
        if (firstVal?.name) {
          // Nowy format z metadanymi
          setProducts(Object.entries(raw).map(([pid, v]) => ({ ...v, id: pid })))
        } else {
          // Stary format — uzupełnij z fallbacka
          setProducts(PRODUCTS_FALLBACK.map(def => ({ ...def, ...(raw[def.id] || {}) })))
        }
      })
      .catch(() => setProducts(PRODUCTS_FALLBACK))
  }, [])

  return (
    <section id="oferta" className="py-24 px-6" style={{ background: '#0f0f0f' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: '#e85c0d' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#e85c0d' }}>Nasza oferta</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>Ceny i produkty</h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Asortyment zależy od bieżącej dostawy. Zadzwoń aby potwierdzić aktualną cenę i dostępność.
          </p>
        </div>

        {!products ? (
          <div className="flex items-center justify-center py-24 gap-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.1) #e85c0d rgba(255,255,255,0.1) rgba(255,255,255,0.1)', animation: 'spin 0.8s linear infinite' }} />
            Ładowanie produktów...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {products.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          * Ceny orientacyjne brutto. Zadzwoń aby potwierdzić aktualną cenę:{' '}
          <a href="tel:+48694232935" style={{ color: '#e85c0d' }}>694 232 935</a>
        </p>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #c94d09 0%, #a83e07 100%)', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Skontaktuj się z nami</p>
          <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>Zainteresowany? Zadzwoń!</h3>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>Odpowiemy na wszystkie pytania i ustalimy termin dostawy.</p>
        </div>
        <a
          href="tel:+48694232935"
          className="inline-flex items-center gap-3 font-black text-lg px-8 py-4 rounded-xl transition-all duration-200 whitespace-nowrap hover:-translate-y-1"
          style={{ background: 'white', color: '#c94d09', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}
        >
          📞 694 232 935
        </a>
      </div>
    </div>
  )
}

function Delivery() {
  return (
    <section id="dostawa" className="py-24 px-6" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: '#e85c0d' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#e85c0d' }}>Logistyka</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>Dostawa i odbiór</h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>Sami przywieziemy lub odbierzesz na miejscu. Termin i koszt ustalamy telefonicznie.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Delivery */}
          <div className="rounded-2xl p-8" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>Dostawa pod adres</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Dostarczamy na terenie gminy Rudniki i okolic. Minimalne zamówienie z dostawą: <strong className="text-white">1 tona</strong>. Termin i koszt ustalamy telefonicznie.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-4 py-2.5 text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Cennik dostawy
              </div>
              {DELIVERY_ZONES.map((z, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 text-sm" style={{ borderBottom: i < DELIVERY_ZONES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{z.range}</span>
                  <span className="font-bold" style={{ color: z.color }}>{z.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup */}
          <div className="rounded-2xl p-8" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>Odbiór własny</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Zapraszamy na skład: <strong className="text-white">Dalachów 8, 46-325 Rudniki</strong>. Możliwość załadunku na miejscu. Prosimy o wcześniejszy kontakt telefoniczny.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-4 py-2.5 text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Godziny otwarcia
              </div>
              {[['Poniedziałek – Piątek', '8:00 – 17:00'], ['Sobota', '8:00 – 13:00'], ['Niedziela', 'nieczynne']].map(([d, h], i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 text-sm" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{d}</span>
                  <span className="font-bold" style={{ color: i === 2 ? 'rgba(255,255,255,0.3)' : 'white' }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="py-24 px-6" style={{ background: '#0f0f0f' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: '#e85c0d' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#e85c0d' }}>Często zadawane pytania</span>
          </div>
          <h2 className="text-5xl font-black text-white" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>FAQ</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl overflow-hidden border-0" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-white hover:no-underline text-sm" style={{ color: 'white' }}>
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="kontakt" className="py-24 px-6" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6" style={{ background: '#e85c0d' }} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#e85c0d' }}>Znajdź nas</span>
          </div>
          <h2 className="text-5xl font-black text-white" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>Kontakt</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { icon: '📍', label: 'Adres składu', value: 'Dalachów 8\n46-325 Rudniki', link: null },
              { icon: '📞', label: 'Telefon', value: '694 232 935', link: 'tel:+48694232935' },
              { icon: '✉️', label: 'E-mail', value: 'fhuliradjagskladopalu@gmail.com', link: 'mailto:fhuliradjagskladopalu@gmail.com' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(232,92,13,0.12)' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</div>
                  {item.link ? (
                    <a href={item.link} className="font-semibold text-white hover:text-[#e85c0d] transition-colors whitespace-pre-line">{item.value}</a>
                  ) : (
                    <div className="font-semibold text-white whitespace-pre-line">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ height: '320px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.7948078672566!2d18.5487838769597!3d51.08013924182562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471085b736e1eb49%3A0xb4695e054ab10178!2sDalach%C3%B3w%208%2C%2046-325%20Dalach%C3%B3w!5e1!3m2!1spl!2spl!4v1781465052940!5m2!1spl!2spl"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-black text-xl tracking-widest text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            LIRA<span style={{ color: '#e85c0d' }}>DJAG</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            FHU LIRADJAG Robert Gajda<br />
            NIP: 5761191269<br />
            Dalachów 8, 46-325 Rudniki<br /><br />
            Sprzedaż paliw stałych — pelletu, węgla kamiennego i eko-groszku.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Nawigacja</div>
          <div className="space-y-2">
            {['#oferta|Oferta i ceny', '#dostawa|Dostawa i odbiór', '#faq|FAQ', '#kontakt|Kontakt'].map(item => {
              const [href, label] = item.split('|')
              return <a key={href} href={href} className="block text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</a>
            })}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Kontakt</div>
          <div className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <div>📍 Dalachów 8, 46-325 Rudniki</div>
            <div>📞 <a href="tel:+48694232935" className="hover:text-white transition-colors">694 232 935</a></div>
            <div>✉️ <a href="mailto:fhuliradjagskladopalu@gmail.com" className="hover:text-white transition-colors break-all">fhuliradjagskladopalu@gmail.com</a></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2025 FHU LIRADJAG Robert Gajda. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes float { from { transform: translateY(0px) } to { transform: translateY(-20px) } }
        @keyframes scrollDot { 0%,100% { transform: translateY(0); opacity:1 } 50% { transform: translateY(12px); opacity:0.3 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        html { scroll-behavior: smooth }
        * { box-sizing: border-box }
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
      `}</style>
      <Nav />
      <Hero />
      <TrustBar />
      <Products />
      <CtaBanner />
      <Delivery />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}
