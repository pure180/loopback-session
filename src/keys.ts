import { BindingKey } from '@loopback/context';
import { CookieSerializeOptions } from 'cookie';

import { SessionProvider } from './providers';
import { SessionComponent } from './session.component';
import { SessionStore } from './services';
import { SessionOptions } from './types';

export namespace SessionBindings {
  export const COMPONENT = BindingKey.create<SessionComponent<any>>(
    'components.SessionComponent',
  );

  export const DATA_SOURCE = 'datasources.session';

  export const MEMORY = BindingKey.create<SessionStore<Express.SessionData>>(
    'service.SessionData',
  );

  export const OPTIONS = BindingKey.create<SessionOptions>(
    'service.SessionOptions',
  );

  export const COOKIE_OPTIONS = BindingKey.create<CookieSerializeOptions>(
    'service.SessionCookieOptions',
  );

  export const PROVIDER = BindingKey.create<SessionProvider>(
    'providers.Session',
  );

  export const REPOSITORY = 'repositories.SessionRepository'
}



