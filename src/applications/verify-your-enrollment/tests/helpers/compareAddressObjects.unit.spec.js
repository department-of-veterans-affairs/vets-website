import { expect } from 'chai';
import { compareAddressObjects } from '../../helpers';

describe('compareAddressObjects', () => {
  it('should return true if objects have the same keys with different values', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };
    expect(compareAddressObjects(obj1, obj2)).to.be.true;
  });

  it('should return false if both objects are identical', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(compareAddressObjects(obj1, obj2)).to.be.false;
  });

  it('should return false if both objects are empty', () => {
    const obj1 = {};
    const obj2 = {};
    expect(compareAddressObjects(obj1, obj2)).to.be.false;
  });

  it('should return false when comparing objects with different keys but ignore extra keys', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2 };
    const obj3 = { a: 1, b: 2, d: 4 };
    expect(compareAddressObjects(obj1, obj2)).to.be.false;
    expect(compareAddressObjects(obj1, obj3)).to.be.false;
    expect(compareAddressObjects(obj2, obj3)).to.be.false;
  });

  it('should return true if objects share some keys with different values, ignoring extra keys', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 3, d: 4 };
    expect(compareAddressObjects(obj1, obj2)).to.be.true;
  });
});
