"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-spread */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const flatted_1 = require("flatted");
const keys_1 = require("../keys");
const repositories_1 = require("../repositories");
const debug = debug_1.default('loopback:session');
const Cookie = require('express-session/session/cookie');
const Session = require('express-session/session/session');
const defer = typeof setImmediate === 'function'
    ? setImmediate
    // eslint-disable-next-line prefer-rest-params
    : function (fn) { process.nextTick(fn.bind.apply(fn, arguments)); };
/**
 *
 */
let SessionStore = class SessionStore extends events_1.EventEmitter {
    /**
     *
     * @param sessionRepository
     */
    constructor(sessionRepository, options) {
        // Call EventEmitter
        super();
        this.sessionRepository = sessionRepository;
        this.options = options;
        // Init the default session Object
        this.sessions = {};
    }
    /**
     *
     * @param callback
     */
    all(callback) {
        debug('"Store": All');
        const sessionIds = Object.keys(this.sessions);
        const sessions = Object.create(null);
        const forEachSession = async (sessionId) => {
            const session = await this.getSession(sessionId);
            if (session) {
                sessions[sessionId] = session;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        sessionIds.forEach(async (sessionId) => forEachSession(sessionId));
        if (callback) {
            defer(callback, null, sessions);
        }
    }
    clear(callback) {
        debug('"Store": clear');
        this.sessions = {};
        if (callback) {
            defer(callback);
        }
    }
    createSession(request, session) {
        debug('"Store": createSession');
        const expires = session.cookie.expires;
        const originalMaxAge = session.cookie.originalMaxAge;
        session.cookie = new Cookie(this.options || session.cookie);
        if (typeof expires === 'string') {
            session.cookie.expires = new Date(expires);
        }
        session.cookie.originalMaxAge = originalMaxAge;
        request.session = new Session(request, session);
        return request.session;
    }
    ;
    destroy(sessionId, callback = () => { }) {
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
            throw new rest_1.HttpErrors.BadRequest('Destroying session Failed');
        })
            .finally(() => defer(callback));
    }
    get(sessionId, callback) {
        debug('"Store": get');
        this.getSession(sessionId)
            .then(session => {
            defer(callback, null, session);
        })
            .catch(error => {
            throw new rest_1.HttpErrors.BadRequest(error);
        })
            .finally(() => {
            debug('Getting store done');
        });
    }
    length(callback) {
        debug('"Store": length');
        this.all((err, sessions) => {
            if (err) {
                return callback(err);
            }
            callback(null, (sessions && Object.keys(sessions).length) || 0);
        });
    }
    load(sessionId, callback) {
        debug('"Store": load');
        const load = (error, session) => {
            if (error) {
                return callback(error);
            }
            if (!session) {
                return callback();
            }
            const request = {
                sessionID: sessionId,
                sessionStore: this,
            };
            const createSession = this.createSession(request, session);
            callback(null, createSession);
        };
        load.bind(this);
        this.get(sessionId, load);
    }
    set(sessionID, sessionData, callback) {
        debug('"Store": set');
        if (sessionData.request) {
            delete sessionData.request;
        }
        const data = {
            sessionID,
            value: flatted_1.stringify(sessionData)
        };
        const emptyCallback = () => { };
        this.sessionRepository.exists(sessionID)
            .then(exist => {
            if (!exist) {
                if (data.request) {
                    delete data.request;
                }
                return this.sessionRepository.create(data);
            }
            return this.sessionRepository.findById(sessionID);
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
    touch(sessionId, session, callback) {
        debug('"Store": touch');
        const emptyCallback = () => { };
        this.getSession(sessionId)
            .then(currentSession => {
            if (currentSession) {
                // update expiration
                currentSession.cookie = session.cookie;
                this.sessions[sessionId] = JSON.stringify(currentSession);
            }
        })
            .catch(error => {
            defer(() => (callback && callback(error) || emptyCallback));
        })
            .finally(() => {
            defer(callback || emptyCallback);
        });
    }
    async getSession(sessionId) {
        debug('"Store": getSession');
        const exist = await this.sessionRepository.exists(sessionId);
        let sessionData;
        if (exist) {
            try {
                sessionData = await this.sessionRepository.findById(sessionId);
            }
            catch (error) {
                throw new Error(error);
            }
        }
        else {
            return undefined;
        }
        if (!sessionData) {
            return undefined;
        }
        const session = flatted_1.parse(sessionData.value);
        if (session.cookie) {
            const expires = typeof session.cookie.expires === 'string'
                ? new Date(session.cookie.expires)
                : session.cookie.expires;
            if (expires && expires <= Date.now()) {
                this.destroy(sessionId);
                return undefined;
            }
        }
        return session;
    }
};
SessionStore = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.SessionRepository)),
    tslib_1.__param(1, core_1.inject(keys_1.SessionBindings.COOKIE_OPTIONS.key)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.SessionRepository, Object])
], SessionStore);
exports.SessionStore = SessionStore;
//# sourceMappingURL=store.service.js.map