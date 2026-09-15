// 게임(public/index.html)의 스타일을 영상용으로 옮겨옴 — 애니메이션은 프레임 기반으로 따로 처리
import { loadFont as loadJua } from "@remotion/google-fonts/Jua";
import { loadFont as loadGowun } from "@remotion/google-fonts/GowunDodum";

loadJua("normal", { weights: ["400"], subsets: ["korean", "latin"], ignoreTooManyRequestsWarning: true });
loadGowun("normal", { weights: ["400"], subsets: ["korean", "latin"], ignoreTooManyRequestsWarning: true });

export const C = {
  sky: "#3fa2ee",
  skyDeep: "#1f7fd8",
  ink: "#13306b",
  inkSoft: "#4a6192",
  yellow: "#ffcf1f",
  yellowDeep: "#f29a00",
  pink: "#ff5d9e",
  good: "#1fae6a",
};

export const css = `
  :root {
    --sky: #3fa2ee; --sky-deep: #1f7fd8; --panel: #ffffff; --panel-soft: #eaf6ff;
    --bar: #1d6fd1; --bar-hi: #45aef5; --ink: #13306b; --ink-soft: #4a6192; --line: #b3d6f3;
    --yellow: #ffcf1f; --yellow-deep: #f29a00; --pink: #ff5d9e;
    --good: #1fae6a; --good-soft: #dbf6e8; --bad: #e2445c; --bad-soft: #fde2e6;
    --display: "Jua", "Malgun Gothic", sans-serif;
    --body: "Gowun Dodum", "Malgun Gothic", sans-serif;
  }
  * { box-sizing: border-box; }
  .stage { color: var(--ink); font-family: var(--body); font-size: 15px; line-height: 1.55; }

  .cloud { position: absolute; width: 150px; height: 44px; background: #fff; border-radius: 40px; box-shadow: inset 0 -8px 0 #d6ecfb; opacity: .95; }
  .cloud::before, .cloud::after { content: ""; position: absolute; background: #fff; border-radius: 50%; }
  .cloud::before { width: 64px; height: 64px; left: 22px; top: -32px; }
  .cloud::after { width: 48px; height: 48px; left: 74px; top: -22px; }
  .island { position: absolute; width: 180px; height: 90px; }
  .island::before { content: ""; position: absolute; inset: 0 0 auto; height: 34px; background: linear-gradient(#8fdc4a, #5fb82e); border-radius: 50% 45% 30% 30% / 70% 70% 30% 30%; border: 3px solid #3f8a1f; z-index: 1; }
  .island::after { content: ""; position: absolute; left: 12%; right: 12%; top: 22px; bottom: 0; background: linear-gradient(#b0703a, #7a4520); clip-path: polygon(0 0, 100% 0, 80% 60%, 55% 100%, 35% 70%, 15% 55%); }

  .qcoin {
    width: 64px; height: 64px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #fff39a, var(--yellow) 45%, var(--yellow-deep));
    border: 4px solid var(--ink); display: grid; place-items: center;
    font: 40px/1 var(--display); color: var(--ink); box-shadow: 0 5px 0 var(--ink);
  }
  .logo-sub { font: 26px/1 var(--display); color: #fff; -webkit-text-stroke: 7px var(--ink); paint-order: stroke fill; }
  .logo-main { position: relative; margin: 0; font: 84px/1.05 var(--display); letter-spacing: 1px; white-space: nowrap; }
  .logo-main .s { color: var(--ink); -webkit-text-stroke: 14px var(--ink); text-shadow: 0 8px 0 var(--ink); }
  .logo-main .f { position: absolute; inset: 0; background: linear-gradient(180deg, #ffffff 0%, #d9f5ff 45%, #54c3ff 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }

  .nick-chip { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(180deg, #ffe867, var(--yellow)); border: 3px solid var(--ink); border-radius: 999px; padding: 5px 6px 5px 16px; box-shadow: 0 4px 0 var(--ink); }
  .nick-chip label { font: 16px var(--display); white-space: nowrap; }
  .nick-chip .input { border: 2px solid var(--ink); font: 15px var(--body); color: var(--ink); width: 150px; height: 32px; background: #fff; border-radius: 999px; padding: 4px 12px; line-height: 20px; }

  .win { width: 900px; background: var(--panel); border: 3px solid var(--ink); border-radius: 20px; box-shadow: 0 7px 0 var(--ink), 0 14px 30px rgba(19,48,107,.25); overflow: hidden; }
  .win-bar { background: linear-gradient(180deg, var(--bar-hi), var(--bar)); color: #fff; height: 47px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid var(--ink); }
  .win-bar h2 { margin: 0; font: 22px/1.2 var(--display); letter-spacing: .3px; -webkit-text-stroke: 5px var(--ink); paint-order: stroke fill; }
  .dots { display: flex; gap: 5px; }
  .dots i { width: 11px; height: 11px; border-radius: 50%; background: #fff; border: 2px solid var(--ink); display: block; }
  .dots i:nth-child(1) { background: var(--pink); }
  .dots i:nth-child(2) { background: var(--yellow); }
  .win-body { padding: 20px; display: grid; gap: 18px; }

  .field { display: grid; gap: 8px; }
  .lab { font: 17px/26px var(--display); display: flex; align-items: baseline; gap: 8px; }
  .lab span { font: 13px var(--body); color: var(--ink-soft); }
  .topic-input { font: 20px/25px var(--body); color: var(--ink); height: 53px; border: 2px solid var(--ink); border-radius: 10px; padding: 12px 14px; background: var(--panel-soft); white-space: nowrap; }
  .topic-input.focus { background: #fff; box-shadow: 0 0 0 3px var(--yellow); }
  .placeholder { color: #8ea0c4; }
  .caret { display: inline-block; width: 2px; height: 22px; background: var(--ink); vertical-align: -4px; margin-left: 1px; }
  .suggest { display: flex; gap: 6px; height: 28px; }
  .suggest span { font: 13px/20px var(--body); color: var(--bar); background: var(--panel-soft); border: 1px solid var(--line); border-radius: 999px; padding: 3px 11px; }
  .suggest span.on { background: var(--yellow); color: var(--ink); border-color: var(--ink); }

  .opts { display: grid; grid-template-columns: 1fr 1.4fr; gap: 18px; }
  .seg { display: flex; height: 50px; border: 2px solid var(--ink); border-radius: 10px; overflow: hidden; }
  .seg span { flex: 1; display: grid; place-items: center; font: 17px var(--display); background: var(--panel); color: var(--ink-soft); border-left: 2px solid var(--ink); }
  .seg span:first-child { border-left: 0; }
  .seg span.on { background: var(--yellow); color: var(--ink); box-shadow: inset 0 -4px 0 var(--yellow-deep); }

  .btn { font: 20px/1 var(--display); color: var(--ink); height: 52px; background: linear-gradient(180deg, #ffe867 0%, var(--yellow) 55%, #ffb300 100%); border: 3px solid var(--ink); border-radius: 999px; padding: 0 26px; box-shadow: 0 4px 0 var(--ink), inset 0 2px 0 rgba(255,255,255,.7); display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; }
  .btn.pressed { transform: translateY(3px); box-shadow: 0 1px 0 var(--ink); }
  .btn.blue { background: var(--bar-hi); color: #fff; }
  .create-row { display: flex; align-items: center; gap: 14px; }
  .note { font-size: 13px; color: var(--ink-soft); }

  .loading { height: 336px; display: grid; gap: 14px; justify-items: center; align-content: center; text-align: center; }
  .loading .big { font: 30px var(--display); }
  .spinner { font-size: 56px; line-height: 1; }
  .meter { width: 360px; height: 20px; border: 2px solid var(--ink); border-radius: 999px; background: var(--panel-soft); overflow: hidden; }
  .meter i { display: block; height: 100%; background: repeating-linear-gradient(-45deg, var(--yellow) 0 10px, #ffe07a 10px 20px); border-right: 2px solid var(--ink); }

  .hud { display: flex; justify-content: space-between; align-items: center; height: 34px; }
  .hud .topic { font: 22px var(--display); display: flex; gap: 8px; align-items: center; }
  .stats { display: flex; gap: 8px; }
  .stat { background: var(--ink); color: #fff; border-radius: 8px; padding: 4px 10px; font: 16px var(--display); font-variant-numeric: tabular-nums; }
  .stat b { color: var(--yellow); font-weight: 400; }
  .timer { height: 14px; border: 2px solid var(--ink); border-radius: 999px; overflow: hidden; background: var(--panel-soft); }
  .timer i { display: block; height: 100%; width: 100%; background: var(--good); transform-origin: left; }
  .qbox { height: 83px; background: var(--panel-soft); border: 2px solid var(--ink); border-radius: 12px; padding: 22px 20px; font: 25px/35px var(--display); white-space: nowrap; }
  .qn { display: inline-block; background: var(--pink); color: #fff; border: 2px solid var(--ink); border-radius: 8px; padding: 0 9px; font-size: 18px; line-height: 28px; margin-right: 8px; vertical-align: 3px; }
  .choices { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .choice { height: 56px; font: 18px/24px var(--body); color: var(--ink); background: #fff; border: 2px solid var(--ink); border-radius: 10px; padding: 0 14px; box-shadow: 0 3px 0 var(--ink); display: flex; gap: 10px; align-items: center; }
  .choice .k { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--ink); display: grid; place-items: center; font: 16px var(--display); background: var(--yellow); }
  .choice.hover { background: #fff7d1; }
  .choice.right { background: var(--good-soft); border-color: var(--good); box-shadow: 0 3px 0 var(--good); }
  .choice.right .k { background: var(--good); color: #fff; border-color: var(--good); }
  .choice.dim { opacity: .55; }
  .verdict { height: 88px; display: flex; gap: 14px; align-items: center; justify-content: space-between; border-radius: 12px; padding: 0 14px; border: 2px solid var(--good); background: var(--good-soft); }
  .verdict .v { font: 24px/37px var(--display); color: var(--good); }
  .verdict p { margin: 0; }

  .result-top { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; }
  .grade { width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--ink); background: var(--yellow); display: grid; place-items: center; font: 64px/1 var(--display); box-shadow: 0 5px 0 var(--ink); }
  .result-top h3 { margin: 0; font: 30px var(--display); }
  .nums { display: flex; gap: 10px; margin-top: 8px; }
  .rank { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  .rank th { font: 14px var(--display); color: var(--ink-soft); text-align: left; padding: 6px 8px; border-bottom: 2px solid var(--ink); }
  .rank td { padding: 7px 8px; border-bottom: 1px dashed var(--line); font-size: 16px; }
  .rank td:first-child { font: 19px var(--display); width: 56px; }
  .rank .num { text-align: right; }
  .rank tr.me td { background: #fff7d1; }
  .actions { display: flex; gap: 10px; }

  .caption { display: inline-flex; align-items: center; gap: 18px; font: 44px/1 var(--display); color: #fff; -webkit-text-stroke: 9px var(--ink); paint-order: stroke fill; white-space: nowrap; }
  .caption .step { font-size: 30px; color: var(--ink); -webkit-text-stroke: 0; background: var(--yellow); border: 4px solid var(--ink); border-radius: 999px; padding: 10px 20px 8px; box-shadow: 0 5px 0 var(--ink); }
`;
