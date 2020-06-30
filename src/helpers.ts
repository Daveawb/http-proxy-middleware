export const toTitle = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};

export const isObject = <T>(value: any): value is object => {
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
};

export const isPlainObject = (value: any): value is object => {
  if (isObject(value)) {
    if (isFunction(Object.getPrototypeOf)) {
      let proto = Object.getPrototypeOf(value);
      return proto === Object.prototype || proto === null;
    }
    return Object.prototype.toString.call(value) == '[object Object]';
  }
  return false;
};
