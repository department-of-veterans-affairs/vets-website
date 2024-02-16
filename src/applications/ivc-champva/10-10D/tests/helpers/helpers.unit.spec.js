import { expect } from 'chai';
import { applicantWording } from '../../helpers/wordingCustomization';

describe('applicantWording helper', () => {
  it('should concatenate first and last names', () => {
    expect(
      applicantWording({
        applicantName: { first: 'firstname', last: 'lastname' },
      }),
    ).to.equal("firstname lastname's ");
  });
});
