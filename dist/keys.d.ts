/// <reference types="express-session" />
import { BindingKey } from '@loopback/context';
import { CookieSerializeOptions } from 'cookie';
import { SessionProvider } from './providers';
import { SessionComponent } from './session.component';
import { SessionStore } from './services';
export declare namespace SessionBindings {
    const COMPONENT: BindingKey<SessionComponent>;
    const DATA_SOURCE = "datasources.SessionDataSource";
    const MEMORY: BindingKey<SessionStore<Express.SessionData>>;
    const OPTIONS: BindingKey<import("express-session").SessionOptions>;
    const COOKIE_OPTIONS: BindingKey<CookieSerializeOptions>;
    const PROVIDER: BindingKey<SessionProvider>;
    const REPOSITORY = "repositories.SessionRepository";
}
