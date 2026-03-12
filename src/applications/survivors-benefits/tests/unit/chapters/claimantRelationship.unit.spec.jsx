import { expect } from 'chai';
import claimantRelationship from '../../../config/chapters/claimantRelationship';

describe('Claimant Relationship with different data sets', () => {
  it('should show claimantOther page when claimantRelationship is OTHER', () => {
    const { pages } = claimantRelationship;
    const { claimantOther } = pages;

    const relationshipOther = { claimantRelationship: 'OTHER' };
    const survivingSpouse = { claimantRelationship: 'SURVIVING_SPOUSE' };
    const custodian = {
      claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18',
    };
    const adultChild = { claimantRelationship: 'CHILD_18-23_IN_SCHOOL' };
    const helplessAdultChild = {
      claimantRelationship: 'HELPLESS_ADULT_CHILD',
    };

    // Should show when claimant relationship is OTHER
    expect(claimantOther.depends(relationshipOther)).to.be.true;

    // Should NOT show for any other valid relationship
    expect(claimantOther.depends(survivingSpouse)).to.be.false;
    expect(claimantOther.depends(custodian)).to.be.false;
    expect(claimantOther.depends(adultChild)).to.be.false;
    expect(claimantOther.depends(helplessAdultChild)).to.be.false;
  });
});
