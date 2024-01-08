import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import featuresDisabled from '../fixtures/mocks/featuresDisabled.json';
import featuresEnabled from '../fixtures/mocks/featuresEnabled.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import {
  fillAddressWebComponentPattern,
  selectCheckboxWebComponent,
  selectRadioWebComponent,
} from './helpers';

import pagePaths from './pagePaths';

const TEST_URL = '/pension/application/527EZ/introduction';

export const setup = ({ authenticated, isEnabled = true } = {}) => {
  const features = isEnabled ? featuresEnabled : featuresDisabled;
  cy.intercept('GET', '/v0/feature_toggles*', features);
  if (!authenticated) {
    cy.visit(TEST_URL);
    return;
  }
  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.login(loggedInUser);
  cy.visit(TEST_URL);
};

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
  [pagePaths.servicePeriod]: () => {
    // Providing a hook for this page prevents the default fill, so we need to call that
    cy.fillPage();

    // Once that's done, go back and fill in the web component that it missed
    cy.get('@testData').then(data => {
      const value = `serviceBranch_${data.serviceBranch}`;
      selectCheckboxWebComponent(value, true);
    });
  },
  [pagePaths.maritalStatus]: () => {
    cy.get('@testData').then(data => {
      selectRadioWebComponent('maritalStatus', data.maritalStatus);
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
});

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test'],
    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy);
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
