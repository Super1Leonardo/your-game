export function checkAnswer(
  input: string,
  correct: string,
  typosForSmallWords: number,
  typosForBigWords: number,
): boolean {
  const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/ё/g, "е");

  const val1 = normalize(input);
  const val2 = normalize(correct);

  if (val1 === val2) return true;

  if (val1.length === 0 || val2.length === 0) return false;

  // расстояние Левенштейна - минимальное количество замен/вставок/удалений для превращения одной строки в другую
  const matrix = Array(val2.length + 1)
    .fill(null)
    .map(() => Array(val1.length + 1).fill(null));

  for (let i = 0; i <= val1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= val2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= val2.length; j++) {
    for (let i = 1; i <= val1.length; i++) {
      const indicator = val1[i - 1] === val2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // удаление
        matrix[j - 1][i] + 1, // вставка
        matrix[j - 1][i - 1] + indicator, // замена
      );
    }
  }

  const distance = matrix[val2.length][val1.length];

  // допуск 1 опечатки для коротких слов меньше 5 букв и 2 опечатки для длинных
  const allowedTypos = val2.length < 5 ? typosForSmallWords : typosForBigWords;

  return distance <= allowedTypos;
}
