declare module 'abuse-detection' {
  export interface AbuseResult {
    hasAbusiveWords: boolean;
    abusiveWords: string[];
    abusiveWordCount: number;
  }

  /**
   * テキスト内の不適切な言葉を検知します
   * @param text チェックしたいテキスト
   * @param lang 言語コード (例: 'ja', 'en')。指定しない場合は英語
   */
  export function detectAbuse(text: string, lang?: string): AbuseResult;

  /**
   * カスタムNGワードを追加します
   */
  export function addCustomWords(words: string[], lang?: string): void;

  /**
   * カスタムNGワードを削除します
   */
  export function removeCustomWords(words: string[], lang?: string): void;
}