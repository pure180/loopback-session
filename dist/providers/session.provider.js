"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const keys_1 = require("../keys");
const services_1 = require("../services");
let SessionProvider = class SessionProvider {
    constructor(store, options) {
        this.store = store;
        this.options = options;
    }
    value() {
        return this.session.bind(this);
    }
    async session(request, response) {
        const options = {
            ...this.options,
            store: this.store,
        };
        await this.initializeSession(options, request, response);
        return { request, response };
    }
    initializeSession(options, request, response) {
        return new Promise((resolve) => {
            express_session_1.default(options)(request, response, () => {
                resolve({
                    request,
                    response
                });
            });
        });
    }
};
SessionProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject(keys_1.SessionBindings.MEMORY)),
    tslib_1.__param(1, context_1.inject(keys_1.SessionBindings.OPTIONS.key)),
    tslib_1.__metadata("design:paramtypes", [services_1.SessionStore, Object])
], SessionProvider);
exports.SessionProvider = SessionProvider;
//# sourceMappingURL=session.provider.js.map