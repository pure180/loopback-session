import { DefaultCrudRepository } from '@loopback/repository';
import { SessionDataSource } from '../datasources';
import { Session } from '../models';
export declare class SessionRepository extends DefaultCrudRepository<Session, typeof Session.prototype.sessionID> {
    constructor(dataSource: SessionDataSource);
}
