/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-spread */
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { CookieSerializeOptions } from 'cookie';
import debugFactory from 'debug';
import { EventEmitter } from 'events';
import { parse, stringify } from 'flatted';

import { SessionBindings } from '../keys';
import { Session as SessionModel } from '../models';
import { SessionRepository } from '../repositories';
import { SessionRequest } from '../types';

const debug = debugFactory('loopback:session');

const Cookie = require('express-session/session/cookie');
const Session = require('express-session/session/session');

const defer = typeof setImmediate === 'function'
  ? setImmediate
  // eslint-disable-next-line prefer-rest-params
  : function(fn: Function){ process.nextTick(fn.bind.apply(fn, arguments as any)) }

type SessionStoreSession<SessionData extends Express.SessionData> = {[key: string]: SessionData | string}

/**
 *
 */
export class SessionStore<SessionData extends Express.SessionData> extends EventEmitter {
  // Object that holds the current session
  sessions: SessionStoreSession<SessionData>;

  /**
   *
   * @param sessionRepository
   */
  constructor(
    @repository(SessionRepository) protected sessionRepository: SessionRepository,
    @inject(SessionBindings.COOKIE_OPTIONS.key) private options: CookieSerializeOptions,
  ) {
    // Call EventEmitter
    super();

    // Init the default session Object
    this.sessions = {};
  }

  /**
   *
   * @param callback
   */
  public all (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) {
    debug('"Store": All')
    const sessionIds = Object.keys(this.sessions);
    const sessions = Object.create(null);

    const forEachSession = async (sessionId: string) => {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions[sessionId] = session as SessionData;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    sessionIds.forEach(async (sessionId) => forEachSession(sessionId));

    if (callback) {
      defer(callback, null, sessions)
    }
  }

  public clear (callback?: (...args: unknown[]) => void) {
    debug('"Store": clear')
    this.sessions = {};
    if (callback) {
      defer(callback);
    }
  }

  public createSession (
    request: Express.Request,
    session: Express.SessionData
  ): Express.Session | undefined {
    debug('"Store": createSession')
    const expires = session.cookie.expires
    const originalMaxAge = session.cookie.originalMaxAge

    session.cookie = new Cookie(this.options || session.cookie);

    if (typeof expires === 'string') {
      session.cookie.expires = new Date(expires);
    }

    session.cookie.originalMaxAge = originalMaxAge;

    request.session = new Session(request, session);

    return request.session;
  };

  public destroy(sessionId: string, callback: (err: any) => void = () => {}) {
    debug('"Store": destroy');
    this.sessionRepository.exists(sessionId)
      .then(exist => {
        if (!exist) {
          defer(callback);
          return;
        }
        return this.sessionRepository.deleteById(sessionId);
      })
      .then(() => {
        delete this.sessions[sessionId];
      })
      .catch(err => {
        throw new HttpErrors.BadRequest('Destroying session Failed');
      })
      .finally(() => defer(callback));
  }

  public get (sessionId: string, callback: (error: any, session?: SessionData) => void) {
    debug('"Store": get')
    this.getSession(sessionId)
      .then(session => {
        defer(callback, null, session);
      })
      .catch(error => {
        throw new HttpErrors.BadRequest(error)
      })
      .finally(() => {
        debug('Getting store done');
      });
  }

  public length (callback: (err: any, count?: number) => void) {
    debug('"Store": length')
    this.all((err, sessions) => {
      if (err) {
        return callback(err);
      }
      callback(null, (sessions && Object.keys(sessions).length) || 0);
    });
  }

  public load (sessionId: string, callback: (error?: any, session?: Express.SessionData | null) => any) {
    debug('"Store": load')
    const load = (error: any, session?: SessionData) => {
      if (error) {
        return callback(error);
      }

      if (!session) {
        return callback();
      }

      const request: Partial<SessionRequest> = {
        sessionID: sessionId,
        sessionStore: this as any,
      };

      const createSession = this.createSession(request as Express.Request, session)
      callback(null, createSession);
    };

    load.bind(this)

    this.get(sessionId, load);
  }

  public set (
    sessionID: string,
    sessionData: Express.SessionData,
    callback?: (err?: any) => void
  ) {
    debug('"Store": set')

    if (sessionData.request) {
      delete sessionData.request;
    }

    const data: Partial<SessionModel> = {
      sessionID,
      value: stringify(sessionData)
    };

    const emptyCallback = () => {};

    this.sessionRepository.exists(sessionID)
      .then(exist => {
        if (!exist) {
          if ((data as any).request) {
            delete (data as any).request;
          }

          return this.sessionRepository.create(data);
        }

        return this.sessionRepository.findById(sessionID)
      })
      .then(session => {
        if (session) {
          // session.value = parse(session.value);
          this.sessions[sessionID] = session.value;
        }
        return session;
      })
      .catch(error => {
        defer(() => (callback && callback(error) || emptyCallback));
      })
      .finally(() => {
        defer(callback || emptyCallback);
      });
  }

  public touch (sessionId: string, session: Express.SessionData, callback?: (err?: any) => void) {

    debug('"Store": touch')
    const emptyCallback = () => {};

    this.getSession(sessionId)
      .then(currentSession => {
        if (currentSession) {
          // update expiration
          currentSession.cookie = session.cookie
          this.sessions[sessionId] = JSON.stringify(currentSession)
        }
      })
      .catch(error => {
        defer(() => (callback && callback(error) || emptyCallback));
      })
      .finally(() => {
        defer(callback || emptyCallback);
      });
  }

  private async getSession (sessionId: string): Promise<SessionData | undefined> {
    debug('"Store": getSession')
    const exist = await this.sessionRepository.exists(sessionId);
    let sessionData: SessionModel;
    if (exist) {
      try {
        sessionData = await this.sessionRepository.findById(sessionId);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      return undefined;
    }

    if (!sessionData) {
      return undefined;
    }

    const session = parse(sessionData.value) as SessionData;

    if (session.cookie) {
      const expires = typeof session.cookie.expires === 'string'
        ? new Date(session.cookie.expires)
        : session.cookie.expires;

      if (expires && (expires as any) <= Date.now()) {
        this.destroy(sessionId);
        return undefined;
      }
    }

    return session;
  }
}
