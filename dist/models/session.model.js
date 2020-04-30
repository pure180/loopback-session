"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Session = class Session extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "sessionID", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "value", void 0);
Session = tslib_1.__decorate([
    repository_1.model({ settings: {} }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Session);
exports.Session = Session;
//# sourceMappingURL=session.model.js.map