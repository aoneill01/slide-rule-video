import { Camera, Circle, Img, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  createRef,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import frame1 from "../../public/1.jpg";
import frame2 from "../../public/2.jpg";
import frame3 from "../../public/3.jpg";
import frame4 from "../../public/4.jpg";
import frame5 from "../../public/5.jpg";
import frame6 from "../../public/6.jpg";

const frames = [frame2, frame3, frame4, frame5, frame6];

export default makeScene2D(function* (view) {
  const img = createRef<Img>();

  view.add(<Img src={frame1} ref={img} />);

  img().scale(0.9).x(70).y(140).rotation(2);

  yield* all(img().scale(0.4, 1), img().y(0, 1));

  for (const frame of frames) {
    img().src(frame);
    yield* waitFor(0.2);
  }

  yield* waitFor(1);
});
