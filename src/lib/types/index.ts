export type GamePhase = "setup" | "round1" | "round2" | "final" | "results";
export type QuestionType = "normal" | "cat" | "auction" | "final";

export interface Player {
  id: string;
  name: string;
  key: string; // клавиша которая используется для ответа
  score: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  answer: string;
  price: number;
  isPlayed: boolean; // сыгран ли вопрос
  secretTheme?: string; // кот в мешке
}

export interface Theme {
  id: string;
  name: string;
  questions: Question[]; // пот з ровно 5
}

export interface GameState {
  phase: GamePhase;
  players: Player[];

  // табло
  round1Themes: Theme[];
  round2Themes: Theme[];
  finalQuestion: Question | null;

  //  контекст
  currentPlayerId: string | null; // кто выбирает вопрос
  activeQuestion: Question | null; // вопрос на экране
  answeringPlayerId: string | null; // кто отвечает

  devMode: boolean;
}
