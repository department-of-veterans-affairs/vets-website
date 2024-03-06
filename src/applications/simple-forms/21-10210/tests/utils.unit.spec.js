import { expect } from 'chai';

import {
  CLAIM_OWNERSHIPS,
  CLAIMANT_TYPES,
  OTHER_RELATIONSHIP,
} from '../definitions/constants';
import { getFullNamePath, witnessHasOtherRelationship } from '../utils';

describe('getFullNamePath for statement of truth', () => {
  it("is a claimant if it's for themselves but not a veteran", () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.SELF,
      claimantType: CLAIMANT_TYPES.NON_VETERAN,
    };
    expect(getFullNamePath(formData)).to.deep.equal('claimantFullName');
  });

  it("is a witness if it's a third party", () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
      claimantType: CLAIMANT_TYPES.VETERAN,
    };
    expect(getFullNamePath(formData)).to.deep.equal('witnessFullName');
  });

  it("is a veteran if it's for themselves and is a veteran", () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.SELF,
      claimantType: CLAIMANT_TYPES.VETERAN,
    };
    expect(getFullNamePath(formData)).to.deep.equal('veteranFullName');
  });
});

describe('witnessHasOtherRelationship', () => {
  it('should return the correct value if they have specified other relationship', () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
      witnessRelationshipToClaimant: OTHER_RELATIONSHIP,
    };
    expect(witnessHasOtherRelationship(formData)).to.deep.equal(true);
  });
});
