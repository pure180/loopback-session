import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';

import { SessionDataSource } from '../datasources';
import { SessionBindings } from '../keys';
import { Session } from '../models';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.sessionID
> {
  constructor(
    @inject(SessionBindings.DATA_SOURCE) dataSource: SessionDataSource,
  ) {
    super(Session, dataSource);
  }
}
