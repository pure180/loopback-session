/// <reference types="express-session" />
import { Application, Binding, Component, ProviderMap } from '@loopback/core';
import { CookieSerializeOptions } from 'cookie';
export declare class SessionComponent implements Component {
    private readonly app;
    providers: ProviderMap;
    bindings: Binding<unknown>[];
    constructor(app: Application);
}
export declare const registerSessionComponent: (app: Application, options: {
    session: import("express-session").SessionOptions;
    cookie?: CookieSerializeOptions | undefined;
}) => void;
