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

const POA_SEARCH = '/representative/find-claimant';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
  cy.intercept('GET', '**authorize_as_representative', {
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
  describe('App feature toggle is enabled, but search feature toggle is not enabled', () => {
    beforeEach(() => {
      cy.loginArpUser();
      setUpInterceptsAndVisit(
        {
          isAppEnabled: true,
          isInPilot: true,
        },
        POA_SEARCH,
      );

      it('redirects to representative home', () => {
        cy.injectAxeThenAxeCheck();
        cy.location('pathname').should('eq', '/representative');
      });
    });

    it('Allows the user to see the Find claimant page when visiting directly', () => {
      cy.visit('/representative/find-claimant');
      cy.injectAxeThenAxeCheck();
      cy.contains('Find claimant').should('be.visible');
    });

    it('Shows errors on empty fields on searching when incomplete', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('.poa-request-search__form-submit').click();
      cy.contains('Enter a first name');
      cy.contains('Enter a last name');
      cy.contains('Enter a date of birth');
      cy.contains('Please enter a valid 9 digit Social Security number');
    });

    it('Clicking on Clear Search resets all fields', () => {
      cy.injectAxeThenAxeCheck();
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
      cy.get('.poa-request__list').should('contain', 'Johnson, Karol');
      cy.get('.poa-request__list').should('contain', 'Declined');
      cy.get('.poa-request__list').should('contain', 'January 30, 2025');
    });

    it('Form submission with valid data and no records found shows error message', () => {
      cy.injectAxeThenAxeCheck();
      cy.fillVaTextInput('first_name', 'asdf');
      cy.fillVaTextInput('last_name', 'ghjkl');
      cy.fillVaDate('dob', '2024-01-01', false);
      cy.get('va-text-input.masked-ssn').then($el =>
        cy.fillVaTextInput($el, '666-66-6666'),
      );

      setEmptyClaimantSearch();
      cy.get('.poa-request-search__form-submit').click();
      cy.get(
        "[data-testid='representation-requests-table-fetcher-no-poa-requests']",
      ).should(
        'have.text',
        'No result found for "asdf", "ghjkl", "2024-01-01", "***-**-6666"',
      );
    });
  });
});
