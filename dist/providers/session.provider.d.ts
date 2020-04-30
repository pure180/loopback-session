import { Provider } from '@loopback/context';
import { Response } from 'express';
import expressSession from 'express-session';
import { SessionStore } from '../services';
import { SessionFn, SessionRequest } from '../types';
export declare class SessionProvider implements Provider<SessionFn<SessionRequest>> {
    private store;
    private options;
    constructor(store: SessionStore<Express.Session>, options: expressSession.SessionOptions);
    value(): (request: SessionRequest, response: Response<any>) => Promise<{
        request: SessionRequest;
        response: Response<any>;
    }>;
    session(request: SessionRequest, response: Response): Promise<{
        request: SessionRequest;
        response: Response<any>;
    }>;
    private initializeSession;
}
