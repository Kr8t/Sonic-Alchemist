
export enum SAGenre {
  SA_HOUSE = 'SA House',
  DEEP_HOUSE = 'Deep House',
  AMAPIANO = 'Amapiano',
  PRIVATE_SCHOOL = 'Private School Amapiano',
  THREE_STEP = '3-Step',
  GQOM = 'Gqom',
  HARD_GQOM = 'Hard Gqom',
  AFRO_TECH = 'Afro Tech',
  SOULFUL_HOUSE = 'Soulful House',
  SGIJA = 'Sgija',
  BACARDI = 'Bacardi',
  ANCESTRAL = 'Ancestral House',
  KWAITO = 'Kwaito',
  QUANTUM = 'Quantum Sound',
  TECH_GOM = 'Tech-Gqom',
  BOLO_HOUSE = 'Bolo House',
  AFRO_HOUSE = 'Afro House',
  TRIBAL_HOUSE = 'Tribal House',
  JAZZ_AMAPIANO = 'Jazz Amapiano',
  ROUGH_AMAPIANO = 'Rough Amapiano',
  DARK_GQOM = 'Dark Gqom',
  SGQOM = 'SGqom',
  MOTSWAKO = 'Motswako',
  ISGUBHU = 'Isgubhu',
  VOCAL_AMAPIANO = 'Vocal Amapiano'
}

export type VocalStyle = 'MELODIC' | 'RHYTHMIC CHANT' | 'SPOKEN WORD' | 'AD-LIBS' | 'WHISPERED' | 'GROWLED' | 'AUTOTUNED' | 'HARMONIZED' | 'NONE';

export interface PromptRequest {
  genres: SAGenre[];
  mood: string;
  instruments?: string;
  tempo?: string;
  includeVocals?: boolean;
  vocalStyle?: VocalStyle;
  instrumentBalance?: number; // 0: Traditional, 100: Synth
}

export interface GeneratedPrompt {
  id: string;
  style: string;
  structure: string;
  genres: SAGenre[];
  timestamp: number;
}
