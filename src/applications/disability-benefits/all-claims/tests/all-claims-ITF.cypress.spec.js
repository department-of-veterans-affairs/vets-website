import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import {
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
  MOCK_SIPS_API,
} from '../constants';

import { mockItf, errorItf, postItf } from './cypress.helpers';
import mockUser from './fixtures/mocks/user.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import minData from './fixtures/data/minimal-test.json';

describe('All claims ITF page', () => {
  Cypress.config({ requestTimeout: 10000 });

  beforeEach(() => {
    cy.login(mockUser);

    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', `${MOCK_SIPS_API}*`, mockInProgress);
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);

    // Pre-fill with the expected ratedDisabilities,
    // but without view:selected, since that's not pre-filled
    const sanitizedRatedDisabilities = (
      minData.data.ratedDisabilities || []
    ).map(({ 'view:selected': _, ...obj }) => obj);

    cy.intercept('GET', `${MOCK_SIPS_API}*`, {
      formData: {
        ...mockPrefill.formData,
        disabilities: sanitizedRatedDisabilities,
        servicePeriods: minData.data.serviceInformation.servicePeriods,
        reservesNationalGuardService:
          minData.data.serviceInformation.reservesNationalGuardService,
      },
      metadata: mockPrefill.metadata,
    });

    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    );

    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');

    cy.injectAxeThenAxeCheck();
  });

  it('should show ITF found alert', () => {
    cy.intercept('GET', '/v0/intent_to_file', mockItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You already have an Intent to File');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });

  it('should show ITF created alert with too old active ITF', () => {
    cy.intercept('GET', '/v0/intent_to_file', mockItf({ years: -2 }));
    cy.intercept('POST', '/v0/intent_to_file/compensation', postItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'Intent to File request has been submitted');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });

  it('should show ITF created alert if current ITF has already been used', () => {
    cy.intercept(
      'GET',
      '/v0/intent_to_file',
      mockItf({ months: -6 }, 'claim_recieved'),
    );
    cy.intercept('POST', '/v0/intent_to_file/compensation', postItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'Intent to File request has been submitted');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });

  it('should show ITF created alert if current ITF is for pensions', () => {
    cy.intercept(
      'GET',
      '/v0/intent_to_file',
      mockItf({ months: 6 }, 'active', 'pension'),
    );
    cy.intercept('POST', '/v0/intent_to_file/compensation', postItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'Intent to File request has been submitted');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });

  it('should show we can’t confirm error alert after creation error', () => {
    cy.intercept('GET', '/v0/intent_to_file', mockItf({ years: -2 }));
    cy.intercept('POST', '/v0/intent_to_file/compensation', errorItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="info"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We can’t confirm if we have an intent to file');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });

  it('should show we can’t confirm error alert after fetch & creation error', () => {
    cy.intercept('GET', '/v0/intent_to_file', errorItf());
    cy.intercept('POST', '/v0/intent_to_file/compensation', errorItf());

    cy.findAllByText(/start the disability/i, { selector: 'a' })
      .first()
      .click();

    cy.get('va-alert[status="info"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We can’t confirm if we have an intent to file');

        cy.axeCheck();
        cy.get('button.usa-button-primary');
      });
  });
});
