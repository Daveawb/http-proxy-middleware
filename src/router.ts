import { getInstance } from './logger';
import { isFunction, isPlainObject } from './helpers';
const logger = getInstance();

export async function getTarget(req, config) {
  let newTarget;
  const router = config.router;

  if (isPlainObject(router)) {
    newTarget = getTargetFromProxyTable(req, router);
  } else if (isFunction(router)) {
    newTarget = await router(req);
  }

  return newTarget;
}

function getTargetFromProxyTable(req, table) {
  let result;
  const host = req.headers.host;
  const path = req.url;

  const hostAndPath = host + path;

  Object.keys(table).some((key) => {
    if (containsPath(key)) {
      if (hostAndPath.indexOf(key) > -1) {
        // match 'localhost:3000/api'
        result = table[key];
        logger.debug('[HPM] Router table match: "%s"', key);
        return true;
      }
    } else {
      if (key === host) {
        // match 'localhost:3000'
        result = table[key];
        logger.debug('[HPM] Router table match: "%s"', host);
        return true;
      }
    }
  });

  return result;
}

function containsPath(v) {
  return v.indexOf('/') > -1;
}
