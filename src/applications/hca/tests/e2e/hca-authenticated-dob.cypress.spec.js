import mockUserInvalidDob from './fixtures/mocks/user.invalidDob.json';
import mockUserNoDob from './fixtures/mocks/user.noDob.json';
import { goToNextPage, setupForAuth, startAsAuthUser } from './utils';

describe('HCA-User-Authenticated: No DOB value', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUserNoDob });
    startAsAuthUser();
  });

  it('works with profile data that has no date of birth ', () => {
    goToNextPage();
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-User-Authenticated: Invalid DOB value', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUserInvalidDob });
    startAsAuthUser();
  });

  it('works with profile data that has an invalid date of birth ', () => {
    goToNextPage();
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-User-Authenticated: With DOB value', () => {
  beforeEach(() => {
    setupForAuth();
    startAsAuthUser();
  });

  it('works with profile data that has valid date of birth ', () => {
    goToNextPage();
    cy.injectAxeThenAxeCheck();
  });
});
