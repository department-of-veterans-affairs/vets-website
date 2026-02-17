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
    'v0/profile/direct_deposits',
  ]);
  mockFeatureToggles();
  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  // Sometimes the page loads too quickly for Cypress to find
  // the loading indicator, so we first check if it exists
  cy.get('body').then($body => {
    if ($body.find('va-loading-indicator').length) {
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
    }
  });
};

const editMailingAddress = () => {
  // Open edit view
  cy.get('va-button[label="Edit Mailing address"]').click({ force: true });
};

const SELECTORS = {
  BASE: 'root_view:livesOnMilitaryBase',
  INFO: 'va-additional-info[trigger^="Learn more about military base address"]',
  COUNTRY: 'root_countryCodeIso3',
  STREET1: 'root_addressLine1',
  STREET2: 'root_addressLine2',
  STREET3: 'root_addressLine3',
  CITY: 'root_city',
  STATE: 'root_state',
  PROVINCE: 'root_province',
  ZIP: 'root_zipCode',
  POSTAL: 'root_internationalPostalCode',
};

const checkMilitaryAddress = () => {
  cy.get(SELECTORS.INFO).should('exist');
  cy.get(`va-select[name="${SELECTORS.COUNTRY}"]`).should('exist');

  cy.selectVaCheckbox(SELECTORS.BASE, true);

  cy.get(`va-select[name="${SELECTORS.COUNTRY}"]`)
    .should('exist')
    .should('have.attr', 'inert');

  // reset things back to the way they were when this function started
  cy.selectVaCheckbox(SELECTORS.BASE, false);
};

// Switches the address form to international address mode to allow for more
// textbox inputs and confirms that each textbox flags URLs as invalid input
const confirmWebAddressesAreBlocked = () => {
  // choose something other than USA for the country
  cy.selectVaSelect(SELECTORS.COUNTRY, 'FRA');

  cy.fillVaTextInput(SELECTORS.STREET1, 'x.com');

  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get(`[name="${SELECTORS.STREET1}"][error*="valid street address"]`);

  cy.fillVaTextInput(SELECTORS.STREET1, '123 main');

  cy.get('[error]').should('not.exist');

  cy.fillVaTextInput(SELECTORS.STREET2, 'www.x.blah');
  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get(`[name="${SELECTORS.STREET2}"][error*="valid street address"]`);

  cy.fillVaTextInput(SELECTORS.STREET2, '');

  cy.get('[error]').should('not.exist');

  // NOTE: resorting to selecting via a fragile element ID since there are two
  // street lines on this form with identical labels :(
  cy.fillVaTextInput(SELECTORS.STREET3, 'x.net');

  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get(`[name="${SELECTORS.STREET3}"][error*="valid street address"]`);

  cy.fillVaTextInput(SELECTORS.STREET3, '');

  cy.get('[error]').should('not.exist');

  cy.fillVaTextInput(SELECTORS.CITY, 'http://');

  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get(`[name="${SELECTORS.CITY}"][error*="valid city"]`);

  cy.fillVaTextInput(SELECTORS.CITY, 'Paris');

  cy.get('[error]').should('not.exist');

  cy.fillVaTextInput(SELECTORS.PROVINCE, 'Paris');

  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get('[error]').should('not.exist');

  cy.fillVaTextInput(SELECTORS.POSTAL, 'x.edu');

  cy.findByTestId('save-edit-button').shadow().find('button').focus();

  cy.get(`[name="${SELECTORS.POSTAL}"][error*="valid postal code"]`);

  cy.fillVaTextInput(SELECTORS.POSTAL, '12345-1234');

  cy.get('[error]').should('not.exist');

  // cancel out of edit mode and discard unsaved changes
  cy.findByTestId('cancel-edit-button').click();

  cy.findByTestId('confirm-cancel-modal')
    .shadow()
    .find('.usa-button-group')
    .first()
    .find('va-button')
    .shadow()
    .findByText(/Cancel changes/i)
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
