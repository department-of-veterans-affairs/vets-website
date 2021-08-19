import { expect } from 'chai';
import { spy } from 'sinon';
import { preventLargeFields } from '../index';

describe('health care questionnaire -- validators -- field length -- preventLargeFields', () => {
  it('should not add error with data is smaller than 500_000', () => {
    const errors = {
      addError: spy(),
    };
    preventLargeFields(errors, 'test');
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should add error with data is bigger than 500_000', () => {
    const errors = {
      addError: spy(),
    };
    preventLargeFields(errors, 'x'.repeat(500_001));
    expect(errors.addError.called).to.be.true;
    expect(
      errors.addError.calledWith(
        'This field should be less than 500,000 characters. Please remove 1 characters',
      ),
    ).to.be.true;
  });
});
