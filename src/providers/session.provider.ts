import { inject, Provider } from '@loopback/context';
import { Response } from 'express';
import expressSession from 'express-session';

import { SessionBindings } from '../keys';
import { SessionStore } from '../services';
import { SessionFn, SessionRequest } from '../types';


export class SessionProvider implements Provider<SessionFn<SessionRequest>> {
  constructor(
    @inject(SessionBindings.MEMORY) private store: SessionStore<Express.Session>,
    @inject(SessionBindings.OPTIONS.key) private options: expressSession.SessionOptions,
  ) {}

  value() {
    return this.session.bind(this);
  }

  async session(request: SessionRequest, response: Response) {
    const options: expressSession.SessionOptions = {
      ...this.options,
      store: this.store,
    }

    await this.initializeSession(options, request, response);

    return {request, response};
  }

  private initializeSession(
    options: expressSession.SessionOptions,
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
