import {
  Layout,
  Line,
  Node,
  NodeProps,
  Rect,
  Txt,
  initial,
  signal,
} from "@motion-canvas/2d";
import {
  Color,
  Reference,
  SignalValue,
  SimpleSignal,
  all,
  createRef,
  createSignal,
  waitFor,
} from "@motion-canvas/core";

export interface SlideRuleProps extends NodeProps {
  slidePosition?: SignalValue<number>;
}

const ruleColor = "#eec93e";
const secondaryRuleColor = "#f29748";
const cursorColor = "#bdbebf";
const lineColor = "#2f1b19";
const pointerColor = "#ea449d";

export class SlideRule extends Node {
  @initial(1)
  @signal()
  public declare readonly slidePosition: SimpleSignal<number, this>;

  private readonly cScaleOffset = createSignal(() => {
    if (this.slidePosition() >= 1)
      return 1700 * Math.log10(this.slidePosition());
    return -1700 * (1 - Math.log10(9 + this.slidePosition()));
  });

  private readonly slide = createRef<Rect>();
  private readonly cScale = createRef<Layout>();
  private readonly dScale = createRef<Layout>();
  private readonly l = createRef<Layout>();
  private readonly cursorParts: Reference<Node>[] = [
    createRef<Rect>(),
    createRef<Rect>(),
    createRef<Rect>(),
  ];
  private bodyColor = Color.createSignal(ruleColor);
  private slideColor = Color.createSignal(ruleColor);

  public constructor(props?: SlideRuleProps) {
    super({
      ...props,
    });

    this.add(
      <Layout ref={this.l}>
        <Rect
          x={cdToPosition(8.1)}
          y={-125}
          fill={cursorColor}
          size={[150, 100]}
          radius={20}
          ref={this.cursorParts[0]}
        />
        <Rect
          x={cdToPosition(8.1)}
          y={125}
          fill={cursorColor}
          size={[150, 100]}
          radius={20}
          ref={this.cursorParts[1]}
        />
        <Rect y={-98} fill="#615626" size={[1920, 100]} radius={5}></Rect>
        <Rect y={98} fill="#615626" size={[1920, 100]} radius={5}></Rect>
        <Rect
          y={-100}
          fill={this.bodyColor}
          size={[1920, 100]}
          radius={5}
        ></Rect>
        <Rect
          ref={this.slide}
          fill={this.slideColor}
          size={[1920, 99]}
          x={this.cScaleOffset}
          radius={5}
        >
          <Layout ref={this.cScale} opacity={0}>
            {[...generateCdLines("C", false)]}
          </Layout>
        </Rect>
        <Rect y={100} fill={this.bodyColor} size={[1920, 100]} radius={5}>
          <Layout ref={this.dScale} opacity={0}>
            {[...generateCdLines("D", true)]}
          </Layout>
        </Rect>
        <Rect
          y={-100}
          x={-1920 / 2 + 70 / 2}
          fill={secondaryRuleColor}
          size={[70, 100]}
          radius={5}
        />
        <Rect
          y={100}
          x={-1920 / 2 + 70 / 2}
          fill={secondaryRuleColor}
          size={[70, 100]}
          radius={5}
        />
        <Rect
          x={1920 / 2 - 70 / 2 - 40 / 2}
          fill={secondaryRuleColor}
          size={[30, 110]}
        />
        <Rect
          y={-100}
          x={1920 / 2 - 70 / 2}
          fill={secondaryRuleColor}
          size={[70, 100]}
          radius={5}
        />
        <Rect
          y={100}
          x={1920 / 2 - 70 / 2}
          fill={secondaryRuleColor}
          size={[70, 100]}
          radius={5}
        />
        <Rect
          x={-1920 / 2 + 70 / 2 + 40 / 2}
          fill={secondaryRuleColor}
          size={[30, 110]}
        />
        <Rect
          x={cdToPosition(8.1)}
          fill={cursorColor}
          opacity={0.4}
          size={[150, 350]}
          radius={20}
          ref={this.cursorParts[2]}
        >
          <Line
            stroke={pointerColor}
            lineWidth={1}
            points={[
              [0, -350 / 2],
              [0, 350 / 2],
            ]}
          />
        </Rect>
      </Layout>
    );
  }

  public *highlightBody() {
    const original = this.bodyColor();
    yield* this.bodyColor(this.bodyColor().brighten(0.5), 0.5);
    yield* waitFor(1);
    yield* this.bodyColor(original, 0.5);
  }

  public *highlightSlide() {
    const original = this.slideColor();
    yield* this.slideColor(this.slideColor().brighten(0.5), 0.5);
    yield* this.moveSlide(1.5, 1);
    yield* this.moveSlide(1, 1);
    yield* this.slideColor(original, 0.5);
  }

  public *highlightCursor() {
    yield* all(
      ...this.cursorParts.map((part) => part().x(cdToPosition(2), 1.5))
    );
    yield* waitFor(1);
    yield* all(...this.cursorParts.map((part) => part().opacity(0, 0.5)));
  }

  public *showScales() {
    yield* this.cScale().opacity(1, 1);
    yield* waitFor(0.5);
    yield* this.dScale().opacity(1, 1);
  }

  public *moveSlide(value: number, duration: number, reverse: boolean = false) {
    yield* this.slidePosition(reverse ? value - 9 : value, duration);
  }

  public *focusOn(value: number) {
    yield* all(
      this.l().x(-cdToPosition(value), 1),
      this.l().y(-50, 1),
      this.scale(3.5, 1)
    );
  }

  public *revertFocus() {
    yield* all(this.l().x(0, 1), this.l().y(0, 1), this.scale(0.9, 1));
  }

  public *pointToC(value: number, duration: number) {
    const pos = cdToPosition(value);
    const arrow = (
      <Line
        stroke={pointerColor}
        lineWidth={24}
        points={[
          [0, 0],
          [0, 70],
        ]}
        startArrow
        opacity={0}
        y={100}
        x={() => this.cScaleOffset() + pos}
      />
    );
    this.l().add(arrow);
    yield* all(arrow.y(50, 0.5), arrow.opacity(0.8, 0.5));
    yield* waitFor(duration - 1);
    yield* arrow.opacity(0, 0.5);
    arrow.remove();
  }

  public *pointToD(value: number, duration: number) {
    const pos = cdToPosition(value);
    const arrow = (
      <Line
        stroke={pointerColor}
        lineWidth={24}
        points={[
          [0, 0],
          [0, -70],
        ]}
        startArrow
        opacity={0}
        y={0}
        x={pos}
      />
    );
    this.l().add(arrow);
    yield* all(arrow.y(50, 0.5), arrow.opacity(0.8, 0.5));
    yield* waitFor(duration - 1);
    yield* arrow.opacity(0, 0.5);
    arrow.remove();
  }
}

function* generateCdLines(label: string, flip = false) {
  const factor = flip ? -1 : 1;
  const commonProps = {
    stroke: lineColor,
    lineWidth: 1,
  };
  yield (
    <Txt
      text={label}
      x={cdToPosition(1) - 20}
      fontSize={24}
      y={factor * 30}
      fill={lineColor}
    />
  );
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
      <Txt
        text={whole.toString()[0]}
        x={pos}
        fontSize={20}
        y={factor * 15}
        fill={lineColor}
      />
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
              fill={lineColor}
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
