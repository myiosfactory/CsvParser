export class AppResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;


  constructor(
    success: boolean,
    message: string = "Success",
    data: T,
  ) {
    this.success = true
    this.message = message,
    this.data = data
  }

  static send<T>(
    res: import("express").Response,
    statusCode: number,
    message: string = "Success",
    data: T
  ): void {
    const body = new AppResponse(true, message, data);
    res.status(statusCode).json(body);
  }
}
