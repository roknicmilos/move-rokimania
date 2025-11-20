export type ApiBadRequestResponse = {
  errors: Record<string, string[]>;
};

// Shared API single-object response base type
export type BaseModel = {
  id: number;
  created_at: string;
  updated_at: string | null;
};

// Unified type for both login and register responses
export type User = BaseModel & {
  username: string;
};

export type BaseEntry = BaseModel & {
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
