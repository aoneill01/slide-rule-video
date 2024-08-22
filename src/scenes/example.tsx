import { Circle, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { Switch } from "../switch";
import { SlideRule } from "../components/slideRule";

export default makeScene2D(function* (view) {
  // Create your animations here

  const slideRule = createRef<SlideRule>();

  view.add(<SlideRule ref={slideRule} scale={1} />);

  yield* slideRule().moveSlide(2, 2);
  yield* waitFor(1);
  yield* all(slideRule().moveSlide(3, 2), slideRule().scale(4, 2));
  yield* waitFor(1);
  yield* all(slideRule().moveSlide(1, 2), slideRule().scale(1, 2));
  yield* waitUntil("1");
  yield* sequence(
    1,
    ...range(10).map((i) => slideRule().pointTo(i + 1, 12 - i))
    // slideRule().pointTo(3, 2),
    // slideRule().pointTo(4, 2),
    // slideRule().pointTo(5, 2)
  );
  // yield* slideRule().pointTo(3, 2);
  // yield* all(slideRule().x(-1000, 3), slideRule().scale(2, 2));
  // yield* all(slideRule().x(1000, 3), slideRule().scale(1, 2));
  // yield* slideRule().x(0, 3);
  // yield* switchRef().toggle(2);
  // yield* switchRef().toggle(2);
});
