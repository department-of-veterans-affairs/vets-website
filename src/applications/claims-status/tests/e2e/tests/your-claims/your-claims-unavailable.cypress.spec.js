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

    cy.findByRole('heading', {
      name: 'Claim and Appeal status is unavailable',
      level: 3,
    });
    cy.findByText(
      'VA.gov is having trouble loading claims and appeals information at this time. Check back again in an hour.',
    );

    cy.axeCheck();
  });

  it('should display claims unavailable alert', () => {
    mockClaimsEndpoint([], 500);
    mockAppealsEndpoint(appeals.data);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByRole('heading', {
      name: 'Claim status is unavailable',
      level: 3,
    });
    cy.findByText(
      'VA.gov is having trouble loading claims information at this time. Check back again in an hour. Note: You are still able to review appeals information.',
    );

    cy.axeCheck();
  });

  it('should display appeals unavailable alert', () => {
    mockClaimsEndpoint(claimsList.data);
    mockAppealsEndpoint([], 500);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByRole('heading', {
      name: 'Appeal status is unavailable',
      level: 3,
    });
    cy.findByText(
      'VA.gov is having trouble loading appeals information at this time. Check back again in an hour. Note: You are still able to review claims information.',
    );

    cy.axeCheck();
  });
});
