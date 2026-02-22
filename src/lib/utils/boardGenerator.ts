import type { Question, Theme } from "$lib/types";

export interface RawQuestion {
  cost: number;
  text: string;
  answer: string;
}
export interface RawTheme {
  theme: string;
  questions: RawQuestion[];
}
export interface RawCatQuestion {
  theme: string;
  text: string;
  answer: string;
}

export function prepareRound(
  rawThemes: RawTheme[],
  catPool: RawCatQuestion[],
): Theme[] {
  const themes: Theme[] = rawThemes.map((rt) => ({
    id: crypto.randomUUID(),
    name: rt.theme,
    questions: rt.questions.map((rq) => ({
      id: crypto.randomUUID(),
      type: "normal",
      text: rq.text,
      answer: rq.answer,
      price: rq.cost,
      isPlayed: false,
    })),
  }));

  const allQuestions: Question[] = themes.flatMap((t) => t.questions);
  const specialIndices = new Set<number>();

  while (specialIndices.size < 4) {
    specialIndices.add(Math.floor(Math.random() * allQuestions.length));
  }
  const indices = Array.from(specialIndices);

  allQuestions[indices[0]].type = "auction";
  allQuestions[indices[1]].type = "auction";

  for (let i = 2; i < 4; i++) {
    const q = allQuestions[indices[i]];
    q.type = "cat";

    if (catPool.length > 0) {
      const randomCatIdx = Math.floor(Math.random() * catPool.length);
      const catData = catPool.splice(randomCatIdx, 1)[0];
      q.secretTheme = catData.theme;
      q.text = catData.text;
      q.answer = catData.answer;
    }
  }

  return themes;
}
