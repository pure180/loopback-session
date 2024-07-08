import { inject, Provider } from '@loopback/context';
import { Response } from 'express';
import expressSession, { Session, SessionOptions } from 'express-session';

import { SessionBindings } from '../keys';
import { SessionStore } from '../services';
import { SessionFn, SessionRequest } from '../types';
import session from 'express-session';


export class SessionProvider implements Provider<SessionFn<SessionRequest>> {
  constructor(
    @inject(SessionBindings.OPTIONS.key) private options: SessionOptions,
  ) {}

  value() {
    return this.session.bind(this);
  }

  async session(request: SessionRequest, response: Response) {
    const options = {
      ...this.options,
      store: new session.MemoryStore(),
    }

    await this.initializeSession(options, request, response);

    return {request, response};
  }

  private initializeSession(
    options: SessionOptions,
    request: SessionRequest,
    response: Response,
  ): Promise<{
    request: SessionRequest;
    response: Response;
  }> {
    return new Promise((resolve) => {
      expressSession(options)(request, response, () => {
        resolve({
          request,
          response
        });
      });
    });
  }
}
