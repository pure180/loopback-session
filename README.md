# @loopback/session

## This package is still work in progress

Please note this package has the user service is a reference implementation, not
recommended for production. You can follow the guide in section
[Customizing User](#customizing-user) to replace it.

## Architecture Overview

## Usage

To use this component, you need to have an existing LoopBack 4 application.

- create app: run `lb4 app`

Next create a data source 

Next enable the session system in your application:

- register session component in application

<details>
<summary><strong>Check The Code</strong></summary>
<p>

```ts
import { SessionBindings, SessionComponent, SessionConfig } from '@loopback/session';

export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // - enable session -

    //
    this.configure<SessionConfig>(SessionBindings.COMPONENT).to({
      DataSource: MemoryDataSource,
      session: {
        secret: 'xyz_12345678_zyx',
        resave: false,
        saveUninitialized: false,
        name: 'sid'
      }
    });

    this.component(SessionComponent);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {};
  }
}
```

</p>
</details>

- Setup your sequence and wrap the request and response the session provider.

<details>
<summary><strong>Check The Code</strong></summary>
<p>

```ts

import { inject } from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

import { SessionFn, SessionBindings, SessionRequest } from '@loopback/session';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE)
      protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
      protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD)
      protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND)
      public send: Send,
    @inject(SequenceActions.REJECT) 
      public reject: Reject,

    // Inject the session provider
    @inject(SessionBindings.PROVIDER)
      protected session: SessionFn<SessionRequest>,

  ) {}

  async handle(context: RequestContext) {
    try {

      // Wrap the incoming and outgoing messages with the session provider.
      const {
        request, 
        response
      } = await this.session(context.request as SessionRequest, context.response as Response);

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}

```

</p>
</details>

## Contributions

- [Guidelines](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Tests

Run `npm test` from the root folder.

## Contributors

See
[all contributors](https://github.com/strongloop/loopback-next/graphs/contributors).

## License

MIT
