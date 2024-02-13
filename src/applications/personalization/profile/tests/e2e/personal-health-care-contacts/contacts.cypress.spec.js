import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
import contacts from '@@profile/tests/fixtures/contacts.json';
import { PROFILE_PATHS } from '@@profile/constants';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

describe('Personal health care contacts -- feature enabled', () => {
  it("displays a Veteran's Next of kin and Emergency contacts", () => {
    const featureToggles = generateFeatureToggles({ profileContacts: true });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('GET', '/v0/profile/contacts', contacts);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.CONTACTS);
    cy.findByTestId('phcc-emergency-contact-0');
    cy.findByTestId('phcc-emergency-contact-1');
    cy.findByTestId('phcc-next-of-kin-0');
    cy.findByTestId('phcc-next-of-kin-1');
    cy.injectAxeThenAxeCheck();
  });
});

describe('Personal health care contacts -- feature disabled', () => {
  it('removes the link from the nav', () => {
    const featureToggles = generateFeatureToggles({ profileContacts: false });
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('GET', '/v0/profile/contacts', contacts);
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('h1');
    cy.get('a[href$="/profile/contacts"]').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });
});
