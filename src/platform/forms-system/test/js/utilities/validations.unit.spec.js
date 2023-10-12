import { expect } from 'chai';

import { checkValidations } from '../../../src/js/utilities/validations';

describe('checkValidations', () => {
  // simple validation functions
  const check1 = (errors, data) => {
    if (!data.foo) {
      errors.addError('no foo');
    }
  };
  const check2 = (errors, data) => {
    if (!data.bar) {
      errors.addError('no bar');
    }
  };
  it('should return error messages', () => {
    expect(checkValidations([check1])).to.deep.equal(['no foo']);
    expect(checkValidations([check1], { bar: '' })).to.deep.equal(['no foo']);
    expect(
      checkValidations([check1, check2], { foo: null, bar: null }),
    ).to.deep.equal(['no foo', 'no bar']);
  });
  it('should not return any error messages', () => {
    expect(checkValidations([check1], { foo: 'yes' })).to.deep.equal([]);
    expect(checkValidations([check2], { bar: 'maybe' })).to.deep.equal([]);
    expect(
      checkValidations([check1, check2], { foo: '123', bar: '456' }),
    ).to.deep.equal([]);
  });
});
