import { expect } from 'chai';
import { noSuggestedAddress } from '../../helpers';
import { BAD_UNIT_NUMBER, MISSING_UNIT_NUMBER } from '../../constants';

describe('noSuggestedAddress', () => {
  it('should return true for BAD_UNIT_NUMBER', () => {
    expect(noSuggestedAddress(BAD_UNIT_NUMBER)).to.be.true;
  });

  it('should return true for MISSING_UNIT_NUMBER', () => {
    expect(noSuggestedAddress(MISSING_UNIT_NUMBER)).to.be.true;
  });

  it('should return true for MISSING_ZIP', () => {
    expect(noSuggestedAddress('MISSING_ZIP')).to.be.true;
  });

  it('should return false for other values', () => {
    expect(noSuggestedAddress('OTHER_VALUE')).to.be.false;
  });
});
