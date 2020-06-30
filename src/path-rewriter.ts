import { ERRORS } from './errors';
import { getInstance } from './logger';
import { isEmpty, isFunction, isPlainObject } from './helpers';
const logger = getInstance();

/**
 * Create rewrite function, to cache parsed rewrite rules.
 *
 * @param {Object} rewriteConfig
 * @return {Function} Function to rewrite paths; This function should accept `path` (request.url) as parameter
 */
export function createPathRewriter(rewriteConfig) {
  let rulesCache;

  if (!isValidRewriteConfig(rewriteConfig)) {
    return;
  }

  if (isFunction(rewriteConfig)) {
    return rewriteConfig;
  } else {
    rulesCache = parsePathRewriteRules(rewriteConfig);
    return rewritePath;
  }

  function rewritePath(path) {
    let result = path;

    rulesCache.some((rule) => {
      if (rule.regex.test(path)) {
        result = result.replace(rule.regex, rule.value);
        logger.debug('[HPM] Rewriting path from "%s" to "%s"', path, result);
        return true;
      }
    });

    return result;
  }
}

function isValidRewriteConfig(rewriteConfig) {
  if (isFunction(rewriteConfig)) {
    return true;
  } else if (!isEmpty(rewriteConfig) && isPlainObject(rewriteConfig)) {
    return true;
  } else if (
    typeof rewriteConfig === 'undefined' ||
    rewriteConfig === null ||
    (isEmpty(rewriteConfig) && isPlainObject(rewriteConfig))
  ) {
    return false;
  } else {
    throw new Error(ERRORS.ERR_PATH_REWRITER_CONFIG);
  }
}

function parsePathRewriteRules(rewriteConfig) {
  const rules = [];

  if (isPlainObject(rewriteConfig)) {
    for (const key in rewriteConfig) {
      // Inspection not necessary as we know it's a plain object and not constructed
      // therefore hasOwnProperty check would be redundant.
      // noinspection JSUnfilteredForInLoop
      rules.push({
        regex: new RegExp(key),
        value: rewriteConfig[key],
      });
      // noinspection JSUnfilteredForInLoop
      logger.info('[HPM] Proxy rewrite rule created: "%s" ~> "%s"', key, rewriteConfig[key]);
    }
  }

  return rules;
}
