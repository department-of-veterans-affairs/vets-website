import manifest from '../../manifest.json';
import maxTestData from './fixtures/data/requiredOnly.json';
import { setupBasicTest } from './utils';

const { data: testData } = maxTestData;

describe('Caregivers-Keyboard-Only', () => {
  // NOTE: This test is skipped in CI due to a limitiation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    setupBasicTest();
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockFeatures']);
    cy.tabToStartForm();

    // Veteran information
    cy.typeInFullName('root_veteranFullName', testData.veteranFullName);
    cy.typeInIfDataExists(
      '[name="root_veteranSsnOrTin"]',
      testData.veteranSsnOrTin,
    );
    cy.typeInVaMemorableDate(
      'root_veteranDateOfBirth',
      testData.veteranDateOfBirth,
    );
    cy.selectRadioFromData(
      '[name="root_veteranGender"]',
      testData.veteranGender,
    );
    cy.tabToContinueForm();

    // Veteran contact information
    cy.typeInAddress('root_veteranAddress', testData.veteranAddress);
    cy.typeInIfDataExists(
      '[name="root_veteranPrimaryPhoneNumber"]',
      testData.veteranPrimaryPhoneNumber,
    );
    cy.tabToContinueForm();

    // VA medical center
    const {
      veteranFacilityState,
      plannedClinic,
    } = testData.veteranPreferredFacility;
    const fieldSelector = field =>
      `[name="root_veteranPreferredFacility_${field}"]`;
    cy.selectDropdownFromData(
      fieldSelector('veteranFacilityState'),
      veteranFacilityState,
    );
    cy.selectDropdownFromData(fieldSelector('plannedClinic'), plannedClinic);
    cy.tabToContinueForm();

    // Primary caregiver declaration
    cy.selectRadioFromData('[name="root_view:hasPrimaryCaregiver"]', 'Y');
    cy.tabToContinueForm();

    // Primary caregiver information
    cy.typeInFullName('root_primaryFullName', testData.primaryFullName);
    cy.typeInVaMemorableDate(
      'root_primaryDateOfBirth',
      testData.primaryDateOfBirth,
    );
    cy.selectRadioFromData(
      '[name="root_primaryGender"]',
      testData.primaryGender,
    );
    cy.tabToContinueForm();

    // Primary caregiver contact information
    cy.setCheckboxFromData('[name="root_caregiverAddress_autofill"]');
    cy.typeInIfDataExists(
      '[name="root_primaryPrimaryPhoneNumber"]',
      testData.primaryPrimaryPhoneNumber,
    );
    cy.selectDropdownFromData(
      '[name="root_primaryVetRelationship"]',
      testData.primaryVetRelationship,
    );
    cy.tabToContinueForm();

    // Primary caregiver insurance
    cy.selectRadioFromData('[name="primaryHasHealthInsurance"]', 'Y');
    cy.tabToContinueForm();

    // Sign as representative
    cy.selectRadioFromData('[name="signAsRepresentativeYesNo"]', 'no');
    cy.tabToContinueForm();

    // Review / Submit
    cy.tabToElementAndPressSpace('.va-accordion__button');
    cy.typeInIfDataExists(
      'va-text-input.signature-input',
      testData.veteranSignature,
    );
    cy.tabToElementAndPressSpace('va-checkbox.signature-checkbox');
    cy.tabToSubmitForm();

    // Confirmation
    cy.location('pathname').should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });
});
