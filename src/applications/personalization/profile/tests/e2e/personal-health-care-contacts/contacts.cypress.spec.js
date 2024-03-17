import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';
import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import contacts from '@@profile/tests/fixtures/contacts.json';
import contactsSingleEc from '@@profile/tests/fixtures/contacts-single-ec.json';
import contactsSingleNok from '@@profile/tests/fixtures/contacts-single-nok.json';

import { PROFILE_PATHS } from '@@profile/constants';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

let featureToggles;

describe('Personal health care contacts -- feature enabled', () => {
  beforeEach(() => {
    const otherEndpoints = [
      '/v0/profile/ch33_bank_accounts',
      '/v0/profile/direct_deposits/disability_compensations',
      '/v0/profile/full_name',
      '/v0/disability_compensation_form/rating_info',
      '/v0/profile/service_history',
      '/v0/profile/personal_information',
    ];
    mockGETEndpoints(otherEndpoints, 200, {});

    featureToggles = generateFeatureToggles({ profileContacts: true });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });

  it("displays a Veteran's Next of kin and Emergency contacts", () => {
    cy.intercept('GET', '/v0/profile/contacts', contacts);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByTestId('phcc-emergency-contact-0');
    cy.findByTestId('phcc-emergency-contact-1');
    cy.findByTestId('phcc-next-of-kin-0');
    cy.findByTestId('phcc-next-of-kin-1');
    cy.injectAxeThenAxeCheck();
  });

  it('displays instructions when no contacts are present', () => {
    cy.intercept('GET', '/v0/profile/contacts', { data: [] });
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByTestId('phcc-no-ecs');
    cy.findByTestId('phcc-no-nok');
    cy.injectAxeThenAxeCheck();
  });

  it('handles one emergency contact', () => {
    cy.intercept('GET', '/v0/profile/contacts', contactsSingleEc);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByText(/Ethan Jermey Bishop/);
    cy.findByTestId('phcc-no-nok');
    cy.injectAxeThenAxeCheck();
  });

  it('handles one next of kin', () => {
    cy.intercept('GET', '/v0/profile/contacts', contactsSingleNok);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByTestId('phcc-no-ecs');
    cy.findByText(/James Daniel Bishop/);
    cy.injectAxeThenAxeCheck();
  });

  it('handles a 500 response', () => {
    cy.intercept('GET', '/v0/profile/contacts', { statusCode: 500 });
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByTestId('service-is-down-banner');
    cy.injectAxeThenAxeCheck();
  });
});

describe('Personal health care contacts -- feature disabled', () => {
  it('removes the link from the nav', () => {
    featureToggles = generateFeatureToggles({ profileContacts: false });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('GET', '/v0/profile/contacts', contacts);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('h1');
    cy.get('a[href$="/profile/contacts"]').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
