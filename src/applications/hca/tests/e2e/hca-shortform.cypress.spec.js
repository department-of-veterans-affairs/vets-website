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

describe('HCA-ShortForm-Authenticated: High disability', () => {
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

describe('HCA-ShortForm-Authenticated: Low disability', () => {
  beforeEach(() => {
    setupForAuth({ disabilityRating: 40 });
    startAsAuthUser();
  });

  it('works with self disclosure of VA compensation type of High Disability', () => {
    advanceToAuthShortForm();

    goToNextPage('/va-benefits/basic-information');
    cy.selectVaRadioOption('root_vaCompensationType', 'highDisability');

    goToNextPage('/va-benefits/confirm-service-pay');
    advanceFromShortFormToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});

describe('HCA-ShortForm: Unauthenticated', () => {
  beforeEach(() => {
    setupForGuest();
    startAsGuestUser();
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    fillIdentityForm(testData);

    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.selectVaRadioOption('root_gender', 'M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.fillAddress('root_veteranAddress', testData.veteranAddress);
    cy.selectYesNoVaRadioOption('root_view:doesMailingMatchHomeAddress', true);

    goToNextPage('/veteran-information/contact-information');
    goToNextPage('/va-benefits/basic-information');
    cy.selectVaRadioOption('root_vaCompensationType', 'highDisability');

    goToNextPage('/va-benefits/confirm-service-pay');
    advanceFromShortFormToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
