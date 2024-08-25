import {
  Img,
  Latex,
  Layout,
  Line,
  Txt,
  is,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  all,
  createRef,
  fadeTransition,
  range,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import background from "../../public/background-plain.svg";
import { colorScheme } from "../colorScheme";

export default makeScene2D(function* (view) {
  const numberLine = createRef<Layout>();
  const a = createRef<Layout>();
  const b = createRef<Layout>();
  const eq1 = createRef<Latex>();
  const eq2 = createRef<Latex>();
  const numberLineColor = colorScheme.white;

  view.add(
    <>
      <Img src={background} />
      <Layout ref={numberLine}>
        <Line
          points={[
            [toPosition(0) - 8, 0],
            [toPosition(1) + 8, 0],
          ]}
          lineWidth={16}
          stroke={numberLineColor}
        />
        <Line
          x={toPosition(0)}
          points={[
            [0, -50],
            [0, 0],
          ]}
          lineWidth={16}
          stroke={numberLineColor}
        />
        <Line
          x={toPosition(1)}
          points={[
            [0, -50],
            [0, 0],
          ]}
          lineWidth={16}
          stroke={numberLineColor}
        />
        <Txt
          fill={numberLineColor}
          text="0"
          x={toPosition(0)}
          y={-90}
          fontSize={72}
        />
        <Txt
          fill={numberLineColor}
          text="1"
          x={toPosition(1)}
          y={-90}
          fontSize={72}
        />
      </Layout>
      <Layout x={toPosition(0)} y={220} ref={a} opacity={0}>
        <Line
          points={[
            [0, 0],
            [1600 * Math.log10(2), 0],
          ]}
          lineWidth={32}
          stroke={colorScheme.orange}
        />
        <Txt
          fill={colorScheme.orange}
          text="log(2)"
          y={50}
          x={70}
          fontSize={48}
        />
      </Layout>
      <Layout x={toPosition(0)} y={350} ref={b} opacity={0}>
        <Line
          points={[
            [0, 0],
            [1600 * Math.log10(3), 0],
          ]}
          lineWidth={32}
          stroke={colorScheme.yellow}
        />
        <Txt
          fill={colorScheme.yellow}
          text="log(3)"
          y={50}
          x={70}
          fontSize={48}
        />
      </Layout>
      <Latex
        tex="log(x) + log(y) = log(x \cdot y)"
        fill={colorScheme.white}
        fontSize={92}
        y={-400}
        opacity={0}
        ref={eq1}
      />
      <Latex
        tex="log(x) - log(y) = log(\frac{x}{y})"
        fill={colorScheme.white}
        fontSize={92}
        y={-200}
        opacity={0}
        ref={eq2}
      />
    </>
  );

  const logMarkings = range(10).map((value) => (
    <Layout x={toPosition(value / 9)}>
      <Line
        points={[
          [0, 50],
          [0, 0],
        ]}
        lineWidth={16}
        stroke={numberLineColor}
      />
      <Txt
        fill={numberLineColor}
        text={`log(${value + 1})`}
        y={120}
        x={40}
        fontSize={48}
        rotation={45}
        opacity={0}
      />
    </Layout>
  ));

  logMarkings.forEach((marking) => numberLine().add(marking));
  yield* fadeTransition(1);

  yield* waitUntil("eq1");
  yield* eq1().opacity(1, 0.5);

  yield* waitUntil("number-line");
  yield* all(
    ...logMarkings.map((layout, i) =>
      layout.x(toPosition(Math.log10(i + 1)), 1)
    )
  );

  yield* sequence(
    0.2,
    ...logMarkings.map((layout) => layout.findFirst(is(Txt)).opacity(1, 1))
  );

  yield* waitUntil("add-a-b");
  yield* sequence(0.2, ...[a, b].map((value) => value().opacity(1, 1)));
  yield* all(b().x(toPosition(Math.log10(2)), 2), b().y(220, 2));

  yield* waitUntil("eq2");
  yield* eq2().opacity(1, 0.5);

  yield* waitUntil("math-done");
});

function toPosition(x: number): number {
  return 1600 * (x - 0.5);
}
