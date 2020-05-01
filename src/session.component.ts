import { bind, Binding, Component, ContextTags, ProviderMap, config } from '@loopback/core';
import { CookieSerializeOptions } from 'cookie';

import { SessionBindings } from './keys';
import { SessionProvider } from './providers';
import { SessionRepository } from './repositories';
import { SessionStore } from './services';
import { SessionConfig } from './types';
import { juggler } from '@loopback/repository';

@bind({tags: {[ContextTags.KEY]: SessionBindings.COMPONENT}})
export class SessionComponent<DataSource extends juggler.DataSource> implements Component {
  providers: ProviderMap;
  
  bindings: Binding<unknown>[]  = [
    Binding.bind(SessionBindings.MEMORY).toClass(SessionStore),
    Binding.bind(SessionBindings.REPOSITORY).toClass(SessionRepository),
  ];

  constructor(
    @config() sessionConfig: SessionConfig<DataSource>,
  ) {
    this.providers = {
      [SessionBindings.PROVIDER.key]: SessionProvider,
    };

    this.bindings.push(...[
      Binding.bind<DataSource>(SessionBindings.DATA_SOURCE).toClass(sessionConfig.DataSource),
      Binding.bind(SessionBindings.COOKIE_OPTIONS.key).to(sessionConfig.cookie || {}),
      Binding.bind(SessionBindings.OPTIONS.key).to(sessionConfig.session),
    ]);
  }
}
