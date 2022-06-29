import moment from 'moment';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-shortForm.json';
import mockUserAiq from './fixtures/mockUserAiq';
import minTestData from './fixtures/schema/minimal-test.json';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import prefillAiq from './fixtures/mockPrefillAiq.json';
import * as aiqHelpers from './helpers';

const mockUserAttrs = mockUserAiq.data.attributes;
const testData = minTestData.data;

const disabilityRating = 90;

describe('HCA-Shortform-Authenticated-High-Disability', () => {
  beforeEach(() => {
    cy.login(mockUserAiq);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: prefillAiq,
    }).as('mockSip');
    cy.intercept('/v0/disability_compensation_form/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'evss_disability_compensation_form_rating_info_responses',
          attributes: { userPercentOfDisability: disabilityRating },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works with total disability rating greater than or equal to 50%', () => {
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);
    // wait for useEffect to set  'view:totalDisabilityRating'
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.findAllByText(/start.+application/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@mockSip');

    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    // birth information page with short form message
    // wait for hideIf to show shortform message
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.findAllByText(/you can fill out a shorter application/i, {
      selector: 'h3',
    })
      .first()
      .should('exist');

    cy.get('va-alert')
      .contains(disabilityRating)
      .should('exist');

    cy.injectAxe();
    cy.axeCheck();

    aiqHelpers.goToNextPage('/veteran-information/maiden-name-information');
    aiqHelpers.shortFormAdditionalHelpAssertion();

    aiqHelpers.goToNextPage('/veteran-information/birth-sex');
    aiqHelpers.shortFormAdditionalHelpAssertion();

    aiqHelpers.goToNextPage('/veteran-information/demographic-information');
    aiqHelpers.shortFormAdditionalHelpAssertion();

    // aiqHelpers.goToNextPage('/veteran-information/american-indian');
    // aiqHelpers.shortFormAdditionalHelpAssertion();
    // cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();

    aiqHelpers.goToNextPage('/veteran-information/veteran-address');
    aiqHelpers.shortFormAdditionalHelpAssertion();
    cy.get('[type=radio]').check('N');

    aiqHelpers.goToNextPage('/veteran-information/veteran-home-address');
    aiqHelpers.shortFormAdditionalHelpAssertion();
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

    aiqHelpers.goToNextPage('/veteran-information/contact-information');
    aiqHelpers.shortFormAdditionalHelpAssertion();

    cy.wait('@mockSip');
    cy.get('[name*="emailConfirmation"]')
      .scrollIntoView()
      .type(mockUserAttrs.profile.email);

    // medicaid
    aiqHelpers.goToNextPage('/insurance-information/medicaid');
    aiqHelpers.shortFormAdditionalHelpAssertion();
    cy.get('[type=radio]#root_isMedicaidEligibleNo')
      .first()
      .scrollIntoView()
      .check('N');

    // general insurance
    aiqHelpers.goToNextPage('/insurance-information/general');
    aiqHelpers.shortFormAdditionalHelpAssertion();

    cy.get('[type=radio]#root_isCoveredByHealthInsuranceNo')
      .first()
      .scrollIntoView()
      .check('N');

    aiqHelpers.goToNextPage('/insurance-information/va-facility');
    aiqHelpers.shortFormAdditionalHelpAssertion();
    cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
      testData['view:preferredFacility']['view:facilityState'],
    );
    cy.wait('@mockSip');
    cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
      testData['view:preferredFacility'].vaMedicalFacility,
    );

    aiqHelpers.goToNextPage('review-and-submit');

    cy.get('[name="privacyAgreementAccepted"]')
      .scrollIntoView()
      .check();
    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.wait('@mockSubmit');
    cy.location('pathname').should('include', '/confirmation');
  });
});

describe('HCA-Shortform-Authenticated-Low-Disability', () => {
  beforeEach(() => {
    cy.login(mockUserAiq);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/disability_compensation_form/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'evss_disability_compensation_form_rating_info_responses',
          attributes: { userPercentOfDisability: 40 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: prefillAiq,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    cy.visit(manifest.rootUrl);
    cy.wait([
      '@mockUser',
      '@mockFeatures',
      '@mockEnrollmentStatus',
      '@mockDisabilityRating',
    ]);
    // wait for useEffect to set  'view:totalDisabilityRating'
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    cy.findAllByText(/start.+application/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );

    aiqHelpers.goToNextPage('/veteran-information/birth-information');
    aiqHelpers.goToNextPage('/veteran-information/maiden-name-information');
    aiqHelpers.goToNextPage('/veteran-information/birth-sex');
    aiqHelpers.goToNextPage('/veteran-information/demographic-information');

    // aiqHelpers.goToNextPage('/veteran-information/american-indian');
    // cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();

    aiqHelpers.goToNextPage('/veteran-information/veteran-address');
    cy.get('[type=radio]')
      .first()
      .scrollIntoView()
      .check('Y');

    aiqHelpers.goToNextPage('/veteran-information/contact-information');
    cy.wait('@mockSip');
    cy.get('[name*="emailConfirmation"]')
      .scrollIntoView()
      .type(mockUserAttrs.profile.email);

    cy.injectAxe();
    cy.axeCheck();

    aiqHelpers.shortFormSelfDisclosureToSubmit();
  });
});

describe('HCA-Shortform-UnAuthenticated', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works with self disclosure of va compensation type of High Disability', () => {
    cy.visit(manifest.rootUrl);

    cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
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
    aiqHelpers.goToNextPage('veteran-information/profile-information');
    aiqHelpers.goToNextPage('veteran-information/profile-information-ssn');
    aiqHelpers.goToNextPage('veteran-information/profile-information-dob');

    aiqHelpers.goToNextPage('/veteran-information/birth-information');
    aiqHelpers.goToNextPage('/veteran-information/maiden-name-information');
    aiqHelpers.goToNextPage('/veteran-information/birth-sex');
    cy.get('[type=radio]').check('M');

    aiqHelpers.goToNextPage('/veteran-information/demographic-information');

    // aiqHelpers.goToNextPage('/veteran-information/american-indian');
    // cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();

    aiqHelpers.goToNextPage('/veteran-information/veteran-address');
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

    aiqHelpers.goToNextPage('/veteran-information/contact-information');

    cy.injectAxe();
    cy.axeCheck();

    aiqHelpers.shortFormSelfDisclosureToSubmit();
  });
});
