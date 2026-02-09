import appeals from '../../fixtures/mocks/appeals.json';
import claimsList from '../../fixtures/mocks/claims-list.json';
import userWithAppeals from '../../fixtures/mocks/user-with-appeals.json';
import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('Your claims unavailable,', () => {
  const bodyText =
    "We're sorry. There's a problem with our system. Refresh this page or try again later.";

  beforeEach(() => {
    mockFeatureToggles();
    mockStemEndpoint();

    cy.login(userWithAppeals);
  });

  it('should display claims and appeals unavailable alert', () => {
    mockClaimsEndpoint([], 500);
    mockAppealsEndpoint([], 500);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('va-alert[status="warning"]')
      .should('exist')
      .within(() => {
        cy.contains(
          'h3',
          "We can't access some of your claims or appeals right now",
        ).should('exist');
        cy.contains(bodyText).should('exist');
      });

    cy.axeCheck();
  });

  it('should display claims unavailable alert', () => {
    mockClaimsEndpoint([], 500);
    mockAppealsEndpoint(appeals.data);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('va-alert[status="warning"]')
      .should('exist')
      .within(() => {
        cy.contains(
          'h3',
          "We can't access some of your claims right now",
        ).should('exist');
        cy.contains(bodyText).should('exist');
      });

    cy.axeCheck();
  });

  it('should display appeals unavailable alert', () => {
    mockClaimsEndpoint(claimsList.data);
    mockAppealsEndpoint([], 500);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('va-alert[status="warning"]')
      .should('exist')
      .within(() => {
        cy.contains(
          'h3',
          "We can't access some of your appeals right now",
        ).should('exist');
        cy.contains(bodyText).should('exist');
      });

    cy.axeCheck();
  });
});
