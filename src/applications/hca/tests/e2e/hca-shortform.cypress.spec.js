import { getTime } from 'date-fns';
import manifest from '../../manifest.json';
import minTestData from './fixtures/data/minimal-test.json';
import mockEnrollmentStatus from './fixtures/mocks/enrollment-status.json';
import mockFacilities from './fixtures/mocks/facilities.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockUser from './fixtures/mocks/user.json';
import {
  acceptPrivacyAgreement,
  goToNextPage,
  selectDropdownWebComponent,
  shortFormSelfDisclosureToSubmit,
} from './utils';

const { data: testData } = minTestData;
const disabilityRating = 90;

describe('HCA-Shortform-Authenticated-High-Disability', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    ).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', mockPrefill).as('mockSip');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: disabilityRating },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: getTime(new Date()),
      },
    }).as('mockSubmit');
    cy.intercept(
      'GET',
      '/v0/health_care_applications/facilities?*',
      mockFacilities,
    ).as('getFacilities');
  });

  it('works with total disability rating greater than or equal to 50%', () => {
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.get('[href="#start"]')
      .first()
      .click();

    cy.wait('@mockSip');

    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    cy.injectAxe();
    cy.axeCheck();

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
    cy.wait('@mockSip');

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
  });
});

describe('HCA-Shortform-Authenticated-Low-Disability', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    ).as('mockEnrollmentStatus');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 40 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('/v0/in_progress_forms/1010ez', mockPrefill).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: getTime(new Date()),
      },
    }).as('mockSubmit');
    cy.intercept(
      'GET',
      '/v0/health_care_applications/facilities?*',
      mockFacilities,
    ).as('getFacilities');
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.get('[href="#start"]')
      .first()
      .click();

    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/check-your-personal-information',
    );

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
    cy.wait('@mockSip');

    cy.injectAxe();
    cy.axeCheck();

    shortFormSelfDisclosureToSubmit();
  });
});

describe('HCA-Shortform-UnAuthenticated', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept(
      'GET',
      '/v0/health_care_applications/enrollment_status*',
      mockEnrollmentStatus,
    ).as('mockEnrollmentStatus');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: getTime(new Date()),
      },
    }).as('mockSubmit');
    cy.intercept(
      'GET',
      '/v0/health_care_applications/facilities?*',
      mockFacilities,
    ).as('getFacilities');
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    cy.visit(manifest.rootUrl);

    cy.get('.schemaform-start-button')
      .first()
      .click();

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

    cy.injectAxe();
    cy.axeCheck();

    shortFormSelfDisclosureToSubmit();
  });
});
