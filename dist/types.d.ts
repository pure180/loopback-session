import { Request, Response } from 'express';
import expressSession, { MemoryStore } from 'express-session';
export interface SessionRequest extends Request {
    secret: string;
    sessionStore: MemoryStore;
}
export declare type SessionOptions = expressSession.SessionOptions;
export interface SessionFn<Req extends SessionRequest> {
    (request: Req, response: Response): Promise<{
        request: Req;
        response: Response;
    }>;
}
