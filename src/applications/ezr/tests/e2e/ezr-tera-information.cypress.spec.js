import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockUserAgentOrangeDob from './fixtures/mocks/tera/mock-user-agent-orange-dob';
import mockUserCombatOperationsDob from './fixtures/mocks/tera/mock-user-combat-operations-dob';
import mockUserOtherExposureDob from './fixtures/mocks/tera/mock-user-other-exposure-dob';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import mockPrefillAgentOrangeDob from './fixtures/mocks/tera/mock-prefill-agent-orange-dob.json';
import mockPrefillCombatOperationsDob from './fixtures/mocks/tera/mock-prefill-combat-operations-dob.json';
import mockPrefillOtherExposureDob from './fixtures/mocks/tera/mock-prefill-other-exposure-dob.json';
import {
  goToNextPage,
  goToPreviousPage,
  fillGulfWarDateRange,
  fillAgentOrangeDateRange,
  fillTextWebComponent,
} from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import { advanceToHouseholdSection } from './helpers/household';

function setUserData(user, prefillData) {
  cy.login(user);
  cy.intercept('GET', '/v0/feature_toggles*', {
    /*
    Remove this data object and replace it with 'mockfeatures' after removing the
    'ezr_tera_branching_enabled' feature toggle
    */
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'ezrProdEnabled',
          value: true,
        },
        {
          name: 'hcaSigiEnabled',
          value: false,
        },
      ],
    },
  });
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
    statusCode: 200,
    body: MOCK_ENROLLMENT_RESPONSE,
  }).as('mockEnrollmentStatus');
  cy.intercept('/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: prefillData,
  }).as('mockSip');
}

function goToToxicExposurePageAndCheckYes() {
  cy.visit(manifest.rootUrl);
  // Add '@mockfeatures' back to this list after removing the 'ezr_tera_branching_enabled' feature toggle
  cy.wait(['@mockUser', '@mockEnrollmentStatus']);

  advanceToHouseholdSection();

  goToNextPage('/military-service/toxic-exposure');
  cy.get('[name="root_hasTeraResponse"]').check('Y');
  cy.injectAxeThenAxeCheck();
}

describe('EZR TERA flow', () => {
  beforeEach(() => {
    setUserData(mockUser, mockPrefill);
    goToToxicExposurePageAndCheckYes();
  });

  it('should not show tera information questions when the user does not have any tera information to report', () => {
    /*
    Go through the tera flow until the 'Operation Support' page is reached.
    After that, go back to first tera page and select 'No' instead of 'Yes'.
    */
    goToNextPage('/military-service/radiation-cleanup-efforts');
    cy.get('[name="root_radiationCleanupEfforts"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/gulf-war-service');
    cy.get('[name="root_gulfWarService"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/gulf-war-service-dates');
    fillGulfWarDateRange();
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/operation-support');
    cy.get('[name="root_combatOperationService"]').check('Y');
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/agent-orange-exposure');
    cy.get('[name="root_exposedToAgentOrange"]').check('Y');

    goToNextPage('/military-service/agent-orange-exposure-dates');
    fillAgentOrangeDateRange();
    cy.injectAxeThenAxeCheck();

    goToNextPage('/military-service/other-toxic-exposure');
    [...Array(7)].forEach(_ => goToPreviousPage());
    cy.get('[name="root_hasTeraResponse"]').check('N');
    // Expect the tera section to be skipped. Instead, the user will move to the household section
    goToNextPage('/household-information/marital-status');
  });
});

describe("EZR branching logic based on the user's DOB", () => {
  describe('when the user has a DOB between 1900 and 1965', () => {
    beforeEach(() => {
      setUserData(mockUserAgentOrangeDob, mockPrefillAgentOrangeDob);
      goToToxicExposurePageAndCheckYes();
    });

    it('displays the radiation cleanup, Gulf War, combat operations, agent orange, and other toxic exposure pages', () => {
      goToNextPage('/military-service/radiation-cleanup-efforts');
      cy.get('[name="root_radiationCleanupEfforts"]').check('Y');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/gulf-war-service');
      cy.get('[name="root_gulfWarService"]').check('Y');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/gulf-war-service-dates');
      fillGulfWarDateRange();
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/operation-support');
      cy.get('[name="root_combatOperationService"]').check('Y');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/agent-orange-exposure');
      cy.get('[name="root_exposedToAgentOrange"]').check('Y');

      goToNextPage('/military-service/agent-orange-exposure-dates');
      fillAgentOrangeDateRange();
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/other-toxic-exposure');
      goToNextPage('/military-service/upload-supporting-documents');
      goToNextPage('/household-information/marital-status');
    });
  });

  describe('when the user has a DOB between 1966 and the present day - 15 years', () => {
    beforeEach(() => {
      setUserData(mockUserCombatOperationsDob, mockPrefillCombatOperationsDob);
      goToToxicExposurePageAndCheckYes();
    });

    it('displays the Gulf War, combat operations pages, and other toxic exposure pages', () => {
      goToNextPage('/military-service/gulf-war-service');
      cy.get('[name="root_gulfWarService"]').check('Y');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/gulf-war-service-dates');
      fillGulfWarDateRange();
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/operation-support');
      cy.get('[name="root_combatOperationService"]').check('Y');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/other-toxic-exposure');
      goToNextPage('/military-service/upload-supporting-documents');
      goToNextPage('/household-information/marital-status');
    });
  });

  describe('when the user has a DOB after the present day - 15 years', () => {
    beforeEach(() => {
      setUserData(mockUserOtherExposureDob, mockPrefillOtherExposureDob);
      goToToxicExposurePageAndCheckYes();
    });

    it('only displays the other toxic exposure pages', () => {
      goToNextPage('/military-service/other-toxic-exposure');
      cy.get('[name="root_view:otherToxicExposures_exposureToOther"]')
        .scrollIntoView()
        .click();
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/other-toxins-or-hazards');
      fillTextWebComponent('otherToxicExposure', 'Test');
      cy.injectAxeThenAxeCheck();

      goToNextPage('/military-service/other-toxic-exposure-dates');
    });
  });
});
