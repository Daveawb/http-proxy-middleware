import { getInstance } from './logger';
import { toTitle } from './helpers';
import { EventHandler, Options } from './types';
const logger = getInstance();

export function init(proxy, option) {
  const handlers = getHandlers(option);

  for (const eventName of Object.keys(handlers)) {
    proxy.on(eventName, handlers[eventName]);
  }

  logger.debug('[HPM] Subscribed to http-proxy events:', Object.keys(handlers));
}

export function getHandlers(options: Options = {}) {
  // https://github.com/nodejitsu/node-http-proxy#listening-for-proxy-events
  const proxyEvents = ['error', 'proxyReq', 'proxyReqWs', 'proxyRes', 'open', 'close'];
  const handlers: Record<string, EventHandler> = {};
  // all handlers for the http-proxy events are prefixed with 'on'.
  // loop through options and try to find these handlers
  // and add them to the handlers object for subscription in init().
  proxyEvents.reduce((handlersRef, event) => {
    const eventName = `on${toTitle(event)}`;
    const fnHandler = options.hasOwnProperty(eventName) && options[eventName];

    if (typeof fnHandler === 'function') {
      handlersRef[event] = fnHandler;
    }

    return handlersRef;
  }, handlers);

  // add default error handler in absence of error handler
  if (typeof handlers.error !== 'function') {
    handlers.error = defaultErrorHandler;
  }

  // add default close handler in absence of close handler
  if (typeof handlers.close !== 'function') {
    handlers.close = logClose;
  }

  return handlers;
}

function defaultErrorHandler(err, req, res) {
  const host = req.headers && req.headers.host;
  const code = err.code;

  if (res.writeHead && !res.headersSent) {
    if (/HPE_INVALID/.test(code)) {
      res.writeHead(502);
    } else {
      switch (code) {
        case 'ECONNRESET':
        case 'ENOTFOUND':
        case 'ECONNREFUSED':
          res.writeHead(504);
          break;
        default:
          res.writeHead(500);
      }
    }
  }

  res.end('Error occured while trying to proxy to: ' + host + req.url);
}

function logClose(req, socket, head) {
  // view disconnected websocket connections
  logger.info('[HPM] Client disconnected');
}
