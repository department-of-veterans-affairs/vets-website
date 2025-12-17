import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Edu 1995 sponsorInformation depends logic', () => {
  const sponsorInfoPage =
    formConfig.chapters.sponsorInformation.pages.sponsorInformation;

  it('should NOT show sponsor information page for chapter1606 benefit', () => {
    const formData = {
      benefitUpdate: 'chapter1606',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.false;
  });

  it('should NOT show sponsor information page for chapter30 benefit', () => {
    const formData = {
      benefitUpdate: 'chapter30',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.false;
  });

  it('should NOT show sponsor information page for chapter33 benefit', () => {
    const formData = {
      benefitUpdate: 'chapter33',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.false;
  });

  it('should show sponsor information page for chapter35 benefit (benefitUpdate)', () => {
    const formData = {
      benefitUpdate: 'chapter35',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.true;
  });

  it('should show sponsor information page for chapter35 benefit (benefitAppliedFor)', () => {
    const formData = {
      benefitAppliedFor: 'chapter35',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.true;
  });

  it('should NOT show sponsor information page when in MEB reroute flow', () => {
    const formData = {
      benefitUpdate: 'chapter35',
      isMeb1995Reroute: true,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.false;
  });

  it('should NOT show sponsor information page when benefit is not chapter35', () => {
    const formData = {
      benefitUpdate: 'fryScholarship',
      isMeb1995Reroute: false,
    };
    expect(sponsorInfoPage.depends(formData)).to.be.false;
  });
});
