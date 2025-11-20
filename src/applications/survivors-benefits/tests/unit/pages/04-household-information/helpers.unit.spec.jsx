import { expect } from 'chai';
import { shouldShowPreviousMarriages } from '../../../../config/chapters/04-household-information/helpers';

describe('shouldShowPreviousMarriages', () => {
  it('should return true if hadPreviousMarriages is true', () => {
    const formData = {
      hadPreviousMarriages: true,
    };
    const result = shouldShowPreviousMarriages(formData);
    expect(result).to.be.true;
  });

  it('should return false if hadPreviousMarriages is false', () => {
    const formData = {
      hadPreviousMarriages: false,
    };
    const result = shouldShowPreviousMarriages(formData);
    expect(result).to.be.false;
  });
  it('should return false if hadPreviousMarriages is undefined', () => {
    const formData = {};
    const result = shouldShowPreviousMarriages(formData);
    expect(result).to.be.false;
  });
});
