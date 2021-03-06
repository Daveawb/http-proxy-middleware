import * as util from 'util';
import { isFunction } from './helpers';

let loggerInstance;

const defaultProvider = {
  // tslint:disable: no-console
  log: console.log,
  debug: console.log, // use .log(); since console does not have .debug()
  info: console.info,
  warn: console.warn,
  error: console.error,
};

// log level 'weight'
enum LEVELS {
  debug = 10,
  info = 20,
  warn = 30,
  error = 50,
  silent = 80,
}

export function getInstance() {
  if (!loggerInstance) {
    loggerInstance = new Logger();
  }

  return loggerInstance;
}

class Logger {
  public logLevel;
  public provider;

  constructor() {
    this.setLevel('info');
    this.setProvider(() => defaultProvider);
  }

  // log will log messages, regardless of logLevels
  public log() {
    this.provider.log(this.interpolate.apply(null, arguments));
  }

  public debug() {
    if (this.showLevel('debug')) {
      this.provider.debug(this.interpolate.apply(null, arguments));
    }
  }

  public info() {
    if (this.showLevel('info')) {
      this.provider.info(this.interpolate.apply(null, arguments));
    }
  }

  public warn() {
    if (this.showLevel('warn')) {
      this.provider.warn(this.interpolate.apply(null, arguments));
    }
  }

  public error() {
    if (this.showLevel('error')) {
      this.provider.error(this.interpolate.apply(null, arguments));
    }
  }

  public setLevel(v) {
    if (this.isValidLevel(v)) {
      this.logLevel = v;
    }
  }

  public setProvider(fn) {
    if (fn && this.isValidProvider(fn)) {
      this.provider = fn(defaultProvider);
    }
  }

  public isValidProvider(fnProvider) {
    const result = true;

    if (fnProvider && !isFunction(fnProvider)) {
      throw new Error('[HPM] Log provider config error. Expecting a function.');
    }

    return result;
  }

  public isValidLevel(levelName) {
    const validLevels = Object.keys(LEVELS);
    const isValid = validLevels.includes(levelName);

    if (!isValid) {
      throw new Error('[HPM] Log level error. Invalid logLevel.');
    }

    return isValid;
  }

  /**
   * Decide to log or not to log, based on the log levels 'weight'
   * @param  {String}  showLevel [debug, info, warn, error, silent]
   * @return {Boolean}
   */
  private showLevel(showLevel) {
    let result = false;
    const currentLogLevel = LEVELS[this.logLevel];

    if (currentLogLevel && currentLogLevel <= LEVELS[showLevel]) {
      result = true;
    }

    return result;
  }

  // make sure logged messages and its data are return interpolated
  // make it possible for additional log data, such date/time or custom prefix.
  private interpolate() {
    const fn = (...args) => util.format(args);
    return fn(...arguments);
  }
}

/**
 * -> normal proxy
 * => router
 * ~> pathRewrite
 * ≈> router + pathRewrite
 *
 * @param  {String} originalPath
 * @param  {String} newPath
 * @param  {String} originalTarget
 * @param  {String} newTarget
 * @return {String}
 */
export function getArrow(originalPath, newPath, originalTarget, newTarget) {
  const arrow = ['>'];
  const isNewTarget = originalTarget !== newTarget; // router
  const isNewPath = originalPath !== newPath; // pathRewrite

  if (isNewPath && !isNewTarget) {
    arrow.unshift('~');
  } else if (!isNewPath && isNewTarget) {
    arrow.unshift('=');
  } else if (isNewPath && isNewTarget) {
    arrow.unshift('≈');
  } else {
    arrow.unshift('-');
  }

  return arrow.join('');
}
