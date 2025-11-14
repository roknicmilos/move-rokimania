export type BaseEntry = {
  id: number;
  created_at: string;
  updated_at: string | null;
  exercise: string;
  load: number;
};

export type HoldEntry = BaseEntry & {
  started_at: string;
  ended_at: string;
};

export type RepsEntry = BaseEntry & {
  reps: number;
};

export type Entry = HoldEntry | RepsEntry;
