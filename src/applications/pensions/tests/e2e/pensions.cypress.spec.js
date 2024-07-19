import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import kitchenSinkFixture from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import overflowFixture from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';
import simpleFixture from 'vets-json-schema/dist/21P-527EZ-SIMPLE-cypress-example.json';

import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import setupCypress, { cypressBeforeAllSetup } from './cypress.setup';

import {
  fillAddressWebComponentPattern,
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
  fillVaMedicalCentersPage,
  shouldNotHaveValidationErrors,
} from './helpers';

import pagePaths from './pagePaths';

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

export const pageHooks = cy => ({
  introduction: () => {
    // skip wizard
    cy.findAllByText(/start the pension application/i)
      .first()
      .click();
  },
  ...Object.keys(pagePaths).reduce((paths, pagePath) => ({
    ...paths,
    [pagePath]: replaceDefaultBehavior,
  })),
  [pagePaths.mailingAddress]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('veteranAddress', data.veteranAddress);
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
      cy.get('#root_marriages').type(`${data.marriages.length}`, {
        force: true,
      });
      afterHook(replaceDefaultPostHook);
    });
  },
  [pagePaths.currentSpouseAddress]: ({ afterHook }) => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('spouseAddress', data.spouseAddress);
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
        cy.findAllByText(/Submit application/i, {
          selector: 'button',
        }).click();
        shouldNotHaveValidationErrors();
      });
    });
  },
});

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      { title: 'kitchen-sink', data: kitchenSinkFixture },
      { title: 'overflow', data: overflowFixture },
      { title: 'simple', data: simpleFixture },
    ],
    pageHooks: pageHooks(cy),
    setup: () => {
      cypressBeforeAllSetup();
    },
    setupPerTest: () => {
      cy.login(mockUser);
      setupCypress(cy);
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
