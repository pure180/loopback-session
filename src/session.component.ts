import { Application, bind, Binding, Component, ContextTags, CoreBindings, inject, ProviderMap } from '@loopback/core';
import { CookieSerializeOptions } from 'cookie';

import { SessionBindings } from './keys';
import { SessionProvider } from './providers';
import { SessionRepository } from './repositories';
import { SessionStore } from './services';
import { SessionOptions } from './types';
import { SessionDataSource } from './datasources';

@bind({tags: {[ContextTags.KEY]: SessionBindings.COMPONENT}})
export class SessionComponent implements Component {
  providers: ProviderMap;
  
  bindings: Binding<unknown>[] = [
    Binding.bind(SessionBindings.DATA_SOURCE).toClass(SessionDataSource),
    Binding.bind(SessionBindings.MEMORY).toClass(SessionStore),
    Binding.bind(SessionBindings.REPOSITORY).toClass(SessionRepository),
  ];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private readonly app: Application,
  ) {
    this.providers = {
      [SessionBindings.PROVIDER.key]: SessionProvider,
    };
  }
}

export const registerSessionComponent = (app: Application, options: {
  session: SessionOptions,
  cookie?: CookieSerializeOptions,
}) => {
  app.component(SessionComponent)
  app.bind(SessionBindings.COOKIE_OPTIONS.key).to(options.cookie || {});
  app.bind(SessionBindings.OPTIONS.key).to(options.session);
}