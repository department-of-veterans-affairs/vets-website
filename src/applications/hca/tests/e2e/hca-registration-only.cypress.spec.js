import minTestData from './fixtures/data/minimal-test.json';
import mockFeatures from './fixtures/mocks/feature-toggles.reg-only.json';
import {
  advanceToVaBenefits,
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
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has high disability rating - 50%+', () => {
    beforeEach(() => {
      setupForAuth({ features: mockFeatures, disabilityRating: 80 });
      startAsAuthUser();
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has low disability rating of - 10-40%)', () => {
    beforeEach(() => {
      setupForAuth({ features: mockFeatures, disabilityRating: 30 });
      startAsAuthUser();
      goToNextPage();
    });

    it('should allow user to advance to the application if `full medical benefits` is selected on the form page', () => {
      cy.selectVaRadioOption('root_view:vaBenefitsPackage', 'fullPackage');
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.selectVaRadioOption('root_view:vaBenefitsPackage', 'regOnly');
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });
});

describe('HCA-Registration-Only: Guest user', () => {
  beforeEach(() => {
    setupForGuest({ features: mockFeatures });
  });

  context('when user selects `no` (0%) VA disability compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits(testData);
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user selects `highDisability` (50%+) compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits(testData, { compensation: 'highDisability' });
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user selects `lowDisability` (10-40%) compensation', () => {
    beforeEach(() => {
      advanceToVaBenefits(testData, { compensation: 'lowDisability' });
      goToNextPage();
    });

    it('should allow user to continue through the application if `full medical benefits` is selected on the form page', () => {
      cy.selectVaRadioOption('root_view:vaBenefitsPackage', 'fullPackage');
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.selectVaRadioOption('root_view:vaBenefitsPackage', 'regOnly');
      goToNextPage();
      cy.injectAxeThenAxeCheck();
    });
  });
});
