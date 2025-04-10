import { expect } from 'chai';

import { isVerificationEndDateValid } from '../../helpers';

describe('isVerificationEndDateValid', () => {
  it('should returns true for current or past dates ', () => {
    const result = isVerificationEndDateValid('2024-05-27');
    expect(result).to.be.true;
  });

  it('should returns false for future dates', () => {
    const result = isVerificationEndDateValid('2024-11-01');
    expect(result).to.be.true;
  });
});
