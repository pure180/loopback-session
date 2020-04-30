import {Entity, model, property} from '@loopback/repository';

@model({settings: {}})
export class Session extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  sessionID: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
}

export type SessionWithRelations = Session & SessionRelations;
