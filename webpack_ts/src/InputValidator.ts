import { doAttention } from "./Helper";

export class InputValidator {
  private FROM_MINUS_THREE_TILL_THREE: RegExp = new RegExp(
    /^-?(?:3(?:\.0+)?|[0-2](?:\.[0-9]+)?|\.[0-9]+)$/,
  );
  private xSelector: HTMLInputElement | null;

  private readonly yInput: Element | null;

  constructor() {
    this.xSelector = document.querySelector(".x-select");
    this.yInput = document.getElementById("Y-input");
  }

  validateX(): boolean {
    if (this.getX !== "none") {
      return true;
    } else {
      doAttention("Select X").then();
      return false;
    }
  }

  validateY(): boolean {
    let y: string | undefined = this.getY?.replace(",", ".");
    if (y && this.FROM_MINUS_THREE_TILL_THREE.test(y.toString())) {
      return true;
    } else {
      doAttention("Y between -3 and 3").then();
      return false;
    }
  }

  get getY(): string | undefined {
    if (this.yInput instanceof HTMLInputElement) {
      return this.yInput?.value.replace(",", ".");
    }
  }

  get getX(): string | undefined {
    return this.xSelector?.value;
  }
}
