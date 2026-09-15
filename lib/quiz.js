// OpenAI 로 퀴즈 생성 — API 키는 환경변수 OPENAI_API_KEY 에서만 읽음
const CATS = ["음악", "영화·드라마", "스포츠", "역사", "과학", "게임", "음식", "지리·여행", "문학·만화", "상식", "기타"];
const DIFFS = ["easy", "normal", "hard"];
const COUNTS = [5, 10, 15, 20];

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function buildPrompt(topic, difficulty, count) {
  const level = {
    easy: "쉬움 — 대부분의 사람이 알 만한 대중적이고 유명한 사실",
    normal: "중간 — 이 주제에 관심 있는 사람이라면 알 만한 내용",
    hard: "어려움 — 매니아나 전문가 수준의 세부 사실",
  }[difficulty];
  return `아래 조건으로 4지선다 객관식 퀴즈를 만들어.

주제: ${JSON.stringify(topic)}
난이도: ${level}
문제 수: 정확히 ${count}개

규칙:
- 모든 문제는 정답이 하나뿐이고, 확실히 검증된 사실만 사용해. 헷갈리거나 시기에 따라 바뀌는 내용은 피해.
- 문제끼리 내용이 겹치지 않게 다양하게 출제해.
- 보기(choices)는 4개, 각 30자 이내로 짧게. 오답도 그럴듯하게.
- answer는 정답 보기의 인덱스(0~3). 정답 위치를 골고루 섞어.
- explain은 정답에 대한 한 문장 해설.
- title은 주제를 짧게 정리한 이름(예: "K-pop", "조선시대 왕"), emoji는 주제를 잘 나타내는 이모지 1개.
- category는 다음 중 하나: ${CATS.join(", ")}
- 주제가 퀴즈로 만들기 부적절하면 {"error": "이유"}만 반환해.

JSON 객체만 반환해. 형식:
{"title":"K-pop","emoji":"🎤","category":"음악","questions":[{"q":"질문","choices":["보기1","보기2","보기3","보기4"],"answer":2,"explain":"해설"}]}`;
}

async function generate(topic, difficulty, count) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new HttpError(500, "서버에 OPENAI_API_KEY 환경변수가 설정되지 않았어요.");
  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "너는 한국어 퀴즈쇼 출제자야. 항상 요청된 JSON 형식으로만 답해." },
        { role: "user", content: buildPrompt(topic, difficulty, count) },
      ],
    }),
    signal: AbortSignal.timeout(150_000),
  });
  if (!res.ok) {
    console.error("OpenAI 오류", res.status, (await res.text()).slice(0, 500));
    throw new HttpError(502, res.status === 401 ? "OpenAI API 키가 올바르지 않아요." :
      res.status === 429 ? "OpenAI 사용량 한도에 걸렸어요. 잠시 후 다시 시도해 주세요." :
      "AI 출제 서버에서 오류가 났어요. 잠시 후 다시 시도해 주세요.");
  }
  const json = await res.json();
  let data;
  try {
    data = JSON.parse(json.choices[0].message.content);
  } catch {
    throw new HttpError(502, "문제 형식이 올바르지 않게 나왔어요. 다시 시도해 주세요.");
  }
  if (data && data.error) throw new HttpError(422, `이 주제로는 퀴즈를 만들 수 없어요: ${data.error}`);

  const questions = Array.isArray(data?.questions) ? data.questions.filter((x) =>
    x && typeof x.q === "string" && Array.isArray(x.choices) && x.choices.length === 4 &&
    Number.isInteger(x.answer) && x.answer >= 0 && x.answer < 4) : [];
  if (questions.length < Math.min(count, 3)) {
    throw new HttpError(502, "문제 형식이 올바르지 않게 나왔어요. 다시 시도하거나 문제 수를 줄여보세요.");
  }
  return {
    title: String(data.title || topic).slice(0, 30),
    emoji: String(data.emoji || "❓").slice(0, 8),
    category: CATS.includes(data.category) ? data.category : "기타",
    questions: questions.slice(0, count).map((x) => ({
      q: String(x.q), choices: x.choices.map((c) => String(c)), answer: x.answer, explain: String(x.explain || ""),
    })),
  };
}

module.exports = { CATS, DIFFS, COUNTS, HttpError, generate };
