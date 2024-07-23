import { expect } from 'chai';
import { hasFormChanged } from '../../helpers';

describe('hasFormChanged', () => {
  it('should returns true if any key has a value that is not undefined', () => {
    const obj = {
      a: 1,
      b: undefined,
      c: {},
    };
    expect(hasFormChanged(obj)).to.be.true;
  });

  it('should returns false if all keys have values that are undefined or empty objects', () => {
    const obj = {
      a: undefined,
      'view:livesOnMilitaryBaseInfo': {},
      c: undefined,
    };
    expect(hasFormChanged(obj)).to.be.false;
  });

  it('should returns true if any key has a non-empty object', () => {
    const obj = {
      a: {},
      b: { key: 'value' },
      c: undefined,
    };
    expect(hasFormChanged(obj)).to.be.true;
  });

  it('should returns false if the object is empty', () => {
    const obj = {};
    expect(hasFormChanged(obj)).to.be.false;
  });

  it('should skips the key view:livesOnMilitaryBaseInfo', () => {
    const obj = {
      'view:livesOnMilitaryBaseInfo': {},
      a: undefined,
      b: undefined,
    };
    expect(hasFormChanged(obj)).to.be.false;
  });

  it('should stills return true if there are other keys with non-undefined or non-empty values', () => {
    const obj = {
      'view:livesOnMilitaryBaseInfo': {},
      a: undefined,
      b: { key: 'value' },
    };
    expect(hasFormChanged(obj)).to.be.true;
  });

  it('should return false if object is null or undefined', () => {
    expect(hasFormChanged(null)).to.be.false;
    expect(hasFormChanged(undefined)).to.be.false;
  });
});
