import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, Caret, clamp, Cursor, Logo, pop, WinBar, WinStage, typed } from "./components";

// ---------- 1. 오프닝 ----------
export const Opening = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tag = pop(frame, fps, 48, 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 40, marginTop: 40 }}>
        <Logo delay={2} />
        <div
          className="caption"
          style={{ transform: `translateY(${(1 - tag) * 40}px)`, opacity: tag }}
        >
          <span className="step" style={{ fontSize: 38 }}>닉네임만 있으면 되는 AI 퀴즈 게임</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. 한 줄 소개 ----------
const CHIPS = [
  { t: "🎤 K-pop", x: 170, y: 170, d: 34 },
  { t: "📜 한국사", x: 1480, y: 150, d: 40 },
  { t: "🧙 해리포터", x: 120, y: 820, d: 46 },
  { t: "🌍 세계 수도", x: 1450, y: 840, d: 52 },
  { t: "🎮 추억의 게임", x: 1560, y: 480, d: 58 },
  { t: "⚡ 포켓몬", x: 110, y: 490, d: 64 },
  { t: "🍜 한국 음식", x: 640, y: 930, d: 70 },
  { t: "⚽ 월드컵", x: 1020, y: 90, d: 76 },
];

export const Tagline = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = pop(frame, fps, 6, 12);
  const sub = pop(frame, fps, 62, 14);
  const word = "문제가 뚝딱!";
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {CHIPS.map((c, i) => {
        const s = pop(frame, fps, c.d, 9);
        const float = Math.sin((frame + i * 20) / 14) * 8;
        return (
          <div
            key={c.t}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: `translateY(${float}px) scale(${s}) rotate(${(i % 2 ? 1 : -1) * 5}deg)`,
              font: "34px var(--display)",
              color: "var(--ink)",
              background: "#fff",
              border: "4px solid var(--ink)",
              borderRadius: 999,
              padding: "12px 26px 10px",
              boxShadow: "0 6px 0 var(--ink)",
              whiteSpace: "nowrap",
            }}
          >
            {c.t}
          </div>
        );
      })}
      <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
        <div className="caption" style={{ fontSize: 110, WebkitTextStroke: "20px var(--ink)", transform: `scale(${l1})` }}>
          주제만 적으면
        </div>
        <div style={{ display: "flex" }}>
          {[...word].map((ch, i) => {
            const s = pop(frame, fps, 22 + i * 4, 7);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  font: "180px/1.15 var(--display)",
                  color: "var(--yellow)",
                  WebkitTextStroke: "28px var(--ink)",
                  paintOrder: "stroke fill",
                  textShadow: "0 14px 0 var(--ink)",
                  transform: `translateY(${(1 - s) * -120}px) scale(${s})`,
                  width: ch === " " ? 50 : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            font: "40px var(--body)",
            color: "#fff",
            textShadow: "0 3px 6px rgba(19,48,107,.6)",
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
          }}
        >
          AI가 4지선다 퀴즈를 바로 만들어 줘요
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. 퀴즈 출제 ----------
const WIN_Y = 64; // 닉네임 칩 아래 창이 시작하는 위치

export const Create = () => {
  const frame = useCurrentFrame();
  const nick = typed("퀴즈왕", frame, 36, 5);
  const topic = typed("세계 수도", frame, 68, 6);
  const five = frame >= 120;
  const pressed = frame >= 140 && frame < 146;
  const loading = interpolate(frame, [148, 156], [0, 1], clamp);
  const meter = interpolate(frame, [156, 205], [0, 88], clamp);

  return (
    <AbsoluteFill>
      <Caption step="STEP 1" text="주제만 적으면 AI가 뚝딱 출제" />
      <WinStage top={280} scale={1.5}>
        <div style={{ display: "flex", justifyContent: "center", height: 48, marginBottom: 16 }}>
          <div className="nick-chip">
            <label>닉네임</label>
            <div className="input">
              {nick || <span className="placeholder">예) 퀴즈왕</span>}
              <Caret show={frame >= 32 && frame < 62} />
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div className="win" style={{ opacity: 1 - loading }}>
            <WinBar title="새 퀴즈 출제하기" />
            <div className="win-body">
              <div className="field">
                <div className="lab">
                  문제 유형 <span>어떤 주제든 입력하세요</span>
                </div>
                <div className={`topic-input ${frame >= 64 ? "focus" : ""}`}>
                  {topic || <span className="placeholder">예) K-pop, 조선시대 왕, 포켓몬</span>}
                  <Caret show={frame >= 64 && frame < 140} />
                </div>
                <div className="suggest">
                  {["K-pop", "2000년대 추억의 게임", "한국사", "세계 수도", "해리포터"].map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="opts">
                <div className="field">
                  <div className="lab">난이도</div>
                  <div className="seg">
                    <span className="on">쉬움</span>
                    <span>중간</span>
                    <span>어려움</span>
                  </div>
                </div>
                <div className="field">
                  <div className="lab">문제 개수</div>
                  <div className="seg">
                    <span className={five ? "on" : ""}>5개</span>
                    <span className={five ? "" : "on"}>10개</span>
                    <span>15개</span>
                    <span>20개</span>
                  </div>
                </div>
              </div>
              <div className="create-row">
                <span className={`btn ${pressed ? "pressed" : ""}`}>퀴즈 만들고 시작! ▶</span>
                <span className="note">만든 퀴즈는 아래 보관함에 저장되어 다른 참가자도 풀 수 있어요.</span>
              </div>
            </div>
          </div>

          {loading > 0 && (
            <div className="win" style={{ position: "absolute", inset: 0, height: "fit-content", opacity: loading, transform: `scale(${0.95 + loading * 0.05})` }}>
              <WinBar title="출제 중" />
              <div className="loading">
                <div className="spinner" style={{ transform: `translateY(${Math.sin(frame / 5) * -10}px) rotate(${Math.sin(frame / 5) * -8}deg)` }}>
                  ✏️
                </div>
                <div className="big">문제를 만들고 있어요</div>
                <div className="meter">
                  <i style={{ width: `${meter}%` }} />
                </div>
                <div className="note">AI가 ‘세계 수도’ 문제 5개를 만드는 중…</div>
              </div>
            </div>
          )}
        </div>

        {frame < 150 && (
          <Cursor
            path={[
              { f: 14, x: 760, y: 560 },
              { f: 30, x: 487, y: 26 },
              { f: 52, x: 487, y: 26 },
              { f: 62, x: 300, y: WIN_Y + 127 },
              { f: 104, x: 300, y: WIN_Y + 127 },
              { f: 118, x: 450, y: WIN_Y + 267 },
              { f: 124, x: 450, y: WIN_Y + 267 },
              { f: 138, x: 140, y: WIN_Y + 336 },
            ]}
            clicks={[32, 64, 120, 140]}
          />
        )}
      </WinStage>
    </AbsoluteFill>
  );
};

// ---------- 4. 문제 풀기 ----------
const QUESTIONS = [
  { q: "프랑스의 수도는 어디인가요?", choices: ["베를린", "파리", "마드리드", "로마"], answer: 1 },
  { q: "일본의 수도는 어디인가요?", choices: ["오사카", "교토", "도쿄", "삿포로"], answer: 2 },
];

const Stars: React.FC<{ start: number; x: number; y: number }> = ({ start, x, y }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > 24) return null;
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const d = interpolate(t, [0, 24], [10, 120]);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d,
              top: y + Math.sin(a) * d,
              fontSize: 26,
              opacity: interpolate(t, [0, 24], [1, 0]),
              transform: `translate(-50%, -50%) rotate(${t * 12}deg)`,
              zIndex: 40,
            }}
          >
            {i % 2 ? "⭐" : "✨"}
          </span>
        );
      })}
    </>
  );
};

export const Play = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const second = frame >= 140;
  const base = second ? 140 : 0;
  const cur = QUESTIONS[second ? 1 : 0];
  const answered = !second && frame >= 76;
  const timerStart = second ? 150 : 30;
  const timerEnd = answered ? 76 : frame;
  const timer = 1 - Math.max(0, timerEnd - timerStart) / 600;
  const score = Math.round(interpolate(frame, [80, 100], [0, 125], clamp));
  const verdictIn = pop(frame, fps, 80, 13);
  const verdictOut = interpolate(frame, [136, 140], [1, 0], clamp);
  const q = pop(frame, fps, base + 10, 12);

  return (
    <AbsoluteFill>
      <Caption step="STEP 2" text="시간 안에 정답을 콕!" />
      <WinStage top={210} scale={1.55}>
        <div className="win">
          <WinBar title="세계 수도 문제 · 쉬움" />
          <div className="win-body">
            <div className="hud">
              <div className="topic">🌍 세계 수도 문제</div>
              <div className="stats">
                <span className="stat">
                  문제 <b>{second ? 2 : 1}/5</b>
                </span>
                <span className="stat" style={{ transform: `scale(${frame >= 80 && frame < 104 ? 1.15 : 1})` }}>
                  점수 <b>{score}</b>
                </span>
              </div>
            </div>
            <div className="timer">
              <i style={{ transform: `scaleX(${timer})` }} />
            </div>
            <div className="qbox" style={{ transform: `scale(${0.9 + q * 0.1})`, opacity: q }}>
              <span className="qn">Q{second ? 2 : 1}</span>
              {cur.q}
            </div>
            <div className="choices">
              {cur.choices.map((c, i) => {
                const s = pop(frame, fps, base + 18 + i * 4, 12);
                const cls = answered ? (i === cur.answer ? "right" : "dim") : !second && frame >= 66 && i === 1 ? "hover" : "";
                return (
                  <div key={c} className={`choice ${cls}`} style={{ transform: `translateY(${(1 - s) * 30}px)`, opacity: Math.min(1, s * 1.4) }}>
                    <span className="k">{i + 1}</span>
                    <span>{c}</span>
                  </div>
                );
              })}
            </div>
            <div
              className="verdict"
              style={{ opacity: answered ? verdictIn * verdictOut : 0, transform: `translateY(${(1 - verdictIn) * 20}px)` }}
            >
              <div>
                <div className="v">딩동댕! +125</div>
                <p>파리는 프랑스의 수도이자 대표적인 문화·관광 도시입니다.</p>
              </div>
              <span className={`btn blue ${frame >= 136 && frame < 141 ? "pressed" : ""}`}>다음 문제 ▶</span>
            </div>
          </div>
        </div>
        <Stars start={76} x={667} y={67 + 34 + 18 + 14 + 18 + 83 + 18 + 28} />
        <Cursor
          path={[
            { f: 40, x: 820, y: 580 },
            { f: 70, x: 560, y: 285 },
            { f: 110, x: 560, y: 285 },
            { f: 130, x: 796, y: 436 },
            { f: 150, x: 796, y: 436 },
            { f: 180, x: 640, y: 440 },
          ]}
          clicks={[76, 136]}
        />
      </WinStage>
    </AbsoluteFill>
  );
};

// ---------- 5. 결과 · 명예의 전당 ----------
const RANK = [
  { m: "🥇", nick: "수도마스터", c: "5/5", s: 960 },
  { m: "🥈", nick: "퀴즈왕", c: "4/5", s: 780, me: true },
  { m: "🥉", nick: "여행가지니", c: "3/5", s: 590 },
  { m: "4", nick: "익명", c: "2/5", s: 410 },
];

const Confetti = () => {
  const frame = useCurrentFrame();
  const colors = ["#ffcf1f", "#ff5d9e", "#1fae6a", "#ffffff", "#45aef5"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const start = 14 + random(`d${i}`) * 30;
        const t = frame - start;
        if (t < 0) return null;
        const x = random(`x${i}`) * 1920 + Math.sin(t / 8 + i) * 30;
        const y = -40 + t * (9 + random(`v${i}`) * 7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 16,
              height: 26,
              background: colors[i % colors.length],
              border: "2px solid #13306b",
              borderRadius: 4,
              transform: `rotate(${t * (6 + random(`r${i}`) * 10)}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Result = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = pop(frame, fps, 14, 9);
  const score = Math.round(interpolate(frame, [18, 44], [0, 780], clamp));
  const correct = Math.round(interpolate(frame, [18, 36], [0, 4], clamp));
  const glow = frame > 72 ? (Math.sin((frame - 72) / 4) + 1) / 2 : 0;
  return (
    <AbsoluteFill>
      <Caption step="STEP 3" text="명예의 전당에 이름을 올려요" />
      <Confetti />
      <WinStage top={210} scale={1.55}>
        <div className="win">
          <WinBar title="결과 발표" />
          <div className="win-body">
            <div className="result-top">
              <div className="grade" style={{ transform: `scale(${interpolate(stamp, [0, 1], [2.6, 1])}) rotate(${interpolate(stamp, [0, 1], [-30, 0])}deg)`, opacity: Math.min(1, stamp * 2) }}>
                A
              </div>
              <div>
                <h3>🌍 세계 수도 문제 완료!</h3>
                <div className="nums">
                  <span className="stat">
                    정답 <b>{correct}/5</b>
                  </span>
                  <span className="stat">
                    점수 <b>{score}</b>
                  </span>
                </div>
                <p className="note" style={{ margin: "8px 0 0" }}>
                  대단해요! 거의 다 맞혔어요.
                </p>
              </div>
            </div>
            <div className="field">
              <div className="lab">
                이 퀴즈 명예의 전당 <span>상위 10명</span>
              </div>
              <table className="rank">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>닉네임</th>
                    <th className="num">정답</th>
                    <th className="num">점수</th>
                  </tr>
                </thead>
                <tbody>
                  {RANK.map((r, i) => {
                    const s = pop(frame, fps, 40 + i * 6, 14);
                    return (
                      <tr key={r.nick} className={r.me ? "me" : ""} style={{ transform: `translateX(${(1 - s) * 200}px)`, opacity: s }}>
                        <td>{r.m}</td>
                        <td style={r.me ? { fontWeight: 700, boxShadow: `inset 0 0 0 ${glow * 3}px #ffcf1f` } : undefined}>
                          {r.nick}
                          {r.me && <span className="stat" style={{ marginLeft: 10, fontSize: 13, padding: "2px 8px" }}>나</span>}
                        </td>
                        <td className="num">{r.c}</td>
                        <td className="num">{r.s}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="actions">
              <span className="btn">다시 풀기</span>
              <span className="btn" style={{ background: "#fff" }}>
                로비로
              </span>
            </div>
          </div>
        </div>
      </WinStage>
    </AbsoluteFill>
  );
};

// ---------- 6. 마무리 ----------
export const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = pop(frame, fps, 34, 12);
  const btn = pop(frame, fps, 48, 10);
  const pulse = frame > 60 ? 1 + Math.sin((frame - 60) / 5) * 0.04 : 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 34, marginTop: 20 }}>
        <Logo delay={0} scale={0.85} />
        <div className="caption" style={{ fontSize: 64, WebkitTextStroke: "13px var(--ink)", opacity: line, transform: `translateY(${(1 - line) * 30}px)` }}>
          닉네임만 있으면 누구나 참여!
        </div>
        <span
          className="btn"
          style={{ height: 96, fontSize: 44, padding: "0 56px", borderWidth: 5, boxShadow: "0 8px 0 var(--ink), inset 0 3px 0 rgba(255,255,255,.7)", transform: `scale(${btn * pulse})` }}
        >
          지금 바로 플레이 ▶
        </span>
      </div>
    </AbsoluteFill>
  );
};
