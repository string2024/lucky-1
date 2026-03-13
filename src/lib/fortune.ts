export interface FortuneCategory {
  id: string;
  name: string;
  emoji: string;
  score: number;
  message: string;
}

const MESSAGES: Record<string, string[][]> = {
  wealth: [
    ["지출을 줄이는 것이 최선입니다.", "예상치 못한 소비에 주의하세요."],
    ["작은 절약이 큰 도움이 됩니다.", "충동구매를 자제하세요."],
    ["보통의 하루입니다.", "안정적인 재정 관리를 유지하세요."],
    ["좋은 기회가 올 수 있어요!", "투자에 관심을 가져보세요."],
    ["최고의 재물운! 행운이 따릅니다!", "뜻밖의 수입이 생길 수 있어요!"],
  ],
  love: [
    ["혼자만의 시간이 필요해요.", "감정 정리가 필요한 날이에요."],
    ["소통에 조금 더 노력해보세요.", "오해가 생길 수 있어요."],
    ["평화로운 하루가 될 거예요.", "가까운 사람에게 연락해보세요."],
    ["설레는 만남이 있을 수 있어요!", "좋은 인연이 다가옵니다."],
    ["최고의 연애운! 사랑이 넘칩니다!", "운명적 만남의 날이에요!"],
  ],
  health: [
    ["무리하지 마세요.", "충분한 휴식이 필요합니다."],
    ["가벼운 운동을 해보세요.", "수분 섭취를 늘려보세요."],
    ["건강 관리에 신경 쓰세요.", "규칙적인 생활이 중요해요."],
    ["활력이 넘치는 하루!", "새로운 운동을 시작해보세요."],
    ["최상의 컨디션! 에너지 폭발!", "무엇이든 해낼 수 있는 날!"],
  ],
  work: [
    ["실수에 주의하세요.", "중요한 결정은 미루세요."],
    ["꼼꼼한 확인이 필요해요.", "동료와의 협력이 중요합니다."],
    ["무난한 하루가 될 거예요.", "주어진 일에 집중하세요."],
    ["성과를 인정받을 수 있어요!", "새 프로젝트에 도전해보세요."],
    ["승진/성공의 기운! 최고의 날!", "리더십을 발휘해보세요!"],
  ],
  study: [
    ["집중이 잘 안 되는 날이에요.", "짧은 학습 위주로 하세요."],
    ["복습 위주로 공부하세요.", "새로운 것보다 기존 내용 정리를."],
    ["꾸준히 하면 좋은 결과가 있어요.", "계획대로 진행하세요."],
    ["이해력이 높아지는 날!", "어려운 과목에 도전해보세요."],
    ["천재적 집중력! 시험운 최고!", "무엇이든 금방 습득해요!"],
  ],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function getDateSeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

export function getTodayFortune(): FortuneCategory[] {
  const seed = getDateSeed();
  const rand = seededRandom(seed);

  const categories = [
    { id: "wealth", name: "재물운", emoji: "💰" },
    { id: "love", name: "연애운", emoji: "💕" },
    { id: "health", name: "건강운", emoji: "💪" },
    { id: "work", name: "직장운", emoji: "💼" },
    { id: "study", name: "학업운", emoji: "📚" },
  ];

  return categories.map((cat) => {
    const score = Math.floor(rand() * 5) + 1;
    const msgs = MESSAGES[cat.id][score - 1];
    const message = msgs[Math.floor(rand() * msgs.length)];
    return { ...cat, score, message };
  });
}

export function generateLottoNumbers(fortunes: FortuneCategory[]): number[] {
  const seed = getDateSeed();
  const rand = seededRandom(seed + 999);

  // Weight numbers based on fortune scores
  const totalScore = fortunes.reduce((sum, f) => sum + f.score, 0);
  const numbers = new Set<number>();

  while (numbers.size < 6) {
    // Bias toward higher ranges for higher fortune scores
    const biasedMax = Math.min(45, Math.floor(25 + (totalScore / 25) * 20));
    const num = Math.floor(rand() * biasedMax) + 1;
    if (num >= 1 && num <= 45) {
      numbers.add(num);
    }
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateBonusNumbers(fortunes: FortuneCategory[]): number[] {
  const seed = getDateSeed();
  const rand = seededRandom(seed + 7777);
  const numbers = new Set<number>();

  while (numbers.size < 6) {
    const num = Math.floor(rand() * 45) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

export function getNumberColor(num: number): string {
  if (num <= 10) return "hsl(45, 100%, 50%)";
  if (num <= 20) return "hsl(210, 80%, 55%)";
  if (num <= 30) return "hsl(0, 75%, 55%)";
  if (num <= 40) return "hsl(0, 0%, 50%)";
  return "hsl(142, 60%, 45%)";
}

export function getTotalScore(fortunes: FortuneCategory[]): number {
  return fortunes.reduce((sum, f) => sum + f.score, 0);
}

export function getOverallMessage(total: number): string {
  if (total >= 22) return "🎉 오늘은 대박의 날! 행운이 가득합니다!";
  if (total >= 18) return "😊 좋은 기운이 감도는 하루예요!";
  if (total >= 13) return "🙂 무난하지만 기회를 놓치지 마세요!";
  if (total >= 8) return "😐 조심스러운 하루, 신중하게!";
  return "🍀 오늘은 쉬어가는 날로 삼으세요.";
}
