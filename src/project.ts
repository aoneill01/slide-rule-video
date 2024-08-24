import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import calculations from "./scenes/calculations?scene";

export default makeProject({
  scenes: [intro, calculations],
});
