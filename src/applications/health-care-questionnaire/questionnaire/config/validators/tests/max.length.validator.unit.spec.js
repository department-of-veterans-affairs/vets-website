import { expect } from 'chai';
import { spy } from 'sinon';
import { maxLength } from '../index';

describe('health care questionnaire -- validators -- field length -- preventLargeFields', () => {
  it('should not add error with data is smaller than max', () => {
    const max = 10;
    const errors = {
      addError: spy(),
    };
    maxLength(max, errors, 'test');
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should add error with data is bigger than max', () => {
    const max = 10;
    const errors = {
      addError: spy(),
    };
    maxLength(max, errors, 'this is longer than ten characters');
    expect(errors.addError.called).to.be.true;
    expect(
      errors.addError.calledWith(
        'This field should be less than 10 characters. Please remove 24 characters',
      ),
    ).to.be.true;
  });
  it("should not call if fieldData doesn't exists", () => {
    const max = 10;
    const errors = {
      addError: spy(),
    };
    maxLength(max, errors, null);
    expect(errors.addError.called).to.be.false;
  });
  it("should not call if errors doesn't exists", () => {
    const max = 10;
    const errors = {
      addError: spy(),
    };
    maxLength(max, null, null);
    expect(errors.addError.called).to.be.false;
  });
});
