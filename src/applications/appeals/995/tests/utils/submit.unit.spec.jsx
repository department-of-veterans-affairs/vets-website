import { expect } from 'chai';

import { getClaimantData } from '../../utils/submit';

describe('getClaimantData', () => {
  // "other" types are not implemented, but there is some minimal code in place
  it('should handle "other" claimant types', () => {
    expect(
      getClaimantData({
        claimantType: 'other',
        claimantTypeOtherValue: 'Twenty-five characters max',
      }),
    ).to.deep.equal({
      claimantType: 'other',
      claimantTypeOtherValue: 'Twenty-five characters ma',
    });
  });
});
