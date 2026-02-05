
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SAGenre, GeneratedPrompt } from './types';
import { generateMusicPrompt } from './services/geminiService';

const MOODS = [
  "MIDNIGHT SOWETO RAIN",
  "SURGICAL WAREHOUSE ECHO",
  "CAMPS BAY FOGGY SUNSET",
  "INDUSTRIAL DURBAN GRIME",
  "AFRO-TECH RITUAL SPIRIT",
  "PRIVATE SCHOOL JAZZ CLUB",
  "GLITCHY HI-FI VINYL",
  "WINTER JOZI MORNING",
  "BASEMENT SHEBEEN HEAT",
  "GARDEN DEEP FOLEY",
  "SANDTON PENTHOUSE LUSH",
  "MAMELODI BACARDI STREETS",
  "DURBAN HARBOR AMBIENCE",
  "ORBITAL ANCESTRAL VOID",
  "MABONENG ROOFTOP HAZE",
  "SUNNYSIDE DUSTY VIBE",
  "UMHLANGA NEON BREEZE",
  "DRAKENSBERG ECHO CLOUDS",
  "MELANCHOLIC PIANO VOID",
  "ECSTATIC TRIBAL ENERGY",
  "DEEP THOUGHT MINIMALISM",
  "HUMID TAXI RANK PULSE",
  "CRISP APARTHEID GHOSTS",
  "FUTURISTIC KWAITO NOSTALGIA",
  "CYBERNETIC TOWNSHIP FEVER",
  "LIQUID GOLDEN HOUR",
  "STEELY UNDERGROUND HEAT",
  "LO-FI CASSETTE TEXTURES",
  "HIGH-GLOSS TECHNO SHINE",
  "ORGANIC SOIL RESONANCE",
  "HYPNOTIC LIMPOPO NIGHTS",
  "VAPORWAVE MALL AMBIENCE",
  "SUNKISSED SHAKY PULSE",
  "NEON-LIT TAXI INTERIOR",
  "ABSTRACT FOLEY LANDSCAPE",
  "DREAMY PRETORIA GARDEN",
  "SUBMERGED AQUATIC BASS",
  "SPACED-OUT SYNTH WAVE",
  "CHROME-PLATED AFRO BEAT",
  "HAZY LATE NIGHT LOUNGE"
];

const INSTRUMENTS = [
  "SUB-LOW LOG DRUMS",
  "WOOD FOLEY / RAIN STICK",
  "STUTTER KALIMBA / RIMS",
  "SURGICAL GLASS HITS",
  "ETHEREAL PADS / 808",
  "JAZZ PIANO / FM BASS",
  "GRITTY BIT-CRUSHED SUB",
  "ORGANIC CLICKY SHAKERS",
  "GRANULAR NATURE SOUNDS",
  "TRIBAL CHANTS / WATER",
  "METALLIC SHELF PERC",
  "GHOST KICKS / TICK-TOCK",
  "909-STYLE ANALOG HATS",
  "TAPE-HISS ATMOSPHERE",
  "OPERATOR FM SYNTHS",
  "DETUNED RHODES KEYS",
  "LASER-CUT LEAD STABS",
  "TRADITIONAL DJEMBE TAP",
  "PLUCKY MARIMBA TEXTURE",
  "DISTORTED WHISTLE ECHO",
  "SQUARE-WAVE SGIJA LEAD",
  "BIT-REDUCED RIMSHOTS",
  "REVERB-SOAKED HUMS",
  "TRANSIENT-RICH WOODBLOCK",
  "PULSATING 303 ACID LINE",
  "FILTERED CROWD NOISE",
  "HOLLOW WOODEN PLUCKS",
  "BRASSY SYNTH SWELLS",
  "METALLIC PIPE DRIPS",
  "MODULAR GLITCH BLIPS",
  "RESONANT COWBELLS",
  "8-BIT CHIPTUNE ARPS",
  "SHIMMERING CRYSTAL PADS",
  "DEEP ANALOG CHORDS",
  "WARP-DRIVE FILTER SWEEPS",
  "ORGANIC GRAVEL CRUNCH",
  "REVERSED VOCAL TEXTURES",
  "STACCATO CELLO STABS",
  "DAMPENED CONGA LOOPS",
  "ELECTRIC PIANO TREMOLO"
];

const TEMPOS = [
  "113 BPM / LAID BACK",
  "114 BPM / DUSTY SWING",
  "115 BPM / SGIJA SWING",
  "116 BPM / MELLOW GROOVE",
  "117 BPM / DEEP SHUFFLE",
  "118 BPM / STEADY DEEP",
  "119 BPM / HYPNOTIC FLOW",
  "120 BPM / SOULFUL DRIVE",
  "121 BPM / MODERN HOUSE",
  "122 BPM / AFRO SHUFFLE",
  "123 BPM / TECHNO-TECH",
  "124 BPM / SURGICAL TECH",
  "125 BPM / INDUSTRIAL THUMP",
  "126 BPM / GQOM DRIVE",
  "127 BPM / RAW ENERGY",
  "128 BPM / PEAK ENERGY",
  "12/8 TRIPLET 113 BPM",
  "12/8 TRIPLET 115 BPM",
  "12/8 TRIPLET 120 BPM",
  "12/8 TRIPLET 124 BPM",
  "12/8 TRIPLET 126 BPM",
  "SWING-SHIFT 118 BPM",
  "OFF-BEAT 122 BPM",
  "LINEAR 128 BPM DRIVE",
  "DRAGGING 114 BPM SOUL",
  "RUSHED 127 BPM GQOM",
  "SHUFFLED 116 BPM AFRO",
  "GLITCHED 120 BPM SYNC",
  "STUTTERED 125 BPM PULSE",
  "STEADY 121 BPM FLOW"
];

const GENRE_HINTS: Record<string, { mood: string, instruments: string, tempo: string }> = {
  [SAGenre.AMAPIANO]: { mood: "JAZZ / SOULFUL", instruments: "LOG DRUMS / RHODES", tempo: "113-115 BPM" },
  [SAGenre.DEEP_HOUSE]: { mood: "SURGICAL / HYPNOTIC", instruments: "ATMOS PADS / SUB", tempo: "118-122 BPM" },
  [SAGenre.THREE_STEP]: { mood: "SPIRITUAL RITUAL", instruments: "WOOD / TRIBAL", tempo: "TRIPLET SWING" },
  [SAGenre.GQOM]: { mood: "DARK INDUSTRIAL", instruments: "RAW METALLIC TAPS", tempo: "126-128 BPM" },
  [SAGenre.AFRO_TECH]: { mood: "MINIMALIST / TECH", instruments: "NATURE FOLEY / FM", tempo: "122-125 BPM" },
  [SAGenre.SOULFUL_HOUSE]: { mood: "LUSH / GORGEOUS", instruments: "VOCAL CHOPS / KEYS", tempo: "120-122 BPM" },
  [SAGenre.KWAITO]: { mood: "90S HERITAGE", instruments: "KWAITO KEYS / SNARES", tempo: "113-115 BPM" },
  [SAGenre.SGIJA]: { mood: "RHYTHMIC / DANCE", instruments: "MOOG BASS / SGIJA LEADS", tempo: "113-116 BPM" },
  [SAGenre.BACARDI]: { mood: "STREET / RAW", instruments: "TAPS / HEAVY KICKS", tempo: "115-120 BPM" },
  [SAGenre.ANCESTRAL]: { mood: "ANCESTRAL / DEEP", instruments: "TRADITIONAL PERC / VOICES", tempo: "118-124 BPM" },
  [SAGenre.SA_HOUSE]: { mood: "CLUB / CLASSIC", instruments: "KORG M1 / 909 HATS", tempo: "118-126 BPM" }
};

const App: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<Set<SAGenre>>(new Set([SAGenre.AMAPIANO]));
  const [mood, setMood] = useState('');
  const [instruments, setInstruments] = useState('');
  const [tempo, setTempo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<GeneratedPrompt | null>(null);
  const [editedStyle, setEditedStyle] = useState('');
  const [copyStatus, setCopyStatus] = useState<Record<string, string>>({});

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
    if (isLoading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + (Math.random() * 15), 98));
      }, 400);
    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(interval);
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
    try {
      const genresArray: SAGenre[] = [...selectedGenres];
      const result = await generateMusicPrompt({ genres: genresArray, mood, instruments, tempo });
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substr(2, 9),
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
      }, 400);
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
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Top Navigation */}
      <nav className="w-full max-w-6xl flex justify-between items-center mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 hardware-panel flex items-center justify-center bg-[#ff5f00] text-white font-black text-xl">SA</div>
          <div>
            <h1 className="mono-font font-bold text-lg tracking-tighter uppercase leading-none">Sonic Alchemist</h1>
            <p className="mono-font text-[10px] opacity-40 uppercase tracking-widest">TE-CORE FUSION ENGINE V2</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-[#1a1a1a]"></div>
        </div>
      </nav>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 hardware-panel p-8 space-y-8 flex flex-col">
          
          {/* Genre Multi-Selector */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="mono-font text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">01 NODES (MULTI-SELECT)</span>
              <span className="mono-font text-[10px] opacity-40 uppercase">{selectedGenres.size} ACTIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {Object.values(SAGenre).map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`h-10 border-2 border-black mono-font text-[8px] font-bold transition-all flex items-center justify-center px-1 text-center leading-tight ${
                    selectedGenres.has(g) ? 'bg-black text-[#faff00]' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Blueprint Parameters */}
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center">
              <span className="mono-font text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">02 SIGNAL BLUEPRINT</span>
              <button onClick={handleRandomizeAll} className="mono-font text-[9px] font-bold uppercase text-[#ff5f00] hover:underline">RANDOM ALL</button>
            </div>
            
            {[
              { label: 'ATMOS', value: mood, setter: setMood, hint: hints.mood, pool: MOODS },
              { label: 'TECH', value: instruments, setter: setInstruments, hint: hints.instruments, pool: INSTRUMENTS },
              { label: 'SYNC (113-128 BPM)', value: tempo, setter: setTempo, hint: hints.tempo, pool: TEMPOS }
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <div className="flex justify-between">
                  <label className="mono-font text-[10px] font-bold opacity-60 uppercase">{field.label}</label>
                  <button onClick={() => handleRandomizeField(field.setter, field.pool)} className="mono-font text-[9px] opacity-30 hover:opacity-100">RND</button>
                </div>
                <div className="relative group">
                  <input 
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value.toUpperCase())}
                    placeholder={`E.G. ${field.hint}`}
                    className="w-full bg-[#e0e0e0] border-2 border-black p-4 mono-font text-xs uppercase focus:bg-white transition-colors placeholder:text-black/20 outline-none"
                  />
                  <div className="mt-1 flex justify-between items-center">
                    <span className="mono-font text-[8px] opacity-40 uppercase tracking-tighter">RECOMMENDED: {field.hint}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !mood}
            className={`w-full py-8 te-button text-sm font-black mono-font tracking-widest uppercase transition-all flex items-center justify-center gap-4 ${
              isLoading || !mood ? 'opacity-50 cursor-not-allowed' : 'te-button-orange active:translate-y-1'
            }`}
          >
            {isLoading ? `ALCHEMIZING ${Math.round(loadingProgress)}%` : 'TRIGGER FUSION'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="hardware-panel p-2 flex-1 flex flex-col bg-[#1a1a1a]">
            <div className="display-screen flex-1 p-6 relative flex flex-col overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

              {isLoading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90">
                  <div className="mono-font text-2xl font-black mb-2 segmented-display">SIGNAL EXTRACT...</div>
                  <div className="w-full max-w-xs h-1 bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#ff5f00] transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
                  </div>
                </div>
              )}

              {currentPrompt ? (
                <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
                  <div className="flex justify-between border-b border-[#ff5f00]/30 pb-2">
                    <div className="mono-font text-[10px] font-bold">MODE: FUSION</div>
                    <div className="mono-font text-[10px] font-bold uppercase truncate max-w-[200px]">{[...selectedGenres].join(' + ')}</div>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold bg-[#ff5f00] text-black px-1 uppercase italic">Style Filter Box</span>
                        <div className={`mono-font text-[10px] font-bold segmented-display ${editedStyle.length > 300 ? 'text-red-500 animate-pulse' : 'text-[#ff5f00]'}`}>
                          [{editedStyle.length.toString().padStart(3, '0')} / 300]
                        </div>
                      </div>
                      <div className="relative">
                        <textarea 
                          value={editedStyle}
                          onChange={(e) => setEditedStyle(e.target.value.toUpperCase())}
                          className="w-full bg-black/40 border border-[#ff5f00]/20 p-3 mono-font text-xs leading-tight uppercase font-bold text-[#ff5f00] outline-none h-24 custom-scrollbar"
                        />
                        <button onClick={() => copyToClipboard(editedStyle, 'style')} className="absolute bottom-2 right-2 text-[8px] font-bold bg-[#ff5f00]/20 hover:bg-[#ff5f00] hover:text-black px-2 py-1 transition-all">COPY STYLE</button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold bg-[#ff5f00] text-black px-1 uppercase italic">Structure Blueprint</span>
                        <button onClick={() => copyToClipboard(currentPrompt.structure, 'structure')} className="text-[9px] underline uppercase">{copyStatus['structure'] || 'COPY STRUCTURE'}</button>
                      </div>
                      <div className="flex-1 bg-black/50 p-4 rounded border border-[#ff5f00]/10 overflow-y-auto custom-scrollbar">
                        <pre className="text-[10px] leading-relaxed uppercase whitespace-pre-wrap opacity-80">{currentPrompt.structure}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#ff5f00]/20">
                  <div className="text-center space-y-2 opacity-20">
                    <div className="mono-font text-3xl font-black italic">AWAITING SIGNAL</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
             <div className="hardware-panel flex-1 p-4 flex justify-between items-center">
                <div className="mono-font text-[9px] font-bold opacity-40 uppercase">System Status</div>
                <div className="flex items-center gap-2"><div className="mono-font text-[10px] font-bold">ONLINE</div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
             </div>
             <div className="hardware-panel flex-1 p-4 flex justify-between items-center">
                <div className="mono-font text-[9px] font-bold opacity-40 uppercase">Range</div>
                <div className="mono-font text-[10px] font-bold">113-128 BPM</div>
             </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 w-full max-w-6xl px-4 flex justify-between items-center opacity-40">
        <div className="flex gap-8"><a href="https://jackrighteous.com/blogs/guides-using-suno-ai-music-creation/advanced-suno-prompt-engineering-guide" target="_blank" rel="noreferrer" className="mono-font text-[9px] uppercase font-bold hover:underline">Distillation Guide</a></div>
        <div className="mono-font text-[9px] uppercase font-bold tracking-[0.2em]">Surgical Precision Distillation / SA Electronic Heritage</div>
      </footer>
    </div>
  );
};

export default App;
