import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21P-601 form configuration branch dependencies', () => {
  describe('survivingRelativesChapter dependencies', () => {
    const { survivingRelativesChapter } = formConfig.chapters;

    describe('relativesSummary page dependencies', () => {
      const { relativesSummary } = survivingRelativesChapter.pages;

      it('should show page when survivors is true', () => {
        const formData = { survivors: true };
        expect(relativesSummary.depends(formData)).to.be.true;
      });

      it('should hide page when survivors is false', () => {
        const formData = { survivors: false };
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should hide page when survivors object is missing', () => {
        const formData = {};
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should hide page when survivors is undefined', () => {
        const formData = { survivors: undefined };
        expect(relativesSummary.depends(formData)).to.be.false;
      });
    });

    describe('relativeNamePage dependencies', () => {
      const { relativeNamePage } = survivingRelativesChapter.pages;

      it('should show page when survivors is true', () => {
        const formData = { survivors: true };
        expect(relativeNamePage.depends(formData)).to.be.true;
      });

      it('should hide page when survivors is false', () => {
        const formData = { survivors: false };
        expect(relativeNamePage.depends(formData)).to.be.false;
      });

      it('should hide page when survivors is undefined', () => {
        const formData = { survivors: undefined };
        expect(relativeNamePage.depends(formData)).to.be.false;
      });
    });

    describe('relativeAddressPage dependencies', () => {
      const { relativeAddressPage } = survivingRelativesChapter.pages;

      it('should show page when survivors is true', () => {
        const formData = { survivors: true };
        expect(relativeAddressPage.depends(formData)).to.be.true;
      });

      it('should hide page when survivors is false', () => {
        const formData = { survivors: false };
        expect(relativeAddressPage.depends(formData)).to.be.false;
      });

      it('should hide page when survivors is undefined', () => {
        const formData = { survivors: undefined };
        expect(relativeAddressPage.depends(formData)).to.be.false;
      });
    });
  });

  describe('expensesAndDebtsChapter dependencies', () => {
    const { expensesAndDebtsChapter } = formConfig.chapters;

    describe('otherDebts page dependencies', () => {
      const { otherDebts } = expensesAndDebtsChapter.pages;

      it('should show page when claimingReimbursement is true', () => {
        const formData = {
          claimingReimbursement: true,
        };
        expect(otherDebts.depends(formData)).to.be.true;
      });

      it('should hide page when claimingReimbursement is false', () => {
        const formData = {
          claimingReimbursement: false,
        };
        expect(otherDebts.depends(formData)).to.be.false;
      });

      it('should hide page when claimingReimbursement is undefined', () => {
        const formData = {};
        expect(otherDebts.depends(formData)).to.be.false;
      });

      it('should hide page when claimingReimbursement is null', () => {
        const formData = {
          claimingReimbursement: null,
        };
        expect(otherDebts.depends(formData)).to.be.false;
      });
    });

    describe('expense pages from array builder', () => {
      // These don't have explicit depends in the form config but are spread from expensesPages
      const {
        expensesSummary,
        expenseDetailsPage,
        expensePaidByPage,
      } = expensesAndDebtsChapter.pages;

      it('should include expense array builder pages', () => {
        expect(expensesSummary).to.exist;
        expect(expenseDetailsPage).to.exist;
        expect(expensePaidByPage).to.exist;
      });

      it('should have correct paths for expense pages', () => {
        expect(expensesSummary.path).to.equal('expenses-list');
        expect(expenseDetailsPage.path).to.include(
          'expenses-list/:index/details',
        );
        expect(expensePaidByPage.path).to.include(
          'expenses-list/:index/paid-by',
        );
      });
    });

    describe('otherDebts array builder pages', () => {
      const {
        otherDebtsSummary,
        debtDetailsPage,
      } = expensesAndDebtsChapter.pages;

      it('should include other debts array builder pages', () => {
        expect(otherDebtsSummary).to.exist;
        expect(debtDetailsPage).to.exist;
      });

      it('should have correct paths for other debts pages', () => {
        expect(otherDebtsSummary.path).to.equal('other-debts-list');
        expect(debtDetailsPage.path).to.include(
          'other-debts-list/:index/details',
        );
      });
    });
  });

  describe('other chapter dependencies', () => {
    describe('eligibilityChapter', () => {
      const { eligibilityChapter } = formConfig.chapters;

      it('hasUnpaidCreditors page depends on hasAlreadyFiled being false', () => {
        const { hasUnpaidCreditors } = eligibilityChapter.pages;
        expect(hasUnpaidCreditors.depends({ hasAlreadyFiled: false })).to.be
          .true;
        expect(hasUnpaidCreditors.depends({ hasAlreadyFiled: true })).to.be
          .false;
      });

      it('eligibilitySummary shows when user is ineligible', () => {
        const { eligibilitySummary } = eligibilityChapter.pages;

        expect(
          eligibilitySummary.depends({
            hasAlreadyFiled: true,
            hasUnpaidCreditors: false,
          }),
        ).to.be.true;

        expect(
          eligibilitySummary.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: true,
          }),
        ).to.be.true;

        expect(
          eligibilitySummary.depends({
            hasAlreadyFiled: true,
            hasUnpaidCreditors: true,
          }),
        ).to.be.true;

        expect(
          eligibilitySummary.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: false,
          }),
        ).to.be.false;
      });
    });

    describe('deceasedBeneficiaryChapter', () => {
      const { deceasedBeneficiaryChapter } = formConfig.chapters;

      it('beneficiaryFullName depends on beneficiaryIsVeteran being false', () => {
        const { beneficiaryFullName } = deceasedBeneficiaryChapter.pages;
        expect(beneficiaryFullName.depends({ beneficiaryIsVeteran: false })).to
          .be.true;
        expect(beneficiaryFullName.depends({ beneficiaryIsVeteran: true })).to
          .be.false;
      });
    });
  });

  describe('edge cases and null checks', () => {
    const {
      survivingRelativesChapter,
      expensesAndDebtsChapter,
    } = formConfig.chapters;

    it('should handle empty formData object', () => {
      const formData = {};
      expect(survivingRelativesChapter.pages.relativesSummary.depends(formData))
        .to.be.false;
      expect(expensesAndDebtsChapter.pages.otherDebts.depends(formData)).to.be
        .false;
    });
  });
});
