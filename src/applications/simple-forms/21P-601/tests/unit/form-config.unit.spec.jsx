import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21P-601 form config', () => {
  describe('form configuration structure', () => {
    it('has correct form ID', () => {
      expect(formConfig.formId).to.equal('21P-601');
    });

    it('has correct title', () => {
      expect(formConfig.title).to.equal(
        'Application for Accrued Amounts Due a Deceased Beneficiary',
      );
    });

    it('has prefill enabled', () => {
      expect(formConfig.prefillEnabled).to.be.true;
    });

    it('has v3SegmentedProgressBar enabled', () => {
      expect(formConfig.v3SegmentedProgressBar).to.be.true;
    });

    it('has useCustomScrollAndFocus enabled', () => {
      expect(formConfig.useCustomScrollAndFocus).to.be.true;
    });

    it('has correct fullNamePath in statementOfTruth', () => {
      expect(formConfig.preSubmitInfo.statementOfTruth.fullNamePath).to.equal(
        'claimantFullName',
      );
    });

    it('has all required chapters', () => {
      expect(formConfig.chapters).to.have.property('eligibilityChapter');
      expect(formConfig.chapters).to.have.property('veteranInformationChapter');
      expect(formConfig.chapters).to.have.property(
        'deceasedBeneficiaryChapter',
      );
      expect(formConfig.chapters).to.have.property('yourInformationChapter');
      expect(formConfig.chapters).to.have.property('survivingRelativesChapter');
      expect(formConfig.chapters).to.have.property('expensesAndDebtsChapter');
      expect(formConfig.chapters).to.have.property('additionalInfoChapter');
    });

    it('has saved form messages', () => {
      expect(formConfig.savedFormMessages).to.exist;
      expect(formConfig.savedFormMessages.notFound).to.exist;
      expect(formConfig.savedFormMessages.noAuth).to.exist;
    });
  });

  describe('eligibilityChapter pages', () => {
    it('has hasAlreadyFiled page', () => {
      const page = formConfig.chapters.eligibilityChapter.pages.hasAlreadyFiled;
      expect(page).to.exist;
      expect(page.path).to.equal('already-filed');
      expect(page.uiSchema).to.exist;
      expect(page.schema).to.exist;
    });

    it('has hasUnpaidCreditors page', () => {
      const page =
        formConfig.chapters.eligibilityChapter.pages.hasUnpaidCreditors;
      expect(page).to.exist;
      expect(page.path).to.equal('unpaid-creditors');
      expect(page.depends).to.be.a('function');
    });

    it('has eligibilitySummary page', () => {
      const page =
        formConfig.chapters.eligibilityChapter.pages.eligibilitySummary;
      expect(page).to.exist;
      expect(page.path).to.equal('eligibility-summary');
      expect(page.hideNavButtons).to.be.true;
      expect(page.customNavButtons).to.be.a('function');
    });

    it('eligibilitySummary customNavButtons returns null', () => {
      const page =
        formConfig.chapters.eligibilityChapter.pages.eligibilitySummary;
      expect(page.customNavButtons()).to.be.null;
    });
  });

  describe('hasUnpaidCreditors page dependencies', () => {
    const dependsFn =
      formConfig.chapters.eligibilityChapter.pages.hasUnpaidCreditors.depends;

    it('should be visible when hasAlreadyFiled is false', () => {
      const formData = { hasAlreadyFiled: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasAlreadyFiled is undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('eligibilitySummary page dependencies', () => {
    const dependsFn =
      formConfig.chapters.eligibilityChapter.pages.eligibilitySummary.depends;

    it('should be visible when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be visible when hasUnpaidCreditors is true', () => {
      const formData = { hasUnpaidCreditors: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be visible when both are true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when both are false', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when both are undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('veteranInformationChapter dependencies', () => {
    const dependsFn = formConfig.chapters.veteranInformationChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasUnpaidCreditors is true', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: true };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when both are true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: true };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('deceasedBeneficiaryChapter dependencies', () => {
    const dependsFn = formConfig.chapters.deceasedBeneficiaryChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when hasUnpaidCreditors is true', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: true };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('yourInformationChapter dependencies', () => {
    const dependsFn = formConfig.chapters.yourInformationChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('survivingRelativesChapter dependencies', () => {
    const dependsFn = formConfig.chapters.survivingRelativesChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('expensesAndDebtsChapter dependencies', () => {
    const dependsFn = formConfig.chapters.expensesAndDebtsChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('additionalInfoChapter dependencies', () => {
    const dependsFn = formConfig.chapters.additionalInfoChapter.depends;

    it('should be visible when user is eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when hasAlreadyFiled is true', () => {
      const formData = { hasAlreadyFiled: true, hasUnpaidCreditors: false };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('beneficiaryFullName page dependencies', () => {
    const dependsFn =
      formConfig.chapters.deceasedBeneficiaryChapter.pages.beneficiaryFullName
        .depends;

    it('should be visible when beneficiaryIsVeteran is false', () => {
      const formData = { beneficiaryIsVeteran: false };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when beneficiaryIsVeteran is true', () => {
      const formData = { beneficiaryIsVeteran: true };
      expect(dependsFn(formData)).to.be.false;
    });

    it('should be hidden when beneficiaryIsVeteran is undefined', () => {
      const formData = {};
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('otherDebts page dependencies', () => {
    const dependsFn =
      formConfig.chapters.expensesAndDebtsChapter.pages.otherDebts.depends;

    it('should be visible when claimingReimbursement is true', () => {
      const formData = { claimingReimbursement: true };
      expect(dependsFn(formData)).to.be.true;
    });

    it('should be hidden when claimingReimbursement is false', () => {
      const formData = { claimingReimbursement: false };
      expect(dependsFn(formData)).to.be.false;
    });
  });

  describe('dev configuration', () => {
    it('should have dev configuration object', () => {
      expect(formConfig.dev).to.exist;
      expect(formConfig.dev.showNavLinks).to.be.true;
      expect(formConfig.dev.collapsibleNavLinks).to.be.true;
    });
  });

  describe('comprehensive user flow scenarios', () => {
    it('should show eligibility end page when already filed', () => {
      const formData = { hasAlreadyFiled: true };

      expect(
        formConfig.chapters.eligibilityChapter.pages.hasUnpaidCreditors.depends(
          formData,
        ),
      ).to.be.false;
      expect(
        formConfig.chapters.eligibilityChapter.pages.eligibilitySummary.depends(
          formData,
        ),
      ).to.be.true;
      expect(formConfig.chapters.veteranInformationChapter.depends(formData)).to
        .be.false;
    });

    it('should show eligibility end page when has unpaid creditors', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: true };

      expect(
        formConfig.chapters.eligibilityChapter.pages.eligibilitySummary.depends(
          formData,
        ),
      ).to.be.true;
      expect(formConfig.chapters.veteranInformationChapter.depends(formData)).to
        .be.false;
    });

    it('should show full form when eligible', () => {
      const formData = { hasAlreadyFiled: false, hasUnpaidCreditors: false };

      expect(
        formConfig.chapters.eligibilityChapter.pages.eligibilitySummary.depends(
          formData,
        ),
      ).to.be.false;
      expect(formConfig.chapters.veteranInformationChapter.depends(formData)).to
        .be.true;
      expect(formConfig.chapters.deceasedBeneficiaryChapter.depends(formData))
        .to.be.true;
      expect(formConfig.chapters.yourInformationChapter.depends(formData)).to.be
        .true;
    });

    it('should show beneficiaryFullName only when beneficiary is not veteran', () => {
      const formData = {
        hasAlreadyFiled: false,
        hasUnpaidCreditors: false,
        beneficiaryIsVeteran: false,
      };

      expect(
        formConfig.chapters.deceasedBeneficiaryChapter.pages.beneficiaryFullName.depends(
          formData,
        ),
      ).to.be.true;
    });

    it('should show otherDebts page when claiming reimbursement', () => {
      const formData = { claimingReimbursement: true };

      expect(
        formConfig.chapters.expensesAndDebtsChapter.pages.otherDebts.depends(
          formData,
        ),
      ).to.be.true;
    });

    it('should have array builder pages for expenses', () => {
      expect(formConfig.chapters.expensesAndDebtsChapter.pages.expensesSummary)
        .to.exist;
      expect(
        formConfig.chapters.expensesAndDebtsChapter.pages.expenseDetailsPage,
      ).to.exist;
    });

    it('should have array builder pages for other debts', () => {
      expect(
        formConfig.chapters.expensesAndDebtsChapter.pages.otherDebtsSummary,
      ).to.exist;
      expect(formConfig.chapters.expensesAndDebtsChapter.pages.debtDetailsPage)
        .to.exist;
    });
  });
});
