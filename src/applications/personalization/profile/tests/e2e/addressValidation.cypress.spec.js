import { PROFILE_PATHS } from '../../constants';

import mockUser from 'applications/personalization/profile/tests/fixtures/users/user-36.json';

// // Domestic Address (with and without confident address)
// // International Address (with and without confident address)
// // Military Address (with and without confident address)

// // Mailin Address
// // Domestic
// Find Mailing Address
// Click edit
// Fill out address (update zip code)
// Check that both entered and suggested addresses are there
// (in 1 test - go back to click edit address in the 'entered section')
// (in 1 test - choose 'entered section' and click update)
// (in 1 test - choose 'suggested address' and click update)

// // Home address
// // Domestic
// 1) Home address is same as mailing address, click update

// Check for all these error messages

// // MAILNG ADDRESS
// / Domestic address
// Go to /personal-information
// Click on edit mailing address
//

// Military address
// International address

// / HOME ADDRESS
// Domestic address
// Military address
// International address
// Same as mailing address

const confirmAddressAlert = 'Please confirm your address';
const confirmUnitNumberAlert = 'Please update or confirm your unit number';

function setUp(mobile = false) {
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  if (mobile) {
    cy.viewport('iphone-4');
  }
  cy.get('#mailingAddress-edit-link').click();
}

function updateDomesticAddress({ mobile, chooseUserEntered }) {
  const selectedAddressType = chooseUserEntered
    ? '#userEntered'
    : '#suggestedAddress';
  setUp(mobile);

  cy.get('#root_addressLine2').type('23');

  cy.findByTestId('save-edit-button').click({
    force: true,
  });

  cy.findByText(confirmAddressAlert).should('exist');

  cy.get(selectedAddressType).click({
    force: true,
  });

  cy.findByTestId('update-button').click({
    force: true,
  });

  // cy.mockAddressValidation
}

describe('Personal and contact information', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      JSON.stringify(['single-sign-on-intro']),
    );
    cy.login(mockUser);
    // login() calls cy.server() so we can now mock routes
  });
  describe('should successfully update addresses on Desktop', () => {
    describe('for home address', () => {
      describe('when updating a domestic address', () => {
        it('should update successfully choosing the entered address', () => {
          const config = {
            mobile: false,
            chooseUserEntered: true,
          };
          updateDomesticAddress(config);
        });

        it('should update successfully choosing the suggessted address', () => {
          const config = {
            mobile: false,
            chooseUserEntered: true,
          };
          updateDomesticAddress(config);
        });
      });
    });
  });

  // describe('should successfully update addresses on mobile', () => {
  //   updateAddress(true);
  // });
});
