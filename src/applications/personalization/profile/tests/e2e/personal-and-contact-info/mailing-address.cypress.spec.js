import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';

const setup = (mobile = false) => {
  disableFTUXModals();

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

const editMailingAddress = () => {
  // Open edit view
  cy.findByRole('button', {
    name: new RegExp(`edit mailing address`, 'i'),
  }).click({
    force: true,
  });
};

const checkMilitaryAddress = () => {
  const militaryAddressCountry =
    'U.S. military bases are considered a domestic address and a part of the United States.';

  cy.contains(militaryAddressCountry).should('not.exist');
  cy.findByRole('combobox', { name: /country/i }).should(
    'not.have.attr',
    'disabled',
  );

  cy.findByRole('checkbox', {
    name: `I live on a United States military base outside of the United States.`,
  }).click({
    force: true,
  });

  cy.contains(militaryAddressCountry).should('exist');
  cy.findByRole('combobox', { name: /country/i }).should(
    'have.attr',
    'disabled',
  );

  // reset things back to the way they were when this function started
  cy.findByRole('checkbox', {
    name: `I live on a United States military base outside of the United States.`,
  }).click({
    force: true,
  });
};

// Switches the address form to international address mode to allow for more
// textbox inputs and confirms that each textbox flags URLs as invalid input
const confirmWebAddressesAreBlocked = () => {
  // choose something other than USA for the country
  cy.findByRole('combobox', { name: /country/i }).select('France');

  cy.findByRole('textbox', { name: /street address.*required/i })
    .clear()
    .type('propaganda.com');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);
  cy.findByRole('textbox', { name: /street address.*required/i })
    .clear()
    .type('123 main');
  cy.findByRole('alert').should('not.exist');

  // NOTE: resorting to selecting via a fragile element ID since there are two
  // street lines on this form with identical labels :(
  cy.findByLabelText(/^Street address line 2/i)
    .clear()
    .type('www.propaganda.blah');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);
  cy.findByLabelText(/^Street address line 2/i).clear();
  cy.findByRole('alert').should('not.exist');

  // NOTE: resorting to selecting via a fragile element ID since there are two
  // street lines on this form with identical labels :(
  cy.findByLabelText(/^Street address line 3/i)
    .clear()
    .type('propaganda.net');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);
  cy.findByLabelText(/^Street address line 3/i).clear();
  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /city/i })
    .clear()
    .type('http://');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid city/i);
  cy.findByRole('textbox', { name: /city/i })
    .clear()
    .type('Paris');
  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /state/i })
    .clear()
    .type('propaganda.gov');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid state/i);
  cy.findByRole('textbox', { name: /state/i })
    .clear()
    .type('Paris');
  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /postal code/i })
    .clear()
    .type('propaganda.edu');
  cy.findByRole('button', { name: 'Update' }).focus();
  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid postal code/i);
  cy.findByRole('textbox', { name: /postal code/i })
    .clear()
    .type('12345-1234');
  cy.findByRole('alert').should('not.exist');

  // cancel out of edit mode and discard unsaved changes
  cy.findByRole('button', { name: /cancel/i }).click();
  cy.findByRole('alertdialog')
    .findByRole('button', { name: /cancel/i })
    .click();
};

describe('The personal and contact information page', () => {
  it('should handle the military base checkbox and prevent entering web URLs on Desktop', () => {
    setup();
    editMailingAddress();
    checkMilitaryAddress();
    confirmWebAddressesAreBlocked();
  });
  it('should handle the military base checkbox on Mobile', () => {
    setup(true);
    editMailingAddress();
    checkMilitaryAddress();
  });
});
