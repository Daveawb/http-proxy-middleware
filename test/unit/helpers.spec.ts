import { isEmpty, isFunction, isObject, isPlainObject, toTitle } from '../../src/helpers';

describe('helper functions', () => {
  describe('isObject', () => {
    const falsyTests = {
      string: 'test',
      number: 1,
      boolean: true,
    };

    const truthyTests = {
      object: { a: 'b' },
      function: () => void 0,
      array: ['value'],
    };

    for (let key in truthyTests) {
      test(`returns true as ${key}`, () => {
        const sut = truthyTests[key];
        expect(isObject(sut)).toBeTruthy();
      });
    }

    for (let key in falsyTests) {
      test(`returns false as ${key}`, () => {
        const sut = falsyTests[key];
        expect(isObject(sut)).toBeFalsy();
      });
    }

    test('returns true as a constructed object', () => {
      function TestObject(value) {
        this.test = value;
      }

      const sut = new TestObject('test');
      expect(isObject(sut)).toBeTruthy();
    });
  });

  describe('isPlainObject', () => {
    const falsyTests = {
      function: () => void 0,
      array: ['value'],
      string: 'test',
      number: 1,
      boolean: true,
    };

    const truthyTests = {
      object: { a: 'b' },
    };

    for (let key in truthyTests) {
      test(`returns true as ${key}`, () => {
        const sut = truthyTests[key];
        expect(isPlainObject(sut)).toBeTruthy();
      });
    }

    for (let key in falsyTests) {
      test(`returns false as ${key}`, () => {
        const sut = falsyTests[key];
        expect(isPlainObject(sut)).toBeFalsy();
      });
    }

    test('returns false as a constructed object', () => {
      function TestObject(value) {
        this.test = value;
      }

      const sut = new TestObject('test');
      expect(isPlainObject(sut)).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    test('returns true with empty values', () => {
      [[], {}, '', null, undefined].forEach((value) => expect(isEmpty(value)).toBeTruthy());
    });

    test('returns false with populated values', () => {
      [['test'], { a: 'test' }, 'test', 1].forEach((value) => expect(isEmpty(value)).toBeFalsy());
    });
  });

  describe('isFunction', () => {
    test('returns true with traditional functions', () => {
      function sut() {
        return void 0;
      }
      expect(isFunction(sut)).toBeTruthy();
    });

    test('returns true with arrow functions', () => {
      const sut = () => void 0;
      expect(isFunction(sut)).toBeTruthy();
    });

    test('returns false with non functions', () => {
      [{ a: 'test' }, {}, ['test'], [], 'test', '', 1, 0, true, false].forEach(
        (value) => expect(isFunction(value)).toBeFalsy
      );
    });
  });

  describe('toTitle', () => {
    test('returns capitalized first letter', () => {
      const tests = {
        'subject 1': 'Subject 1',
        'multiple words': 'Multiple words',
        single: 'Single',
      };

      for (let key in tests) {
        expect(toTitle(key)).toBe(tests[key]);
      }
    });
  });
});
