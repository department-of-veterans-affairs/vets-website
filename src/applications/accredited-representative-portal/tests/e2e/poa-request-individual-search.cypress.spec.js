import user from './fixtures/mocks/user.json';
import { setFeatureToggles } from './intercepts/feature-toggles';
import {
  setClaimantSearch,
  setEmptyClaimantSearch,
} from './intercepts/claimant-search';

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const POA_SEARCH = '/representative/poa-search';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

const setUpInterceptsAndVisit = (featureToggles, url) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(
    featureToggles || {
      isAppEnabled: true,
      isInPilot: true,
      isSearchEnabled: true,
    },
  );
  cy.visit(url || '/representative');
  cy.injectAxeThenAxeCheck();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is not enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit({
        isAppEnabled: false,
        isInPilot: false,
      });
    });

    it('redirects to VA.gov homepage when in production and app is not enabled', () => {
      cy.injectAxeThenAxeCheck();
      cy.location('pathname').should('eq', '/');
    });
  });

  describe('App feature toggle is enabled, but search feature toggle is not enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit(
        {
          isAppEnabled: true,
          isInPilot: true,
          isSearchEnabled: false,
        },
        POA_SEARCH,
      );

      it('redirects to representative home', () => {
        cy.injectAxeThenAxeCheck();
        cy.location('pathname').should('eq', '/representative');
      });
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit(null, POA_SEARCH);
    });

    it('Allows the user to see the Search people page when visiting directly', () => {
      cy.contains('Search people').should('be.visible');
    });

    it('Shows errors on empty fields on searching when incomplete', () => {
      cy.get('.poa-request-search__form-submit').click();
      cy.contains('Enter a first name');
      cy.contains('Enter a last name');
      cy.contains('Enter a date of birth');
      cy.contains('Enter a Social Security number');
    });

    it('Clicking on Clear Search resets all fields', () => {
      cy.fillVaTextInput('first_name', 'asdf');
      cy.fillVaTextInput('last_name', 'ghjkl');
      cy.fillVaDate('dob', '2024-01-01', false);
      cy.get('va-text-input.masked-ssn').then($el =>
        cy.fillVaTextInput($el, '666-66-6666'),
      );

      cy.get("va-text-input[name='first_name']").should('have.value', 'asdf');
      cy.get("va-text-input[name='last_name']").should('have.value', 'ghjkl');
      cy.get('va-select.select-month').should('have.value', '1');
      cy.get('va-select.select-day').should('have.value', '1');
      cy.get('va-text-input.input-year').should('have.value', '2024');
      cy.get('va-text-input.masked-ssn').should('have.value', '666-66-6666');

      cy.get('.poa-request-search__form-reset').click();
      cy.get("va-text-input[name='first_name']").should('be.empty');
      cy.get("va-text-input[name='first_name']").should('be.empty');
      cy.get('va-select.select-month').should('have.value', '');
      cy.get('va-select.select-day').should('have.value', '');
      cy.get('va-text-input.input-year').should('be.empty');
      cy.get('va-text-input.masked-ssn').should('be.empty');
    });

    it('Form submission with valid data shows records returned', () => {
      cy.fillVaTextInput('first_name', 'asdf');
      cy.fillVaTextInput('last_name', 'ghjkl');
      cy.fillVaDate('dob', '2024-01-01', false);
      cy.get('va-text-input.masked-ssn').then($el =>
        cy.fillVaTextInput($el, '666-66-6666'),
      );

      setClaimantSearch();
      cy.get('.poa-request-search__form-submit').click();
      cy.get('.poa-requests-page-table-container').should(
        'contain',
        'Karol Johnson',
      );
      cy.get('.poa-requests-page-table-container').should(
        'contain',
        'Good Representatives R Us',
      );
      cy.get('.poa-requests-page-table-container').should(
        'contain',
        'Declined',
      );
      cy.get('.poa-requests-page-table-container').should(
        'contain',
        'January 30, 2025',
      );
    });

    it('Form submission with valid data and no records found shows error message', () => {
      cy.fillVaTextInput('first_name', 'asdf');
      cy.fillVaTextInput('last_name', 'ghjkl');
      cy.fillVaDate('dob', '2024-01-01', false);
      cy.get('va-text-input.masked-ssn').then($el =>
        cy.fillVaTextInput($el, '666-66-6666'),
      );

      setEmptyClaimantSearch();
      cy.get('.poa-request-search__form-submit').click();
      cy.get('.poa-requests-page-table-container').should(
        'contain',
        'We did not find an individual “asdf ghjkl”, “2024-01-01”, “666666666” who has submitted a power of attorney request in the past 60 days to you or your organizations.',
      );
    });
  });
});
