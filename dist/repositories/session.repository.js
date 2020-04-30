"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const keys_1 = require("../keys");
const models_1 = require("../models");
let SessionRepository = class SessionRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.Session, dataSource);
    }
};
SessionRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(keys_1.SessionBindings.DATA_SOURCE)),
    tslib_1.__metadata("design:paramtypes", [datasources_1.SessionDataSource])
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=session.repository.js.map