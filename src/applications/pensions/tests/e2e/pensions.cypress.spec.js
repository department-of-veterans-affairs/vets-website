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
} from './helpers';

import pagePaths from './pagePaths';

export const pageHooks = cy => ({
  introduction: () => {
    // skip wizard
    cy.findAllByText(/start the pension application/i)
      .first()
      .click();
  },
  [pagePaths.mailingAddress]: () => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('veteranAddress', data.veteranAddress);
    });
  },
  [pagePaths.previousNames]: () => {
    cy.get('@testData').then(data => {
      data.previousNames.forEach((previousName, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          previousName,
          index,
          fillPreviousNamesPage,
          data.previousNames.length,
        );
      });
    });
  },
  [pagePaths.currentEmploymentHistory]: () => {
    cy.get('@testData').then(data => {
      data.currentEmployers.forEach((employer, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          employer,
          index,
          fillCurrentEmploymentHistoryPage,
          data.currentEmployers.length,
        );
      });
    });
  },
  [pagePaths.previousEmploymentHistory]: () => {
    cy.get('@testData').then(data => {
      data.previousEmployers.forEach((employer, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          employer,
          index,
          fillPreviousEmploymentHistoryPage,
          data.previousEmployers.length,
        );
      });
    });
  },
  [pagePaths.vaMedicalCenters]: () => {
    cy.get('@testData').then(data => {
      data.vaMedicalCenters.forEach((medicalCenter, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalCenter,
          index,
          fillVaMedicalCentersPage,
          data.vaMedicalCenters.length,
        );
      });
    });
  },
  [pagePaths.federalMedicalCenters]: () => {
    cy.get('@testData').then(data => {
      data.federalMedicalCenters.forEach((medicalCenter, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalCenter,
          index,
          fillFederalMedicalCentersPage,
          data.federalMedicalCenters.length,
        );
      });
    });
  },
  [pagePaths.maritalStatus]: () => {
    cy.get('@testData').then(data => {
      selectRadioWebComponent('maritalStatus', data.maritalStatus);
    });
  },
  [pagePaths.marriageInfo]: () => {
    cy.get('@testData').then(data => {
      // TODO Fix this
      cy.get('#root_marriages').type(`${data.marriages.length}`, {
        force: true,
      });
    });
  },
  [pagePaths.currentSpouseAddress]: () => {
    cy.get('@testData').then(data => {
      fillAddressWebComponentPattern('spouseAddress', data.spouseAddress);
    });
  },
  [pagePaths.currentSpouseFormerMarriages]: () => {
    cy.get('@testData').then(data => {
      data.spouseMarriages.forEach((marriage, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          marriage,
          index,
          fillSpouseMarriagesPage,
          data.spouseMarriages.length,
        );
      });
    });
  },
  [pagePaths.dependentChildren]: () => {
    cy.get('@testData').then(data => {
      data.dependents.forEach((dependent, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          dependent,
          index,
          fillDependentsPage,
          data.dependents.length,
        );
      });
    });
  },
  [pagePaths.incomeSources]: () => {
    cy.get('@testData').then(data => {
      data.incomeSources.forEach(async (incomeSource, index) => {
        await cy.fillFieldsInVaCardIfNeeded(
          incomeSource,
          index,
          fillIncomeSourcesPage,
          data.incomeSources.length,
        );
      });
    });
  },
  [pagePaths.careExpenses]: () => {
    cy.get('@testData').then(data => {
      data.careExpenses.forEach((careExpense, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          careExpense,
          index,
          fillCareExpensesPage,
          data.careExpenses.length,
        );
      });
    });
  },
  [pagePaths.medicalExpenses]: () => {
    cy.get('@testData').then(data => {
      data.medicalExpenses.forEach((medicalExpense, index) => {
        cy.fillFieldsInVaCardIfNeeded(
          medicalExpense,
          index,
          fillMedicalExpensesPage,
          data.medicalExpenses.length,
        );
      });
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
