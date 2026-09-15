// 로컬 실행용 서버 — Vercel 에서는 public/ 과 api/*.js 가 대신 쓰임
// 실행: npm start  (.env 의 OPENAI_API_KEY 사용)
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const handlers = require("./lib/handlers");

const PORT = Number(process.env.PORT) || 3000;
const routes = { "/api/quizzes": handlers.quizzes, "/api/generate": handlers.generateQuiz, "/api/plays": handlers.plays };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const handler = routes[url.pathname];

  if (!handler) {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(await fs.readFile(path.join(__dirname, "public", "index.html")));
    }
    res.writeHead(404);
    return res.end();
  }

  // Vercel 함수와 같은 req.query / req.body / res.status().json() 형태로 맞춤
  let raw = "";
  for await (const chunk of req) raw += chunk;
  try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
  req.query = Object.fromEntries(url.searchParams);
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(obj)); };
  handler(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n추억의 큐플레이 실행 중 (모델: ${process.env.OPENAI_MODEL || "gpt-5.6-luna"})`);
  console.log(`  이 컴퓨터:   http://localhost:${PORT}`);
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === "IPv4" && !a.internal) console.log(`  같은 와이파이: http://${a.address}:${PORT}`);
  }
});
