import { Img, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  fadeTransition,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { SlideRule } from "../components/slideRule";

import background from "../../public/background-plain.svg";

export default makeScene2D(function* (view) {
  const slideRule = createRef<SlideRule>();

  view.add(
    <>
      <Img src={background} />
      <SlideRule ref={slideRule} scale={0.4} rotation={27.8} x={60} y={-60} />
    </>
  );

  yield* fadeTransition(2);

  // Center rule
  yield* all(
    slideRule().scale(0.9, 2),
    slideRule().rotation(0, 2),
    slideRule().x(0, 2),
    slideRule().y(0, 2)
  );

  // Identify parts
  yield* waitUntil("body");
  yield* slideRule().highlightBody();
  yield* waitUntil("slide");
  yield* slideRule().highlightSlide();
  yield* waitUntil("scales");
  yield* slideRule().showScales();
  yield* waitUntil("cursor");
  yield* slideRule().highlightCursor();

  // Point to scales
  yield* waitUntil("scales-1");
  yield slideRule().pointToC(1, 2);
  yield* waitUntil("scales-2");
  yield slideRule().pointToC(2, 2);
  yield* waitUntil("scales-3");
  yield slideRule().pointToC(3, 2);
  yield* waitUntil("scales-4");
  yield slideRule().pointToC(4, 2);
  yield* waitUntil("scales-5");
  yield slideRule().pointToC(5, 2);
  yield* waitUntil("scales-6");
  yield slideRule().pointToC(6, 2);
  yield* waitUntil("scales-7");
  yield slideRule().pointToC(7, 2);
  yield* waitUntil("scales-8");
  yield slideRule().pointToC(8, 2);
  yield* waitUntil("scales-9");
  yield slideRule().pointToC(9, 2);
  yield* waitUntil("scales-10");
  yield* slideRule().pointToC(10, 2);

  yield* slideRule().focusOn(2.5);
  yield* waitUntil("scales-2.5");
  yield* slideRule().pointToC(2.5, 2);
  yield* waitUntil("scales-tenths");
  yield* sequence(
    0.5,
    ...range(5).map((i) => slideRule().pointToC(2 + 0.1 * (i + 1), 3))
  );
  yield* waitUntil("scales-2.18");
  yield* slideRule().pointToC(2.18, 3);

  yield* slideRule().focusOn(1.4);
  yield* waitUntil("scales-1.64");
  yield* slideRule().pointToC(1.64, 3);

  yield* waitUntil("calc-1-1");
  yield* slideRule().revertFocus();
  yield* waitUntil("calc-1-2");
  yield* all(
    slideRule().pointToD(2, 4),
    chain(waitFor(1), slideRule().moveSlide(2, 1, false))
  );
  yield* waitUntil("calc-1-3");
  yield* slideRule().focusOn(4);
  yield* slideRule().pointToD(4, 2);
  yield* waitUntil("calc-1-4");
  yield* slideRule().focusOn(6);
  yield* slideRule().pointToD(6, 1);
  yield* waitUntil("calc-1-5");
  yield* slideRule().focusOn(8);
  yield* slideRule().pointToD(8, 2);
  yield* waitUntil("calc-1-6");
  yield* slideRule().focusOn(5);
  yield* slideRule().pointToD(5, 4);

  yield* waitUntil("calc-2-1");
  yield* slideRule().revertFocus();
  yield* slideRule().moveSlide(3, 1, false);
  yield* waitUntil("calc-2-2");
  yield* sequence(0.5, slideRule().pointToD(6, 2), slideRule().pointToD(9, 2));

  // 2.6 * 3.5
  yield* waitUntil("calc-3-1");
  yield* slideRule().moveSlide(1, 3);
  yield* waitUntil("calc-3-2");
  yield* all(
    slideRule().pointToD(2.6, 4),
    chain(waitFor(1), slideRule().moveSlide(2.6, 1))
  );
  yield* waitUntil("calc-3-3");
  yield* slideRule().focusOn(9.1);
  yield* slideRule().pointToD(9.1, 6);

  // 4.4 * 3.1
  yield* waitUntil("calc-4-1");
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 3));
  yield* waitUntil("calc-4-2");
  yield* slideRule().moveSlide(4.4, 1);
  yield* slideRule().pointToD(4.4, 2);
  yield* slideRule().moveSlide(4.4, 1);
  yield* waitUntil("calc-4-3");
  yield* slideRule().x(-200, 1);
  yield* slideRule().pointToC(3.1, 2);
  yield* waitUntil("calc-4-4");
  yield* slideRule().x(0, 1);
  yield slideRule().pointToD(4.4, 4);
  yield* slideRule().moveSlide(4.4, 1, true);
  yield* waitUntil("calc-4-5");
  yield* slideRule().focusOn(1.4);
  yield* slideRule().pointToD(1.364, 10);

  // 1240 * 37
  yield* waitUntil("calc-5-1");
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 3));
  yield* waitUntil("calc-5-2");
  yield* all(
    slideRule().pointToD(1.24, 4),
    chain(waitFor(1), slideRule().moveSlide(1.24, 1))
  );
  yield* waitUntil("calc-5-3");
  yield* slideRule().focusOn(4.6);
  yield* slideRule().pointToD(4.588, 12);

  // 6 / 2
  yield* waitUntil("calc-6-1");
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 2));
  yield* waitUntil("calc-6-2");
  yield* all(
    slideRule().pointToD(6, 2),
    chain(waitFor(1), slideRule().moveSlide(3, 1))
  );
  yield* waitUntil("calc-6-3");
  yield* slideRule().pointToD(3, 6);

  yield* waitUntil("calc-done");
});
