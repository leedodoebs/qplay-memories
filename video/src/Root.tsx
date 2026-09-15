import { Composition } from "remotion";
import { QplayIntro, TOTAL } from "./QplayIntro";

export const Root = () => (
  <Composition id="QplayIntro" component={QplayIntro} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
