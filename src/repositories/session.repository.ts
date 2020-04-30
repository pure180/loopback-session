import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Session } from '../models';
import { inject } from '@loopback/core';
import { SessionBindings } from '../keys';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.sessionID
> {
  constructor(
    @inject(SessionBindings.DATA_SOURCE) 
      dataSource: juggler.DataSource,
  ) {
    super(Session, dataSource);
  }
}
