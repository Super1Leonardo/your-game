export type GamePhase = "setup" | "round1" | "round2" | "final" | "results";
export type QuestionType = "normal" | "cat" | "auction" | "final";

export interface Player {
  id: string;
  name: string;
  key: string;
  score: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  answer: string;
  price: number;
  isPlayed: boolean;
  secretTheme?: string; // для кота в мешке аукциона и финала
}

export interface Theme {
  id: string;
  name: string;
  questions: Question[]; // ровно 5
}

export interface AuctionState {
  currentBet: number;
  highestBidderId: string | null; // кто поставил больше всех
  foldedPlayerIds: string[]; // кто пасанул
}

export interface FinalRoundState {
  bets: Record<string, number>; // playerId -> ставка
  answers: Record<string, string>; // playerId -> ответ
  completedPlayerIds: string[]; // кто уже ответил
}

export interface GameState {
  phase: GamePhase;
  players: Player[];

  round1Themes: Theme[];
  round2Themes: Theme[];
  finalQuestion: Question | null;

  // контекст
  currentPlayerId: string | null; // кто выбирает вопрос
  activeQuestion: Question | null; // вопрос на экране
  answeringPlayerId: string | null; // кто отвечает
  pausedRemainingMs: number | null;

  // ход вопроса
  attemptedPlayerIds: string[]; // кто уже ошибся
  timerEndsAt: number | null; // для восстановления таймера

  // спец состояния
  auctionState: AuctionState | null;
  finalState: FinalRoundState | null;
}
