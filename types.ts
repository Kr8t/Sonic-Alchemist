
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
  TECH_GOM = 'Tech-Gqom'
}

export interface PromptRequest {
  genres: SAGenre[];
  mood: string;
  instruments?: string;
  tempo?: string;
}

export interface GeneratedPrompt {
  id: string;
  style: string;
  structure: string;
  genres: SAGenre[];
  timestamp: number;
}
