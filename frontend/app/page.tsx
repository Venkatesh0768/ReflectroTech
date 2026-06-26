'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  CircuitBoard,
  Layers,
  Cpu,
  Wifi,
  FlipHorizontal,
  Zap,
  Award,
  Clock,
  TrendingDown,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronRight,
  Factory,
  Users,
  Star,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const products = [
  { icon: CircuitBoard, name: 'Single Sided PCB',  desc: 'Simple, cost-effective boards for consumer electronics and basic circuits.',   color: 'from-blue-500 to-blue-700' },
  { icon: Layers,       name: 'Metal Core PCB',    desc: 'Superior thermal management for high-power LED and power electronics.',         color: 'from-emerald-500 to-emerald-700' },
  { icon: FlipHorizontal,name:'Double Sided PCB',  desc: 'Circuits on both surfaces for moderate-complexity applications.',              color: 'from-violet-500 to-violet-700' },
  { icon: Cpu,          name: 'Multilayer PCB',    desc: 'High-density interconnects for complex, space-constrained designs.',           color: 'from-orange-500 to-orange-700' },
  { icon: Wifi,         name: 'RF PCB',            desc: 'High-frequency boards for telecom, radar, and wireless communication.',        color: 'from-cyan-500 to-cyan-700' },
  { icon: Zap,          name: 'SS Flex PCB',       desc: 'Single-sided flexible circuits for wearable and dynamic applications.',        color: 'from-pink-500 to-pink-700' },
];

const stats = [
  { value: '15+', label: 'Years Experience',   icon: Factory },
  { value: '500+', label: 'Clients Served',    icon: Users },
  { value: '1M+',  label: 'PCBs Delivered',    icon: CircuitBoard },
  { value: '99.8%', label: 'Quality Rate',     icon: Star },
];

const whyUs = [
  { icon: Award,       title: 'ISO Certified',         desc: 'Certified manufacturing processes ensuring consistent, traceable quality across every batch.' },
  { icon: Clock,       title: 'On-Time Delivery',       desc: 'Industry-leading lead times with real-time order tracking from fabrication to dispatch.' },
  { icon: ShieldCheck, title: 'Rigorous QC',            desc: '100% electrical testing, AOI, and visual inspection before every shipment.' },
  { icon: TrendingDown,title: 'Competitive Pricing',   desc: 'Optimised production lines and bulk material procurement keep costs low without compromise.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { user, status } = useAuth();

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0D1117]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F4C81]">
              <CircuitBoard size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">RF Electrotech</span>
              <p className="text-[10px] text-slate-400 leading-none">PCB Manufacturing ERP</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#products"  className="hover:text-white transition-colors">Products</a>
            <a href="#why-us"    className="hover:text-white transition-colors">Why Us</a>
            <a href="#contact"   className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* CTA */}
          {status === 'loading' ? (
            <div className="h-5 w-5 rounded-full border-2 border-[#00A86B] border-t-transparent animate-spin" />
          ) : user ? (
            <Link href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F4C81] hover:bg-[#1a5fa0] text-sm font-medium transition-colors">
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</Link>
              <Link href="/register"
                className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-[#00956e] text-sm font-semibold text-white transition-colors">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSIjMWYyOTM3IiBmaWxsLW9wYWNpdHk9Ii4zIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        {/* Gradient blobs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#0F4C81]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[#00A86B]/20 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00A86B]/40 bg-[#00A86B]/10 text-[#00A86B] text-xs font-semibold mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00A86B] animate-pulse" />
            ISO Certified PCB Manufacturer — Greater Noida, India
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Precision{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C81] via-[#1a7fc4] to-[#00A86B]">
              PCB Manufacturing
            </span>
            <br />at Scale
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            From single-sided to multilayer and RF boards — RF Electrotech delivers
            precision-engineered PCBs with industry-leading quality and turnaround times.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C81] hover:bg-[#1a5fa0] text-white font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-[#0F4C81]/30">
                Open ERP Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link href="/register"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C81] hover:bg-[#1a5fa0] text-white font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-[#0F4C81]/30">
                  Access ERP System <ArrowRight size={16} />
                </Link>
                <a href="#products"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-base transition-all hover:bg-white/5">
                  View Products <ChevronRight size={16} />
                </a>
              </>
            )}
          </div>

          {/* Tech stack badge */}
          <p className="mt-8 text-xs text-slate-600">
            Spring Boot 3 · Next.js 16 · MySQL · JWT Auth · Docker
          </p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#0F1923]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F4C81]/20 text-[#4a9fd4] mb-3 group-hover:bg-[#0F4C81]/40 transition-colors">
                  <Icon size={22} />
                </div>
                <div className="text-3xl font-extrabold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ───────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 bg-[#0D1117]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0F4C81]/40 bg-[#0F4C81]/10 text-[#4a9fd4] text-xs font-semibold mb-4">
              Our Products
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Complete PCB Manufacturing Solutions
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              From prototype to high-volume production, we manufacture every type of
              printed circuit board with precision and quality assurance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(({ icon: Icon, name, desc, color }) => (
              <div key={name}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* Hover glow */}
                <div className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color} blur-sm`} style={{ zIndex: -1 }} />

                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                  Learn more <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────────────────── */}
      <section id="why-us" className="py-24 bg-[#0F1923]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00A86B]/40 bg-[#00A86B]/10 text-[#00A86B] text-xs font-semibold mb-4">
                Why Choose Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                Professional Approach &<br />
                <span className="text-[#00A86B]">Consistent Quality</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                RF Electrotech has been serving OEMs, CEMs, and system integrators since 2008.
                Our ISO-certified processes, experienced engineering team, and state-of-the-art
                facilities guarantee every board meets your specifications.
              </p>
              <a href="tel:+919205009707"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00A86B] hover:bg-[#00956e] text-sm font-semibold transition-colors">
                <Phone size={14} /> Get a Quote: +91 9205009707
              </a>
            </div>

            {/* Right — feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl border border-white/10 bg-white/5 hover:border-[#00A86B]/30 hover:bg-[#00A86B]/5 transition-all group">
                  <div className="h-10 w-10 rounded-lg bg-[#00A86B]/15 flex items-center justify-center text-[#00A86B] mb-3 group-hover:bg-[#00A86B]/25 transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-[#0F4C81] to-[#0a3560] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wMyIvPjwvZz48L3N2Zz4=')] opacity-100" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Streamline Your Manufacturing?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Access the RF Electrotech ERP to manage customers, orders, production,
            inventory, and quality — all from one platform.
          </p>
          {user ? (
            <Link href="/erp/customers"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0F4C81] font-bold text-base hover:bg-blue-50 transition-colors shadow-xl">
              Open ERP <ArrowRight size={16} />
            </Link>
          ) : (
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0F4C81] font-bold text-base hover:bg-blue-50 transition-colors shadow-xl">
              Sign in to ERP <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-[#0A0F14] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F4C81]">
                  <CircuitBoard size={18} className="text-white" />
                </div>
                <span className="text-base font-bold">RF Electrotech</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                ISO-certified PCB manufacturer delivering high-quality boards
                to OEMs, CEMs, and system integrators across India and beyond.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Our Products</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {products.map(p => (
                  <li key={p.name} className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
                    <ChevronRight size={12} className="text-[#00A86B]" /> {p.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="text-[#00A86B] mt-0.5 shrink-0" />
                  Plot No 106, Sector Ecotech 12, Greater Noida, G.B. Nagar, U.P.
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-[#00A86B] shrink-0" />
                  <a href="tel:+919205009707" className="hover:text-white transition-colors">
                    +91 9205009707
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={14} className="text-[#00A86B] shrink-0" />
                  <a href="mailto:info@rfelectrotech.com" className="hover:text-white transition-colors">
                    info@rfelectrotech.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © 2024 RF Electrotech. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <Link href="/login"   className="hover:text-slate-400 transition-colors">ERP Login</Link>
              <Link href="/register" className="hover:text-slate-400 transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
