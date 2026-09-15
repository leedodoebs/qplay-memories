import { AbsoluteFill, Sequence } from "remotion";
import { Scene, Sky } from "./components";
import { Create, Opening, Outro, Play, Result, Tagline } from "./scenes";
import { css } from "./styles";

const SCENES = [
  { name: "오프닝", C: Opening, dur: 120 },
  { name: "한 줄 소개", C: Tagline, dur: 120 },
  { name: "퀴즈 출제", C: Create, dur: 210 },
  { name: "문제 풀기", C: Play, dur: 210 },
  { name: "결과", C: Result, dur: 140 },
  { name: "마무리", C: Outro, dur: 100 },
];

export const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0);

export const QplayIntro = () => {
  let from = 0;
  return (
    <AbsoluteFill className="stage">
      <style>{css}</style>
      <Sky />
      {SCENES.map(({ name, C, dur }, i) => {
        const seq = (
          <Sequence key={name} name={name} from={from} durationInFrames={dur}>
            <Scene out={i < SCENES.length - 1}>
              <C />
            </Scene>
          </Sequence>
        );
        from += dur;
        return seq;
      })}
    </AbsoluteFill>
  );
};
