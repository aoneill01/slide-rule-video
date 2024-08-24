import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import calculations from "./scenes/calculations?scene";
import math from "./scenes/math?scene";

export default makeProject({
  scenes: [intro, calculations, math],
});
