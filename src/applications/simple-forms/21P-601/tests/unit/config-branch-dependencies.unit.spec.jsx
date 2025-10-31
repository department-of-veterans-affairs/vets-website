import { expect } from 'chai';
import formConfig from '../../config/form';

describe('21P-601 form configuration branch dependencies', () => {
  describe('survivingRelativesChapter dependencies', () => {
    const { survivingRelativesChapter } = formConfig.chapters;

    describe('chapter level dependencies', () => {
      it('should show chapter when hasAlreadyFiled is false and hasUnpaidCreditors is false', () => {
        const formData = {
          hasAlreadyFiled: false,
          hasUnpaidCreditors: false,
        };
        expect(survivingRelativesChapter.depends(formData)).to.be.true;
      });

      it('should hide chapter when hasAlreadyFiled is true', () => {
        const formData = {
          hasAlreadyFiled: true,
          hasUnpaidCreditors: false,
        };
        expect(survivingRelativesChapter.depends(formData)).to.be.false;
      });

      it('should hide chapter when hasUnpaidCreditors is true', () => {
        const formData = {
          hasAlreadyFiled: false,
          hasUnpaidCreditors: true,
        };
        expect(survivingRelativesChapter.depends(formData)).to.be.false;
      });

      it('should hide chapter when both hasAlreadyFiled and hasUnpaidCreditors are true', () => {
        const formData = {
          hasAlreadyFiled: true,
          hasUnpaidCreditors: true,
        };
        expect(survivingRelativesChapter.depends(formData)).to.be.false;
      });
    });

    describe('relativesSummary page dependencies', () => {
      const { relativesSummary } = survivingRelativesChapter.pages;

      it('should show page when hasSpouse is true and hasNone is not true', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasNone: false,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.true;
      });

      it('should show page when hasChildren is true and hasNone is not true', () => {
        const formData = {
          survivors: {
            hasChildren: true,
            hasNone: false,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.true;
      });

      it('should show page when hasParents is true and hasNone is not true', () => {
        const formData = {
          survivors: {
            hasParents: true,
            hasNone: false,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.true;
      });

      it('should show page when multiple survivor types are selected', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasChildren: true,
            hasParents: true,
            hasNone: false,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.true;
      });

      it('should hide page when hasNone is true', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasChildren: true,
            hasParents: true,
            hasNone: true,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should hide page when no survivor types are selected', () => {
        const formData = {
          survivors: {
            hasSpouse: false,
            hasChildren: false,
            hasParents: false,
            hasNone: false,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should hide page when survivors object is missing', () => {
        const formData = {};
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should hide page when survivors is undefined', () => {
        const formData = {
          survivors: undefined,
        };
        expect(relativesSummary.depends(formData)).to.be.false;
      });

      it('should handle null values in survivors', () => {
        const formData = {
          survivors: {
            hasSpouse: null,
            hasChildren: null,
            hasParents: null,
            hasNone: null,
          },
        };
        expect(relativesSummary.depends(formData)).to.be.false;
      });
    });

    describe('relativeNamePage dependencies', () => {
      const { relativeNamePage } = survivingRelativesChapter.pages;

      it('should show page when hasSpouse is true and hasNone is not true', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasNone: false,
          },
        };
        expect(relativeNamePage.depends(formData)).to.be.true;
      });

      it('should show page when hasChildren is true', () => {
        const formData = {
          survivors: {
            hasChildren: true,
          },
        };
        expect(relativeNamePage.depends(formData)).to.be.true;
      });

      it('should show page when hasParents is true', () => {
        const formData = {
          survivors: {
            hasParents: true,
          },
        };
        expect(relativeNamePage.depends(formData)).to.be.true;
      });

      it('should hide page when hasNone is true even if others are selected', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasChildren: true,
            hasNone: true,
          },
        };
        expect(relativeNamePage.depends(formData)).to.be.false;
      });

      it('should hide page when no survivors are selected', () => {
        const formData = {
          survivors: {},
        };
        expect(relativeNamePage.depends(formData)).to.be.false;
      });
    });

    describe('relativeAddressPage dependencies', () => {
      const { relativeAddressPage } = survivingRelativesChapter.pages;

      it('should show page when hasSpouse is true and hasNone is not true', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
            hasNone: false,
          },
        };
        expect(relativeAddressPage.depends(formData)).to.be.true;
      });

      it('should show page when hasChildren is true', () => {
        const formData = {
          survivors: {
            hasChildren: true,
          },
        };
        expect(relativeAddressPage.depends(formData)).to.be.true;
      });

      it('should show page when hasParents is true', () => {
        const formData = {
          survivors: {
            hasParents: true,
          },
        };
        expect(relativeAddressPage.depends(formData)).to.be.true;
      });

      it('should hide page when hasNone is true', () => {
        const formData = {
          survivors: {
            hasNone: true,
          },
        };
        expect(relativeAddressPage.depends(formData)).to.be.false;
      });

      it('should handle undefined hasNone with valid selections', () => {
        const formData = {
          survivors: {
            hasSpouse: true,
          },
        };
        expect(relativeAddressPage.depends(formData)).to.be.true;
      });
    });
  });

  describe('expensesAndDebtsChapter dependencies', () => {
    const { expensesAndDebtsChapter } = formConfig.chapters;

    describe('chapter level dependencies', () => {
      it('should show chapter when hasAlreadyFiled is false and hasUnpaidCreditors is false', () => {
        const formData = {
          hasAlreadyFiled: false,
          hasUnpaidCreditors: false,
        };
        expect(expensesAndDebtsChapter.depends(formData)).to.be.true;
      });

      it('should hide chapter when hasAlreadyFiled is true', () => {
        const formData = {
          hasAlreadyFiled: true,
          hasUnpaidCreditors: false,
        };
        expect(expensesAndDebtsChapter.depends(formData)).to.be.false;
      });

      it('should hide chapter when hasUnpaidCreditors is true', () => {
        const formData = {
          hasAlreadyFiled: false,
          hasUnpaidCreditors: true,
        };
        expect(expensesAndDebtsChapter.depends(formData)).to.be.false;
      });
    });

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

    describe('veteranInformationChapter', () => {
      const { veteranInformationChapter } = formConfig.chapters;

      it('should show when user is eligible', () => {
        expect(
          veteranInformationChapter.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: false,
          }),
        ).to.be.true;
      });

      it('should hide when user is ineligible', () => {
        expect(
          veteranInformationChapter.depends({
            hasAlreadyFiled: true,
            hasUnpaidCreditors: false,
          }),
        ).to.be.false;
      });
    });

    describe('yourInformationChapter', () => {
      const { yourInformationChapter } = formConfig.chapters;

      it('should show when user is eligible', () => {
        expect(
          yourInformationChapter.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: false,
          }),
        ).to.be.true;
      });

      it('should hide when user is ineligible', () => {
        expect(
          yourInformationChapter.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: true,
          }),
        ).to.be.false;
      });
    });

    describe('additionalInfoChapter', () => {
      const { additionalInfoChapter } = formConfig.chapters;

      it('should show when user is eligible', () => {
        expect(
          additionalInfoChapter.depends({
            hasAlreadyFiled: false,
            hasUnpaidCreditors: false,
          }),
        ).to.be.true;
      });

      it('should hide when user is ineligible', () => {
        expect(
          additionalInfoChapter.depends({
            hasAlreadyFiled: true,
            hasUnpaidCreditors: true,
          }),
        ).to.be.false;
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

    it('should handle null formData values', () => {
      const formData = null;
      const chapterDependsFn = survivingRelativesChapter.depends;
      // Chapter level depends should handle null
      expect(() => chapterDependsFn(formData)).to.not.throw();
    });

    it('should handle partial survivors data', () => {
      const formData = {
        survivors: {
          hasSpouse: true,
          // hasChildren and hasParents are undefined
        },
      };
      expect(survivingRelativesChapter.pages.relativesSummary.depends(formData))
        .to.be.true;
    });

    it('should handle string values for boolean fields', () => {
      const formData = {
        survivors: {
          hasSpouse: 'true', // string instead of boolean
          hasNone: 'false',
        },
      };
      // JavaScript truthy/falsy evaluation should handle this
      expect(survivingRelativesChapter.pages.relativesSummary.depends(formData))
        .to.be.true;
    });
  });
});
