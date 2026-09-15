// 보관함 저장소 — Vercel 에서는 Upstash Redis, 로컬(환경변수 없음)에서는 data/quizzes.json
const fs = require("node:fs/promises");
const path = require("node:path");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const byScore = (a, b) => b.score - a.score || a.at - b.at;

function redisStore() {
  const { Redis } = require("@upstash/redis");
  const redis = new Redis({ url: redisUrl, token: redisToken });
  const QUIZZES = "qplay:quizzes";
  const plays = (id) => `qplay:plays:${id}`;

  return {
    async list() {
      const all = (await redis.hvals(QUIZZES)) || [];
      if (!all.length) return [];
      const p = redis.pipeline();
      all.forEach((q) => p.llen(plays(q.id)));
      const counts = await p.exec();
      return all.map((q, i) => ({ ...q, playCount: Number(counts[i]) || 0 }))
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    async get(id) {
      return redis.hget(QUIZZES, id);
    },
    async add(quiz) {
      await redis.hset(QUIZZES, { [quiz.id]: quiz });
    },
    async addPlay(id, play) {
      await redis.rpush(plays(id), play);
    },
    async top(id) {
      const rows = (await redis.lrange(plays(id), 0, -1)) || [];
      return rows.sort(byScore).slice(0, 10);
    },
  };
}

function fileStore() {
  const FILE = path.join(__dirname, "..", "data", "quizzes.json");
  let cache = null;
  let chain = Promise.resolve();
  const load = async () => {
    if (!cache) {
      try { cache = JSON.parse(await fs.readFile(FILE, "utf8")); } catch { cache = []; }
    }
    return cache;
  };
  const save = () => (chain = chain.then(async () => {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE + ".tmp", JSON.stringify(cache, null, 1));
    await fs.rename(FILE + ".tmp", FILE);
  }));

  return {
    async list() {
      return (await load()).map(({ plays, ...q }) => ({ ...q, playCount: plays.length }))
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    async get(id) {
      const q = (await load()).find((x) => x.id === id);
      if (!q) return null;
      const { plays, ...rest } = q;
      return rest;
    },
    async add(quiz) {
      (await load()).push({ ...quiz, plays: [] });
      await save();
    },
    async addPlay(id, play) {
      (await load()).find((x) => x.id === id).plays.push(play);
      await save();
    },
    async top(id) {
      const q = (await load()).find((x) => x.id === id);
      return q ? [...q.plays].sort(byScore).slice(0, 10) : [];
    },
  };
}

module.exports = redisUrl && redisToken ? redisStore() : fileStore();
