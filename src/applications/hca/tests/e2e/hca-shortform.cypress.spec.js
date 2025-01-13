import minTestData from './fixtures/data/minimal-test.json';
import {
  advanceFromShortFormToSubmit,
  advanceToAuthShortForm,
  fillIdentityForm,
  goToNextPage,
  setupForAuth,
  setupForGuest,
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
    advanceToAuthShortForm();
    advanceFromShortFormToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-Shortform-Authenticated-Low-Disability', () => {
  beforeEach(() => {
    setupForAuth({ disabilityRating: 40 });
    startAsAuthUser();
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    advanceToAuthShortForm();

    goToNextPage('/va-benefits/basic-information');
    cy.selectRadio('root_vaCompensationType', 'highDisability');

    goToNextPage('/va-benefits/confirm-service-pay');
    advanceFromShortFormToSubmit(testData);
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
    goToNextPage('/va-benefits/basic-information');
    cy.selectRadio('root_vaCompensationType', 'highDisability');

    goToNextPage('/va-benefits/confirm-service-pay');
    advanceFromShortFormToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
