import fs from "node:fs";
import path from "node:path";

/**
 * 参赛笑话输出条目生成脚本（终版）
 * 将凝练且具有强反转张力的原创单行喜剧台词写入 /output/entry.txt
 */
const MAX_ENTRY_CHARS = 140;

const JOKE_LINE: string =
  "We held an intervention for my uncle's gambling addiction, mostly because Dad offered 4-to-1 odds he'd cry.";

/**
 * 校验单行参赛文本是否满足竞赛门禁约束
 * @param text 待校验文本
 */
function validateEntryText(text: string): void {
  const charCount: number = [...text].length;
  if (charCount < 1 || charCount > MAX_ENTRY_CHARS) {
    throw new Error(`Invalid character count: ${charCount} (must be 1..${MAX_ENTRY_CHARS})`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry text must not be whitespace only");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("Entry text must be a single line without line breaks");
  }
}

function writeEntry(): void {
  validateEntryText(JOKE_LINE);

  const outDir: string = process.env.TEST_OUTPUT_DIR || "/output";
  const outFile: string = path.join(outDir, "entry.txt");

  // 创建输出目录并写入 UTF-8 文本，显式设置 0644 权限以适配 Linux 沙盒评分器
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JOKE_LINE, { encoding: "utf8", mode: 0o644 });
  fs.chmodSync(outFile, 0o644);

  // 回读校验，确认落盘字节完整无误
  const written: string = fs.readFileSync(outFile, { encoding: "utf8" });
  if (written !== JOKE_LINE) {
    throw new Error("Written entry verification mismatch");
  }
}

writeEntry();
