// src/common/response/response.service.ts
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success(statusCode = HttpStatus.OK, data?: any, message?: string) {
    const response: any = {
      success: true,
      message,
      statusCode,
    };

    if (data) {
      response.data = data;
    }

    return response;
  }

  error(statusCode = HttpStatus.BAD_REQUEST, message: string) {
    return {
      success: false,
      message,
      statusCode,
    };
  }
}
