// API 핸들러 — Vercel 함수(api/*.js)와 로컬 server.js 가 함께 사용
const crypto = require("node:crypto");
const store = require("./store");
const { DIFFS, COUNTS, HttpError, generate } = require("./quiz");

const cleanNick = (s) => String(s || "").trim().slice(0, 12);

function wrap(fn) {
  return async (req, res) => {
    try {
      const out = await fn(req);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(out);
    } catch (e) {
      if (!(e instanceof HttpError)) console.error(e);
      res.status(e.status || 500).json({ error: e instanceof HttpError ? e.message : "서버 오류가 났어요." });
    }
  };
}

const body = (req) => (req.body && typeof req.body === "object" ? req.body : {});

const quizzes = wrap(async (req) => {
  if (req.method !== "GET") throw new HttpError(405, "허용되지 않는 요청이에요.");
  return store.list();
});

const generateQuiz = wrap(async (req) => {
  if (req.method !== "POST") throw new HttpError(405, "허용되지 않는 요청이에요.");
  const b = body(req);
  const topic = String(b.topic || "").trim().slice(0, 30);
  const difficulty = DIFFS.includes(b.difficulty) ? b.difficulty : null;
  const count = COUNTS.includes(Number(b.count)) ? Number(b.count) : null;
  const creator = cleanNick(b.creator);
  if (!topic || !difficulty || !count || !creator) throw new HttpError(400, "닉네임, 문제 유형, 난이도, 문제 개수를 확인해 주세요.");

  const made = await generate(topic, difficulty, count);
  const quiz = { id: crypto.randomUUID(), topic, difficulty, creator, createdAt: Date.now(), ...made };
  await store.add(quiz);
  return { ...quiz, playCount: 0 };
});

const plays = wrap(async (req) => {
  const id = String(req.query.id || "");
  const quiz = /^[\w-]{1,64}$/.test(id) ? await store.get(id) : null;
  if (!quiz) throw new HttpError(404, "퀴즈를 찾을 수 없어요.");
  if (req.method === "GET") return { top: await store.top(id) };
  if (req.method !== "POST") throw new HttpError(405, "허용되지 않는 요청이에요.");

  const b = body(req);
  const total = quiz.questions.length;
  const correct = Math.max(0, Math.min(total, Math.floor(Number(b.correct) || 0)));
  const score = Math.max(0, Math.min(total * 200, Math.floor(Number(b.score) || 0)));
  const play = { id: crypto.randomUUID(), nick: cleanNick(b.nick) || "익명", correct, total, score, at: Date.now() };
  await store.addPlay(id, play);
  return { myId: play.id, top: await store.top(id) };
});

module.exports = { quizzes, generateQuiz, plays };
