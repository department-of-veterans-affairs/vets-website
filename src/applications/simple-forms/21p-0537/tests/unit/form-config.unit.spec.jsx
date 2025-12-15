import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21P-0537 form config conditional dependencies', () => {
  describe('marriageInfo page', () => {
    const dependsFn =
      formConfig.chapters.maritalDetailsChapter.pages.marriageInfo.depends;

    it('should be visible when hasRemarried is true', () => {
      const formData = { hasRemarried: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasRemarried is false', () => {
      const formData = { hasRemarried: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasRemarried is undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('spouseVeteranStatus page', () => {
    const dependsFn =
      formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranStatus
        .depends;

    it('should be visible when hasRemarried is true', () => {
      const formData = { hasRemarried: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasRemarried is false', () => {
      const formData = { hasRemarried: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasRemarried is undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('spouseVeteranId page', () => {
    const dependsFn =
      formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranId.depends;

    it('should be visible when hasRemarried is true and spouseIsVeteran is true', () => {
      const formData = {
        hasRemarried: true,
        remarriage: { spouseIsVeteran: true },
      };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasRemarried is false', () => {
      const formData = {
        hasRemarried: false,
        remarriage: { spouseIsVeteran: true },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasRemarried is undefined', () => {
      const formData = {
        remarriage: { spouseIsVeteran: true },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when spouseIsVeteran is false', () => {
      const formData = {
        hasRemarried: true,
        remarriage: { spouseIsVeteran: false },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when spouseIsVeteran is undefined', () => {
      const formData = {
        hasRemarried: true,
        remarriage: {},
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when remarriage object is undefined', () => {
      const formData = { hasRemarried: true };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should handle null remarriage object', () => {
      const formData = {
        hasRemarried: true,
        remarriage: null,
      };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('terminationStatus page', () => {
    const dependsFn =
      formConfig.chapters.maritalDetailsChapter.pages.terminationStatus.depends;

    it('should be visible when hasRemarried is true', () => {
      const formData = { hasRemarried: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasRemarried is false', () => {
      const formData = { hasRemarried: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasRemarried is undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('terminationDetails page', () => {
    const dependsFn =
      formConfig.chapters.maritalDetailsChapter.pages.terminationDetails
        .depends;

    it('should be visible when hasRemarried is true and hasTerminated is true', () => {
      const formData = {
        hasRemarried: true,
        remarriage: { hasTerminated: true },
      };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasRemarried is false', () => {
      const formData = {
        hasRemarried: false,
        remarriage: { hasTerminated: true },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasRemarried is undefined', () => {
      const formData = {
        remarriage: { hasTerminated: true },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasTerminated is false', () => {
      const formData = {
        hasRemarried: true,
        remarriage: { hasTerminated: false },
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasTerminated is undefined', () => {
      const formData = {
        hasRemarried: true,
        remarriage: {},
      };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when remarriage object is undefined', () => {
      const formData = { hasRemarried: true };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should handle null remarriage object', () => {
      const formData = {
        hasRemarried: true,
        remarriage: null,
      };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('form configuration structure', () => {
    it('should have all required chapters', () => {
      expect(formConfig.chapters).to.have.property('veteranInfoChapter');
      expect(formConfig.chapters).to.have.property(
        'eligibilityScreeningChapter',
      );
      expect(formConfig.chapters).to.have.property('maritalDetailsChapter');
      expect(formConfig.chapters).to.have.property('contactInfoChapter');
    });

    it('should have correct form ID', () => {
      expect(formConfig.formId).to.include('21P-0537');
    });

    it('should have prefill enabled', () => {
      expect(formConfig.prefillEnabled).to.be.true;
    });

    it('should have v3SegmentedProgressBar enabled', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });

    it('should have useCustomScrollAndFocus enabled', () => {
      expect(formConfig.useCustomScrollAndFocus).to.be.true;
    });

    it('should have correct fullNamePath in statementOfTruth', () => {
      expect(formConfig.preSubmitInfo.statementOfTruth.fullNamePath).to.include(
        'view:recipientName',
      );
    });
  });

  describe('page dependencies comprehensive test', () => {
    it('should show correct pages for not remarried scenario', () => {
      const formData = { hasRemarried: false };

      // Pages that should NOT be visible
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.marriageInfo.depends(
          formData,
        ),
      ).to.be.false;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranStatus.depends(
          formData,
        ),
      ).to.be.false;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranId.depends(
          formData,
        ),
      ).to.be.false;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationStatus.depends(
          formData,
        ),
      ).to.be.false;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationDetails.depends(
          formData,
        ),
      ).to.be.false;
    });

    it('should show correct pages for remarried, spouse is veteran, marriage ongoing', () => {
      const formData = {
        hasRemarried: true,
        remarriage: {
          spouseIsVeteran: true,
          hasTerminated: false,
        },
      };

      // Pages that SHOULD be visible
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.marriageInfo.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranStatus.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranId.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationStatus.depends(
          formData,
        ),
      ).to.be.true;

      // Pages that should NOT be visible
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationDetails.depends(
          formData,
        ),
      ).to.be.false;
    });

    it('should show correct pages for remarried, spouse not veteran, marriage terminated', () => {
      const formData = {
        hasRemarried: true,
        remarriage: {
          spouseIsVeteran: false,
          hasTerminated: true,
        },
      };

      // Pages that SHOULD be visible
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.marriageInfo.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranStatus.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationStatus.depends(
          formData,
        ),
      ).to.be.true;
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.terminationDetails.depends(
          formData,
        ),
      ).to.be.true;

      // Pages that should NOT be visible
      expect(
        formConfig.chapters.maritalDetailsChapter.pages.spouseVeteranId.depends(
          formData,
        ),
      ).to.be.false;
    });
  });
});
