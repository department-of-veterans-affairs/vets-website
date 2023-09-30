import sinon from 'sinon';
import { expect } from 'chai';

import { textInputNumericRange } from '../../validations';

describe('textInputNumericRange', () => {
  it('should add an error if the number of copies is less than the minimum range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '2' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(
      errors.copies.addError.calledWith(
        `Please raise your number to at least ${input.range.min}`,
      ),
    ).to.be.true;
  });

  it('should add an error if the number of copies is greater than the maximum range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '11' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(
      errors.copies.addError.calledWith(
        'Please lower your number to less than 10',
      ),
    ).to.be.true;
  });

  it('should not add an error if the number of copies is within the range', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '5' };
    const input = { schemaKey: 'copies', range: { min: 3, max: 10 } };
    textInputNumericRange(errors, formData, input);
    expect(errors.copies.addError.called).to.be.false;
  });

  it('should use custom error messages if provided', () => {
    const errors = { copies: { addError: sinon.stub() } };
    const formData = { copies: '2' };
    const input = {
      schemaKey: 'copies',
      range: { min: 3, max: 10 },
      customErrorMessages: { min: 'Custom min error message' },
    };
    textInputNumericRange(errors, formData, input);
    expect(errors.copies.addError.calledWith('Custom min error message')).to.be
      .true;
  });
});
