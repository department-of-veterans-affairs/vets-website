import Timeouts from 'platform/testing/e2e/timeouts';

import {
  fillCareExpensesPage,
  fillCurrentEmploymentHistoryPage,
  fillDependentsPage,
  fillFederalMedicalCentersPage,
  fillIncomeSourcesPage,
  fillMedicalExpensesPage,
  fillPreviousEmploymentHistoryPage,
  fillPreviousNamesPage,
  selectRadioWebComponent,
  fillSpouseMarriagesPage,
  fillTextWebComponent,
  fillVaMedicalCentersPage,
  shouldNotHaveValidationErrors,
} from './index';

import pagePaths from '../pagePaths';

const replaceDefaultPostHook = ({ afterHook }) => {
  afterHook(() => {
    cy.findByText(/continue/i, { selector: 'button' }).click({ force: true });
    shouldNotHaveValidationErrors();
  });
};

const replaceDefaultBehavior = context => {
  cy.fillPage();
  replaceDefaultPostHook(context);
};

const pageHooks = returnUrl => ({
  introduction: () => {
    if (returnUrl) {
      cy.get('va-alert [slot="headline"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'last saved');
      cy.injectAxeThenAxeCheck();

      cy.get('va-button[data-testid="continue-your-application"]').click();
    } else {
      cy.clickStartForm();
    }
  },
  ...Object.keys(pagePaths).reduce((paths, pagePath) => ({
    ...paths,
    [pagePath]: replaceDefaultBehavior,
  })),
  [pagePaths.mailingAddress]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      cy.fillAddressWebComponentPattern('veteranAddress', data.veteranAddress);
      replaceDefaultPostHook({ afterHook });
    });
  },
  [pagePaths.previousNames]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.previousNames.forEach((previousName, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          previousName,
          index,
          fillPreviousNamesPage,
          data.previousNames.length,
        );
      });
      replaceDefaultPostHook({ afterHook });
    });
  },
  [pagePaths.currentEmploymentHistory]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.currentEmployers.forEach((employer, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          employer,
          index,
          fillCurrentEmploymentHistoryPage,
          data.currentEmployers.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.previousEmploymentHistory]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.previousEmployers.forEach((employer, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          employer,
          index,
          fillPreviousEmploymentHistoryPage,
          data.previousEmployers.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.vaMedicalCenters]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.vaMedicalCenters.forEach((medicalCenter, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalCenter,
          index,
          fillVaMedicalCentersPage,
          data.vaMedicalCenters.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.federalMedicalCenters]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.federalMedicalCenters.forEach((medicalCenter, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalCenter,
          index,
          fillFederalMedicalCentersPage,
          data.federalMedicalCenters.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.maritalStatus]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      selectRadioWebComponent('maritalStatus', data.maritalStatus);
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.marriageInfo]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      fillTextWebComponent('marriage_count_value', data.marriages.length);
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.currentSpouseAddress]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      cy.fillAddressWebComponentPattern('spouseAddress', data.spouseAddress);
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.currentSpouseFormerMarriages]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.spouseMarriages.forEach((marriage, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          marriage,
          index,
          fillSpouseMarriagesPage,
          data.spouseMarriages.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.dependentChildren]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.dependents.forEach((dependent, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          dependent,
          index,
          fillDependentsPage,
          data.dependents.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.incomeSources]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.incomeSources.forEach(async (incomeSource, index) => {
        await cy.fillFieldsInVaCardIfNeeded(
          incomeSource,
          index,
          fillIncomeSourcesPage,
          data.incomeSources.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.careExpenses]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.careExpenses.forEach((careExpense, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          careExpense,
          index,
          fillCareExpensesPage,
          data.careExpenses.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.medicalExpenses]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      data.medicalExpenses.forEach((medicalExpense, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalExpense,
          index,
          fillMedicalExpensesPage,
          data.medicalExpenses.length,
        );
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  'review-and-submit': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        cy.get('#veteran-signature')
          .shadow()
          .find('input')
          .first()
          .type(data.statementOfTruthSignature);
        cy.get(`#veteran-certify`)
          .first()
          .shadow()
          .find('input')
          .click({ force: true });
        cy.clickFormContinue();
        shouldNotHaveValidationErrors();
      });
    });
  },
});

export default pageHooks;
