import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import calculations from "./scenes/calculations?scene";
import math from "./scenes/math?scene";

import audio from "../public/voice.mp3";

export default makeProject({
  scenes: [intro, calculations, math],
  audio,
});
