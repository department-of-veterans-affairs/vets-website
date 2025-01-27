import minTestData from './fixtures/data/minimal-test.json';
import {
  acceptPrivacyAgreement,
  goToNextPage,
  selectDropdownWebComponent,
  setupForAuth,
  setupForGuest,
  shortFormSelfDisclosureToSubmit,
  startAsAuthUser,
  startAsGuestUser,
} from './utils';

const { data: testData } = minTestData;

describe('HCA-ShortForm-Authenticated: High disability', () => {
  beforeEach(() => {
    setupForAuth({ disabilityRating: 90 });
    startAsAuthUser();
  });

  it('works with total disability rating greater than or equal to 50%', () => {
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.get('[type=radio]').check('N');

    goToNextPage('/veteran-information/veteran-home-address');
    cy.get('#root_veteranHomeAddress_street').type(
      testData.veteranAddress.street,
    );
    cy.get('#root_veteranHomeAddress_city').type(testData.veteranAddress.city);
    cy.get('#root_veteranHomeAddress_state').select(
      testData.veteranAddress.state,
    );
    cy.get('#root_veteranHomeAddress_postalCode').type(
      testData.veteranAddress.postalCode,
    );

    goToNextPage('/veteran-information/contact-information');

    // TERA response
    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('N');

    // medicaid
    goToNextPage('/insurance-information/medicaid');
    cy.get('#root_isMedicaidEligibleNo').check('N');

    // insurance policies
    goToNextPage('/insurance-information/your-health-insurance');
    goToNextPage('/insurance-information/general');
    cy.get('#root_isCoveredByHealthInsuranceNo').check('N');

    goToNextPage('/insurance-information/va-facility');
    selectDropdownWebComponent(
      'view:preferredFacility_view:facilityState',
      testData['view:preferredFacility']['view:facilityState'],
    );
    cy.wait('@getFacilities');
    selectDropdownWebComponent(
      'view:preferredFacility_vaMedicalFacility',
      testData['view:preferredFacility'].vaMedicalFacility,
    );

    goToNextPage('review-and-submit');
    acceptPrivacyAgreement();

    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.wait('@mockSubmit');
    cy.location('pathname').should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-ShortForm-Authenticated: Low disability', () => {
  beforeEach(() => {
    setupForAuth({ disabilityRating: 40 });
    startAsAuthUser();
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    goToNextPage('/veteran-information/demographic-information');

    goToNextPage('/veteran-information/veteran-address');
    cy.get('[type=radio]')
      .first()
      .scrollIntoView()
      .check('Y');

    goToNextPage('/veteran-information/contact-information');
    shortFormSelfDisclosureToSubmit();
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-ShortForm: Unauthenticated', () => {
  beforeEach(() => {
    setupForGuest();
    startAsGuestUser();
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    cy.findByLabelText(/first name/i).type(testData.veteranFullName.first);
    cy.findByLabelText(/last name/i).type(testData.veteranFullName.last);

    const [year, month, day] = testData.veteranDateOfBirth
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.findByLabelText(/month/i).select(month);
    cy.findByLabelText(/day/i).select(day);
    cy.findByLabelText(/year/i).type(year);

    cy.findByLabelText(/social security/i).type(
      testData.veteranSocialSecurityNumber,
    );
    goToNextPage('/check-your-personal-information');
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.get('[type=radio]').check('M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.get('#root_veteranAddress_street').type(testData.veteranAddress.street);
    cy.get('#root_veteranAddress_city').type(testData.veteranAddress.city);
    cy.get('#root_veteranAddress_state').select(testData.veteranAddress.state);
    cy.get('#root_veteranAddress_postalCode').type(
      testData.veteranAddress.postalCode,
    );
    cy.get('[type=radio]')
      .first()
      .scrollIntoView()
      .check('Y');

    goToNextPage('/veteran-information/contact-information');
    shortFormSelfDisclosureToSubmit();
    cy.injectAxeThenAxeCheck();
  });
});
