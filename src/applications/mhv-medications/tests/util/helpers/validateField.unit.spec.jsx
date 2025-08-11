import { expect } from 'chai';
import { validateField } from '../../../util/helpers';
import { FIELD_NONE_NOTED } from '../../../util/constants';

describe('Validate Field function', () => {
  it('should return the value', () => {
    expect(validateField('Test')).to.equal('Test');
  });

  it("should return 'None noted' when no values are passed", () => {
    expect(validateField()).to.equal(FIELD_NONE_NOTED);
  });

  it('should return 0', () => {
    expect(validateField(0)).to.equal(0);
  });
});
