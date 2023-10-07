export class Graph {
  private SIZE: number = 300;
  private LINE_WIDTH: number = 1;
  private TEXT_SIZE: number = 16;
  private TEXT_MARGIN: number = 15;
  private TEXT_LINE_HEIGHT: number = 3;
  private COLOR_RED: string = "#D18189";
  private COLOR_GREEN: string = "#87C67A";
  private canvas: HTMLElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById("graph") as HTMLCanvasElement;
    this.ctx = (this.canvas as HTMLCanvasElement).getContext("2d");
    this.ctx.font = `${this.TEXT_SIZE}px Soyuz Grotesk`;
  }

  redrawAll(r: number) {
    this.ctx.clearRect(0, 0, this.SIZE, this.SIZE);
    this.drawGraph(r);
    this.drawAxes();
    this.setPointerAtDot(3);
    this.setPointerAtDot(1);
  }

  drawAxes(): void {
    this.ctx.fillStyle = "black";
    this.drawArrow(-this.SIZE, this.SIZE / 2, this.SIZE, this.SIZE / 2);
    this.drawArrow(this.SIZE / 2, this.SIZE, this.SIZE / 2, 0);
  }

  drawGraph(r: number): void {
    const totalPoints: number = 7;
    const pointInPixels: number = this.SIZE / totalPoints;
    this.ctx.fillStyle = "#81BECE";
    this.ctx.beginPath();
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels);
    this.ctx.lineTo(
      this.SIZE / 2 - r * pointInPixels,
      this.SIZE / 2 - r * pointInPixels,
    );
    this.ctx.lineTo(this.SIZE / 2 - r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 + (r / 2) * pointInPixels);
    this.ctx.lineTo(this.SIZE / 2 - r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(
      this.SIZE / 2,
      this.SIZE / 2,
      r * pointInPixels,
      (Math.PI * 3) / 2,
      0,
    );
    this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels);
    this.ctx.lineTo(this.SIZE / 2 + r * pointInPixels, this.SIZE / 2);
    this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
    this.ctx.fill();
  }

  setPointerAtDot(max_r: number = 3): void {
    const totalPoints: number = 7;
    const pointInPixels: number = this.SIZE / totalPoints;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      `${max_r}`,
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 - this.TEXT_MARGIN,
    );
    this.ctx.fillText(
      `${max_r}`,
      this.SIZE / 2 + this.TEXT_MARGIN,
      this.SIZE / 2 - pointInPixels * max_r,
    );

    this.ctx.beginPath();
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.moveTo(
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 + this.TEXT_LINE_HEIGHT,
    );
    this.ctx.lineTo(
      this.SIZE / 2 + pointInPixels * max_r,
      this.SIZE / 2 - this.TEXT_LINE_HEIGHT,
    );
    this.ctx.moveTo(
      this.SIZE / 2 + this.TEXT_LINE_HEIGHT,
      this.SIZE / 2 - pointInPixels * max_r,
    );
    this.ctx.lineTo(
      this.SIZE / 2 - this.TEXT_LINE_HEIGHT,
      this.SIZE / 2 - pointInPixels * max_r,
    );
    this.ctx.stroke();
  }

  drawArrow(fromX: number, fromY: number, toX: number, toY: number): void {
    const headLength: number = 10;
    const dx: number = toX - fromX;
    const dy: number = toY - fromY;
    const angle: number = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6),
    );
    this.ctx.stroke();
  }

  drawPoint(x: number, y: number, success: boolean): void {
    if (success) {
      this.ctx.fillStyle = this.COLOR_GREEN;
    } else {
      this.ctx.fillStyle = this.COLOR_RED;
    }
    const totalPoints: number = 7;
    const pointInPixels: number = this.SIZE / totalPoints;
    this.ctx.beginPath();
    this.ctx.arc(
      this.SIZE / 2 + pointInPixels * x,
      this.SIZE / 2 - y * pointInPixels,
      3,
      0,
      Math.PI * 2,
    );
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.arc(
      this.SIZE / 2 + pointInPixels * x,
      this.SIZE / 2 - y * pointInPixels,
      3,
      0,
      Math.PI * 2,
    );
    this.ctx.stroke();
  }
}
