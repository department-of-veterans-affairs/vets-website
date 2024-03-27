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
  selectRadioWebComponent,
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
  // [pagePaths.dependentChildAddress]: ({ index }) => {
  //   cy.get('@testData').then(data => {
  //     fillAddressWebComponentPattern(
  //       'childAddress',
  //       data.dependents[index].childAddress,
  //     );
  //   });
  // },
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
