// 확인용 정지 화면 여러 장을 한 번의 번들로 뽑음: node scripts/stills.mjs 70 200 375
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "QplayIntro" });
for (const frame of frames) {
  const output = path.resolve("out/stills", `f${String(frame).padStart(3, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.5 });
  console.log("saved", output);
}
