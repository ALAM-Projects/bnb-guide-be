import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Method } from '../types/method.types';

export function ApiAction(
  method: Method,
  tag: string,
  path: string,
  operationId?: string | null,
) {
  const methodDecorator = (method: Method): MethodDecorator | null => {
    return method === 'post'
      ? Post(path)
      : method === 'get'
        ? Get(path)
        : method === 'put'
          ? Put(path)
          : method === 'delete'
            ? Delete(path)
            : method === 'patch'
              ? Patch(path)
              : null;
  };

  const finalOperationId = () => {
    if (operationId) {
      return { operationId };
    }
    return { operationId: path };
  };

  return applyDecorators(
    ApiTags(tag),
    methodDecorator(method)!,
    HttpCode(HttpStatus.OK),
    ApiOperation(finalOperationId()),
  );
}
