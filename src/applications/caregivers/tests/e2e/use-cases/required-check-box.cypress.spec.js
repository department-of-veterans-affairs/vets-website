import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import mockUpload from '../fixtures/mocks/mock-upload.json';
import formSubmit from '../fixtures/mocks/form-submission.json';

describe('10-10CG -- agree checkboxes are required', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('POST', 'v0/form1010cg/attachments', mockUpload);
    cy.intercept('POST', '/v0/caregivers_assistance_claims', formSubmit);

    disableFTUXModals();
    cy.visit(
      '/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/introduction',
    );
  });
  it('checks if the error message shows if the the boxes are not checked', () => {
    // intro page
    cy.get('.caregivers-intro > :nth-child(4)').click();

    // vet information page
    cy.get('#root_veteranFullName_first').type('Mickey');
    cy.get('#root_veteranFullName_last').type('Mouse');
    cy.get('#root_veteranSsnOrTin').type('123121234');
    cy.get('#root_veteranDateOfBirthMonth').select('1');
    cy.get('#root_veteranDateOfBirthDay').select('1');
    cy.get('#root_veteranDateOfBirthYear').type('1980');
    cy.get('#4-continueButton').click();

    // address page
    cy.get('#root_veteranAddress_street').type('123 Main St');
    cy.get('#root_veteranAddress_city').type('New York');
    cy.get('#root_veteranAddress_state').select('NY');
    cy.get('#root_veteranAddress_postalCode').type('12345');
    cy.get('#root_veteranPrimaryPhoneNumber').type('1234567890');
    cy.get('#4-continueButton').click();

    // facility page
    cy.get('#root_veteranPreferredFacility_veteranFacilityState').select('NY');
    cy.get('#root_veteranPreferredFacility_plannedClinic').select('526');
    cy.get('#4-continueButton').click();

    // application information page
    cy.get('[type="radio"]')
      .first()
      .check();
    cy.get('#4-continueButton').click();

    // primary caregiver information page
    cy.get('#root_primaryFullName_first').type('Daffy');
    cy.get('#root_primaryFullName_last').type('Duck');
    cy.get('#root_primaryDateOfBirthMonth').select('1');
    cy.get('#root_primaryDateOfBirthDay').select('1');
    cy.get('#root_primaryDateOfBirthYear').type('1980');
    cy.get('#4-continueButton').click({ waitForAnimations: true });

    // primary caregiver address page
    cy.get('#root_primaryAddress_street').type('123 Main St');
    cy.get('#root_primaryAddress_city').type('New York');
    cy.get('#root_primaryAddress_state').select('NY');
    cy.get('#root_primaryAddress_postalCode').type('12345');
    cy.get('#root_primaryPrimaryPhoneNumber').type('1234567890');
    cy.get('#root_primaryVetRelationship').select('Significant Other');
    cy.get('#4-continueButton').click({ waitForAnimations: true });

    // primary caregiver coverage page
    cy.get('[type="radio"]')
      .last()
      .check();
    cy.get('#4-continueButton').click({ waitForAnimations: true });

    // secondary caregiver applicant page
    cy.get('[type="radio"]')
      .last()
      .check();
    cy.get('#4-continueButton').click({ waitForAnimations: true });

    // documents page
    cy.get('[type="radio"]')
      .last()
      .check();
    cy.get('#4-continueButton').click({ waitForAnimations: true });

    // populate signatures only on review pager
    cy.get('#errorable-text-input-12').type('Mickey Mouse');
    cy.get('#errorable-text-input-14').type('Daffy Duck');

    // trigger submit
    // cy.get('#15-continueButton').click();
    cy.get('.main .usa-button-primary').click();

    // click submit button to trigger error
    cy.get('#errorable-checkbox-13-error-message').should('exist');
    cy.get('#errorable-checkbox-15-error-message').should('exist');

    // sign it to agree
    cy.get('#errorable-checkbox-13').check();
    cy.get('#errorable-checkbox-15').check();

    // submit form
    cy.get('.main .usa-button-primary').click({ waitForAnimations: true });
    cy.get('.usa-alert-heading').contains('success');
  });
});
