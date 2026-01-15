import { expect } from 'chai';

import { defaultFocusSelector } from 'platform/utilities/ui';

import {
  CLAIM_OWNERSHIPS,
  CLAIMANT_TYPES,
  OTHER_RELATIONSHIP,
} from '../definitions/constants';
import {
  getFullNamePath,
  witnessHasOtherRelationship,
  getFocusSelectorFromPath,
} from '../utils';

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
      witnessRelationshipToClaimant: {
        [OTHER_RELATIONSHIP]: true,
      },
    };
    expect(witnessHasOtherRelationship(formData)).to.deep.equal(true);
  });

  it('should return false if they have not specified other relationship', () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
      witnessRelationshipToClaimant: {
        [OTHER_RELATIONSHIP]: false,
      },
    };
    expect(witnessHasOtherRelationship(formData)).to.deep.equal(false);
  });

  it('should return false if witnessRelationshipToClaimant is undefined', () => {
    const formData = {
      claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    };
    expect(witnessHasOtherRelationship(formData)).to.deep.equal(false);
  });
});

describe('getFocusSelectorFromPath', () => {
  it('should use custom path for claim-ownership or claimant-type', () => {
    const pathname = '/claim-ownership';
    expect(getFocusSelectorFromPath(pathname)).to.deep.equal(
      '#main .schemaform-first-field legend',
    );
  });

  it('should use default selector for other cases', () => {
    const pathname = '/something-else';
    expect(getFocusSelectorFromPath(pathname)).to.deep.equal(
      defaultFocusSelector,
    );
  });
});
