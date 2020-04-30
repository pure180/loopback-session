import { Request, Response } from 'express';
import expressSession, { MemoryStore } from 'express-session';
import { CookieSerializeOptions } from 'cookie';
import { juggler } from '@loopback/repository';
import { Constructor } from '@loopback/context';

export interface SessionRequest extends Request {
  secret: string;
  sessionStore: MemoryStore;
}

export type SessionOptions = expressSession.SessionOptions;

export interface SessionFn<Req extends SessionRequest> {
  (request: Req, response: Response): Promise<{
    request: Req;
    response: Response;
  }>;
}

export interface SessionConfig<DataSource extends juggler.DataSource> {
  DataSource: Constructor<DataSource>,
  session: SessionOptions,
  cookie?: CookieSerializeOptions,
}
