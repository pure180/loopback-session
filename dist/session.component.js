"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const providers_1 = require("./providers");
const repositories_1 = require("./repositories");
const services_1 = require("./services");
const datasources_1 = require("./datasources");
let SessionComponent = class SessionComponent {
    constructor(app) {
        this.app = app;
        this.bindings = [
            core_1.Binding.bind(keys_1.SessionBindings.DATA_SOURCE).toClass(datasources_1.SessionDataSource),
            core_1.Binding.bind(keys_1.SessionBindings.MEMORY).toClass(services_1.SessionStore),
            core_1.Binding.bind(keys_1.SessionBindings.REPOSITORY).toClass(repositories_1.SessionRepository),
        ];
        this.providers = {
            [keys_1.SessionBindings.PROVIDER.key]: providers_1.SessionProvider,
        };
    }
};
SessionComponent = tslib_1.__decorate([
    core_1.bind({ tags: { [core_1.ContextTags.KEY]: keys_1.SessionBindings.COMPONENT } }),
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [core_1.Application])
], SessionComponent);
exports.SessionComponent = SessionComponent;
exports.registerSessionComponent = (app, options) => {
    app.component(SessionComponent);
    app.bind(keys_1.SessionBindings.COOKIE_OPTIONS.key).to(options.cookie || {});
    app.bind(keys_1.SessionBindings.OPTIONS.key).to(options.session);
};
//# sourceMappingURL=session.component.js.map