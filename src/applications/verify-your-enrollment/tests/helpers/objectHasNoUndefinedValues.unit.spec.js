import { expect } from 'chai';
import { objectHasNoUndefinedValues } from '../../helpers';

describe('objectHasNoUndefinedValues', () => {
  it('should return true if all object keys have values', () => {
    const obj = {
      city: 'some city',
      state: 'some state',
      zipCode: '89102',
    };
    expect(objectHasNoUndefinedValues(obj)).to.be.true;
  });
  it('should return true if one object key have no value', () => {
    const obj = {
      city: 'some city',
      state: 'some state',
      zipCode: undefined,
    };
    expect(objectHasNoUndefinedValues(obj)).to.be.false;
  });
});
