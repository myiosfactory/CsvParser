export class NotAnIbStatementError extends Error {
  constructor(message = "Not an IB Activity Statement") {
    super(message);
    this.name = "NotAnIbStatementError";
  }
}
