import { getTossShareLink, share } from "@apps-in-toss/web-framework";

const APP_PATH = "intoss://lucky-1";

export type ShareResult = "shared" | "copied" | "failed";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** 토스 공유 링크(intoss://)를 만들어 메시지로 공유한다. 실패하면 복사로 대체한다. */
export async function shareMessage(body: string): Promise<ShareResult> {
  let link = "";
  try {
    link = await getTossShareLink(APP_PATH);
  } catch {
    link = "";
  }
  const message = link ? `${body}\n${link}` : body;

  try {
    await share({ message });
    return "shared";
  } catch {
    return (await copyText(message)) ? "copied" : "failed";
  }
}

export function luckyNumbersMessage(numbers: number[]): string {
  return `🍀 가져봐 1등 🍀\n오늘의 행운 번호: ${numbers.join(", ")}`;
}

export function fortuneMessage(total: number): string {
  return `🍀 가져봐 1등 🍀\n오늘의 내 운세 점수는 ${total}/25! 너의 운세도 확인해봐`;
}
