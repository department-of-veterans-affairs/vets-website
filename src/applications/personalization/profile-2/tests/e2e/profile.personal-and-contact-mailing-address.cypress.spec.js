import { PROFILE_PATHS } from '../../constants';
import mockUser from '../fixtures/users/user-36.json';

const setup = (mobile = false) => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

  if (mobile) {
    cy.viewport('iphone-4');
  }

  cy.login(mockUser);
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  // should show a loading indicator
  cy.findByRole('progressbar').should('exist');
  cy.findByText(/loading your information/i).should('exist');

  // and then the loading indicator should be removed
  cy.findByText(/loading your information/i).should('not.exist');
  cy.findByRole('progressbar').should('not.exist');
};

const checkMilitaryAddress = () => {
  const militaryAddressCountry =
    'U.S. military bases are considered a domestic address and a part of the United States.';

  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit mailing address`, 'i'),
  }).click({
    force: true,
  });

  cy.contains(militaryAddressCountry).should('not.exist');

  cy.findByRole('checkbox', {
    name: `I live on a United States military base outside of the United States.`,
  }).click({
    force: true,
  });

  cy.contains(militaryAddressCountry).should('exist');
};

describe('The personal and contact information page', () => {
  it('should render as expected on Desktop', () => {
    setup();
    checkMilitaryAddress();
  });

  it('should render as expected on Mobile', () => {
    setup(true);
    checkMilitaryAddress();
  });
});
