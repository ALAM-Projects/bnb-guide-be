// src/shared/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>(); // <--- Aggiungi il tipo qui

    // Usiamo il casting (request as any) solo qui nel decorator per gestire
    // le proprietà dinamiche iniettate da Passport
    const user = (request as any).user;

    return data ? user?.[data] : user;
  },
);
