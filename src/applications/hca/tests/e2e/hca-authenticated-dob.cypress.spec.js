import mockUserInvalidDob from './fixtures/mocks/user.invalidDob.json';
import mockUserNoDob from './fixtures/mocks/user.noDob.json';
import mockUserValidDob from './fixtures/mocks/user.json';
import { goToNextPage, setupForAuth, startAsAuthUser } from './utils';

describe('HCA-User-Authenticated: No DOB value', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/profile', {
      body: mockUserInvalidDob,
    }).as('mockPrefill');
    setupForAuth({ user: mockUserNoDob });
    startAsAuthUser();
    // cy.wait('@mockPrefill');
  });

  it('works with profile data that has no date of birth ', () => {
    goToNextPage('veteran-information/birth-information');
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-User-Authenticated: Invalid DOB value', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/profile', {
      body: mockUserInvalidDob,
    }).as('mockPrefill');
    setupForAuth({ user: mockUserInvalidDob });
    startAsAuthUser();
    // cy.wait('@mockPrefill');
  });

  it('works with profile data that has an invalid date of birth ', () => {
    goToNextPage('veteran-information/birth-information');
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-User-Authenticated: With DOB value', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/profile', {
      body: mockUserValidDob,
    }).as('mockPrefill');
    setupForAuth();
    startAsAuthUser();
    // cy.wait('@mockPrefill');
  });

  it('works with profile data that has valid date of birth ', () => {
    goToNextPage('/veteran-information/birth-information');
    cy.injectAxeThenAxeCheck();
  });
});
