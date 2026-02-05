
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { SAGenre, GeneratedPrompt } from './types';
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
  "HAZY LATE NIGHT LOUNGE / SMOKY PIANO"
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
  "MODULAR GLITCH BLIPS / RANDOMIZED SIGNAL"
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
  [SAGenre.AMAPIANO]: { mood: "LUSH JAZZ / SUNSET LOUNGE / CHILL", instruments: "LOG DRUMS / RHODES / SHAKERS", tempo: "113-115 BPM" },
  [SAGenre.PRIVATE_SCHOOL]: { mood: "SOPHISTICATED / JAZZY / LUSH PADS", instruments: "GRAND PIANO / LOG DRUMS / FLUTES", tempo: "113-114 BPM" },
  [SAGenre.DEEP_HOUSE]: { mood: "HYPNOTIC / SURGICAL / WAREHOUSE", instruments: "SUB BASS / ATMOS PADS / 909 HATS", tempo: "118-122 BPM" },
  [SAGenre.THREE_STEP]: { mood: "RITUALISTIC / SPIRITUAL / TRIPLET", instruments: "WOOD PERC / CHANTS / FOLEY", tempo: "115-124 BPM (TRIPLET)" },
  [SAGenre.GQOM]: { mood: "DARK INDUSTRIAL / RAW / AGGRESSIVE", instruments: "METALLIC TAPS / HEAVY SUB / DISTORTION", tempo: "126-128 BPM" },
  [SAGenre.HARD_GQOM]: { mood: "EXTREME / DISTORTED / PEAK POWER", instruments: "OVERDRIVE SUB / METAL SLAM / VOID", tempo: "127-128 BPM" },
  [SAGenre.AFRO_TECH]: { mood: "MINIMAL / TECH / ANCESTRAL FUSION", instruments: "STACCATO SYNTHS / FOLEY / FM BASS", tempo: "122-125 BPM" },
  [SAGenre.SOULFUL_HOUSE]: { mood: "GORGEOUS / VOCAL-DRIVEN / WARM", instruments: "VOCAL CHOPS / BRIGHT KEYS / ORGAN", tempo: "120-122 BPM" },
  [SAGenre.KWAITO]: { mood: "90S NOSTALGIA / TOWNSHIP GROOVE", instruments: "KWAITO KEYS / SNARES / SUB DRONE", tempo: "113-115 BPM" },
  [SAGenre.SGIJA]: { mood: "DANCE-FLOOR / HIGH-ENERGY / BOUNCY", instruments: "MOOG LEADS / QUICK LOG DRUMS", tempo: "113-116 BPM" },
  [SAGenre.BACARDI]: { mood: "STREET FESTIVAL / RAW / FAST", instruments: "BACARDI TAPS / WHISTLES / KICKS", tempo: "115-128 BPM" },
  [SAGenre.ANCESTRAL]: { mood: "DEEP SPIRITUAL / ANCESTRAL ECHO", instruments: "HAND DRUMS / NATURE SOUNDS / CHANTS", tempo: "118-124 BPM" },
  [SAGenre.SA_HOUSE]: { mood: "CLASSIC CLUB / HERITAGE DRIVE", instruments: "M1 PIANO / 909 KIT / ORGANIC BASS", tempo: "118-126 BPM" },
  [SAGenre.QUANTUM]: { mood: "EXPERIMENTAL / GLITCHY / FUTURE", instruments: "STUTTER LOGS / DIGITAL DEBRIS", tempo: "114-118 BPM" },
  [SAGenre.TECH_GOM]: { mood: "TECHNO-GQOM HYBRID / SURGICAL", instruments: "FM PERC / INDUSTRIAL KICKS", tempo: "125-128 BPM" }
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

const LoadingScreen: React.FC<{ progress: number, logIndex: number, genres: string[] }> = ({ progress, logIndex, genres }) => {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a] p-6 overflow-hidden">
      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff5f00]/60 shadow-[0_0_15px_#ff5f00] animate-[scanLine_4s_linear_infinite] z-50"></div>
      
      {/* Background Data Fragments */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none mono-font text-[8px] leading-tight overflow-hidden break-all text-[#ff5f00]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="animate-[pulse_2s_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>
            {Math.random().toString(16).repeat(10)}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Radar / Oscillo Visualization */}
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#ff5f00]">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
              <line x1="50" y1="50" x2="50" y2="2" stroke="currentColor" strokeWidth="1" className="animate-[spin_4s_linear_infinite] origin-center" />
              <path d="M10 50 Q 25 20, 40 50 T 70 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[pulse_0.5s_infinite]" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-1 bg-[#ff5f00] rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
             <div className="mono-font text-2xl font-black italic tracking-tighter text-[#ff5f00] animate-[glitch_2s_infinite]">ALCH_DISTILL_v4.0</div>
             <div className="mono-font text-[10px] font-bold text-[#ff5f00]/60 tabular-nums">P_SIG: {progress.toFixed(1)}%</div>
          </div>
          
          <div className="h-2 w-full bg-[#ff5f00]/10 overflow-hidden relative border border-[#ff5f00]/30 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
            <div className="h-full bg-[#ff5f00] transition-all duration-300 relative" style={{ width: `${progress}%` }}>
              <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-[2px] animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className="bg-[#ff5f00]/5 border border-[#ff5f00]/20 p-3">
                <div className="mono-font text-[9px] font-bold text-[#ff5f00] mb-1 uppercase tracking-tighter">Current Matrix</div>
                <div className="mono-font text-[11px] text-[#ff5f00] truncate uppercase font-bold">
                   {genres.join(' + ')}
                </div>
             </div>
             <div className="bg-[#ff5f00]/5 border border-[#ff5f00]/20 p-3">
                <div className="mono-font text-[9px] font-bold text-[#ff5f00] mb-1 uppercase tracking-tighter">Extraction Log</div>
                <div className="mono-font text-[11px] text-[#ff5f00] truncate uppercase font-bold animate-pulse">
                   {LOG_MESSAGES[logIndex]}
                </div>
             </div>
          </div>

          <div className="pt-2">
             <div className="mono-font text-[9px] text-[#ff5f00]/40 uppercase tracking-[0.2em] leading-relaxed text-center">
               Isolating Sub-Harmonics // Securing Sync-Lock 128 // Distilling Heritage Nodes
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
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
  
  const displayRef = useRef<HTMLDivElement>(null);

  const toggleGenre = (g: SAGenre) => {
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
    setter(pool[Math.floor(Math.random() * pool.length)]);
  };

  const handleRandomizeAll = () => {
    handleRandomizeField(setMood, MOODS);
    handleRandomizeField(setInstruments, INSTRUMENTS);
    handleRandomizeField(setTempo, TEMPOS);
  };

  const handleGenerate = async () => {
    if (!mood.trim()) return;
    setIsLoading(true);
    setCurrentPrompt(null);
    try {
      const genresArray: SAGenre[] = [...selectedGenres];
      const result = await generateMusicPrompt({ genres: genresArray, mood, instruments, tempo });
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        style: result.style,
        structure: result.structure,
        genres: genresArray,
        timestamp: Date.now()
      };
      setLoadingProgress(100);
      setTimeout(() => {
        setCurrentPrompt(newPrompt);
        setCopyStatus({});
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [key]: 'COPIED' }));
    setTimeout(() => setCopyStatus(prev => ({ ...prev, [key]: '' })), 2000);
  }, []);

  return (
    <div className="h-screen w-screen p-3 md:p-6 flex flex-col overflow-hidden bg-[#ececec]">
      {/* Top Navigation - Compact */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 hardware-panel flex items-center justify-center bg-[#ff5f00] text-white font-black text-xl rotate-[-2deg]">SA</div>
          <div>
            <h1 className="mono-font font-bold text-lg tracking-tighter uppercase leading-none">Sonic Alchemist</h1>
            <p className="mono-font text-[9px] opacity-50 uppercase tracking-[0.2em]">Distillation Unit V2.4</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex flex-col items-end">
             <span className="mono-font text-[8px] opacity-40 uppercase">Frequency Range</span>
             <span className="mono-font text-[10px] font-bold">113 - 128 BPM</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-5 flex flex-col min-h-0 hardware-panel overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {/* Genre Nodes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">01 NODES</span>
                <span className="mono-font text-[10px] opacity-40 uppercase">{selectedGenres.size} ACTIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {Object.values(SAGenre).map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`h-9 border border-black mono-font text-[9px] font-bold transition-all flex items-center justify-center px-1 text-center leading-tight hover:bg-gray-50 ${
                      selectedGenres.has(g) ? 'bg-black text-[#faff00] shadow-[inset_0_0_4px_rgba(250,255,0,0.5)]' : 'bg-white'
                    }`}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/10 pb-1">
                <span className="mono-font text-[12px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">02 BLUEPRINT</span>
                <button onClick={handleRandomizeAll} className="mono-font text-[10px] font-bold uppercase text-[#ff5f00] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f00]"></span> RANDOM ALL
                </button>
              </div>
              
              {[
                { label: 'ATMOS', value: mood, setter: setMood, hint: hints.mood, pool: MOODS },
                { label: 'TECH', value: instruments, setter: setInstruments, hint: hints.instruments, pool: INSTRUMENTS },
                { label: 'SYNC (113-128)', value: tempo, setter: setTempo, hint: hints.tempo, pool: TEMPOS }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="mono-font text-[12px] font-bold opacity-60 uppercase">{field.label}</label>
                    <button onClick={() => handleRandomizeField(field.setter, field.pool)} className="mono-font text-[9px] opacity-40 hover:opacity-100 hover:text-[#ff5f00]">RE-ROLL</button>
                  </div>
                  <div className="relative">
                    <input 
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value.toUpperCase())}
                      placeholder={`E.G. ${field.hint}`}
                      className="w-full bg-[#e8e8e8] border border-black p-3 mono-font text-[14px] uppercase focus:bg-white transition-all placeholder:text-black/10 outline-none"
                    />
                    <div className="mt-1">
                      <p className="mono-font text-[9px] opacity-40 uppercase tracking-tight truncate">GUIDE: {field.hint}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Button */}
          <div className="p-4 border-t-2 border-black bg-white">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !mood}
              className={`w-full py-4 te-button text-base font-black mono-font tracking-[0.2em] uppercase transition-all flex flex-col items-center justify-center gap-0.5 ${
                isLoading || !mood ? 'opacity-50 cursor-not-allowed bg-gray-300 shadow-none' : 'te-button-orange active:translate-y-1'
              }`}
            >
              {isLoading ? (
                 <>
                   <span className="animate-pulse text-sm">ALCHEMIZING...</span>
                   <span className="text-[9px] font-normal tracking-widest opacity-80">{Math.round(loadingProgress)}% COMPLETION</span>
                 </>
              ) : 'TRIGGER FUSION'}
            </button>
          </div>
        </div>

        {/* Right Display Panel */}
        <div className="lg:col-span-7 flex flex-col min-h-0 space-y-4">
          <div className="hardware-panel p-1.5 flex-1 flex flex-col bg-[#0a0a0a] border-[3px] overflow-hidden">
            <div ref={displayRef} className="display-screen flex-1 p-5 relative flex flex-col overflow-hidden">
              {/* CRT Overlays */}
              <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 3px, 4px 100%' }}></div>
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              {isLoading && (
                <LoadingScreen 
                  progress={loadingProgress} 
                  logIndex={logIndex} 
                  genres={[...selectedGenres].map(g => g.toString())} 
                />
              )}

              {currentPrompt ? (
                <div className="flex-1 flex flex-col space-y-6 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex justify-between items-center border-b border-[#ff5f00]/40 pb-2">
                    <div className="flex flex-col">
                       <div className="mono-font text-[10px] font-black opacity-60 uppercase">SIGNAL ID: {currentPrompt.id}</div>
                       <div className="mono-font text-[8px] opacity-40 uppercase tracking-widest">Matched heritage signature</div>
                    </div>
                    <div className="mono-font text-[10px] font-bold text-[#ff5f00] bg-[#ff5f00]/10 px-2 py-0.5 border border-[#ff5f00]/20">UNIT: FUSION</div>
                  </div>

                  <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                    <div className="space-y-2 flex-shrink-0">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[12px] font-bold bg-[#ff5f00] text-black px-1.5 uppercase italic tracking-tighter">Style Filter</span>
                        <div className={`mono-font text-[11px] font-bold segmented-display ${editedStyle.length > 300 ? 'text-red-500 animate-pulse' : 'text-[#ff5f00]'}`}>
                          [{editedStyle.length.toString().padStart(3, '0')} / 300]
                        </div>
                      </div>
                      <div className="relative">
                        <textarea 
                          value={editedStyle}
                          onChange={(e) => setEditedStyle(e.target.value.toUpperCase())}
                          className="w-full bg-black border border-[#ff5f00]/30 p-3 mono-font text-[14px] leading-relaxed uppercase font-bold text-[#ff5f00] outline-none h-24 custom-scrollbar shadow-[0_0_10px_rgba(255,95,0,0.1)] focus:border-[#ff5f00]"
                        />
                        <button 
                          onClick={() => copyToClipboard(editedStyle, 'style')} 
                          className="absolute bottom-2 right-2 text-[9px] font-black bg-[#ff5f00] text-black px-2 py-1 transition-all active:scale-95 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >
                          {copyStatus['style'] || 'COPY'}
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 space-y-2">
                      <div className="flex justify-between items-center px-1 flex-shrink-0">
                        <span className="text-[12px] font-bold bg-[#ff5f00] text-black px-1.5 uppercase italic tracking-tighter">Arrangement</span>
                        <button onClick={() => copyToClipboard(currentPrompt.structure, 'structure')} className="text-[10px] underline uppercase hover:text-white transition-colors">{copyStatus['structure'] || 'COPY BLUEPRINT'}</button>
                      </div>
                      <div className="flex-1 bg-black p-4 border border-[#ff5f00]/10 overflow-y-auto custom-scrollbar relative">
                        <div className="absolute top-0 right-0 p-1 opacity-5 mono-font text-[40px] pointer-events-none font-black">SA</div>
                        <pre className="text-[12px] leading-relaxed uppercase whitespace-pre-wrap opacity-90 text-[#ff5f00] mono-font">{currentPrompt.structure}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#ff5f00]/10">
                  <div className="text-center space-y-4 opacity-20">
                    <div className="mono-font text-3xl font-black italic tracking-tighter text-[#ff5f00]">AWAITING_SIGNAL</div>
                    <div className="mono-font text-[9px] tracking-[0.5em] uppercase">Configure nodes to distillation unit</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini Health Monitor */}
          <div className="flex gap-4 flex-shrink-0 h-14">
             <div className="hardware-panel flex-1 px-4 flex justify-between items-center bg-[#fdfdfd]">
                <div className="mono-font text-[10px] font-bold opacity-40 uppercase">Sys_Node</div>
                <div className="flex items-center gap-2">
                  <div className="mono-font text-[11px] font-bold">STABLE</div>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></div>
                </div>
             </div>
             <div className="hardware-panel flex-1 px-4 flex justify-between items-center bg-[#fdfdfd]">
                <div className="mono-font text-[10px] font-bold opacity-40 uppercase">Sync_Lock</div>
                <div className="mono-font text-[11px] font-bold">LOCKED</div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <footer className="w-full max-w-7xl mx-auto flex justify-between items-center opacity-40 py-4 flex-shrink-0 border-t border-black/10 mt-auto">
        <div className="flex gap-6">
          <a href="https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/advanced-suno-prompt-engineering-guide" target="_blank" rel="noreferrer" className="mono-font text-[9px] uppercase font-black hover:text-[#ff5f00]">Documentation</a>
          <span className="mono-font text-[9px] uppercase font-bold">© 1994-2025 SURGICAL UNIT</span>
        </div>
        <div className="mono-font text-[9px] uppercase font-black tracking-[0.2em] hidden sm:block">
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
          2% { transform: translate(-1px, 1px); text-shadow: 1px 0 #ff5f00; }
          4% { transform: translate(1px, -1px); text-shadow: -1px 0 #faff00; }
          6% { transform: translate(0); text-shadow: none; }
          100% { transform: translate(0); text-shadow: none; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 95, 0, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 95, 0, 0.2);
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 95, 0, 0.4);
        }
      `}} />
    </div>
  );
};

export default App;
