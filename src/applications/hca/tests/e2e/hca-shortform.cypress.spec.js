import minTestData from './fixtures/data/minimal-test.json';
import {
  acceptPrivacyAgreement,
  fillIdentityForm,
  fillVaFacility,
  goToNextPage,
  setupForAuth,
  setupForGuest,
  shortFormSelfDisclosureToSubmit,
  startAsAuthUser,
  startAsGuestUser,
} from './utils';

const { data: testData } = minTestData;

describe('HCA-Shortform-Authenticated-High-Disability', () => {
  beforeEach(() => {
    setupForAuth({ disabilityRating: 90 });
    startAsAuthUser();
  });

  it('works with total disability rating greater than or equal to 50%', () => {
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

    goToNextPage('/veteran-information/contact-information');
    goToNextPage('/military-service/toxic-exposure');
    cy.selectRadio('root_hasTeraResponse', 'N');

    goToNextPage('/insurance-information/medicaid');
    cy.selectRadio('root_isMedicaidEligible', 'N');

    goToNextPage('/insurance-information/your-health-insurance');
    goToNextPage('/insurance-information/general');
    cy.selectRadio('root_isCoveredByHealthInsurance', 'N');

    goToNextPage('/insurance-information/va-facility');
    fillVaFacility(testData['view:preferredFacility']);

    goToNextPage('review-and-submit');
    acceptPrivacyAgreement();

    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.wait('@mockSubmit');
    cy.location('pathname').should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-Shortform-Authenticated-Low-Disability', () => {
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
    cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

    goToNextPage('/veteran-information/contact-information');
    shortFormSelfDisclosureToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-Shortform-UnAuthenticated', () => {
  beforeEach(() => {
    setupForGuest();
    startAsGuestUser();
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    fillIdentityForm(testData);

    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.selectRadio('root_gender', 'M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.fillAddress('root_veteranAddress', testData.veteranAddress);
    cy.selectRadio('root_view:doesMailingMatchHomeAddress', 'Y');

    goToNextPage('/veteran-information/contact-information');
    shortFormSelfDisclosureToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
