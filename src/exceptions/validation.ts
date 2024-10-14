import { ErrorCode, HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
  constructor(message: string, errorCode: ErrorCode, error: any) {
    super(message, errorCode, 422, error);
  }
}
