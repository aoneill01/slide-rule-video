import { Img, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, fadeTransition } from "@motion-canvas/core";
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

  yield* fadeTransition(1);

  yield* all(
    slideRule().scale(0.9, 1),
    slideRule().rotation(0, 1),
    slideRule().x(0, 1),
    slideRule().y(0, 1)
  );
  yield* slideRule().highlightBody();
  yield* slideRule().highlightSlide();
  yield* slideRule().highlightCursor();
  yield* slideRule().showScales();
  //   yield* sequence(1, ...range(10).map((i) => slideRule().pointToC(i + 1, 1)));

  yield* slideRule().focusOn(2.5);
  yield* slideRule().pointToC(2.5, 2);
  yield* slideRule().pointToC(2.18, 2);

  yield* slideRule().focusOn(1.4);
  yield* slideRule().pointToC(1.64, 2);

  yield* slideRule().revertFocus();
  yield* slideRule().moveSlide(2, 1, false);
  yield* slideRule().focusOn(4);
  yield* slideRule().pointToD(4, 2);
  yield* slideRule().focusOn(6);
  yield* slideRule().pointToD(6, 2);
  yield* slideRule().focusOn(5);
  yield* slideRule().pointToD(5, 2);

  yield* slideRule().revertFocus();
  yield* slideRule().moveSlide(3, 1, false);
  yield* all(slideRule().pointToD(6, 2), slideRule().pointToD(9, 2));

  // 2.6 * 3.5
  yield* slideRule().moveSlide(1, 1);
  yield* slideRule().moveSlide(2.6, 1);
  yield* slideRule().pointToD(2.6, 2);
  yield* slideRule().focusOn(9.1);
  yield* slideRule().pointToD(9.1, 2);

  // 4.4 * 3.1
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 1));
  yield* slideRule().moveSlide(4.4, 1);
  yield* slideRule().pointToD(4.4, 2);
  yield* slideRule().x(-200, 1);
  yield* slideRule().pointToC(3.1, 2);
  yield* slideRule().x(0, 1);
  yield* slideRule().moveSlide(4.4, 1, true);
  yield* slideRule().pointToD(4.4, 2);
  yield* slideRule().focusOn(1.4);
  yield* slideRule().pointToD(1.364, 2);

  // 1240 * 37
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 1));
  yield* slideRule().moveSlide(1.24, 1);
  yield* slideRule().pointToD(1.24, 2);
  yield* slideRule().focusOn(4.6);
  yield* slideRule().pointToD(4.588, 2);

  // 6 / 2
  yield* all(slideRule().revertFocus(), slideRule().moveSlide(1, 1));
  yield* slideRule().moveSlide(3, 1);
  yield* slideRule().pointToD(6, 2);
  yield* slideRule().pointToD(3, 2);
});
