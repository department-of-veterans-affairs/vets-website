import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import {
  goToNextPage,
  goToPreviousPage,
  fillGulfWarDateRange,
} from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import { advanceToHouseholdSection } from './helpers/household';

describe('EZR TERA flow', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
  });

  it('should not show tera information questions when the user does not have any tera information to report', () => {
    /*
    Go through the tera flow until the 'Operation Support' page is reached.
    After that, go back to first tera page and select 'No' instead of 'Yes'.
    */
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);

    advanceToHouseholdSection();

    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/gulf-war-service-dates');
    fillGulfWarDateRange();
    cy.injectAxeThenAxeCheck();

    goToNextPage('/operation-support');
    [...Array(4)].forEach(_ => goToPreviousPage());
    cy.get('[name="root_hasTeraResponse"]').check('N');
    // Expect the tera section to be skipped. Instead, the user will move to the household section
    goToNextPage('/household-information/marital-status');
  });
});
