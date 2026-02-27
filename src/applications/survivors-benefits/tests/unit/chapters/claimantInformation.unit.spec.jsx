import { expect } from 'chai';
import claimantInformation from '../../../config/chapters/claimantInformation';

describe('Claimant Information with different data sets', () => {
  const relationshipOther = { claimantRelationship: 'OTHER' };
  const survivingSpouse = { claimantRelationship: 'SURVIVING_SPOUSE' };
  const custodian = {
    claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18',
  };
  const adultChild = { claimantRelationship: 'CHILD_18-23_IN_SCHOOL' };
  const helplessAdultChild = {
    claimantRelationship: 'HELPLESS_ADULT_CHILD',
  };
  it('should show the correct title based on relationship', () => {
    const { title } = claimantInformation;
    // Title for custodian filing for child under 18
    expect(title({ formData: custodian })).to.equal('Child’s information');

    // Title for other relationships
    expect(title({ formData: relationshipOther })).to.equal('Your information');
    expect(title({ formData: survivingSpouse })).to.equal('Your information');
    expect(title({ formData: adultChild })).to.equal('Your information');
    expect(title({ formData: helplessAdultChild })).to.equal(
      'Your information',
    );
  });
  it('should show claimantOther page when claimantRelationship is OTHER', () => {
    const { pages } = claimantInformation;
    const { claimantHistory } = pages;

    // Should show for other relationships.
    expect(claimantHistory.depends(relationshipOther)).to.be.true;
    expect(claimantHistory.depends(survivingSpouse)).to.be.true;
    expect(claimantHistory.depends(adultChild)).to.be.true;
    expect(claimantHistory.depends(helplessAdultChild)).to.be.true;

    // Should NOT show for custodian.
    expect(claimantHistory.depends(custodian)).to.be.false;
  });
});
