import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const pop = (frame: number, fps: number, delay: number, damping = 11) =>
  spring({ frame: frame - delay, fps, config: { damping, stiffness: 160 } });

// 게임 배경: 하늘 그라데이션 + 흘러가는 구름 + 떠 있는 섬
const CLOUDS = [
  { x: 120, y: 90, s: 1.2, v: 0.5 },
  { x: 1500, y: 60, s: 0.9, v: 0.35 },
  { x: -80, y: 900, s: 1.6, v: 0.6 },
  { x: 1650, y: 380, s: 1.3, v: 0.45 },
  { x: 800, y: 980, s: 1.0, v: 0.3 },
];

export const Sky = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% -6%, rgba(255,255,255,.95) 0%, rgba(190,236,255,.6) 35%, transparent 70%), linear-gradient(180deg, #5cc0ff 0%, #3fa2ee 40%, #1f7fd8 100%)",
      }}
    >
      {CLOUDS.map((c, i) => {
        const x = ((c.x + frame * c.v * 2 + 300) % 2300) - 300;
        return <i key={i} className="cloud" style={{ left: x, top: c.y, transform: `scale(${c.s})` }} />;
      })}
      <i className="island" style={{ right: -40, bottom: 60, transform: `scale(1.4) translateY(${Math.sin(frame / 25) * 6}px)` }} />
      <i className="island" style={{ left: -60, bottom: 220, transform: `scale(1) translateY(${Math.sin(frame / 30 + 1) * 6}px)` }} />
    </AbsoluteFill>
  );
};

// 장면 전환: 앞뒤로 살짝 페이드 + 확대
export const Scene: React.FC<{ children: React.ReactNode; out?: boolean }> = ({ children, out = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], clamp);
  const fadeOut = out ? interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clamp) : 1;
  const scale = out ? interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0.96], clamp) : 1;
  return <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut), transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

export const Caption: React.FC<{ step: string; text: string }> = ({ step, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, 2, 13);
  return (
    <div style={{ position: "absolute", top: 46, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div className="caption" style={{ transform: `translateY(${(1 - s) * -80}px) scale(${0.8 + s * 0.2})`, opacity: s }}>
        <span className="step">{step}</span>
        {text}
      </div>
    </div>
  );
};

// 게임 창을 1.6배로 키워 화면 가운데에 배치
export const WinStage: React.FC<{ children: React.ReactNode; top: number; scale?: number; delay?: number }> = ({
  children,
  top,
  scale = 1.6,
  delay = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        width: 900,
        transformOrigin: "top center",
        transform: `translateX(-50%) translateY(${(1 - s) * 120}px) scale(${scale * (0.9 + s * 0.1)})`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      {children}
    </div>
  );
};

export const WinBar: React.FC<{ title: string }> = ({ title }) => (
  <div className="win-bar">
    <h2>{title}</h2>
    <div className="dots">
      <i />
      <i />
      <i />
    </div>
  </div>
);

// 마우스 커서: 키프레임 사이를 부드럽게 이동하고, 클릭 프레임에 눌림 + 물결
type Point = { f: number; x: number; y: number };
export const Cursor: React.FC<{ path: Point[]; clicks: number[] }> = ({ path, clicks }) => {
  const frame = useCurrentFrame();
  if (frame < path[0].f) return null;
  const opts = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  let x = path[path.length - 1].x;
  let y = path[path.length - 1].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame <= b.f) {
      x = interpolate(frame, [a.f, b.f], [a.x, b.x], opts);
      y = interpolate(frame, [a.f, b.f], [a.y, b.y], opts);
      break;
    }
  }
  const click = clicks.map((c) => frame - c).find((d) => d >= 0 && d < 14);
  const press = click !== undefined && click < 5 ? 0.82 : 1;
  const appear = interpolate(frame, [path[0].f, path[0].f + 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none", opacity: appear }}>
      {click !== undefined && (
        <div
          style={{
            position: "absolute",
            left: -22,
            top: -22,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3px solid #ffcf1f",
            transform: `scale(${interpolate(click, [0, 13], [0.3, 1.5])})`,
            opacity: interpolate(click, [0, 13], [1, 0]),
          }}
        />
      )}
      <svg width="30" height="34" viewBox="0 0 30 34" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 2px rgba(19,48,107,.35))" }}>
        <path d="M2 2 L2 27 L9 21 L14 32 L19 30 L14 19 L24 19 Z" fill="#fff" stroke="#13306b" strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const typed = (text: string, frame: number, start: number, perChar = 3) =>
  frame < start ? "" : text.slice(0, Math.floor((frame - start) / perChar) + 1);

export const Caret: React.FC<{ show?: boolean }> = ({ show = true }) => {
  const frame = useCurrentFrame();
  return show && Math.floor(frame / 8) % 2 === 0 ? <span className="caret" /> : null;
};

// 로고: Q 동전 + "추억의" + "큐플레이"
export const Logo: React.FC<{ delay?: number; scale?: number }> = ({ delay = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coin = spring({ frame: frame - delay, fps, config: { damping: 7, stiffness: 120 } });
  const sub = pop(frame, fps, delay + 12, 9);
  const main = pop(frame, fps, delay + 20, 8);
  const bob = Math.sin((frame - delay) / 13) * 8;
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 6 * scale, transform: `scale(${scale})` }}>
      <div
        className="qcoin"
        style={{
          width: 64,
          height: 64,
          transform: `translateY(${(1 - coin) * -500 + (frame > delay + 30 ? bob : 0)}px) rotate(${(1 - coin) * -200}deg) scale(1.6)`,
          marginBottom: 30,
        }}
      >
        Q
      </div>
      <div className="logo-sub" style={{ fontSize: 44, WebkitTextStroke: "12px #13306b", transform: `scale(${sub})`, marginTop: 6 }}>
        추억의
      </div>
      <h1 className="logo-main" style={{ fontSize: 160, transform: `scale(${main})` }}>
        <span className="s" style={{ WebkitTextStroke: "26px #13306b", textShadow: "0 14px 0 #13306b" }} aria-hidden>
          큐플레이
        </span>
        <span className="f">큐플레이</span>
      </h1>
    </div>
  );
};
