import {
  Line,
  Node,
  NodeProps,
  Rect,
  Txt,
  initial,
  signal,
} from "@motion-canvas/2d";
import {
  SignalValue,
  SimpleSignal,
  all,
  createRef,
  waitFor,
} from "@motion-canvas/core";

export interface SlideRuleProps extends NodeProps {
  slidePosition?: SignalValue<number>;
}

export class SlideRule extends Node {
  @initial(0)
  @signal()
  public declare readonly slidePosition: SimpleSignal<number, this>;

  private readonly slide = createRef<Rect>();

  public constructor(props?: SlideRuleProps) {
    super({
      ...props,
    });

    this.add(
      <>
        <Rect x={500} y={-125} fill="#bdbebf" size={[150, 100]} radius={20} />
        <Rect x={500} y={125} fill="#bdbebf" size={[150, 100]} radius={20} />
        <Rect y={-98} fill="#615626" size={[1920, 100]} radius={5}></Rect>
        <Rect y={98} fill="#615626" size={[1920, 100]} radius={5}></Rect>
        <Rect y={-100} fill="#ffe369" size={[1920, 100]} radius={5}></Rect>
        <Rect ref={this.slide} fill="#ffe369" size={[1920, 99]} radius={5}>
          {[...generateCdLines()]}
        </Rect>
        <Rect y={100} fill="#ffe369" size={[1920, 100]} radius={5}>
          {[...generateCdLines(true)]}
        </Rect>
        <Rect
          y={-100}
          x={-1920 / 2 + 70 / 2}
          fill="#bdbebf"
          size={[70, 100]}
          radius={5}
        />
        <Rect
          y={100}
          x={-1920 / 2 + 70 / 2}
          fill="#bdbebf"
          size={[70, 100]}
          radius={5}
        />
        <Rect x={1920 / 2 - 70 / 2 - 40 / 2} fill="#bdbebf" size={[30, 110]} />
        <Rect
          y={-100}
          x={1920 / 2 - 70 / 2}
          fill="#bdbebf"
          size={[70, 100]}
          radius={5}
        />
        <Rect
          y={100}
          x={1920 / 2 - 70 / 2}
          fill="#bdbebf"
          size={[70, 100]}
          radius={5}
        />
        <Rect x={-1920 / 2 + 70 / 2 + 40 / 2} fill="#bdbebf" size={[30, 110]} />
        <Rect
          x={500}
          fill="#bdbebf"
          opacity={0.4}
          size={[150, 350]}
          radius={20}
        >
          <Line
            stroke="red"
            lineWidth={1}
            points={[
              [0, -350 / 2],
              [0, 350 / 2],
            ]}
          />
        </Rect>
      </>
    );
  }

  public *moveSlide(value: number, duration: number) {
    yield* this.slide().x(1700 * Math.log10(value), duration);
  }

  public *pointTo(value: number, duration: number) {
    const pos = cdToPosition(value);
    const arrow = (
      <Line
        stroke="black"
        lineWidth={24}
        points={[
          [0, 0],
          [0, 70],
        ]}
        startArrow
        opacity={0}
        y={100}
        x={pos}
      />
    );
    this.add(arrow);
    yield* all(arrow.y(50, 0.5), arrow.opacity(0.5, 0.5));
    yield* waitFor(duration - 1);
    yield* arrow.opacity(0, 0.5);
    arrow.remove();
  }
}

function* generateCdLines(flip = false) {
  const factor = flip ? -1 : 1;
  const commonProps = {
    stroke: "black",
    lineWidth: 1,
  };
  for (let whole = 1; whole <= 10; whole++) {
    let pos = cdToPosition(whole);
    yield (
      <Line
        {...commonProps}
        points={[
          [pos, factor * 50],
          [pos, factor * 25],
        ]}
      />
    );
    yield (
      <Txt text={whole.toString()[0]} x={pos} fontSize={20} y={factor * 15} />
    );
    if (whole === 1) {
      for (let i = 1; i < 100; i++) {
        pos = cdToPosition(whole + i / 100);
        let height = 10;
        if (i % 5 === 0) height = 15;
        if (i % 10 === 0) height = 20;
        yield (
          <Line
            {...commonProps}
            points={[
              [pos, factor * 50],
              [pos, factor * (50 - height)],
            ]}
          />
        );
        if (i % 10 === 0) {
          yield (
            <Txt
              text={(i / 10).toString()}
              x={pos}
              y={factor * 20}
              fontSize={15}
            />
          );
        }
      }
    } else if (whole === 2 || whole === 3) {
      for (let i = 1; i < 50; i++) {
        pos = cdToPosition(whole + i / 50);
        let height = 10;
        if (i % 5 === 0) height = 15;
        if (i % 25 === 0) height = 20;
        yield (
          <Line
            {...commonProps}
            points={[
              [pos, factor * 50],
              [pos, factor * (50 - height)],
            ]}
          />
        );
      }
    } else if (whole < 10) {
      for (let i = 1; i < 20; i++) {
        pos = cdToPosition(whole + i / 20);
        let height = 10;
        if (i % 2 === 0) height = 15;
        if (i % 10 === 0) height = 20;
        yield (
          <Line
            {...commonProps}
            points={[
              [pos, factor * 50],
              [pos, factor * (50 - height)],
            ]}
          />
        );
      }
    }
  }
}

const cdToPosition = (value: number) => 1700 * (Math.log10(value) - 0.5);
