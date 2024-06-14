import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import maxTestData from './fixtures/data/requiredOnly.json';
import {
  fillAddressWithKeyboard,
  fillDateWithKeyboard,
  fillNameWithKeyboard,
  selectRadioWithKeyboard,
  selectDropdownWithKeyboard,
  selectCheckboxWithKeyboard,
} from './utils/keyboard-only';

describe('Caregivers-Keyboard-Only', () => {
  // NOTE: This test is skipped in CI due to a limitiation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('POST', '/v0/caregivers_assistance_claims', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'form1010cg_submissions',
          attributes: {
            confirmationNumber: 'aB935000000F3VnCAK',
            submittedAt: '2020-08-06T19:18:11+00:00',
          },
        },
      },
    }).as('mockSubmit');
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.wrap(maxTestData).as('testData');
    cy.get('@testData').then(data => {
      cy.visit(manifest.rootUrl);
      cy.wait(['@mockFeatures']);
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[href="#start"]');
      cy.realPress('Enter');

      // Veteran information
      fillNameWithKeyboard('veteranFullName', data.veteranFullName);
      cy.typeInIfDataExists(
        '[name="root_veteranSsnOrTin"]',
        data.veteranSsnOrTin,
      );
      fillDateWithKeyboard('veteranDateOfBirth', data.veteranDateOfBirth);
      selectRadioWithKeyboard('veteranGender', data.veteranGender);
      cy.tabToContinueForm();

      // Veteran contact information
      const { veteranAddress } = data;
      fillAddressWithKeyboard('veteranAddress', veteranAddress);
      cy.typeInIfDataExists(
        '[name="root_veteranPrimaryPhoneNumber"]',
        data.veteranPrimaryPhoneNumber,
      );
      cy.tabToContinueForm();

      // VA medical center
      const {
        veteranFacilityState,
        plannedClinic,
      } = data.veteranPreferredFacility;
      selectDropdownWithKeyboard(
        'veteranPreferredFacility_veteranFacilityState',
        veteranFacilityState,
      );
      selectDropdownWithKeyboard(
        'veteranPreferredFacility_plannedClinic',
        plannedClinic,
      );
      cy.tabToContinueForm();

      // Primary caregiver declaration
      selectRadioWithKeyboard('view:hasPrimaryCaregiver', 'Y');
      cy.tabToContinueForm();

      // Primary caregiver information
      fillNameWithKeyboard('primaryFullName', data.primaryFullName);
      fillDateWithKeyboard('primaryDateOfBirth', data.primaryDateOfBirth);
      selectRadioWithKeyboard('primaryGender', data.primaryGender);
      cy.tabToContinueForm();

      // Primary caregiver contact information
      selectCheckboxWithKeyboard('[name="root_caregiverAddress_autofill"]');
      cy.typeInIfDataExists(
        '[name="root_primaryPrimaryPhoneNumber"]',
        data.primaryPrimaryPhoneNumber,
      );
      selectDropdownWithKeyboard(
        'primaryVetRelationship',
        data.primaryVetRelationship,
      );
      cy.tabToContinueForm();

      // Primary caregiver insurance
      selectRadioWithKeyboard('primaryHasHealthInsurance', 'Y');
      cy.tabToContinueForm();

      // Sign as representative
      selectRadioWithKeyboard('signAsRepresentativeYesNo', 'no');
      cy.tabToContinueForm();

      // Review / Submit
      cy.tabToElementAndPressSpace('.va-accordion__button');
      cy.typeInIfDataExists(
        'va-text-input.signature-input',
        data.veteranSignature,
      );
      cy.tabToElementAndPressSpace('va-checkbox.signature-checkbox');
      cy.tabToSubmitForm();

      // Confirmation
      cy.location('pathname').should('include', '/confirmation');
    });
  });
});
