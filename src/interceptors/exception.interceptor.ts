import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundError) {
          return throwError(() => new NotFoundException());
        }
        if (
          err.message ===
          'Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer'
        ) {
          return throwError(() => new BadRequestException('Invalid Id'));
        }
        return throwError(() => err);
      }),
    );
  }
}
