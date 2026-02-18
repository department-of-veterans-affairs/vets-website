import { expect } from 'chai';
import formConfig from '../../config/form';

describe('Edu 1995 guardianInformation depends logic', () => {
  const guardianInfoPage =
    formConfig.chapters.guardianInformation.pages.guardianInformation;

  describe('Legacy flow', () => {
    it('should show guardian information page for applicant under 18 with any benefit type', () => {
      const formData = {
        dateOfBirth: '2010-01-01', // Under 18
        benefitUpdate: 'chapter33',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.true;
    });

    it('should show guardian information page for applicant under 18 with chapter35', () => {
      const formData = {
        dateOfBirth: '2010-01-01', // Under 18
        benefitUpdate: 'chapter35',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.true;
    });

    it('should show guardian information page for applicant under 18 with chapter30', () => {
      const formData = {
        dateOfBirth: '2010-01-01', // Under 18
        benefitUpdate: 'chapter30',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.true;
    });

    it('should NOT show guardian information page for applicant 18 or older', () => {
      const formData = {
        dateOfBirth: '2000-01-01', // Over 18
        benefitUpdate: 'chapter33',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });

    it('should NOT show guardian information page for applicant 18 or older with chapter35', () => {
      const formData = {
        dateOfBirth: '2000-01-01', // Over 18
        benefitUpdate: 'chapter35',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });

    it('should NOT show guardian information page when dateOfBirth is missing', () => {
      const formData = {
        benefitUpdate: 'chapter33',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });

    it('should NOT show guardian information page when dateOfBirth is invalid', () => {
      const formData = {
        dateOfBirth: 'invalid-date',
        benefitUpdate: 'chapter33',
        isMeb1995Reroute: false,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });
  });

  describe('MEB reroute flow', () => {
    it('should NOT show guardian information page when in MEB reroute flow (even if under 18)', () => {
      const formData = {
        dateOfBirth: '2010-01-01', // Under 18
        benefitUpdate: 'chapter33',
        isMeb1995Reroute: true,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });

    it('should NOT show guardian information page when in MEB reroute flow with chapter35', () => {
      const formData = {
        dateOfBirth: '2010-01-01', // Under 18
        benefitUpdate: 'chapter35',
        isMeb1995Reroute: true,
      };
      expect(guardianInfoPage.depends(formData)).to.be.false;
    });
  });
});
