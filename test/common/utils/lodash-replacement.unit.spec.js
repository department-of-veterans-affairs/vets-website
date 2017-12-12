import { expect } from 'chai';

import {
  deconstructPath,
  clone,
  cloneDeep,
  get,
  set
} from '../../../src/js/common/utils/lodash-replacement';


describe('lodash replacements', () => {
  describe('deconstructPath', () => {
    it('should deconstruct a string path into an array', () => {
      const strPath = 'a.b[4].c';
      expect(deconstructPath(strPath)).to.eql(['a', 'b', 4, 'c']);
    });
  });


  describe('clone', () => {
    it('should return an object with the same data but different reference', () => {
      const obj = {
        a: 1,
        b: 2
      };
      const cloned = clone(obj);
      expect(cloned).to.eql(obj);
      expect(cloned).to.not.equal(obj);
    });
  });


  describe('cloneDeep', () => {
    const obj = {
      'int': 1,
      obj: {
        foo: 'bar',
        nestedObj: {
          nestedArray: [0, 2, 4]
        }
      },
      string: 'string!',
      array: ['0', 1, null, { s: 'thing', o: { k: 'I am nested' } }],
      func: function() { return this.int; }, // eslint-disable-line
      arrowFunction: () => this.int
    };

    const cloned = cloneDeep(obj);

    it('should return an object with a different reference', () => {
      expect(cloned).to.eql(obj);
      expect(cloned).to.not.equal(obj);
    });

    it('should clone all sub-objects', () => {
      expect(cloned.obj).to.eql(obj.obj);
      expect(cloned.obj).to.not.equal(obj.obj);
    });

    it('should clone all sub-arrays', () => {
      expect(cloned.array).to.eql(obj.array);
      expect(cloned.array).to.not.equal(obj.array);
      expect(cloned.obj.nestedObj.nestedArray).to.eql(obj.obj.nestedObj.nestedArray);
      expect(cloned.obj.nestedObj.nestedArray).to.not.equal(obj.obj.nestedObj.nestedArray);
    });

    it('should clone all objects in arrays', () => {
      expect(cloned.array[3]).to.eql(obj.array[3]);
      expect(cloned.array[3]).to.not.equal(obj.array[3]);
    });
  });


  describe('get', () => {
    const o = {
      a: 'a',
      b: { c: 'c' },
      k: { a: { y: 'f' } },
      g: ['h', 'i', 'j']
    };

    it('should get a value one level deep', () => {
      expect(get(o, 'a')).to.equal(o.a);
    });

    it('should get a value n levels deep', () => {
      expect(get(o, 'b.c')).to.equal(o.b.c);
      expect(get(o, 'k.a.y')).to.equal(o.k.a.y);
    });

    it('should handle array indexes', () => {
      expect(get(o, 'g[2]')).to.equal(o.g[2]);
    });

    it('should handle an array path', () => {
      expect(get(o, ['k', 'a', 'y'])).to.equal(o.k.a.y);
    });

    it('should return a default value if not found', () => {
      expect(get(o, 'does.not.exist', 'default')).to.equal('default');
    });

    it('should return undefined if not found and no default is provided', () => {
      expect(get(o, 'does.not.exist')).to.equal();
    });
  });


  describe('set', () => {
    it('should set the value of an existing path', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j']
      };

      const newObj = set(o, 'b.c', 'd');
      expect(newObj.b.c).to.equal('d');
    });

    it('should set the value of a path that doesn\'t exist yet', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j']
      };

      const newObj = set(o, 'new.path', ['foo', 'bar']);
      expect(newObj.new.path).to.eql(['foo', 'bar']);
    });

    it('should handle an array path', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j']
      };

      const newObj = set(o, ['new', 'path'], ['foo', 'bar']);
      expect(newObj.new.path).to.eql(['foo', 'bar']);
    });

    it('should not modify original object', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j']
      };

      // Perhaps using cloneDeep in here is in bad taste?
      const oCopy = cloneDeep(o);

      set(o, ['new', 'path'], ['foo', 'bar']);
      expect(o).to.eql(oCopy);
    });

    it('should throw an error if a segment of the path is not a string or number', () => {
      const o = {
        a: 'a',
        b: { c: 'c' },
        k: { a: { y: 'f' } },
        g: ['h', 'i', 'j']
      };

      try {
        set(o, ['new', [0, 1]], ['foo', 'bar']);
        // Shouldn't get here; should throw an error
        expect(true).to.be.false;
      } catch (e) {
        // Public service announcement: Arrays are objects too!
        expect(e.message).to.contain('Unrecognized path element type: object.');
      }
    });
  });
});

