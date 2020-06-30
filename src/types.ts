import * as express from 'express';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as net from 'net';

export interface Request extends express.Request {}
export interface Response extends express.Response {}

export interface RequestHandler extends express.RequestHandler {
  upgrade?: (req: Request, socket: net.Socket, head: any) => void;
}

export type Filter = string | string[] | ((pathname: string, req: Request) => boolean);

export type OnErrorHandler = (err: Error, req: Request, res: Response) => void;
export type OnProxyResHandler = (
  proxyRes: http.IncomingMessage,
  req: Request,
  res: Response
) => void;
export type OnProxyReqHandler = (proxyReq: http.ClientRequest, req: Request, res: Response) => void;
export type OnProxyReqWsHandler = (
  proxyReq: http.ClientRequest,
  req: Request,
  socket: net.Socket,
  options: httpProxy.ServerOptions,
  head: any
) => void;
export type OnOpenHandler = (proxySocket: net.Socket) => void;
export type OnCloseHandler = (res: Response, socket: net.Socket, head: any) => void;

export type EventHandler =
  | OnErrorHandler
  | OnProxyResHandler
  | OnProxyReqHandler
  | OnProxyReqWsHandler
  | OnOpenHandler
  | OnCloseHandler;

export interface Options extends httpProxy.ServerOptions {
  pathRewrite?:
    | { [regexp: string]: string }
    | ((path: string, req: Request) => string)
    | ((path: string, req: Request) => Promise<string>);
  router?:
    | { [hostOrPath: string]: httpProxy.ServerOptions['target'] }
    | ((req: Request) => httpProxy.ServerOptions['target'])
    | ((req: Request) => Promise<httpProxy.ServerOptions['target']>);
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  logProvider?(provider: LogProvider): LogProvider;

  onError?: OnErrorHandler;
  onProxyRes?: OnProxyResHandler;
  onProxyReq?: OnProxyReqHandler;
  onProxyReqWs?: OnProxyReqWsHandler;
  onOpen?: OnOpenHandler;
  onClose?: OnCloseHandler;
}

interface LogProvider {
  log: Logger;
  debug?: Logger;
  info?: Logger;
  warn?: Logger;
  error?: Logger;
}

type Logger = (...args: any[]) => void;
