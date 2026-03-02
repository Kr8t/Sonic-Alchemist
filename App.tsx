
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Twitter, Facebook, Download, Share2, Sun, Moon, Save, Trash2, FolderOpen, Info, FileText, Volume2, VolumeX } from 'lucide-react';
import html2canvas from 'html2canvas';
import { SAGenre, GeneratedPrompt, VocalStyle } from './types';
import { generateMusicPrompt } from './services/geminiService';

const MOODS = [
  "MIDNIGHT SOWETO RAIN / NEON REFLECTIONS",
  "SURGICAL WAREHOUSE ECHO / MINIMALIST PRECISION",
  "CAMPS BAY FOGGY SUNSET / LUSH ATMOSPHERICS",
  "INDUSTRIAL DURBAN GRIME / METALLIC RESONANCE",
  "AFRO-TECH RITUAL SPIRIT / ANCESTRAL ECHO",
  "PRIVATE SCHOOL JAZZ CLUB / SOPHISTICATED NOSTALGIA",
  "GLITCHY HI-FI VINYL / ANALOG WARMTH",
  "WINTER JOZI MORNING / CRISP URBAN HAZE",
  "BASEMENT SHEBEEN HEAT / RAW ENERGY",
  "GARDEN DEEP FOLEY / ORGANIC TEXTURES",
  "SANDTON PENTHOUSE LUSH / HIGH-GLOSS WEALTH",
  "MAMELODI BACARDI STREETS / AGGRESSIVE FESTIVAL",
  "DURBAN HARBOR AMBIENCE / RUSTY SIGNAL",
  "ORBITAL ANCESTRAL VOID / COSMIC TRANCE",
  "MABONENG ROOFTOP HAZE / VIBRANT CITYSCAPE",
  "SUNNYSIDE DUSTY VIBE / LO-FI SUBURBIA",
  "NEON-LIT TAXI INTERIOR / VAPORWAVE DRIFT",
  "SUBMERGED AQUATIC BASS / FLUID MOTION",
  "CHROME-PLATED AFRO BEAT / FUTURISTIC POLISH",
  "HAZY LATE NIGHT LOUNGE / SMOKY PIANO",
  "DRAKENSBERG ECHO CLOUDS / ETHEREAL HEIGHTS",
  "MAMELODI MIDNIGHT / SHARP SGIJA PULSE",
  "UMHLANGA SHORELINE / SALTY SYNTH BREEZE",
  "VAPOR-TRAIL DREAMS / STRATOSPHERIC PADS",
  "DISTORTED TOWNSHIP GHOSTS / HAUNTED LO-FI",
  "GOLDEN CITY GLIMMER / SPARKLING PERCUSSION",
  "DEEP LIMPOPO NIGHTS / HYPNOTIC CICADA BUZZ",
  "CONCRETE JUNGLE HUM / URBAN BIODIVERSITY",
  "LIQUID SANDTON SUNSET / AMBER RADIANCE",
  "ABANDONED MINE ECHO / SUBTERRANEAN BOOM",
  "HIGH-VELOCITY TAXI RANK / KINETIC FRICTION",
  "MELANCHOLIC PIANO VOID / EMOTIONAL DEPTH",
  "TRIBAL FIREPIT / EMBERS AND ANCESTRY",
  "CYBERNETIC SHEBEEN / NEON-SOAKED KWAITO",
  "POLISHED MARBLE HALLS / REVERBERANT LUXURY",
  "DUSTY VINYL CRACKLE / PRETORIA NOSTALGIA",
  "ELECTRIC STORMBANK / VOLTAGE SPIKES",
  "MISTY CAPE FLATS / GRITTY TEXTURES",
  "TRANSCENDENTAL RITUAL / SPIRITUAL FREQUENCY",
  "FUTURISTIC AFRO-FUSION / CHROME AND CLAY"
];

const INSTRUMENTS = [
  "SUB-LOW LOG DRUMS / SURGICAL TRANSIENTS",
  "WOOD FOLEY / RAIN STICK / ORGANIC RATTLE",
  "STUTTER KALIMBA / RIMS / DIGITAL JITTER",
  "SURGICAL GLASS HITS / HIGH-FREQUENCY CHIRP",
  "ETHEREAL PADS / 808 GLIDE / COSMIC SUB",
  "JAZZ PIANO / FM BASS / VELVET TEXTURE",
  "GRITTY BIT-CRUSHED SUB / LO-FI DISTORTION",
  "ORGANIC CLICKY SHAKERS / MICRO-RHYTHM",
  "GRANULAR NATURE SOUNDS / WATER DROPS",
  "TRIBAL CHANTS / ANCESTRAL VOICES / REVERB",
  "METALLIC SHELF PERC / INDUSTRIAL TAPS",
  "GHOST KICKS / TICK-TOCK TRANSIENTS",
  "DETUNED RHODES KEYS / VAPORWAVE WARBLE",
  "LASER-CUT LEAD STABS / SYNTHETIC PIERCE",
  "TRADITIONAL DJEMBE TAP / EARTHEN TONE",
  "PLUCKY MARIMBA TEXTURE / WOODEN ATTACK",
  "PULSATING 303 ACID LINE / SQUELCHY RESONANCE",
  "HOLLOW WOODEN PLUCKS / PERCUSSIVE MELODY",
  "METALLIC PIPE DRIPS / REVERBERANT METAL",
  "MODULAR GLITCH BLIPS / RANDOMIZED SIGNAL",
  "OVERDRIVEN SGIJA WHISTLE / PIERCING FREQ",
  "FM ORGAN STABS / M1-STYLE HERITAGE",
  "SQUARE-WAVE LEAD / RETRO-GAME AFRO",
  "DAMPENED CONGA LOOPS / EARTHY DRIVE",
  "BIT-REDUCED RIMSHOTS / CRUNCHY SNAPS",
  "REVERSED VOCAL GRAINS / GHOSTLY CHOPS",
  "ANALOG TAPE HISS / SATURATED NOISE",
  "CRISP COWBELL PING / MINIMALIST ACCENT",
  "DEEP CELLO PLUCKS / MELANCHOLIC SUB",
  "OPERATOR FM BELLS / CRYSTALLINE TONES",
  "909 HI-HAT CHIRPS / TECHNO HERITAGE",
  "RESAMPLING DELAY TAILS / INFINITE FEEDBACK",
  "PLASTIC PIPE HITS / UNIQUE TRANSIENTS",
  "DISTORTED HARMONICA / BLUES-FUSION BASS",
  "METALLIC BOWLS / RESONANT HARMONICS",
  "GRANULAR RAIN TEXTURES / AMBIENT NOISE",
  "CLICK-TRACK PERCUSSION / CLOCKWORK FLOW",
  "RESONANT FILTER SWEEPS / LIQUID MOTION",
  "WAH-WAH AFRO GUITAR / FUNK INJECTION",
  "DIGITAL WHALE HUMS / EXPERIMENTAL DEPTH"
];

const TEMPOS = [
  "113 BPM / LAID BACK SGIJA",
  "115 BPM / PRIVATE SCHOOL SWING",
  "118 BPM / STEADY DEEP FLOW",
  "120 BPM / SOULFUL HOUSE DRIVE",
  "122 BPM / AFRO-TECH SHUFFLE",
  "124 BPM / SURGICAL MINIMALISM",
  "126 BPM / GQOM INDUSTRIAL THUMP",
  "128 BPM / PEAK ENERGY BACARDI",
  "12/8 TRIPLET 115 BPM / RITUAL SWING",
  "12/8 TRIPLET 124 BPM / ANCESTRAL TECH",
  "LINEAR 128 BPM / STEELY DRIVE",
  "DRAGGING 114 BPM / DUSTY KWAITO",
  "RUSHED 127 BPM / DURBAN HEAT",
  "SHUFFLED 116 BPM / AMAPIANO GROOVE"
];

const GENRE_HINTS: Record<string, { mood: string, instruments: string, tempo: string }> = {
  [SAGenre.AMAPIANO]: { mood: "LUSH JAZZ / SUNSET LOUNGE / CHILL / SOPHISTICATED NOSTALGIA", instruments: "SUB-LOW LOG DRUMS / RHODES CHORDS / SHAKER LOOPS / FLUTE ACCENTS", tempo: "113-115 BPM / SHUFFLED GROOVE" },
  [SAGenre.PRIVATE_SCHOOL]: { mood: "SOPHISTICATED / JAZZY / LUSH PADS / HIGH-GLOSS WEALTH", instruments: "GRAND PIANO / LOG DRUMS / FLUTES / VELVET SYNTH TEXTURES", tempo: "113-114 BPM / LAID BACK" },
  [SAGenre.DEEP_HOUSE]: { mood: "HYPNOTIC / SURGICAL / WAREHOUSE / MINIMAL PRECISION", instruments: "DEEP SUB BASS / ATMOS PADS / 909 HATS / SURGICAL GLASS HITS", tempo: "118-122 BPM / STEADY FLOW" },
  [SAGenre.THREE_STEP]: { mood: "RITUALISTIC / SPIRITUAL / TRIPLET / ANCESTRAL ECHO", instruments: "WOOD PERCUSSION / SPIRITUAL CHANTS / FOLEY / HEAVY LOG DRUM ACCENTS", tempo: "115-124 BPM / 12/8 TRIPLET SWING" },
  [SAGenre.GQOM]: { mood: "DARK INDUSTRIAL / RAW / AGGRESSIVE / DURBAN GRIME", instruments: "METALLIC TAPS / HEAVY SUB / DISTORTION / INDUSTRIAL SLAMS", tempo: "126-128 BPM / KINETIC FRICTION" },
  [SAGenre.HARD_GQOM]: { mood: "EXTREME / DISTORTED / PEAK POWER / VOID RESONANCE", instruments: "OVERDRIVE SUB / METAL SLAM / VOID TEXTURES / AGGRESSIVE TRANSIENTS", tempo: "127-128 BPM / RUSHED ENERGY" },
  [SAGenre.AFRO_TECH]: { mood: "MINIMAL / TECH / ANCESTRAL FUSION / FUTURISTIC POLISH", instruments: "STACCATO SYNTHS / NATURE FOLEY / FM BASS / RHYTHMIC CALL AND RESPONSE", tempo: "122-125 BPM / TECH SHUFFLE" },
  [SAGenre.SOULFUL_HOUSE]: { mood: "GORGEOUS / VOCAL-DRIVEN / WARM / AMBER RADIANCE", instruments: "VOCAL CHOPS / BRIGHT KEYS / M1 ORGAN / SOULFUL PADS", tempo: "120-122 BPM / SOULFUL DRIVE" },
  [SAGenre.KWAITO]: { mood: "90S NOSTALGIA / TOWNSHIP GROOVE / DUSTY VINYL CRACKLE", instruments: "KWAITO KEYS / SLOW SNARES / SUB DRONE / ANALOG TAPE HISS", tempo: "113-115 BPM / DRAGGING GROOVE" },
  [SAGenre.SGIJA]: { mood: "DANCE-FLOOR / HIGH-ENERGY / BOUNCY / MAMELODI MIDNIGHT", instruments: "MOOG LEADS / QUICK LOG DRUMS / PIERCING WHISTLES / SHARP TRANSIENTS", tempo: "113-116 BPM / HIGH-VELOCITY" },
  [SAGenre.BACARDI]: { mood: "STREET FESTIVAL / RAW / FAST / AGGRESSIVE FESTIVAL", instruments: "BACARDI TAPS / WHISTLES / HEAVY KICKS / METALLIC SHELF PERCUSSION", tempo: "115-128 BPM / PEAK ENERGY" },
  [SAGenre.ANCESTRAL]: { mood: "DEEP SPIRITUAL / ANCESTRAL ECHO / TRANSCENDENTAL RITUAL", instruments: "HAND DRUMS / NATURE SOUNDS / CHANTS / ETHEREAL PADS", tempo: "118-124 BPM / RITUAL SWING" },
  [SAGenre.SA_HOUSE]: { mood: "CLASSIC CLUB / HERITAGE DRIVE / JOZI MORNING", instruments: "M1 PIANO / 909 KIT / ORGANIC BASS / HERITAGE ORGAN STABS", tempo: "118-126 BPM / STEADY DRIVE" },
  [SAGenre.QUANTUM]: { mood: "EXPERIMENTAL / GLITCHY / FUTURE / DIGITAL DEBRIS", instruments: "STUTTER LOGS / DIGITAL DEBRIS / GRANULAR TEXTURES / RANDOMIZED SIGNAL", tempo: "114-118 BPM / GLITCHY FLOW" },
  [SAGenre.TECH_GOM]: { mood: "TECHNO-GQOM HYBRID / SURGICAL / INDUSTRIAL THUMP", instruments: "FM PERCUSSION / INDUSTRIAL KICKS / METALLIC DRIPS / TECH STABS", tempo: "125-128 BPM / STEELY DRIVE" },
  [SAGenre.BOLO_HOUSE]: { mood: "LIMPOPO ENERGY / FAST / UPBEAT / HIGH-VELOCITY", instruments: "BOLO SYNTHS / FAST KICKS / WHISTLES / AGGRESSIVE FESTIVAL ENERGY", tempo: "128-135 BPM / HYPER-SPEED" },
  [SAGenre.AFRO_HOUSE]: { mood: "DEEP TRIBAL / ORGANIC / DRIVING / HYPNOTIC", instruments: "CONGAS / SHAKERS / DEEP SUB BASS / TRIBAL FIREPIT AMBIENCE", tempo: "120-124 BPM / HYPNOTIC DRIVE" },
  [SAGenre.TRIBAL_HOUSE]: { mood: "RHYTHMIC / EARTHY / CEREMONIAL / RITUALISTIC", instruments: "TRIBAL DRUMS / CHANTS / WOOD PERCUSSION / CEREMONIAL BELLS", tempo: "122-126 BPM / RHYTHMIC RITUAL" },
  [SAGenre.JAZZ_AMAPIANO]: { mood: "SOPHISTICATED / SMOOTH / JAZZY / LOUNGE VIBE", instruments: "SAXOPHONE / LOG DRUMS / RHODES / JAZZ PIANO / VELVET TEXTURES", tempo: "112-114 BPM / SMOOTH SWING" },
  [SAGenre.ROUGH_AMAPIANO]: { mood: "GRITTY / STREET / AGGRESSIVE / RAW ENERGY", instruments: "DISTORTED LOG DRUMS / RAW PERCUSSION / STREET FOLEY / AGGRESSIVE WHISTLES", tempo: "113-115 BPM / RAW STREET GROOVE" },
  [SAGenre.DARK_GQOM]: { mood: "OMINOUS / MINIMAL / HAUNTING / DURBAN HARBOR AMBIENCE", instruments: "DARK SUBS / METALLIC CLANGS / GHOST KICKS / HAUNTED LO-FI TEXTURES", tempo: "126-128 BPM / OMINOUS DRIVE" },
  [SAGenre.SGQOM]: { mood: "SOULFUL GQOM / MELODIC / DEEP / EMOTIONAL DEPTH", instruments: "SOFT PADS / GQOM KICKS / VOCAL CHOPS / MELODIC SUB BASS", tempo: "125-127 BPM / MELODIC DRIVE" },
  [SAGenre.MOTSWAKO]: { mood: "HIP-HOP FUSION / RHYTHMIC / BOLD / URBAN VIBE", instruments: "BOOM BAP KICKS / SA SYNTHS / SCRATCH ARTIFACTS / URBAN FOLEY", tempo: "90-110 BPM / BOLD RHYTHM" },
  [SAGenre.ISGUBHU]: { mood: "TRADITIONAL HOUSE / DRUM-HEAVY / HERITAGE DRIVE", instruments: "HEAVY KICKS / REPETITIVE PERCUSSION / SIMPLE SYNTH LINES / HERITAGE ORGAN", tempo: "124-128 BPM / HEAVY DRIVE" },
  [SAGenre.VOCAL_AMAPIANO]: { mood: "MELODIC / EMOTIONAL / CATCHY / VOCAL-DRIVEN", instruments: "LEAD VOCALS / LOG DRUMS / BRIGHT KEYS / CATCHY SYNTH HOOKS", tempo: "113-115 BPM / CATCHY GROOVE" }
};

const LOG_MESSAGES = [
  "CALIBRATING LOG DRUM RESONANCE...",
  "SYNCHRONIZING 12/8 TRIPLET GRID...",
  "EXTRACTING VAPORWAVE HAZE...",
  "SURGICAL PRECISION APPLIED...",
  "DISTILLING ANCESTRAL ECHOES...",
  "ISOLATING SUB-BASS FREQUENCIES...",
  "GENERATING ALCHEMY BLUEPRINT...",
  "MAPPING TOWNSHIP NEON VIBES...",
  "INJECTING GLITCH ARTIFACTS...",
  "SIGNAL STRENGTH OPTIMIZED...",
  "WRITING SUNO-STYLE PROTOCOLS..."
];

// Sound Engine
const audioCtxRef = { current: null as AudioContext | null };
const getAudioCtx = () => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume();
  }
  return audioCtxRef.current;
};

const playSound = (freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* Audio blocked */ }
};

const playRetroClick = () => playSound(800, 'sine', 0.05, 0.05);
const playRetroRandom = () => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};
const playRetroSuccess = () => {
  playSound(523.25, 'sine', 0.2, 0.08);
  setTimeout(() => playSound(659.25, 'sine', 0.3, 0.06), 100);
};
const playRetroToggle = (on: boolean) => playSound(on ? 600 : 300, 'triangle', 0.1, 0.05);

const Visualizer: React.FC<{ genres: Set<SAGenre>, theme: string }> = ({ genres, theme }) => {
  const bars = 24;
  const isAmapiano = genres.has(SAGenre.AMAPIANO) || genres.has(SAGenre.JAZZ_AMAPIANO);
  const isGqom = genres.has(SAGenre.GQOM) || genres.has(SAGenre.HARD_GQOM);
  
  return (
    <div className={`flex items-end justify-between h-32 w-full gap-1 px-2 transition-opacity duration-500 ${theme === 'tactical' ? 'opacity-30' : 'opacity-60'}`}>
      {Array.from({ length: bars }).map((_, i) => {
        // Base duration influenced by genre
        let baseDuration = isGqom ? 0.4 : isAmapiano ? 1.2 : 0.8;
        
        // Theme influence on speed
        if (theme === 'tactical') baseDuration *= 0.8; // Faster, more high-tech
        if (theme === 'organic') baseDuration *= 1.2;  // Slower, more natural
        
        const duration = baseDuration + (Math.random() * baseDuration * 0.5);
        const delay = i * (isGqom ? 0.02 : isAmapiano ? 0.1 : 0.05);
        
        // Height variance based on genre
        const minHeight = isGqom ? 10 : isAmapiano ? 30 : 20;
        const maxHeight = isGqom ? 100 : isAmapiano ? 70 : 90;
        const heightRange = maxHeight - minHeight;
        const randomHeight = minHeight + Math.random() * heightRange;

        // Animation timing function based on theme
        const timingFunction = theme === 'tactical' ? 'steps(4, end)' : theme === 'organic' ? 'ease-in-out' : 'linear';
        
        return (
          <div 
            key={i}
            className={`flex-1 bg-[var(--accent)] transition-all duration-500 ${theme === 'organic' ? 'rounded-full' : theme === 'glass' ? 'rounded-sm' : ''}`}
            style={{
              height: `${randomHeight}%`,
              animation: `visualizer-bounce ${duration}s ${timingFunction} ${delay}s infinite alternate`,
              boxShadow: theme === 'glass' || theme === 'tactical' ? '0 0 10px rgba(var(--accent-rgb), 0.5)' : 'none',
              opacity: isGqom ? 0.8 + Math.random() * 0.2 : 1
            }}
          />
        );
      })}
      <style>{`
        @keyframes visualizer-bounce {
          0% { height: 15%; opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.7; }
          100% { height: 85%; opacity: 1; transform: scaleY(1.05); }
        }
      `}</style>
    </div>
  );
};

const GENRE_PRESETS = [
  {
    name: "AMAPIANO",
    genres: [SAGenre.AMAPIANO, SAGenre.JAZZ_AMAPIANO],
    mood: "PRIVATE SCHOOL JAZZ CLUB / SOPHISTICATED NOSTALGIA",
    instruments: "SUB-LOW LOG DRUMS / RHODES CHORDS / SHAKER LOOPS / FLUTE ACCENT",
    tempo: "113 BPM / LAID BACK SGIJA",
    vocalStyle: "MELODIC" as VocalStyle,
    includeVocals: true
  },
  {
    name: "GQOM",
    genres: [SAGenre.GQOM, SAGenre.HARD_GQOM],
    mood: "INDUSTRIAL DURBAN GRIME / METALLIC RESONANCE",
    instruments: "METALLIC TAPS / HEAVY SUB / DISTORTION / INDUSTRIAL SLAMS",
    tempo: "127 BPM / RUSHED ENERGY",
    vocalStyle: "RHYTHMIC CHANT" as VocalStyle,
    includeVocals: true
  },
  {
    name: "SA HOUSE",
    genres: [SAGenre.SA_HOUSE, SAGenre.SOULFUL_HOUSE],
    mood: "BASEMENT SHEBEEN HEAT / RAW ENERGY",
    instruments: "M1 PIANO / 909 KIT / ORGANIC BASS / HERITAGE ORGAN STABS",
    tempo: "122 BPM / AFRO-TECH SHUFFLE",
    vocalStyle: "HARMONIZED" as VocalStyle,
    includeVocals: true
  }
];

interface InstrumentPreset {
  id: string;
  name: string;
  value: string;
}

const VisualizerBars: React.FC<{ genres: string[], theme: string }> = ({ genres, theme }) => {
  const primaryGenre = (genres[0] || 'AMAPIANO') as SAGenre;
  
  const getGenreConfig = (genre: SAGenre) => {
    const isDark = genre.includes('GQOM') || genre.includes('DARK') || genre.includes('ROUGH');
    const isTech = genre.includes('TECH') || genre.includes('QUANTUM');
    const isSoulful = genre.includes('SOULFUL') || genre.includes('JAZZ') || genre.includes('PRIVATE');
    
    if (isDark) return { color: '#ff3e3e', speed: '0.4s', count: 14, curve: 'ease-in' };
    if (isTech) return { color: '#00f2ff', speed: '0.2s', count: 20, curve: 'steps(3)' };
    if (isSoulful) return { color: '#ffb347', speed: '1.5s', count: 8, curve: 'cubic-bezier(0.4, 0, 0.2, 1)' };
    return { color: 'var(--accent)', speed: '0.8s', count: 12, curve: 'ease-in-out' };
  };

  const config = getGenreConfig(primaryGenre);
  
  return (
    <div className="flex items-end justify-center gap-[3px] h-10 w-full">
      {Array.from({ length: config.count }).map((_, i) => (
        <div 
          key={i}
          className="w-1 rounded-t-[1px] transition-colors duration-500"
          style={{ 
            backgroundColor: theme === 'vaporwave' ? '#05ffa1' : config.color,
            boxShadow: theme === 'vaporwave' ? '0 0 10px #05ffa1' : `0 0 8px ${config.color}44`,
            height: '20%',
            animation: `visualizerBar ${config.speed} ${config.curve} infinite alternate`,
            animationDelay: `${i * (parseFloat(config.speed) / config.count)}s`
          }}
        />
      ))}
    </div>
  );
};

const LoadingScreen: React.FC<{ progress: number, logIndex: number, genres: string[], theme: string }> = ({ progress, logIndex, genres, theme }) => {
  return (
    <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-[var(--screen-bg)] p-6 overflow-hidden ${theme === 'glass' ? 'backdrop-blur-md' : ''}`}>
      {/* Vaporwave Background Elements */}
      {theme === 'vaporwave' && (
        <>
          {/* Scrolling Grid */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            perspective: '500px',
            background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 100%)'
          }}>
            <div className="absolute inset-0 animate-[gridScroll_2s_linear_infinite]" style={{
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: 'rotateX(60deg) translateY(-50%)',
              transformOrigin: 'top'
            }}></div>
          </div>
          
          {/* Retro Sun */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-40 blur-sm" style={{
            background: 'linear-gradient(to bottom, #ff71ce 0%, #fffb96 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 50%, transparent 55%, black 55%, black 65%, transparent 65%, transparent 72%, black 72%, black 80%, transparent 80%, transparent 88%, black 88%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 50%, transparent 55%, black 55%, black 65%, transparent 65%, transparent 72%, black 72%, black 80%, transparent 80%, transparent 88%, black 88%, black 100%)'
          }}></div>
        </>
      )}

      {/* Scanning Line */}
      {(theme === 'tactical' || theme === 'vaporwave') && (
        <div className={`absolute top-0 left-0 w-full h-[2px] z-50 ${theme === 'vaporwave' ? 'bg-[#ff71ce] shadow-[0_0_15px_#ff71ce]' : 'bg-[var(--accent)]/60 shadow-[0_0_15px_var(--accent)]'} animate-[scanLine_4s_linear_infinite]`}></div>
      )}
      
      {/* Background Data Fragments */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none mono-font text-[8px] leading-tight overflow-hidden break-all text-[var(--accent)]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="animate-[pulse_2s_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>
            {Math.random().toString(16).repeat(10)}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Radar / Oscillo Visualization */}
        <div className="flex flex-col items-center mb-4 space-y-4">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className={`w-full h-full ${theme === 'vaporwave' ? 'text-[#05ffa1]' : 'text-[var(--accent)]'}`}>
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
              <line x1="50" y1="50" x2="50" y2="2" stroke="currentColor" strokeWidth="1" className="animate-[spin_4s_linear_infinite] origin-center" />
              <path d="M10 50 Q 25 20, 40 50 T 70 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[pulse_0.5s_infinite]" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className={`w-1 h-1 rounded-full animate-ping ${theme === 'vaporwave' ? 'bg-[#ff71ce]' : 'bg-[var(--accent)]'}`}></div>
            </div>
          </div>
          
          <VisualizerBars genres={genres} theme={theme} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
             <div className={`mono-font text-3xl font-black italic tracking-tighter animate-[retroText_3s_infinite] text-center ${theme === 'vaporwave' ? 'text-[#ff71ce] drop-shadow-[0_0_8px_#ff71ce]' : 'text-[var(--accent)]'}`}>
               {theme === 'vaporwave' ? 'VAPOR_DISTILL_v8.4' : 'ALCH_DISTILL_v4.0'}
             </div>
             <div className="flex justify-between w-full items-end px-1">
                <div className="mono-font text-[9px] font-bold text-[var(--accent)]/40 uppercase tracking-[0.3em] animate-pulse">
                  Auth: {genres[0] || 'GENERIC'}
                </div>
                <div className="mono-font text-[10px] font-bold text-[var(--accent)]/60 tabular-nums">
                  SIG_LVL: {progress.toFixed(1)}%
                </div>
             </div>
          </div>
          
          <div className={`h-3 w-full bg-[var(--accent)]/10 overflow-hidden relative border border-[var(--accent)]/30 shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)] ${theme === 'organic' ? 'rounded-full' : ''} ${theme === 'vaporwave' ? 'border-[#05ffa1] shadow-[0_0_15px_rgba(5,255,161,0.3)]' : ''}`}>
            <div className={`h-full transition-all duration-300 relative ${theme === 'vaporwave' ? 'bg-gradient-to-r from-[#ff71ce] via-[#b967ff] to-[#01cdfe]' : 'bg-[var(--accent)]'}`} style={{ width: `${progress}%` }}>
              <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-[2px] animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className={`bg-[var(--accent)]/5 border border-[var(--accent)]/20 p-3 ${theme === 'organic' ? 'rounded-xl' : theme === 'glass' ? 'rounded-lg' : ''} ${theme === 'vaporwave' ? 'border-[#01cdfe]/40 bg-[#01cdfe]/5' : ''}`}>
                <div className={`mono-font text-[9px] font-bold mb-1 uppercase tracking-tighter ${theme === 'vaporwave' ? 'text-[#05ffa1]' : 'text-[var(--accent)]'}`}>Current Matrix</div>
                <div className={`mono-font text-[11px] truncate uppercase font-bold ${theme === 'vaporwave' ? 'text-[#01cdfe]' : 'text-[var(--accent)]'}`}>
                   {genres.join(' + ')}
                </div>
             </div>
             <div className={`bg-[var(--accent)]/5 border border-[var(--accent)]/20 p-3 ${theme === 'organic' ? 'rounded-xl' : theme === 'glass' ? 'rounded-lg' : ''} ${theme === 'vaporwave' ? 'border-[#ff71ce]/40 bg-[#ff71ce]/5' : ''}`}>
                <div className={`mono-font text-[9px] font-bold mb-1 uppercase tracking-tighter ${theme === 'vaporwave' ? 'text-[#05ffa1]' : 'text-[var(--accent)]'}`}>Extraction Log</div>
                <div className={`mono-font text-[11px] truncate uppercase font-bold animate-pulse ${theme === 'vaporwave' ? 'text-[#ff71ce]' : 'text-[var(--accent)]'}`}>
                   {LOG_MESSAGES[logIndex]}
                </div>
             </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes visualizerBar {
          0% { height: 20%; opacity: 0.4; }
          100% { height: 100%; opacity: 1; }
        }
        @keyframes retroText {
          0%, 100% { opacity: 1; transform: scale(1); filter: blur(0px); }
          50% { opacity: 0.8; transform: scale(0.98); filter: blur(0.5px); }
          51% { opacity: 1; transform: scale(1.02); filter: blur(0px); }
          52% { opacity: 0.9; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'tactical' | 'editorial' | 'glass' | 'organic' | 'vaporwave'>('organic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<Set<SAGenre>>(new Set([SAGenre.AMAPIANO]));
  const [mood, setMood] = useState('');
  const [instruments, setInstruments] = useState('');
  const [tempo, setTempo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<GeneratedPrompt | null>(null);
  const [editedStyle, setEditedStyle] = useState('');
  const [copyStatus, setCopyStatus] = useState<Record<string, string>>({});
  const [includeVocals, setIncludeVocals] = useState(false);
  const [vocalStyle, setVocalStyle] = useState<VocalStyle>('NONE');
  const [instrumentBalance, setInstrumentBalance] = useState(50);
  const [useInstrumentBalance, setUseInstrumentBalance] = useState(false);
  const [presets, setPresets] = useState<InstrumentPreset[]>(() => {
    const saved = localStorage.getItem('sa_instrument_presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: ('tactical' | 'editorial' | 'glass' | 'organic' | 'vaporwave')[] = ['tactical', 'editorial', 'glass', 'organic', 'vaporwave'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    if (soundEnabled) playRetroToggle(nextTheme !== 'tactical');
    setTheme(nextTheme);
  };

  const toggleGenre = (g: SAGenre) => {
    if (soundEnabled) playRetroClick();
    const next = new Set(selectedGenres);
    if (next.has(g)) {
      if (next.size > 1) next.delete(g);
    } else {
      next.add(g);
    }
    setSelectedGenres(next);
  };

  const hints = useMemo(() => {
    const first = [...selectedGenres][0];
    return (first ? GENRE_HINTS[first as string] : null) || GENRE_HINTS[SAGenre.AMAPIANO];
  }, [selectedGenres]);

  useEffect(() => {
    let interval: any;
    let logInterval: any;
    if (isLoading) {
      setLoadingProgress(0);
      setLogIndex(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + (Math.random() * 8), 98));
      }, 400);
      logInterval = setInterval(() => {
        setLogIndex(prev => (prev + 1) % LOG_MESSAGES.length);
      }, 800);
    } else {
      setLoadingProgress(0);
    }
    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (currentPrompt) setEditedStyle(currentPrompt.style);
  }, [currentPrompt]);

  const handleRandomizeField = (setter: (val: string) => void, pool: string[]) => {
    if (soundEnabled) playRetroRandom();
    setter(pool[Math.floor(Math.random() * pool.length)]);
  };

  const applyGenrePreset = (preset: typeof GENRE_PRESETS[0]) => {
    if (soundEnabled) playRetroSuccess();
    setSelectedGenres(new Set(preset.genres));
    setMood(preset.mood);
    setInstruments(preset.instruments);
    setTempo(preset.tempo);
    setVocalStyle(preset.vocalStyle);
    setIncludeVocals(preset.includeVocals);
  };

  const handleRandomizeAll = () => {
    if (soundEnabled) playRetroRandom();
    handleRandomizeField(setMood, MOODS);
    handleRandomizeField(setInstruments, INSTRUMENTS);
    handleRandomizeField(setTempo, TEMPOS);
    setIncludeVocals(Math.random() > 0.5);
    const styles: VocalStyle[] = ['MELODIC', 'RHYTHMIC CHANT', 'SPOKEN WORD', 'AD-LIBS', 'WHISPERED', 'GROWLED', 'AUTOTUNED', 'HARMONIZED', 'NONE'];
    setVocalStyle(styles[Math.floor(Math.random() * styles.length)]);
    setUseInstrumentBalance(Math.random() > 0.5);
    setInstrumentBalance(Math.floor(Math.random() * 101));
  };

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    if (soundEnabled) playRetroSuccess();
    setIsLoading(true);
    setCurrentPrompt(null);
    try {
      const genresArray: SAGenre[] = [...selectedGenres];
      const result = await generateMusicPrompt({ 
        genres: genresArray, 
        mood, 
        instruments, 
        tempo,
        includeVocals,
        vocalStyle,
        instrumentBalance: useInstrumentBalance ? instrumentBalance : undefined
      });
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        style: result.style,
        structure: result.structure,
        genres: genresArray,
        timestamp: Date.now()
      };
      setLoadingProgress(100);
      setTimeout(() => {
        if (soundEnabled) playRetroSuccess();
        setCurrentPrompt(newPrompt);
        setCopyStatus({});
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const copyToClipboard = useCallback((text: string, key: string) => {
    if (soundEnabled) playRetroClick();
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [key]: 'COPIED' }));
    setTimeout(() => setCopyStatus(prev => ({ ...prev, [key]: '' })), 2000);
  }, [soundEnabled]);

  const shareToTwitter = (text: string) => {
    // Twitter limit is 280. We leave some space for the intro and hashtags.
    const intro = "Check out this Suno prompt from Sonic Alchemist: ";
    const hashtags = " #SunoAI #SonicAlchemist";
    const maxLength = 280 - intro.length - hashtags.length - 5;
    
    const truncatedText = text.length > maxLength 
      ? text.substring(0, maxLength) + "..." 
      : text;
      
    const fullTweet = `${intro}"${truncatedText}"${hashtags}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullTweet)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = (text: string) => {
    const appUrl = window.location.href;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const downloadShareCard = async () => {
    if (!displayRef.current) return;
    
    try {
      // Temporarily modify styles for full text capture
      const display = displayRef.current;
      const buttons = display.querySelector('.share-buttons-container') as HTMLElement;
      const textareas = display.querySelectorAll('textarea');
      const pres = display.querySelectorAll('pre');
      
      if (buttons) buttons.style.display = 'none';
      
      // Save original styles
      const originalStyles = new Map<Element, string>();
      textareas.forEach(el => {
        originalStyles.set(el, el.style.height);
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      });
      pres.forEach(el => {
        originalStyles.set(el, el.style.maxHeight || '');
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
      });

      const canvas = await html2canvas(display, {
        backgroundColor: theme === 'te-core' ? '#0a0a0a' : '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Ensure the cloned display has full height
          const clonedDisplay = clonedDoc.querySelector('.display-screen') as HTMLElement;
          if (clonedDisplay) {
            clonedDisplay.style.height = 'auto';
            clonedDisplay.style.maxHeight = 'none';
            clonedDisplay.style.overflow = 'visible';
          }
        }
      });
      
      // Restore original styles
      if (buttons) buttons.style.display = 'flex';
      textareas.forEach(el => el.style.height = originalStyles.get(el) || '');
      pres.forEach(el => el.style.maxHeight = originalStyles.get(el) || '');
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `sonic-alchemist-prompt-${currentPrompt?.id || 'export'}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to generate share card:', err);
    }
  };

  const downloadPromptAsText = () => {
    if (!currentPrompt) return;
    
    const content = `SONIC ALCHEMIST DISTILLATION UNIT V2.4
SIGNAL ID: ${currentPrompt.id}
GENRES: ${currentPrompt.genres.join(', ')}
TIMESTAMP: ${new Date(currentPrompt.timestamp).toLocaleString()}

[STYLE FILTER]
${editedStyle}

[ARRANGEMENT BLUEPRINT]
${currentPrompt.structure}

--------------------------------------------------
Generated by Sonic Alchemist
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sonic-alchemist-prompt-${currentPrompt.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSavePreset = () => {
    if (!instruments.trim() || !newPresetName.trim()) return;
    const newPreset = { id: Date.now().toString(), name: newPresetName.toUpperCase(), value: instruments };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('sa_instrument_presets', JSON.stringify(updated));
    setNewPresetName('');
    setIsSavingPreset(false);
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem('sa_instrument_presets', JSON.stringify(updated));
  };

  const loadPreset = (val: string) => {
    setInstruments(val);
  };

  return (
    <div className="h-screen w-screen p-3 md:p-6 flex flex-col overflow-hidden bg-[var(--bg)]">
      {/* Top Navigation - Compact */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 hardware-panel flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] font-black text-xl rotate-[-2deg]">SA</div>
          <div>
            <h1 className="mono-font font-bold text-lg tracking-tighter uppercase leading-none text-[var(--dark)]">Sonic Alchemist</h1>
            <p className="mono-font text-[14px] opacity-50 uppercase tracking-[0.2em] text-[var(--dark)]">Distillation Unit V2.4</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playRetroClick();
            }}
            className={`hardware-panel p-2 flex items-center justify-center transition-colors ${soundEnabled ? 'text-[var(--accent)]' : 'text-[var(--dark)] opacity-40'}`}
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <div className="flex hardware-panel overflow-hidden border-2 border-[var(--dark)]">
            <button 
              onClick={() => setTheme('tactical')}
              className={`px-3 py-2 mono-font text-[10px] font-black uppercase transition-all ${theme === 'tactical' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--panel)] text-[var(--dark)] opacity-40 hover:opacity-100'}`}
            >
              TACTICAL
            </button>
            <button 
              onClick={() => setTheme('editorial')}
              className={`px-3 py-2 mono-font text-[10px] font-black uppercase transition-all border-l-2 border-[var(--dark)] ${theme === 'editorial' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--panel)] text-[var(--dark)] opacity-40 hover:opacity-100'}`}
            >
              EDITORIAL
            </button>
            <button 
              onClick={() => setTheme('glass')}
              className={`px-3 py-2 mono-font text-[10px] font-black uppercase transition-all border-l-2 border-[var(--dark)] ${theme === 'glass' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--panel)] text-[var(--dark)] opacity-40 hover:opacity-100'}`}
            >
              GLASS
            </button>
            <button 
              onClick={() => setTheme('organic')}
              className={`px-3 py-2 mono-font text-[10px] font-black uppercase transition-all border-l-2 border-[var(--dark)] ${theme === 'organic' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--panel)] text-[var(--dark)] opacity-40 hover:opacity-100'}`}
            >
              ORGANIC
            </button>
          </div>
          <div className="hidden sm:flex flex-col items-end">
             <span className="mono-font text-[12px] opacity-40 uppercase text-[var(--dark)]">Frequency Range</span>
             <span className="mono-font text-[14px] font-bold text-[var(--dark)]">113 - 128 BPM</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-5 flex flex-col min-h-0 hardware-panel overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {/* Quick Presets */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--dark)]/10 pb-1">
                <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-[var(--accent)] text-[var(--bg)] px-2 py-0.5">00 ALCHEMY PRESETS</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {GENRE_PRESETS.map((p, idx) => (
                  <div key={p.name} className="relative group">
                    <button
                      onClick={() => applyGenrePreset(p)}
                      className="w-full h-12 border-2 border-[var(--dark)] bg-[var(--panel)] mono-font text-[11px] font-black transition-all flex items-center justify-center px-1 text-center leading-tight hover:bg-[var(--accent)] hover:text-[var(--bg)] shadow-[2px_2px_0px_var(--dark)] active:translate-y-[2px] active:shadow-none"
                    >
                      {p.name}
                      <Info size={10} className="ml-1 opacity-40 group-hover:opacity-100" />
                    </button>
                    
                    {/* Tooltip */}
                    <div className={`absolute z-50 top-full ${idx === 2 ? 'right-0' : 'left-0'} mt-2 w-64 p-3 bg-[var(--dark)] text-[var(--bg)] border border-[var(--accent)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none`}>
                      <div className="space-y-2">
                        <div className="border-b border-[var(--bg)]/20 pb-1">
                          <span className="mono-font text-[10px] font-black uppercase text-[var(--accent)]">PRESET SPECS</span>
                        </div>
                        <div className="space-y-1">
                          <div>
                            <span className="mono-font text-[8px] opacity-50 uppercase block">Atmos</span>
                            <span className="mono-font text-[10px] leading-tight block">{p.mood}</span>
                          </div>
                          <div>
                            <span className="mono-font text-[8px] opacity-50 uppercase block">Tech</span>
                            <span className="mono-font text-[10px] leading-tight block">{p.instruments}</span>
                          </div>
                          <div>
                            <span className="mono-font text-[8px] opacity-50 uppercase block">Sync</span>
                            <span className="mono-font text-[10px] leading-tight block">{p.tempo}</span>
                          </div>
                        </div>
                      </div>
                      {/* Tooltip Arrow */}
                      <div className={`absolute bottom-full ${idx === 2 ? 'right-6' : 'left-6'} w-2 h-2 bg-[var(--dark)] border-l border-t border-[var(--accent)] transform rotate-45 translate-y-1`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Nodes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--dark)]/10 pb-1">
                <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-[var(--dark)] text-[var(--bg)] px-2 py-0.5">01 NODES</span>
                <span className="mono-font text-[12px] opacity-40 uppercase text-[var(--dark)]">{selectedGenres.size} ACTIVE</span>
              </div>
          <div className="grid grid-cols-3 gap-1">
            {Object.values(SAGenre).map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`h-11 border border-[var(--dark)] mono-font text-[13px] font-bold transition-all flex items-center justify-center px-1 text-center leading-tight hover:bg-[var(--accent)]/10 ${
                  selectedGenres.has(g) ? 'bg-[var(--accent)] text-[var(--bg)] shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]' : 'bg-[var(--panel)] text-[var(--dark)]'
                }`}
              >
                {g.toUpperCase()}
              </button>
            ))}
          </div>
            </div>

            {/* Parameters */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[var(--dark)]/10 pb-1">
                <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-[var(--dark)] text-[var(--bg)] px-2 py-0.5">02 BLUEPRINT</span>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (soundEnabled) playRetroClick();
                      setMood(''); setInstruments(''); setTempo('');
                    }} 
                    className="mono-font text-[13px] font-bold uppercase text-[var(--dark)]/40 hover:text-[var(--dark)] hover:underline"
                  >
                    CLEAR
                  </button>
                  <button onClick={() => handleRandomizeField(setMood, MOODS)} className="mono-font text-[13px] font-bold uppercase text-[var(--accent)] hover:underline">
                    RANDOM MOOD
                  </button>
                  <button onClick={() => handleRandomizeField(setInstruments, INSTRUMENTS)} className="mono-font text-[13px] font-bold uppercase text-[var(--accent)] hover:underline">
                    RANDOM TECH
                  </button>
                  <button 
                    onClick={() => {
                      if (soundEnabled) playRetroRandom();
                      const styles: VocalStyle[] = ['MELODIC', 'RHYTHMIC CHANT', 'SPOKEN WORD', 'AD-LIBS', 'WHISPERED', 'GROWLED', 'AUTOTUNED', 'HARMONIZED', 'NONE'];
                      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                      setVocalStyle(randomStyle);
                      if (randomStyle !== 'NONE') setIncludeVocals(true);
                    }} 
                    className="mono-font text-[13px] font-bold uppercase text-[var(--accent)] hover:underline"
                  >
                    RANDOM VOCAL
                  </button>
                  <button onClick={handleRandomizeAll} className="mono-font text-[13px] font-bold uppercase text-[var(--accent)] hover:underline flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span> RANDOM ALL
                  </button>
                </div>
              </div>
              
              {[
                { label: 'ATMOS', value: mood, setter: setMood, hint: hints.mood, pool: MOODS },
                { 
                  label: 'TECH', 
                  value: instruments, 
                  setter: setInstruments, 
                  hint: hints.instruments, 
                  pool: INSTRUMENTS,
                  extra: (
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsSavingPreset(!isSavingPreset)}
                            className="mono-font text-[9px] font-bold uppercase flex items-center gap-1 text-[var(--accent)] hover:underline"
                          >
                            <Save size={10} /> {isSavingPreset ? 'CANCEL' : 'SAVE PRESET'}
                          </button>
                        </div>
                        {presets.length > 0 && (
                          <div className="flex items-center gap-1 opacity-40">
                            <FolderOpen size={10} />
                            <span className="mono-font text-[9px] uppercase font-bold">{presets.length} SAVED</span>
                          </div>
                        )}
                      </div>

                      {isSavingPreset && (
                        <div className="flex gap-1 animate-[fadeIn_0.2s_ease-out]">
                          <input 
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value.toUpperCase())}
                            placeholder="PRESET NAME..."
                            className="flex-1 bg-[var(--bg)] border border-[var(--dark)] p-1.5 mono-font text-[10px] uppercase outline-none"
                            autoFocus
                          />
                          <button 
                            onClick={handleSavePreset}
                            className="bg-[var(--accent)] text-[var(--bg)] px-3 mono-font text-[10px] font-bold uppercase"
                          >
                            CONFIRM
                          </button>
                        </div>
                      )}

                      {presets.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {presets.map(p => (
                            <div key={p.id} className="group flex items-center bg-[var(--dark)]/5 border border-[var(--dark)]/10 px-1.5 py-0.5">
                              <button 
                                onClick={() => loadPreset(p.value)}
                                className="mono-font text-[9px] font-bold uppercase text-[var(--dark)] hover:text-[var(--accent)] transition-colors"
                              >
                                {p.name}
                              </button>
                              <button 
                                onClick={() => deletePreset(p.id)}
                                className="ml-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                              >
                                <Trash2 size={8} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                },
                { label: 'SYNC (113-128)', value: tempo, setter: setTempo, hint: hints.tempo, pool: TEMPOS }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="mono-font text-[12px] font-bold opacity-60 uppercase text-[var(--dark)]">{field.label}</label>
                    <button onClick={() => handleRandomizeField(field.setter, field.pool)} className="mono-font text-[9px] opacity-40 hover:opacity-100 hover:text-[var(--accent)] text-[var(--dark)]">RE-ROLL</button>
                  </div>
                  <div className="relative">
                    <input 
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value.toUpperCase())}
                      placeholder={`E.G. ${field.hint}`}
                      className="w-full bg-[var(--bg)] border border-[var(--dark)] p-3 mono-font text-[16px] uppercase focus:bg-[var(--panel)] transition-all placeholder:text-[var(--dark)]/10 outline-none text-[var(--dark)]"
                    />
                    <div className="mt-1">
                      <p className="mono-font text-[12px] opacity-60 uppercase tracking-tight truncate text-[var(--dark)]">GUIDE: {field.hint}</p>
                    </div>
                  </div>
                  {(field as any).extra}
                </div>
              ))}

              {/* Advanced Signal Modifiers */}
              <div className="pt-4 space-y-6 border-t border-[var(--dark)]/10">
                <div className="flex justify-between items-center">
                  <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-[var(--dark)] text-[var(--bg)] px-2 py-0.5">03 SIGNAL MODS</span>
                </div>

                {/* Vocal Toggle */}
                <div className="flex items-center justify-between hardware-panel p-4 bg-[var(--panel)] relative overflow-hidden border-l-[12px] border-l-[var(--dark)]">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="mono-font text-[16px] font-black text-[var(--dark)] uppercase tracking-tighter">Vocal Injection</span>
                      <span className="mono-font text-[11px] opacity-50 uppercase font-bold">Street phrases / Call-to-action</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (soundEnabled) playRetroToggle(!includeVocals);
                      setIncludeVocals(!includeVocals);
                    }}
                    className={`w-16 h-8 rounded-full transition-all relative border-2 border-[var(--dark)] ${includeVocals ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-[1px_1px_0px_rgba(0,0,0,0.2)] ${includeVocals ? 'left-9' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Vocal Style Selection */}
                <div className="space-y-3 hardware-panel p-3 bg-[var(--panel)]">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="mono-font text-[14px] font-bold text-[var(--dark)] uppercase">Vocal Style</span>
                      <span className="mono-font text-[11px] opacity-50 uppercase">Specify the treatment</span>
                    </div>
                    <button 
                      onClick={() => {
                        const styles: VocalStyle[] = ['MELODIC', 'RHYTHMIC CHANT', 'SPOKEN WORD', 'AD-LIBS', 'WHISPERED', 'GROWLED', 'AUTOTUNED', 'HARMONIZED', 'NONE'];
                        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                        setVocalStyle(randomStyle);
                        if (randomStyle !== 'NONE') setIncludeVocals(true);
                      }} 
                      className="mono-font text-[12px] opacity-60 hover:opacity-100 hover:text-[var(--accent)] text-[var(--dark)] font-bold"
                    >
                      RE-ROLL
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['MELODIC', 'RHYTHMIC CHANT', 'SPOKEN WORD', 'AD-LIBS', 'WHISPERED', 'GROWLED', 'AUTOTUNED', 'HARMONIZED', 'NONE'] as VocalStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          setVocalStyle(style);
                          if (style !== 'NONE') setIncludeVocals(true);
                        }}
                        className={`mono-font text-[11px] font-bold py-2.5 border transition-all ${
                          vocalStyle === style 
                            ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' 
                            : 'bg-transparent text-[var(--dark)] border-[var(--dark)]/20 hover:border-[var(--dark)]/40'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instrument Balance */}
                <div className="space-y-3 hardware-panel p-3 bg-[var(--panel)]">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="mono-font text-[14px] font-bold text-[var(--dark)] uppercase">Instrument Balance</span>
                      <span className="mono-font text-[11px] opacity-50 uppercase">Traditional vs Synthetic</span>
                    </div>
                    <button 
                      onClick={() => setUseInstrumentBalance(!useInstrumentBalance)}
                      className={`mono-font text-[12px] font-bold px-3 py-1.5 border border-[var(--dark)] transition-all ${useInstrumentBalance ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-transparent text-[var(--dark)] opacity-60'}`}
                    >
                      {useInstrumentBalance ? 'ACTIVE' : 'BYPASS'}
                    </button>
                  </div>
                  
                  {useInstrumentBalance && (
                    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out] pt-2">
                      <div className="flex justify-between mono-font text-[14px] font-bold text-[var(--dark)] opacity-60">
                        <span>TRADITIONAL</span>
                        <span>SYNTHETIC</span>
                      </div>
                      <div className="relative pt-1 pb-6">
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={instrumentBalance}
                          onChange={(e) => setInstrumentBalance(parseInt(e.target.value))}
                          className="w-full accent-[var(--accent)] h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="absolute top-6 left-0 right-0 flex justify-between px-0.5">
                          {[0, 25, 50, 75, 100].map((tick) => (
                            <div key={tick} className="flex flex-col items-center">
                              <div className={`w-0.5 h-2 bg-[var(--dark)] ${tick === 50 ? 'opacity-80 h-3' : 'opacity-30'}`}></div>
                              <span className={`mono-font text-[9px] mt-1 ${tick === 50 ? 'font-black text-[var(--accent)]' : 'opacity-40'}`}>
                                {tick === 0 ? 'TRAD' : tick === 100 ? 'SYNTH' : `${tick}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center pt-2">
                        <div className="bg-[var(--dark)] text-[var(--bg)] px-4 py-2 rounded-sm shadow-lg transform rotate-[-1deg]">
                          <span className="mono-font text-[14px] font-black tracking-tighter">
                            {100 - instrumentBalance}% TRAD / {instrumentBalance}% SYNTH
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="p-4 border-t-2 border-[var(--dark)] bg-[var(--panel)]">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !mood}
              className={`w-full py-6 te-button text-xl font-black mono-font tracking-[0.3em] uppercase transition-all flex flex-col items-center justify-center gap-0.5 border-4 ${
                isLoading || !mood 
                  ? 'opacity-50 cursor-not-allowed bg-[var(--border)] shadow-none border-[var(--dark)]/20' 
                  : 'bg-[var(--accent)] text-[var(--bg)] border-[var(--dark)] shadow-[0_8px_0_var(--dark)] active:shadow-[0_2px_0_var(--dark)] active:translate-y-[6px]'
              }`}
            >
              {isLoading ? (
                 <>
                   <span className="animate-pulse text-2xl">ALCHEMIZING...</span>
                 </>
              ) : 'TRIGGER FUSION'}
            </button>
            <div className="mt-4 flex justify-center">
              <span className="text-[14px] font-black tracking-[0.3em] opacity-80 mono-font uppercase text-[var(--dark)]">{Math.round(loadingProgress)}% COMPLETION</span>
            </div>
          </div>
        </div>

        {/* Right Display Panel */}
        <div className="lg:col-span-7 flex flex-col min-h-0 space-y-4">
          <div className="hardware-panel p-1.5 flex-1 flex flex-col bg-[var(--screen-bg)] border-[3px] overflow-hidden">
            <div ref={displayRef} className="display-screen flex-1 p-5 relative flex flex-col overflow-hidden">
              {/* CRT Overlays */}
              {theme === 'tactical' && (
                <>
                  <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 3px, 4px 100%' }}></div>
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </>
              )}
              {theme === 'editorial' && (
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply"></div>
              )}
              {theme === 'glass' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 to-transparent"></div>
              )}

              {isLoading && (
                <LoadingScreen 
                  progress={loadingProgress} 
                  logIndex={logIndex} 
                  genres={[...selectedGenres].map(g => g.toString())} 
                  theme={theme}
                />
              )}

              {!isLoading && !currentPrompt && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 opacity-40">
                  <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between items-end border-b border-[var(--accent)]/20 pb-2">
                      <span className="mono-font text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Signal Visualizer</span>
                      <span className="mono-font text-[8px] opacity-60 uppercase">Real-time Matrix Monitoring</span>
                    </div>
                    <Visualizer genres={selectedGenres} theme={theme} />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="mono-font text-[14px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">System Idle</div>
                    <div className="mono-font text-[10px] uppercase opacity-60">Awaiting Heritage Signal Input...</div>
                  </div>
                </div>
              )}

              {currentPrompt ? (
                <div className="flex-1 flex flex-col space-y-6 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex justify-between items-start border-b border-[var(--accent)]/40 pb-3">
                    <div className="flex flex-col">
                       <div className="mono-font text-[12px] font-black opacity-80 uppercase tracking-tighter text-[var(--accent)]">SIGNAL ID: {currentPrompt.id}</div>
                       <div className="mono-font text-[9px] opacity-50 uppercase tracking-[0.2em] font-bold">Matched heritage signature</div>
                    </div>
                    <div className="mono-font text-[11px] font-black text-[var(--bg)] bg-[var(--accent)] px-3 py-1 border-2 border-[var(--dark)] shadow-[2px_2px_0px_var(--dark)]">UNIT: FUSION</div>
                  </div>

                  <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                    <div className="space-y-2 flex-shrink-0">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-black bg-[var(--accent)] text-[var(--screen-bg)] px-2 py-0.5 uppercase italic tracking-tighter">Style Filter</span>
                          <div className={`mono-font text-[11px] font-bold segmented-display ${editedStyle.length > 300 ? 'text-red-500 animate-pulse' : 'text-[var(--accent)] opacity-60'}`}>
                            [{editedStyle.length.toString().padStart(3, '0')} / 300]
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 share-buttons-container">
                          <button 
                            onClick={() => copyToClipboard(editedStyle, 'style')} 
                            className="text-[10px] font-black bg-[var(--accent)] text-[var(--screen-bg)] px-2 py-1 transition-all active:scale-95 border border-[var(--dark)]"
                          >
                            {copyStatus['style'] || 'COPY TEXT'}
                          </button>
                          <button 
                            onClick={() => {
                              if (soundEnabled) playRetroClick();
                              downloadPromptAsText();
                            }}
                            title="Download Prompt (Text)"
                            className="bg-[var(--accent)] text-[var(--screen-bg)] p-1 border border-[var(--dark)]"
                          >
                            <FileText size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (soundEnabled) playRetroClick();
                              downloadShareCard();
                            }}
                            className="bg-[var(--secondary)] text-[var(--screen-bg)] p-1 border border-[var(--dark)]"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (soundEnabled) playRetroClick();
                              shareToTwitter(editedStyle);
                            }}
                            className="bg-[var(--accent)] text-[var(--screen-bg)] p-1 border border-[var(--dark)]"
                          >
                            <Twitter size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (soundEnabled) playRetroClick();
                              shareToFacebook(editedStyle);
                            }}
                            className="bg-[var(--accent)] text-[var(--screen-bg)] p-1 border border-[var(--dark)]"
                          >
                            <Facebook size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="relative flex-shrink-0">
                        <textarea 
                          value={editedStyle}
                          onChange={(e) => setEditedStyle(e.target.value.toUpperCase())}
                          className="w-full bg-[var(--screen-bg)] border border-[var(--accent)]/30 p-4 mono-font text-[16px] leading-relaxed uppercase font-bold text-[var(--accent)] outline-none h-40 custom-scrollbar shadow-[inset_0_0_15px_rgba(var(--accent-rgb),0.05)] focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 space-y-2">
                      <div className="flex justify-between items-center px-1 flex-shrink-0">
                        <span className="text-[14px] font-black bg-[var(--accent)] text-[var(--screen-bg)] px-2 py-0.5 uppercase italic tracking-tighter">Arrangement</span>
                        <button onClick={() => copyToClipboard(currentPrompt.structure, 'structure')} className="text-[11px] font-bold underline uppercase hover:text-white transition-colors text-[var(--accent)]">{copyStatus['structure'] || 'COPY BLUEPRINT'}</button>
                      </div>
                      <div className="flex-1 bg-[var(--screen-bg)] p-4 border border-[var(--accent)]/10 overflow-y-auto custom-scrollbar relative">
                        <div className="absolute top-0 right-0 p-1 opacity-5 mono-font text-[40px] pointer-events-none font-black text-[var(--accent)]">SA</div>
                        <pre className="text-[12px] leading-relaxed uppercase whitespace-pre-wrap opacity-90 text-[var(--accent)] mono-font">{currentPrompt.structure}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[var(--accent)]/10">
                  <div className="text-center space-y-4 opacity-20">
                    <div className="mono-font text-3xl font-black italic tracking-tighter text-[var(--accent)]">AWAITING_SIGNAL</div>
                    <div className="mono-font text-[9px] tracking-[0.5em] uppercase text-[var(--accent)]">Configure nodes to distillation unit</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini Health Monitor */}
          <div className="flex gap-4 flex-shrink-0 h-14">
             <div className="hardware-panel flex-1 px-4 flex justify-between items-center bg-[var(--panel)]">
                <div className="mono-font text-[10px] font-bold opacity-40 uppercase text-[var(--dark)]">Sys_Node</div>
                <div className="flex items-center gap-2">
                  <div className="mono-font text-[11px] font-bold text-[var(--dark)]">STABLE</div>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></div>
                </div>
             </div>
             <div className="hardware-panel flex-1 px-4 flex justify-between items-center bg-[var(--panel)]">
                <div className="mono-font text-[10px] font-bold opacity-40 uppercase text-[var(--dark)]">Sig_Strength</div>
                <div className="flex items-end gap-0.5 h-4">
                  {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-[var(--accent)] animate-[pulse_1s_infinite]" 
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <footer className="w-full max-w-7xl mx-auto flex justify-between items-center opacity-40 py-4 flex-shrink-0 border-t border-[var(--dark)]/10 mt-auto">
        <div className="flex gap-6">
          <a href="https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/advanced-suno-prompt-engineering-guide" target="_blank" rel="noreferrer" className="mono-font text-[9px] uppercase font-black hover:text-[var(--accent)] text-[var(--dark)]">Documentation</a>
          <span className="mono-font text-[9px] uppercase font-bold text-[var(--dark)]">© 1994-2025 SURGICAL UNIT</span>
        </div>
        <div className="mono-font text-[9px] uppercase font-black tracking-[0.2em] hidden sm:block text-[var(--dark)]">
          ALCHEMIZING HERITAGE SIGNAL
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          from { top: 0%; }
          to { top: 100%; }
        }
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: none; }
          2% { transform: translate(-1px, 1px); text-shadow: 1px 0 var(--accent); }
          4% { transform: translate(1px, -1px); text-shadow: -1px 0 var(--secondary); }
          6% { transform: translate(0); text-shadow: none; }
          100% { transform: translate(0); text-shadow: none; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(var(--accent-rgb), 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb), 0.2);
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--accent-rgb), 0.4);
        }
      `}} />
    </div>
  );
};

export default App;
