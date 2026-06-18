import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, X, Music2, Volume2, ArrowRight, Map, Orbit, Feather, Camera, Code2, CloudSun, Plane, Compass, Heart } from 'lucide-react';

const IMAGE_URLS = [
  'https://i.ibb.co/TDsRgbhV/photo-27-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/qFjhRJkr/photo-25-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/KzVjLVGX/photo-23-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/YTwM4Vk6/photo-22-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/tMWgHmqQ/photo-20-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/TM2MtkbP/photo-21-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/ZpGNtgQ9/photo-19-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/Zzhcf3tt/photo-17-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/kVGP6P7F/photo-15-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/LDpxgTw0/photo-12-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/cc4nJwPN/photo-10-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/rKYd1MFR/photo-11-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/jvCt4bG9/photo-9-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/8n1mftnR/photo-8-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/MyhVfmwF/photo-3-2026-06-10-15-40-32.jpg',
  'https://i.ibb.co/6cX9jRN1/photo-2-2026-06-10-15-40-32.jpg',
];

function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return { x, y };
}

function FloatingParticle({ p, dreamMode, onBurst }) {
  return (
    <motion.div
      className="pointer-events-auto absolute select-none"
      style={{ left: p.x, top: p.y }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: p.alpha, scale: 1, x: [0, p.dx, 0], y: [0, p.dy, 0] }}
      transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
      onClick={() => onBurst?.(p)}
    >
      <div className={`rounded-full ${dreamMode ? 'bg-white/60' : 'bg-white/40'} blur-[1px]`} style={{ width: p.size, height: p.size, boxShadow: `0 0 ${p.glow}px rgba(255,255,255,.8)` }} />
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs tracking-[0.3em] text-white/80 backdrop-blur-xl">
        <Icon className="h-3.5 w-3.5" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">{subtitle}</p>
    </div>
  );
}

function MagneticButton({ children, className = '', onClick, variant = 'default' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.3 });
  const springY = useSpring(my, { stiffness: 200, damping: 18, mass: 0.3 });

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
        my.set((e.clientY - (r.top + r.height / 2)) * 0.18);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-medium transition ${variant === 'ghost' ? 'border border-white/15 bg-white/8 text-white backdrop-blur-xl' : 'bg-white text-slate-950 shadow-2xl shadow-black/30'} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,.35), transparent 70%)' }} />
    </motion.button>
  );
}

function GlassCard({ children, className = '' }) {
  return <div className={`rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,.25)] ${className}`}>{children}</div>;
}

function PhotoCard({ item, index, onClick, onHover, onLeave, dreamMode }) {
  const driftX = [0, 16, -8, 10][index % 4];
  const driftY = [0, -10, 8, -14][index % 4];
  const size = [160, 190, 150, 210, 170][index % 5];
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: item.x, top: item.y, rotate: item.rotate, zIndex: item.z }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1, x: [0, driftX, 0], y: [0, driftY, 0] }}
      transition={{ duration: 8 + (index % 3), repeat: Infinity, ease: 'easeInOut' }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
    >
      <div className={`relative rounded-[1.5rem] p-[2px] ${dreamMode ? 'bg-gradient-to-br from-pink-300 via-white to-sky-300' : 'bg-gradient-to-br from-white/80 via-white/30 to-fuchsia-300/70'} shadow-2xl`}>
        <div className="overflow-hidden rounded-[1.4rem] bg-black/20" style={{ width: size, height: size * 1.2, transformStyle: 'preserve-3d' }}>
          <img src={item.src} alt={`memory ${index + 1}`} className="h-full w-full object-cover transition duration-700 hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-white/10" />
          <div className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-[10px] tracking-[0.35em] text-white backdrop-blur-xl">{item.tag}</div>
          <div className="absolute bottom-3 left-3 right-3 text-white/90">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Constellation</p>
            <p className="text-sm font-semibold">{item.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ item, onClose, dreamMode }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_30px_120px_rgba(0,0,0,.5)] backdrop-blur-2xl"
          initial={{ scale: 0.9, y: 30, rotateX: 12 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`absolute inset-0 ${dreamMode ? 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.18),_transparent_42%),linear-gradient(135deg,rgba(255,192,203,.35),rgba(185,218,255,.22),rgba(255,245,230,.18))]' : 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.12),_transparent_42%),linear-gradient(135deg,rgba(168,85,247,.18),rgba(56,189,248,.12),rgba(251,113,133,.14))]'}" />
          <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-black/20 p-2 text-white backdrop-blur-xl"><X className="h-4 w-4" /></button>
          <div className="grid gap-0 md:grid-cols-[1.5fr_1fr]">
            <div className="relative min-h-[420px] md:min-h-[640px]">
              <img src={item.src} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="relative flex flex-col justify-between p-6 md:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs tracking-[0.3em] text-white/80 backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5" /> MEMORY PORTAL
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{item.story}</p>
              </div>
              <div className="mt-8 grid gap-3 text-sm text-white/80">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">A floating memory with depth, glow, and a soft cinematic blur.</div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">Hover stories stay alive, like a postcard that remembers your touch.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

export default function LiliasUniverse() {
  const [phase, setPhase] = useState('intro');
  const [showUI, setShowUI] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [dreamMode, setDreamMode] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [scrollStorm, setScrollStorm] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [cursorTrail, setCursorTrail] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [gravity, setGravity] = useState(0.3);
  const mouse = useMouse();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const items = useMemo(() => {
    const titles = [
      'Orbit of Wonder', 'Memory Bloom', 'Sky Notes', 'Travel Echo', 'Quiet Radiance', 'Golden Drift', 'Soft Horizon', 'Afterglow',
      'Story Fragment', 'Blue Hour', 'Paper Light', 'Stardust Path', 'Curious Moment', 'Dream Postcard', 'Hidden Glow', 'Lasting Trace',
    ];
    const stories = [
      'A memory suspended like a star, still glowing with color and movement.',
      'A quiet moment that feels like it was caught between sky and thought.',
      'A tiny universe of light, texture, and curiosity.',
      'A photograph that feels like a postcard from a beautiful somewhere.',
      'A frame that remembers softness, energy, and a little bit of magic.',
      'A memory that seems to float even after the moment has passed.',
      'A scene that turns ordinary light into something unforgettable.',
      'A fragment of a story told with warmth and wonder.',
      'A visual note from an adventure, suspended in the air.',
      'A still moment with the feeling of motion hidden inside it.',
      'A photograph that carries curiosity like a secret spark.',
      'A gentle trace of color, travel, and imagination.',
      'A memory made of light, sky, and quiet confidence.',
      'A postcard from a dream that refuses to fade.',
      'A hidden star waiting to be noticed.',
      'A beautiful moment stored as light and motion.',
    ];
    return IMAGE_URLS.map((src, i) => ({
      src,
      title: titles[i % titles.length],
      story: stories[i % stories.length],
      tag: ['photo', 'memory', 'journey', 'spark'][i % 4],
      x: 70 + (i % 4) * 260 + (i % 2) * 40,
      y: 40 + Math.floor(i / 4) * 210 + ((i % 3) * 16),
      rotate: [-8, -4, 4, 7, -10, 5][i % 6],
      z: 10 + i,
    }));
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      x: `${(i * 7) % 100}%`,
      y: `${(i * 13) % 100}%`,
      size: 2 + (i % 5) * 1.5,
      glow: 12 + (i % 4) * 10,
      dx: (i % 2 ? 1 : -1) * (12 + (i % 5) * 6),
      dy: (i % 3 ? -1 : 1) * (8 + (i % 6) * 4),
      duration: 7 + (i % 8),
      alpha: 0.25 + (i % 4) * 0.12,
    }));
  }, []);

  const planets = useMemo(() => ([
    { name: 'Photography Planet', icon: Camera, x: 18, y: 22, hue: 'from-pink-300 via-rose-200 to-orange-200', note: 'camera flashes • film • lenses' },
    { name: 'Travel Planet', icon: Plane, x: 72, y: 18, hue: 'from-sky-300 via-cyan-200 to-indigo-200', note: 'routes • clouds • passports' },
    { name: 'Computer Science Planet', icon: Code2, x: 78, y: 72, hue: 'from-violet-300 via-fuchsia-200 to-sky-200', note: 'code • particles • digital waves' },
    { name: 'Dance Planet', icon: Music2, x: 22, y: 74, hue: 'from-amber-200 via-rose-200 to-pink-200', note: 'music • rhythm • motion' },
  ]), []);

  useEffect(() => {
    const move = (e) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
      setCursorTrail((prev) => [...prev.slice(-14), { x: e.clientX, y: e.clientY, id: crypto.randomUUID() }]);
    };
    const click = (e) => {
      setSparkles((prev) => [...prev.slice(-24), { x: e.clientX, y: e.clientY, id: crypto.randomUUID() }]);
      setInteractionCount((n) => n + 1);
      if (interactionCount > 5 && !secretUnlocked) setSecretUnlocked(true);
      if (phase !== 'intro') setGravity((g) => Math.min(1, g + 0.05));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('click', click);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('click', click);
    };
  }, [mouse.x, mouse.y, phase, interactionCount, secretUnlocked]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollStorm(y > 700 && y < 2500);
      if (y > 1600) setDreamMode(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const rippleX = useTransform(mouse.x, (v) => v / 25);
  const rippleY = useTransform(mouse.y, (v) => v / 25);

  const beginUniverse = () => setPhase('enter');
  const continueUniverse = () => {
    setPhase('explore');
    setShowUI(true);
    setTimeout(() => setLetterOpen(false), 0);
  };

  const openLetter = () => {
    setLetterOpen(true);
    setDreamMode(true);
    setShowUI(true);
  };

  const triggerTransformation = () => {
    setDreamMode(true);
    setMusicOn(true);
    setPhase('dream');
    setTimeout(() => setLetterOpen(true), 1200);
  };

  const returnReality = () => {
    setDreamMode(false);
    setLetterOpen(false);
    setPhase('explore');
  };

  const toggleMusic = () => setMusicOn((v) => !v);

  return (
    <div ref={containerRef} className={`relative min-h-screen overflow-hidden ${dreamMode ? 'bg-[#f9dbe8]' : 'bg-[#080816]'} text-white`}>
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${dreamMode ? '#f9dbe8' : '#080816'}; }
        .universe-grid {
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,.12) 0, transparent 16%),
            radial-gradient(circle at 80% 10%, rgba(255,255,255,.10) 0, transparent 14%),
            radial-gradient(circle at 10% 80%, rgba(255,255,255,.08) 0, transparent 18%),
            linear-gradient(135deg, rgba(99,102,241,.10), rgba(236,72,153,.10), rgba(14,165,233,.08));
        }
        .grain:before {
          content: '';
          position: absolute; inset: 0; pointer-events:none;
          background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px);
          background-size: 22px 22px;
          mix-blend-mode: screen;
          opacity: .08;
        }
        @keyframes drift { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(10px,-12px,0) } 100% { transform: translate3d(0,0,0) } }
        @keyframes shimmer { 0% { opacity:.25; transform:scale(.96) } 50% { opacity:.65; transform:scale(1.04) } 100% { opacity:.25; transform:scale(.96) } }
        @keyframes floaty { 0% { transform: translateY(0px) rotate(0deg) } 50% { transform: translateY(-14px) rotate(4deg) } 100% { transform: translateY(0px) rotate(0deg) } }
        @keyframes ripple { 0% { transform: scale(.2); opacity:.75 } 100% { transform: scale(3); opacity:0 } }
        .floaty { animation: floaty 8s ease-in-out infinite; }
        .drift { animation: drift 10s ease-in-out infinite; }
        .shimmer { animation: shimmer 3.5s ease-in-out infinite; }
      `}</style>

      <motion.div className="pointer-events-none fixed inset-0 z-0 opacity-80 universe-grid" style={{ x: rippleX, y: rippleY }} />
      <motion.div className="pointer-events-none fixed inset-0 z-0 opacity-70 grain" />

      <div className="pointer-events-none fixed inset-0 z-10">
        {particles.map((p, i) => (
          <FloatingParticle key={i} p={p} dreamMode={dreamMode} />
        ))}
        {cursorTrail.map((c, i) => (
          <motion.div key={c.id} className="absolute rounded-full bg-white/40 blur-sm" style={{ left: c.x, top: c.y, width: 8 - i * 0.25, height: 8 - i * 0.25 }} initial={{ opacity: 0.8, scale: 0.8 }} animate={{ opacity: 0, scale: 1.8 }} transition={{ duration: 0.9 }} />
        ))}
        {sparkles.map((s) => (
          <motion.div key={s.id} className="absolute text-white" style={{ left: s.x, top: s.y }} initial={{ opacity: 1, scale: 0.3 }} animate={{ opacity: 0, scale: 1.8, y: -30 }} transition={{ duration: 1.1 }}>
            ✨
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.section className="relative z-20 flex min-h-screen items-center justify-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <motion.button
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl shadow-[0_0_80px_rgba(255,255,255,.3)] backdrop-blur-xl"
                animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 35px rgba(255,255,255,.35)', '0 0 70px rgba(255,255,255,.65)', '0 0 35px rgba(255,255,255,.35)'] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                onClick={beginUniverse}
              >
                ✦
              </motion.button>
              <p className="mt-6 text-sm tracking-[0.45em] text-white/50">TOUCH THE STAR</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'enter' && (
          <motion.section className="relative z-20 flex min-h-screen items-center justify-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="text-center" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
              <motion.h1 className="text-5xl font-semibold md:text-8xl" initial={{ letterSpacing: '0.5em', opacity: 0 }} animate={{ letterSpacing: '0.08em', opacity: 1 }} transition={{ duration: 1.2 }}>
                LILIA <span className="inline-block">🦢</span>
              </motion.h1>
              <motion.p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/75 md:text-lg" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                Welcome to a universe captured through her eyes.
              </motion.p>
              <div className="mt-8">
                <MagneticButton onClick={continueUniverse}>Continue <ArrowRight className="h-4 w-4" /></MagneticButton>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUI && (
          <motion.div className="relative z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black/10 backdrop-blur-2xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">🦢</div>
                  <div>
                    <div className="text-sm font-semibold tracking-[0.25em]">LILIA'S UNIVERSE</div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">A living memory constellation</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MagneticButton variant="ghost" onClick={() => setPhase('explore')}>Explore</MagneticButton>
                  <MagneticButton variant="ghost" onClick={toggleMusic}>{musicOn ? <Volume2 className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}</MagneticButton>
                </div>
              </div>
            </header>

            <main ref={contentRef} className="mx-auto max-w-7xl px-4 pb-28 pt-12 md:px-6">
              <section className="min-h-[90vh]">
                <SectionTitle
                  icon={Sparkles}
                  eyebrow="CONSTELLATION GALLERY"
                  title="A floating universe of memories"
                  subtitle="Every image is a star. Every hover reveals a story. Every click opens a memory portal instead of a simple preview."
                />
                <div className="relative h-[1300px] rounded-[3rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:h-[980px] md:p-10">
                  <div className="absolute inset-0 overflow-hidden rounded-[3rem]">
                    <motion.div className={`absolute inset-0 ${dreamMode ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,192,203,.35),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(186,230,253,.32),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(253,230,138,.18),transparent_28%)]' : 'bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,.15),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(251,113,133,.12),transparent_28%)]'}" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 9, repeat: Infinity }} />
                    {items.map((item, i) => (
                      <PhotoCard
                        key={item.src}
                        item={item}
                        index={i}
                        dreamMode={dreamMode}
                        onHover={() => setHovered(item)}
                        onLeave={() => setHovered(null)}
                        onClick={() => { setLightbox(item); setInteractionCount((n) => n + 1); }}
                      />
                    ))}
                    {hovered && (
                      <motion.div className="absolute bottom-8 left-8 z-40 max-w-sm rounded-[1.5rem] border border-white/15 bg-black/30 p-4 text-white backdrop-blur-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="text-xs tracking-[0.35em] text-white/60">STORY NOTE</div>
                        <div className="mt-2 text-lg font-semibold">{hovered.title}</div>
                        <div className="mt-1 text-sm leading-6 text-white/75">{hovered.story}</div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              <section className="py-24">
                <SectionTitle
                  icon={Map}
                  eyebrow="TRAVEL MEMORY ATLAS"
                  title="A glowing atlas where routes draw themselves"
                  subtitle="The map feels alive: routes sketch in real time, postcards drift like memories, and every location behaves like a soft cinematic chapter."
                />
                <div className="grid gap-6 lg:grid-cols-[1.3fr_.9fr]">
                  <GlassCard className="relative min-h-[560px] overflow-hidden p-6 md:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.14),transparent_32%)]" />
                    <motion.div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.22),rgba(255,255,255,.04)_55%,rgba(99,102,241,.06)_75%,transparent_100%)] shadow-[0_0_120px_rgba(255,255,255,.15)]" animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute left-[18%] top-[22%] text-2xl" animate={{ x: [0, 10, 0], y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>✈</motion.div>
                    <motion.div className="absolute left-[70%] top-[34%] text-2xl" animate={{ x: [0, -12, 0], y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity }}>☁</motion.div>
                    <motion.div className="absolute left-[43%] top-[65%] text-2xl" animate={{ x: [0, 8, 0], y: [0, -6, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>✦</motion.div>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="rounded-full border border-white/15 bg-white/10 px-6 py-4 text-center backdrop-blur-2xl">
                        <div className="text-xs tracking-[0.35em] text-white/60">WORLD ATLAS</div>
                        <div className="mt-1 text-2xl font-semibold">Travel paths glow into existence</div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-3">
                      {['Floating postcards', 'Animated routes', 'Journal pages'].map((t) => <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80 backdrop-blur-xl">{t}</div>)}
                    </div>
                  </GlassCard>
                  <div className="grid gap-4">
                    {items.slice(0, 4).map((item, i) => (
                      <motion.div key={item.src} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/8 backdrop-blur-xl" whileHover={{ scale: 1.02 }}>
                        <div className="flex gap-4 p-4">
                          <img src={item.src} alt={item.title} className="h-24 w-20 rounded-2xl object-cover" />
                          <div className="min-w-0">
                            <div className="text-[11px] tracking-[0.35em] text-white/55">POSTCARD {String(i + 1).padStart(2, '0')}</div>
                            <div className="mt-1 font-semibold">{item.title}</div>
                            <div className="mt-2 text-sm text-white/70">{item.story}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-24">
                <SectionTitle
                  icon={Orbit}
                  eyebrow="CREATIVE DNA GALAXY"
                  title="Four planets orbiting a warm core"
                  subtitle="Drag the feeling of the page with your eyes: photography flashes, clouds, code particles, and music waves become tiny worlds of their own."
                />
                <div className="relative min-h-[620px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-10">
                  <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.45),rgba(255,255,255,.1),transparent_72%)] blur-2xl" />
                  <motion.div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
                  {planets.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.name}
                        className={`absolute flex h-44 w-44 cursor-grab flex-col items-center justify-center rounded-full bg-gradient-to-br ${p.hue} text-slate-900 shadow-[0_20px_90px_rgba(0,0,0,.22)]`}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        drag
                        dragElastic={0.28}
                        dragMomentum
                        whileHover={{ scale: 1.08 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Icon className="h-10 w-10" />
                        <div className="mt-2 text-center text-sm font-semibold">{p.name}</div>
                        <div className="mt-1 px-4 text-center text-[11px] tracking-[0.25em] opacity-70">{p.note}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              <section className="py-24">
                <SectionTitle
                  icon={CloudSun}
                  eyebrow="MEMORY STORM"
                  title="Where photos begin to fall like memories"
                  subtitle="This area wakes up as you scroll. Images drift, bounce, collide, and swirl around the viewport like a playful physics dream."
                />
                <GlassCard className={`relative min-h-[720px] overflow-hidden ${scrollStorm ? 'ring-1 ring-white/20' : ''}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.12),transparent_36%)]" />
                  {items.slice(0, 10).map((item, i) => (
                    <motion.img
                      key={`${item.src}-storm`}
                      src={item.src}
                      alt="falling memory"
                      className="absolute rounded-2xl border border-white/15 object-cover shadow-2xl"
                      style={{ width: 110 + (i % 3) * 20, height: 90 + (i % 4) * 18, left: `${4 + (i * 9) % 86}%`, top: `${8 + (i * 13) % 72}%` }}
                      animate={{ y: [0, 500], x: [0, (i % 2 ? 1 : -1) * 40], rotate: [i * 5, i * 5 + 22], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 11 + (i % 5), repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                    />
                  ))}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-sm text-white/75">Move your cursor across the storm and the memories feel as though they remember motion.</div>
                </GlassCard>
              </section>

              <section className="py-24">
                <SectionTitle
                  icon={Feather}
                  eyebrow="HIDDEN SWAN"
                  title="A quiet detail waits in the universe"
                  subtitle="Somewhere inside this experience, a small presence observes the motion of the page. It appears only after the universe has been touched enough times."
                />
                <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
                  <GlassCard className="relative min-h-[360px] overflow-hidden p-6 md:p-8">
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="text-xs tracking-[0.35em] text-white/60">THE QUIET PLACE</div>
                        <h3 className="mt-3 text-3xl font-semibold">The page listens before it reveals.</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">Keep exploring the universe. At the right moment, a hidden presence begins to follow the cursor and changes everything.</p>
                      </div>
                    </div>
                    {secretUnlocked && (
                      <motion.button
                        className="absolute bottom-5 right-5 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-sm backdrop-blur-xl"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={triggerTransformation}
                      >
                        a tiny swan appears
                      </motion.button>
                    )}
                  </GlassCard>
                  <div className="grid gap-4">
                    <GlassCard className="p-6">
                      <div className="text-xs tracking-[0.35em] text-white/60">INTERACTION STATE</div>
                      <div className="mt-3 text-2xl font-semibold">{interactionCount} touches</div>
                      <p className="mt-2 text-sm text-white/75">Every click, hover, and scroll adds energy to the universe.</p>
                    </GlassCard>
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs tracking-[0.35em] text-white/60">TRANSFORMATION</div>
                          <div className="mt-1 text-2xl font-semibold">Dream mode</div>
                        </div>
                        <Button onClick={triggerTransformation} className="rounded-full bg-white text-slate-950 hover:bg-white/90">Awaken</Button>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </section>

              <section className="py-24">
                <SectionTitle
                  icon={Heart}
                  eyebrow="THE LETTER DIMENSION"
                  title="A paper-folding transition into something more intimate"
                  subtitle="This is not a modal. The universe folds, the camera drifts through clouds, and the letter arrives as a handwritten memory in motion."
                />
                <GlassCard className="overflow-hidden p-6 md:p-10">
                  <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
                    <div className="space-y-5">
                      <div className="text-xs tracking-[0.35em] text-white/60">UNFOLDED MESSAGE</div>
                      <h3 className="text-3xl font-semibold">A note for Lilia</h3>
                      <div className="space-y-4 text-sm leading-7 text-white/80">
                        <p>There is something rare about the way you notice the world. Not just the big moments, but the quiet ones too — the reflections, the colors, the little details most people walk past without seeing.</p>
                        <p>Your creativity feels alive. Your photography turns passing moments into memories with weight and warmth. Your curiosity gives the universe motion. Your energy makes ordinary scenes feel brighter. Your adventures leave behind traces of wonder wherever they go.</p>
                        <p>This space was built to celebrate that feeling — the beauty of seeing deeply, moving boldly, and turning life into something vivid and unforgettable.</p>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <MagneticButton onClick={() => setPhase('explore')}>✨ Continue Exploring</MagneticButton>
                        <MagneticButton variant="ghost" onClick={() => setLightbox(items[0])}>📷 View Memory Collection</MagneticButton>
                        <MagneticButton variant="ghost" onClick={returnReality}>🦢 Return To Reality</MagneticButton>
                      </div>
                    </div>
                    <div className="relative min-h-[360px] rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.2),transparent_40%),linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.03))] p-6 backdrop-blur-xl">
                      <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs tracking-[0.35em] text-white/75">SEALED WITH LIGHT</div>
                      <motion.div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                        <div className="rounded-[2rem] border border-white/20 bg-white/15 p-6 text-5xl backdrop-blur-2xl">✉</div>
                        <div className="text-sm text-white/75">A letter suspended in a soft dimension.</div>
                      </motion.div>
                      <motion.div className="absolute bottom-8 left-8 text-2xl">🌸</motion.div>
                      <motion.div className="absolute bottom-20 right-10 text-2xl">✨</motion.div>
                      <motion.div className="absolute right-8 top-20 text-2xl">🫧</motion.div>
                    </div>
                  </div>
                </GlassCard>
              </section>
            </main>

            <footer className="border-t border-white/10 bg-black/10 px-6 py-8 text-center text-xs tracking-[0.35em] text-white/50 backdrop-blur-2xl">
              LILIA'S UNIVERSE • A living interactive story
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {letterOpen && (
          <motion.div className="fixed inset-0 z-[180] flex items-center justify-center bg-[#f7d8e5]/95 p-4 backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,.80),rgba(255,248,250,.88))] p-6 text-slate-900 shadow-[0_40px_140px_rgba(0,0,0,.22)] md:p-10" initial={{ rotateX: 20, scale: 0.82, y: 60 }} animate={{ rotateX: 0, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,192,203,.3),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(186,230,253,.25),transparent_35%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_.78fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.35em] text-slate-600">LETTER DIMENSION</div>
                  <h3 className="mt-4 text-4xl font-semibold md:text-5xl">A warm note</h3>
                  <motion.div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-700" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.45 } } }}>
                    {[
                      'Some people do not just live in a place — they bring their own atmosphere with them.',
                      'Your creativity, curiosity, and energy have a way of making moments feel brighter and more meaningful.',
                      'The way you notice beauty in ordinary things is a gift. It turns small moments into memories and simple scenes into stories.',
                      'May your path keep opening into new colors, new places, and new reasons to keep creating.',
                    ].map((t, i) => (
                      <motion.p key={i} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
                        {t}
                      </motion.p>
                    ))}
                  </motion.div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <MagneticButton onClick={() => setLetterOpen(false)}>✨ Continue Exploring</MagneticButton>
                    <MagneticButton variant="ghost" onClick={() => setLightbox(items[0])}>📷 View Memory Collection</MagneticButton>
                    <MagneticButton variant="ghost" onClick={() => { setLetterOpen(false); setDreamMode(false); }}>🦢 Return To Reality</MagneticButton>
                  </div>
                </div>
                <div className="relative min-h-[420px] rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.22))] p-6">
                  <div className="absolute left-6 top-6 rounded-full bg-rose-200 px-4 py-2 text-xs tracking-[0.35em] text-rose-800">wax seal</div>
                  <motion.div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
                    <div className="rounded-[2rem] bg-white px-8 py-10 text-6xl shadow-2xl">✉</div>
                    <div className="mt-4 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-700 shadow">handwritten thoughts</div>
                  </motion.div>
                  <div className="absolute bottom-6 left-6 text-2xl">🌸</div>
                  <div className="absolute right-6 bottom-16 text-2xl">✨</div>
                  <div className="absolute right-12 top-20 text-2xl">🦢</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} dreamMode={dreamMode} />}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[160] flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-3 text-xs text-white/80 backdrop-blur-2xl">
        <Compass className="h-3.5 w-3.5" />
        Scroll to unlock the transformation
      </div>

      {secretUnlocked && (
        <motion.div
          className="fixed left-6 top-1/2 z-[170] -translate-y-1/2 text-2xl"
          animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          onClick={triggerTransformation}
        >
          🦢
        </motion.div>
      )}

      {dreamMode && (
        <motion.div className="pointer-events-none fixed inset-0 z-[155] mix-blend-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              style={{ left: `${(i * 9) % 100}%`, top: `${(i * 13) % 100}%` }}
              animate={{ y: [0, -18, 0], x: [0, 8, 0], rotate: [0, 8, 0], opacity: [0.15, 0.8, 0.15] }}
              transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: 'easeInOut' }}
            >
              {['💖', '✨', '🌸', '🦢'][i % 4]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
