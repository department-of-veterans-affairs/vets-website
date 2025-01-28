import minTestData from './fixtures/data/minimal-test.json';
import mockFeatures from './fixtures/mocks/feature-toggles.reg-only.json';
import {
  goToNextPage,
  setupForAuth,
  setupForGuest,
  startAsAuthUser,
} from './utils';

const { data: testData } = minTestData;

describe('HCA-Registration-Only: Authenticated user', () => {
  context('when user has no disability rating - 0%', () => {
    beforeEach(() => {
      setupForAuth({ features: mockFeatures });
      startAsAuthUser();
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has high disability rating - 50%+', () => {
    beforeEach(() => {
      setupForAuth({ features: mockFeatures, disabilityRating: 80 });
      startAsAuthUser();
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has low disability rating of - 10-40%)', () => {
    beforeEach(() => {
      setupForAuth({ features: mockFeatures, disabilityRating: 30 });
      startAsAuthUser();
      goToNextPage('/va-benefits-package');
    });

    it('should allow user to advance to the application if `full medical benefits` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('fullPackage');
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxeThenAxeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('regOnly');
      goToNextPage('/care-for-service-connected-conditions');
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('HCA-Registration-Only: Guest user', () => {
  const advanceToVaBenefits = ({ vaCompensationType }) => {
    cy.get('.schemaform-start-button')
      .first()
      .click();
    cy.location('pathname').should('include', '/id-form');

    cy.get('#root_firstName').type(testData.veteranFullName.first);
    cy.get('#root_lastName').type(testData.veteranFullName.last);

    const [year, month, day] = testData.veteranDateOfBirth
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.get('#root_dobMonth').select(month);
    cy.get('#root_dobDay').select(day);
    cy.get('#root_dobYear').type(year);

    cy.get('#root_ssn').type(testData.veteranSocialSecurityNumber);

    goToNextPage('/check-your-personal-information');
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.get('[name="root_gender"]').check('M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.get('#root_veteranAddress_street').type(testData.veteranAddress.street);
    cy.get('#root_veteranAddress_city').type(testData.veteranAddress.city);
    cy.get('#root_veteranAddress_state').select(testData.veteranAddress.state);
    cy.get('#root_veteranAddress_postalCode').type(
      testData.veteranAddress.postalCode,
    );
    cy.get('[name="root_view:doesMailingMatchHomeAddress"]').check('Y');

    goToNextPage('/veteran-information/contact-information');
    goToNextPage('/va-benefits/basic-information');
    cy.get('[name="root_vaCompensationType"]').check(vaCompensationType);
  };

  beforeEach(() => {
    setupForGuest({ features: mockFeatures });
  });

  context('when user selects `no` (0%) VA disability compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits({ vaCompensationType: 'none' });
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/va-benefits/pension-information');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user selects `highDisability` (50%+) compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits({ vaCompensationType: 'highDisability' });
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/va-benefits/confirm-service-pay');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user selects `lowDisability` (10-40%) compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits({ vaCompensationType: 'lowDisability' });
      goToNextPage('/va-benefits/benefits-package');
    });

    it('should allow user to continue through the application if `full medical benefits` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('fullPackage');
      goToNextPage('/military-service/service-information');
      cy.injectAxeThenAxeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('regOnly');
      goToNextPage('/va-benefits/service-connected-care');
      cy.injectAxeThenAxeCheck();
    });
  });
});
