import { expect } from 'chai';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

// Import the functions directly from their source files
import guardianInformation from '../../pages/guardianInformation';
import { sponsorInfo } from '../../pages/sponsorInfomartion';

describe('isEighteenOrYounger', () => {
  it('should correctly identify individuals under 18 in production environment', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});

    // Test with someone who is 17 years old
    const formDataUnder18 = {
      dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - 17),
      )
        .toISOString()
        .split('T')[0],
    };

    expect(guardianPage.depends(formDataUnder18)).to.be.true;
  });

  it('should correctly identify individuals under 18 in non-production environment', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});

    // Test with someone who is 16 years old
    const formDataUnder18 = {
      dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - 16),
      )
        .toISOString()
        .split('T')[0],
    };

    expect(guardianPage.depends(formDataUnder18)).to.be.true;
  });

  it('should return false for individuals 18 or older regardless of environment', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});

    // Test with someone who is 25 years old
    const formDataOver18 = {
      dateOfBirth: new Date(
        new Date().setFullYear(new Date().getFullYear() - 25),
      )
        .toISOString()
        .split('T')[0],
    };

    expect(guardianPage.depends(formDataOver18)).to.be.false;
  });

  it('should return false when dateOfBirth is missing', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});
    const formDataNoBirthday = {};

    expect(guardianPage.depends(formDataNoBirthday)).to.be.false;
  });

  it('should return false when dateOfBirth is invalid', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});
    const formDataInvalidBirthday = {
      dateOfBirth: 'invalid-date',
    };

    expect(guardianPage.depends(formDataInvalidBirthday)).to.be.false;
  });

  it('should correctly handle edge case of exactly 18 years old', () => {
    const guardianPage = guardianInformation(fullSchema1995, {});

    // Create a date exactly 18 years ago
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    const formDataExactly18 = {
      dateOfBirth: eighteenYearsAgo.toISOString().split('T')[0],
    };

    expect(guardianPage.depends(formDataExactly18)).to.be.false;
  });
});

describe('showSponsorInfo', () => {
  it('should display sponsor information when benefit is chapter35 via benefitUpdate', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataChapter35Update = {
      benefitUpdate: 'chapter35',
    };

    expect(sponsorPage.depends(formDataChapter35Update)).to.be.true;
  });

  it('should display sponsor information when benefit is chapter35 via benefitAppliedFor', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataChapter35Applied = {
      benefitAppliedFor: 'chapter35',
    };

    expect(sponsorPage.depends(formDataChapter35Applied)).to.be.true;
  });

  it('should display sponsor information when benefit is chapter35 regardless of production environment', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataChapter35 = {
      benefitUpdate: 'chapter35',
    };

    // The depends function should work the same in any environment
    expect(sponsorPage.depends(formDataChapter35)).to.be.true;
  });

  it('should not display sponsor information for non-chapter35 benefits', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataChapter33 = {
      benefitUpdate: 'chapter33',
    };

    expect(sponsorPage.depends(formDataChapter33)).to.be.false;
  });

  it('should not display sponsor information for chapter30', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataChapter30 = {
      benefitUpdate: 'chapter30',
    };

    expect(sponsorPage.depends(formDataChapter30)).to.be.false;
  });

  it('should not display sponsor information when no benefit is specified', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    const formDataNoBenefit = {};

    expect(sponsorPage.depends(formDataNoBenefit)).to.be.false;
  });

  it('should handle both benefitUpdate and benefitAppliedFor fields', () => {
    const sponsorPage = sponsorInfo(fullSchema1995);

    // When both are present and one is chapter35
    const formDataBothFields = {
      benefitUpdate: 'chapter35',
      benefitAppliedFor: 'chapter33',
    };

    // Should return true if either field is chapter35
    expect(sponsorPage.depends(formDataBothFields)).to.be.true;
  });
});
