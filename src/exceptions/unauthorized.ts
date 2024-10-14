import { ErrorCode, HttpException } from "./root";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, error?: any) {
    super(message, errorCode, 401, error);
  }
}
