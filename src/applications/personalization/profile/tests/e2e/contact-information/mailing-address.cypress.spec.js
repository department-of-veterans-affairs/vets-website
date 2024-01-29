import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = (mobile = false) => {
  if (mobile) {
    cy.viewportPreset('va-top-mobile-1');
  }

  cy.login(mockUser);
  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/ppiu/payment_information',
  ]);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // should show a loading indicator
  cy.get('va-loading-indicator')
    .should('exist')
    .then($container => {
      cy.wrap($container)
        .shadow()
        .findByRole('progressbar')
        .should('contain', /loading your information/i);
    });

  // and then the loading indicator should be removed
  cy.get('va-loading-indicator').should('not.exist');
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

  cy.findByRole('textbox', { name: /street address.*required/i });

  cy.findByRole('textbox', { name: /street address.*required/i }).clear();

  cy.findByRole('textbox', { name: /street address.*required/i }).type(
    'x.com',
    { delay: 1 },
  );

  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);

  cy.findByRole('textbox', { name: /street address.*required/i }).clear();

  cy.findByRole('textbox', { name: /street address.*required/i }).type(
    '123 main',
    { delay: 1 },
  );

  cy.findByRole('alert').should('not.exist');

  cy.findByLabelText(/^Street address line 2/i).clear();

  cy.findByLabelText(/^Street address line 2/i).type('www.x.blah', {
    delay: 1,
  });
  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);

  cy.findByLabelText(/^Street address line 2/i).clear();

  cy.findByRole('alert').should('not.exist');

  // NOTE: resorting to selecting via a fragile element ID since there are two
  // street lines on this form with identical labels :(
  cy.findByLabelText(/^Street address line 3/i).clear();

  cy.findByLabelText(/^Street address line 3/i).type('x.net', { delay: 1 });

  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid street address/i);

  cy.findByLabelText(/^Street address line 3/i).clear();

  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /city/i }).clear();

  cy.findByRole('textbox', { name: /city/i }).type('http://', { delay: 1 });

  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid city/i);

  cy.findByRole('textbox', { name: /city/i }).clear();

  cy.findByRole('textbox', { name: /city/i }).type('Paris', { delay: 1 });

  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /state/i }).clear();

  cy.findByRole('textbox', { name: /state/i }).type('x.gov', { delay: 1 });

  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid state/i);

  cy.findByRole('textbox', { name: /state/i }).clear();

  cy.findByRole('textbox', { name: /state/i }).type('Paris', { delay: 1 });

  cy.findByRole('alert').should('not.exist');

  cy.findByRole('textbox', { name: /postal code/i }).clear();

  cy.findByRole('textbox', { name: /postal code/i }).type('x.edu', {
    delay: 1,
  });

  cy.findByRole('button', { name: 'Save' }).focus();

  cy.findByRole('alert')
    .should('exist')
    .contains(/please enter a valid postal code/i);

  cy.findByRole('textbox', { name: /postal code/i }).clear();

  cy.findByRole('textbox', { name: /postal code/i }).type('12345-1234', {
    delay: 1,
  });

  cy.findByRole('alert').should('not.exist');

  // cancel out of edit mode and discard unsaved changes
  cy.findByRole('button', { name: /cancel/i }).click();

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/yes, cancel my changes/i)
    .click();
};

describe('The personal and contact information page', () => {
  it('should handle the military base checkbox and prevent entering web URLs on Desktop', () => {
    setup();
    editMailingAddress();
    checkMilitaryAddress();
    confirmWebAddressesAreBlocked();
    cy.injectAxeThenAxeCheck();
  });
  it('should handle the military base checkbox on Mobile', () => {
    setup(true);
    editMailingAddress();
    checkMilitaryAddress();
    cy.injectAxeThenAxeCheck();
  });
});
