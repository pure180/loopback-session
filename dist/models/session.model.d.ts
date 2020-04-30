import { Entity } from '@loopback/repository';
export declare class Session extends Entity {
    sessionID: string;
    value: string;
    constructor(data?: Partial<Session>);
}
export interface SessionRelations {
}
export declare type SessionWithRelations = Session & SessionRelations;
