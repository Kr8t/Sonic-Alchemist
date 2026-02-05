
export enum SAGenre {
  SA_HOUSE = 'South African House',
  DEEP_HOUSE = 'Deep House',
  AMAPIANO = 'Amapiano',
  THREE_STEP = '3-Step',
  GQOM = 'Gqom',
  AFRO_TECH = 'Afro Tech',
  SOULFUL_HOUSE = 'Soulful House',
  SGIJA = 'Sgija',
  BACARDI = 'Bacardi',
  ANCESTRAL = 'Ancestral House',
  KWAITO = 'Kwaito'
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
