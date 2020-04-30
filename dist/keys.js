"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
var SessionBindings;
(function (SessionBindings) {
    SessionBindings.COMPONENT = context_1.BindingKey.create('components.SessionComponent');
    SessionBindings.DATA_SOURCE = 'datasources.SessionDataSource';
    SessionBindings.MEMORY = context_1.BindingKey.create('service.SessionData');
    SessionBindings.OPTIONS = context_1.BindingKey.create('service.SessionOptions');
    SessionBindings.COOKIE_OPTIONS = context_1.BindingKey.create('service.SessionCookieOptions');
    SessionBindings.PROVIDER = context_1.BindingKey.create('providers.Session');
    SessionBindings.REPOSITORY = 'repositories.SessionRepository';
})(SessionBindings = exports.SessionBindings || (exports.SessionBindings = {}));
//# sourceMappingURL=keys.js.map