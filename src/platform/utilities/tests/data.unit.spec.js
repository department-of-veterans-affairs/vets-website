import sinon from 'sinon';

import _ from '../data';
import deconstructPath from '../data/deconstructPath';
import checkValidPath from '../data/checkValidPath';
import removeDeeplyEmptyObjects from '../data/removeDeeplyEmptyObjects';
import deduplicate from '../data/deduplicate';

// Could split these out into separate files...
describe('data utils', () => {
  describe('deconstructPath', () => {
    test('should deconstruct a string path', () => {
      const strPath = 'a.b.c';
      expect(deconstructPath(strPath)).toEqual(['a', 'b', 'c']);
    });

    test('should handle array notation', () => {
      const strPath = 'a.b[4].c';
      expect(deconstructPath(strPath)).toEqual(['a', 'b', 4, 'c']);
    });

    test('should handle array indexes using dot notation', () => {
      const strPath = 'a.b.4.c.123abc';
      expect(deconstructPath(strPath)).toEqual(['a', 'b', 4, 'c', '123abc']);
    });
  });

  describe('clone', () => {
    test(
      'should return an object with the same data but different reference',
      () => {
        const obj = {
          a: 1,
          b: 2,
        };
        const cloned = _.clone(obj);
        expect(cloned).toEqual(obj);
        expect(cloned).not.toBe(obj);
      }
    );

    test('should clone a set', () => {
      const s = new Set([{ sub: 'original' }]);
      const cloned = _.clone(s);
      expect(cloned).toEqual(s);
      expect(cloned).not.toBe(s);
    });
  });

  describe('cloneDeep', () => {
    const obj = {
      int: 1,
      obj: {
        foo: 'bar',
        nestedObj: {
          nestedArray: [0, 2, 4],
        },
      },
      string: 'string!',
      array: ['0', 1, null, { s: 'thing', o: { k: 'I am nested' } }],
      // eslint-disable-next-line
      func: function() {
        return this.int;
      },
      arrowFunction: () => this.int,
    };

    const cloned = _.cloneDeep(obj);

    test('should return an object with a different reference', () => {
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    test('should handle an array as the root "object"', () => {
      const arr = ['foo', 'bar', 0];
      const clonedArr = _.cloneDeep(arr);

      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr);
    });

    test('should clone all sub-objects', () => {
      expect(cloned.obj).toEqual(obj.obj);
      expect(cloned.obj).not.toBe(obj.obj);
    });

    test('should clone all sub-arrays', () => {
      expect(cloned.array).toEqual(obj.array);
      expect(cloned.array).not.toBe(obj.array);
      expect(cloned.obj.nestedObj.nestedArray).toEqual(
        obj.obj.nestedObj.nestedArray,
      );
      expect(cloned.obj.nestedObj.nestedArray).not.toBe(
        obj.obj.nestedObj.nestedArray,
      );
    });

    test('should clone all objects in arrays', () => {
      expect(cloned.array[3]).toEqual(obj.array[3]);
      expect(cloned.array[3]).not.toBe(obj.array[3]);
    });
  });

  describe('get', () => {
    const o = {
      a: 'a',
      b: { c: 'c' },
      k: { a: { y: 'f' } },
      g: ['h', 'i', 'j'],
    };

    test('should get a value one level deep', () => {
      expect(_.get('a', o)).toBe(o.a);
    });

    test('should get a value n levels deep', () => {
      expect(_.get('b.c', o)).toBe(o.b.c);
      expect(_.get('k.a.y', o)).toBe(o.k.a.y);
    });

    test('should handle array indexes', () => {
      expect(_.get('g[2]', o)).toBe(o.g[2]);
    });

    test('should handle dot-notated array indexes', () => {
      expect(_.get('g.2', o)).toBe(o.g[2]);
    });

    test('should handle an array path', () => {
      expect(_.get(['k', 'a', 'y'], o)).toBe(o.k.a.y);
    });

    test('should return a default value if not found', () => {
      expect(_.get('does.not.exist', o, 'default')).toBe('default');
    });

    test('should return undefined if not found and no default is provided', () => {
      expect(_.get('does.not.exist', o)).toBe();
    });
  });

  describe('set', () => {
    test('should set the value of an existing path', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.set('b.c', 'd', o);
      expect(newObj.b.c).toBe('d');
      // Expect everything else to be deeply equal
      Object.keys(o).forEach(key => {
        if (key !== 'b') {
          expect(o[key]).toEqual(newObj[key]);
        }
      });
    });

    test('should create nested objects as needed', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.set('new.path', ['foo', 'bar'], o);
      expect(newObj.new.path).toEqual(['foo', 'bar']);
    });

    test('should create nested arrays as needed', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.set(['array', 1], 'first', o);
      expect(newObj.array).toEqual([undefined, 'first']);
    });

    test('should handle an array path', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.set(['new', 'path'], ['foo', 'bar'], o);
      expect(newObj.new.path).toEqual(['foo', 'bar']);
    });

    test('should not change the array path provided', () => {
      const o = {};
      const arrayPath = ['path', 0];
      _.set(arrayPath, 'foo', o);
      expect(arrayPath).toEqual(['path', 0]);
    });

    test('should not modify original object when adding a new property', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      // Perhaps using cloneDeep in here is in bad taste?
      const oCopy = _.cloneDeep(o);

      _.set(['new', 'path'], ['foo', 'bar'], o);
      expect(o).toEqual(oCopy);
    });

    test(
      'should not modify original object when changing an existing property',
      () => {
        const o = {
          a: 'a',
          b: { c: 'c' },
          k: { a: { y: 'f' } },
          g: ['h', 'i', 'j'],
        };

        // Perhaps using cloneDeep in here is in bad taste?
        const oCopy = _.cloneDeep(o);

        _.set('b.c', 'd', o);
        expect(o).toEqual(oCopy);
      }
    );

    test(
      'should not maintain the same refs to sub-objects which were changed',
      () => {
        const o = {
          a: 'a',
          b: { c: 'c' },
          k: { a: { y: 'f' } },
          g: ['h', 'i', 'j'],
        };

        const newObj = _.set('k.a.y', 'd', o);
        expect(newObj.k.a).not.toBe(o.k.a);
        expect(newObj.k.a).not.toEqual(o.k.a);
      }
    );

    // Objects outside the given path should remain the same
    test('should maintain the same refs to objects not touched', () => {
      const old = {
        a: {
          prop: 1,
        },
        b: {
          prop2: {
            other: 5,
          },
          c: {
            prop3: 3,
          },
        },
      };

      const changed = _.set('b.c', { prop4: 4 }, old);

      expect(changed).not.toBe(old);
      expect(old.a).toBe(changed.a);
      expect(old.b).not.toBe(changed.b);
      expect(old.b.c).not.toBe(changed.b.c);
      expect(old.b.prop2).toBe(changed.b.prop2);
    });

    test(
      'should throw an error if a segment of the path is not a string or number',
      () => {
        const o = {
          a: 'a',
          b: { c: 'c' },
          k: { a: { y: 'f' } },
          g: ['h', 'i', 'j'],
        };

        try {
          _.set(['new', [0, 1]], ['foo', 'bar'], o);
          // Shouldn't get here; should throw an error
          throw new Error(
            'Should have failed if path is not a string or number.',
          );
        } catch (e) {
          // There's gotta be a better way to do this...
          if (
            e.message === 'Should have failed if path is not a string or number.'
          ) {
            throw e;
          }

          // Public service announcement: Arrays are objects too!
          expect(e.message).toEqual(
            expect.arrayContaining(['Unrecognized path element type: object.']),
          );
        }
      }
    );
  });

  describe('checkValidPath', () => {
    test('should throw an error if a path segment is undefined', () => {
      expect(() => checkValidPath(['asdf', undefined])).to.throw;
    });

    test('should throw an error if a path segment is null', () => {
      expect(() => checkValidPath(['asdf', null])).to.throw;
    });
  });

  describe('omit', () => {
    // So properties can be compared with ===
    // Useful in shouldComponentUpdate, for instance
    test('should not return a deep clone of an object', () => {
      const obj = {
        a: 'a',
        b: {
          c: 'c',
        },
      };

      const newObj = _.omit(['a'], obj);
      expect(newObj.b).toBe(obj.b);
    });

    test(
      'should return the same reference to the root object if no fields are omitted',
      () => {
        const obj = { a: 'a' };
        const newObj = _.omit(['b'], obj);
        expect(newObj).toBe(obj);
      }
    );

    test('should omit all the fields passed in', () => {
      const obj = {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
      };
      const omittedFields = ['a', 'c', 'd'];
      const newObj = _.omit(omittedFields, obj);
      omittedFields.forEach(f => expect(newObj[f]).toBeUndefined());
    });

    test('should retain all fields not passed in', () => {
      const obj = {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
      };
      const omittedFields = ['a', 'c', 'd'];
      const newObj = _.omit(omittedFields, obj);
      Object.keys(newObj).forEach(f => {
        if (!omittedFields.includes(f)) {
          expect(newObj[f]).toEqual(obj[f]);
        }
      });
    });
  });

  describe('debounce', () => {
    test('should call a function with the supplied arguments', done => {
      const spy = sinon.spy();
      const debouncedFunc = _.debounce(0, spy);
      debouncedFunc('first arg', 'second arg');
      setTimeout(() => {
        expect(spy.called).toBe(true);
        expect(spy.firstCall.args).toEqual(['first arg', 'second arg']);
        done();
      }, 10);
    });

    test('should call a function after a waiting period', done => {
      const spy = sinon.spy();
      const debouncedFunc = _.debounce(100, spy);
      debouncedFunc();
      expect(spy.called).toBe(false);
      setTimeout(() => {
        expect(spy.called).toBe(true);
        done();
      }, 150);
    });

    test('should not call a function before the wait time is over', done => {
      const spy = sinon.spy();
      const debouncedFunc = _.debounce(100, spy);
      debouncedFunc();
      expect(spy.called).toBe(false);

      // Call the function every 50 ms so it resets the timeout clock
      setTimeout(() => {
        debouncedFunc();
        expect(spy.called).toBe(false);
      }, 50);
      setTimeout(() => {
        debouncedFunc();
        expect(spy.called).toBe(false);
      }, 100);
      setTimeout(() => {
        debouncedFunc();
        expect(spy.called).toBe(false);
      }, 150);
      setTimeout(() => {
        debouncedFunc();
        expect(spy.called).toBe(false);
      }, 200);
      // And finally, check to make sure it's only been called once
      setTimeout(() => {
        expect(spy.callCount).toBe(1);
        done();
      }, 350);
    });

    test("should not call the function after it's been canceled", done => {
      const spy = sinon.spy();
      const debouncedFunction = _.debounce(100, spy);
      debouncedFunction();
      setTimeout(() => debouncedFunction.cancel(), 50);
      setTimeout(() => {
        expect(spy.callCount).toBe(0);
        done();
      }, 200);
    });
  });

  describe('unset', () => {
    test('remove item at path', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.unset('b.c', o);
      expect(newObj.b.c).toBeUndefined();
      // Expect everything else to be equal
      Object.keys(o).forEach(key => {
        if (key !== 'b') {
          expect(o[key]).toEqual(newObj[key]);
        }
      });
    });

    test('remove item at first level', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.unset('b', o);
      expect(newObj.b).toBeUndefined();
      // Expect everything else to be equal
      Object.keys(o).forEach(key => {
        if (key !== 'b') {
          expect(o[key]).toEqual(newObj[key]);
        }
      });
    });

    test('unchanged if path does not exist', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j'],
      };

      const newObj = _.unset('g.c', o);
      expect(newObj).toEqual(o);
      // Expect everything else to be equal
      Object.keys(o).forEach(key => {
        expect(o[key]).toEqual(newObj[key]);
      });
    });
  });

  describe('removeDeeplyEmptyObjects', () => {
    test('should not remove non-empty objects', () => {
      const data = { level1: { level2: "I'm not empty!" } };
      expect(removeDeeplyEmptyObjects(data)).toBe(data);
    });
    test('should remove empty objects', () => {
      const data = { level1: {} };
      expect(removeDeeplyEmptyObjects(data)).toEqual({});
    });
    test('should remove deeply empty objects', () => {
      const data = { level1: { level2: {} } };
      expect(removeDeeplyEmptyObjects(data)).toEqual({});
    });
    test(
      'should remove deeply empty objects while keeping deeply non-empty objects',
      () => {
        const data = { level1: { level2: {}, level2Filled: 'I am full' } };
        expect(removeDeeplyEmptyObjects(data)).toEqual({
          level1: { level2Filled: 'I am full' },
        });
      }
    );
    test('should remove multiple sibling objects', () => {
      const data = { level1: { first: {}, second: {} } };
      expect(removeDeeplyEmptyObjects(data)).toEqual({});
    });
    test('should consider null and undefined as empty by default', () => {
      const data = {
        noGood: undefined,
        stillNoGood: null,
      };
      expect(removeDeeplyEmptyObjects(data)).toEqual({});
    });
  });
  describe('deduplicate', () => {
    test('should return a list of unique items', () => {
      const uniques = deduplicate([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
      expect(uniques).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
      expect(uniques.length).toBe(5);
    });
  });
});
