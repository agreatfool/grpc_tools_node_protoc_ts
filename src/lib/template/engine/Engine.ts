export abstract class TplEngine {
  protected data: unknown;

  protected constructor(data: unknown) {
    this.data = data;
  }

  public abstract render(): string;
}
