import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles-reg-only.json';
import mockUser from './fixtures/mocks/mockUser';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import minTestData from './fixtures/data/minimal-test.json';
import { goToNextPage } from './utils';

const { data: testData } = minTestData;
const APIs = {
  features: '/v0/feature_toggles*',
  prefill: '/v0/in_progress_forms/1010ez',
  enrollment: '/v0/health_care_applications/enrollment_status*',
  disability: '/v0/health_care_applications/rating_info',
};

describe('HCA-Registration-Only-Authenticated-User', () => {
  const setupAuthUser = ({ userPercentOfDisability = 0 }) => {
    cy.intercept('GET', APIs.features, featureToggles).as('mockFeatures');
    cy.intercept('GET', APIs.enrollment, {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept(APIs.disability, {
      statusCode: 200,
      body: {
        data: { id: '', type: 'hash', attributes: { userPercentOfDisability } },
      },
    }).as('mockDisabilityRating');
    cy.intercept(APIs.prefill, { statusCode: 200, body: mockPrefill }).as(
      'mockSip',
    );
    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);
  };
  const startApplication = () => {
    cy.get('[href="#start"]')
      .first()
      .click();
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );
  };

  context('when user has no disability rating - 0%', () => {
    beforeEach(() => {
      setupAuthUser({ userPercentOfDisability: 0 });
      startApplication();
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when user has high disability rating - 50%+', () => {
    beforeEach(() => {
      setupAuthUser({ userPercentOfDisability: 80 });
      startApplication();
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when user has low disability rating of - 10-40%)', () => {
    beforeEach(() => {
      setupAuthUser({ userPercentOfDisability: 30 });
      startApplication();
      goToNextPage('/va-benefits-package');
    });

    it('should allow user to advance to the application if `full medical benefits` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('fullPackage');
      goToNextPage('/veteran-information/birth-information');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('regOnly');
      goToNextPage('/care-for-service-connected-conditions');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});

describe('HCA-Registration-Only-Guest-User', () => {
  const setupGuestUser = () => {
    cy.intercept('GET', APIs.features, featureToggles).as('mockFeatures');
    cy.intercept('GET', APIs.enrollment, {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockFeatures']);
  };
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

  context('when user selects `no` (0%) VA disability compensation', () => {
    beforeEach(() => {
      setupGuestUser();
      advanceToVaBenefits({ vaCompensationType: 'none' });
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/va-benefits/pension-information');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when user selects `highDisability` (50%+) compensation', () => {
    beforeEach(() => {
      setupGuestUser();
      advanceToVaBenefits({ vaCompensationType: 'highDisability' });
    });

    it('should not follow the registration only pathway', () => {
      goToNextPage('/va-benefits/confirm-service-pay');
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  context('when user selects `lowDisability` (10-40%) compensation', () => {
    beforeEach(() => {
      setupGuestUser();
      advanceToVaBenefits({ vaCompensationType: 'lowDisability' });
      goToNextPage('/va-benefits/benefits-package');
    });

    it('should allow user to continue through the application if `full medical benefits` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('fullPackage');
      goToNextPage('/military-service/service-information');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('should block user from advancing to the application if `reg only` is selected on the form page', () => {
      cy.get('[name="root_view:vaBenefitsPackage"]').check('regOnly');
      goToNextPage('/va-benefits/service-connected-care');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
