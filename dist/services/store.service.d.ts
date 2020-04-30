/// <reference types="express-session" />
/// <reference types="express-serve-static-core" />
/// <reference types="node" />
import { CookieSerializeOptions } from 'cookie';
import { EventEmitter } from 'events';
import { SessionRepository } from '../repositories';
declare type SessionStoreSession<SessionData extends Express.SessionData> = {
    [key: string]: SessionData | string;
};
/**
 *
 */
export declare class SessionStore<SessionData extends Express.SessionData> extends EventEmitter {
    protected sessionRepository: SessionRepository;
    private options;
    sessions: SessionStoreSession<SessionData>;
    /**
     *
     * @param sessionRepository
     */
    constructor(sessionRepository: SessionRepository, options: CookieSerializeOptions);
    /**
     *
     * @param callback
     */
    all(callback: (err: any, obj?: {
        [sid: string]: Express.SessionData;
    } | null) => void): void;
    clear(callback?: (...args: unknown[]) => void): void;
    createSession(request: Express.Request, session: Express.SessionData): Express.Session | undefined;
    destroy(sessionId: string, callback?: (err: any) => void): void;
    get(sessionId: string, callback: (error: any, session?: SessionData) => void): void;
    length(callback: (err: any, count?: number) => void): void;
    load(sessionId: string, callback: (error?: any, session?: Express.SessionData | null) => any): void;
    set(sessionID: string, sessionData: Express.SessionData, callback?: (err?: any) => void): void;
    touch(sessionId: string, session: Express.SessionData, callback?: (err?: any) => void): void;
    private getSession;
}
export {};
