"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const session_datasource_config_json_1 = tslib_1.__importDefault(require("./session.datasource.config.json"));
let SessionDataSource = class SessionDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = session_datasource_config_json_1.default) {
        super(dsConfig);
    }
    /**
     * Start the datasource when application is started
     */
    start() {
        // Add your logic here to be invoked when the application is started
    }
    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop() {
        return super.disconnect();
    }
};
SessionDataSource.dataSourceName = 'session';
SessionDataSource = tslib_1.__decorate([
    core_1.lifeCycleObserver('datasource'),
    tslib_1.__param(0, core_1.inject('datasources.config.session', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], SessionDataSource);
exports.SessionDataSource = SessionDataSource;
//# sourceMappingURL=sesion.datasource.js.map