import { PTSD_INCIDENT_ITERATION } from '../constants';

const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageAllClaimsHelpers = require('./e2e/disability-benefits-helpers');
const MockData = require('./e2e/mock-data');
const Page781Helpers = require('./e2e/page-781-helpers');
const Page781aHelpers = require('./e2e/page-781a-helpers');
const Page8940Helpers = require('./e2e/page-8940-helpers');
const Page4142Helpers = require('./e2e/page-4142-helpers');
const testData = require('./schema/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');
const ENVIRONMENTS = require('../../../../site/constants/environments');

const runTest = E2eHelpers.createE2eTest(client => {
  if (process.env.BUILDTYPE !== ENVIRONMENTS.VAGOVPROD) {
    const token = Auth.getUserToken();
    const formData = testData.data;

    Auth.logIn(
      token,
      client,
      '/disability-benefits/apply/form-526-all-claims/',
      3,
    );

    MockData.initInProgressMock(token);
    MockData.initDocumentUploadMock();
    MockData.initApplicationSubmitMock();
    MockData.initItfMock(token);
    MockData.initPaymentInformationMock(token);

    // Ensure introduction page renders.
    client.assert
      .title('Apply for disability benefits: VA.gov')
      // First render of React may be slow.
      .waitForElementVisible('.schemaform-title', Timeouts.slow) // First render of React may be slow.
      .waitForElementVisible(
        '.schemaform-intro .usa-button-primary',
        Timeouts.verySlow,
      )
      .click('.schemaform-intro .usa-button-primary')
      // Click past the `You already have an Intent to File` screen.
      .waitForElementVisible('.usa-grid .usa-button-primary', Timeouts.slow)
      .click('.usa-grid .usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    FormsTestHelpers.overrideFormsScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran Details
    // Review Veteran Information
    E2eHelpers.expectLocation(client, '/veteran-information');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // Alternate Name
    E2eHelpers.expectLocation(client, '/alternate-names');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeAlternateName(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Military Retirement Pay
    E2eHelpers.expectLocation(client, '/service-pay');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeMilitaryRetiredPay(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Military Service History
    E2eHelpers.expectLocation(client, '/military-service-history');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeMilitaryHistory(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Combat Zone Post 9/11
    E2eHelpers.expectLocation(client, '/combat-status');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeCombatZonePost911(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Reserves/National Guard Info
    E2eHelpers.expectLocation(client, '/reserves-national-guard');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeReservesNationalGuardInfo(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Federal Orders
    E2eHelpers.expectLocation(client, '/federal-orders');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeFederalOrders(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Disabilities
    // Orientation
    E2eHelpers.expectLocation(client, '/disabilities/orientation');
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Rated Disability Selection
    E2eHelpers.expectLocation(client, '/disabilities/rated-disabilities');
    client.axeCheck('.main');
    PageAllClaimsHelpers.selectDisabilities(client); // Just selects the first one
    client.click('.form-progress-buttons .usa-button-primary');

    // New Disability
    E2eHelpers.expectLocation(client, '/new-disabilities');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeNewDisability(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // New Disability - Add
    E2eHelpers.expectLocation(client, '/new-disabilities/add');
    // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
    client.axeCheck('.main', { rules: ['section508'] });
    PageAllClaimsHelpers.addNewDisability(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // New Disability - Follow up
    E2eHelpers.expectLocation(client, '/new-disabilities/follow-up');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // ***********************
    // 781/a - PTSD
    // ***********************

    // PTSD - Intro
    E2eHelpers.expectLocation(client, '/new-disabilities/ptsd-intro');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // PTSD - Type
    E2eHelpers.expectLocation(client, '/new-disabilities/ptsd-type');
    client.axeCheck('.main');
    PageAllClaimsHelpers.selectPtsdTypes(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // PTSD - 781 - Walkthrough Choice
    E2eHelpers.expectLocation(
      client,
      '/new-disabilities/walkthrough-781-choice',
    );
    client.axeCheck('.main');
    Page781Helpers.selectWalkthrough781Choice(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // PTSD - 781 - PTSD intro to questions
    E2eHelpers.expectLocation(
      client,
      '/new-disabilities/ptsd-intro-to-questions',
    );
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    for (let index = 0; index < PTSD_INCIDENT_ITERATION; index++) {
      const incident = Page781Helpers.getPtsdIncident(formData, index);
      if (incident) {
        // PTSD - 781 - Medals
        E2eHelpers.expectLocation(client, `/disabilities/ptsd-medals-${index}`);
        client.axeCheck('.main');
        Page781Helpers.completePtsdMedals(client, incident, index);
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781 - Incident Date
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-incident-date-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdIncidentDate(client, incident, index);
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781 - Incident Unit Assignment
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-incident-unit-assignment-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdIncidentUnitAssignment(
          client,
          incident,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781 - Incident Location
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-incident-location-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdIncidentLocation(client, incident, index);
        client.click('.form-progress-buttons .usa-button-primary');

        const individualsInvolved = Page781Helpers.getIndividualsInvolved(
          formData,
          index,
        );

        // PTSD - 781 - Individuals Involved
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-individuals-involved-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdIndividualsInvolved(
          client,
          individualsInvolved,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781 - Incident Support
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-incident-support-${index}`,
        );
        client.axeCheck('.main');
        client.click('.form-progress-buttons .usa-button-primary');

        if (individualsInvolved) {
          // PTSD - 781 - Individuals Involved Questions
          E2eHelpers.expectLocation(
            client,
            `/disabilities/ptsd-individuals-involved-questions-${index}`,
          );
          client.axeCheck('.main');
          Page781Helpers.completePtsdIndividualsInvolvedQuestions(
            client,
            incident,
            index,
          );
          client.click('.form-progress-buttons .usa-button-primary');

          // PTSD - 781 - Incident Support Additional Break
          E2eHelpers.expectLocation(
            client,
            `/disabilities/ptsd-incident-support-additional-break-${index}`,
          );
          client.axeCheck('.main');
          client.click('.form-progress-buttons .usa-button-primary');
        }

        // PTSD - 781 - Incident Description
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-incident-description-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdIncidentDescription(client, incident, index);
        client.click('.form-progress-buttons .usa-button-primary');

        // PSTD - 781 - ADDITIONAL EVENTS OR SITUATIONS Y/N
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-additional-events-${index}`,
        );
        client.axeCheck('.main');
        Page781Helpers.completePtsdAdditionalEvents(client, formData, index);
        client.click('.form-progress-buttons .usa-button-primary');
      }
    }

    // PTSD - 781 - Additional Remarks
    E2eHelpers.expectLocation(
      client,
      '/new-disabilities/additional-remarks-781',
    );
    client.axeCheck('.main');
    Page781Helpers.complete781AdditionalRemarks(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // PTSD - 781 - Conclusion
    E2eHelpers.expectLocation(client, '/ptsd-conclusion-combat');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // PTSD - 781a - Walkthrough Choice
    E2eHelpers.expectLocation(
      client,
      '/new-disabilities/walkthrough-781a-choice',
    );
    client.axeCheck('.main');
    Page781aHelpers.selectWalkthrough781aChoice(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');
    for (let index = 0; index < PTSD_INCIDENT_ITERATION; index++) {
      const secondaryIncident = Page781aHelpers.getPtsdSecondaryIncident(
        formData,
        index,
      );
      if (secondaryIncident) {
        // PTSD - 781a - Incident Date
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-incident-date-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryIncidentDate(
          client,
          secondaryIncident,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781a - Incident Unit Assignment
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-incident-unit-assignment-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryIncidentUnitAssignment(
          client,
          secondaryIncident,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781a - Incident Location
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-incident-location-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryIncidentLocation(
          client,
          secondaryIncident,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781a - Incident Support
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-incident-support-${index}`,
        );
        client.axeCheck('.main');
        client.click('.form-progress-buttons .usa-button-primary');

        // PTSD - 781a - Incident Description
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-incident-description-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryIncidentDescription(
          client,
          secondaryIncident,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        const otherSources = secondaryIncident.otherSources;

        // PTSD - 781a - Other Sources
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-other-sources-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryOtherSources(
          client,
          otherSources,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        if (otherSources) {
          // PTSD - 781a - Other Sources Help
          E2eHelpers.expectLocation(
            client,
            `/disabilities/ptsd-secondary-other-sources-help-${index}`,
          );
          client.axeCheck('.main');
          Page781aHelpers.completePtsdSecondaryOtherSourcesHelp(
            client,
            secondaryIncident,
            index,
          );
          client.click('.form-progress-buttons .usa-button-primary');

          if (
            Page781aHelpers.getHelpPrivateMedicalTreatment(secondaryIncident)
          ) {
            // PTSD - 781a - Permission Notice
            E2eHelpers.expectLocation(
              client,
              `/disabilities/ptsd-secondary-permission-notice-${index}`,
            );
            client.axeCheck('.main');
            client.click('.form-progress-buttons .usa-button-primary');
          }

          if (Page781aHelpers.getHelpRequestingStatements(secondaryIncident)) {
            // PTSD - 781a - Reports from authorities
            E2eHelpers.expectLocation(
              client,
              `/disabilities/ptsd-secondary-authorities-${index}`,
            );
            client.axeCheck('.main');
            Page781aHelpers.completePtsdSecondaryAuthorities(
              client,
              secondaryIncident,
              index,
            );
            client.click('.form-progress-buttons .usa-button-primary');
          }
        }

        const uploadChoice = Page781aHelpers.getUploadChoice(formData, index);

        // PTSD - 781a - Supporting documents
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-secondary-upload-supporting-sources-choice-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsdSecondaryUploadSupportingSourcesChoice(
          client,
          uploadChoice,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');

        if (uploadChoice) {
          // PTSD - 781a - Upload supporting documents
          E2eHelpers.expectLocation(
            client,
            `/disabilities/ptsd-secondary-upload-supporting-sources-${index}`,
          );
          client.axeCheck('.main');
          client.click('.form-progress-buttons .usa-button-primary');
        }

        // PSTD - 781a - ADDITIONAL EVENTS OR SITUATIONS Y/N
        E2eHelpers.expectLocation(
          client,
          `/disabilities/ptsd-781a-additional-events-${index}`,
        );
        client.axeCheck('.main');
        Page781aHelpers.completePtsd781aAdditionalEvents(
          client,
          formData,
          index,
        );
        client.click('.form-progress-buttons .usa-button-primary');
      }
    }

    // PSTD - 781a - Changes in physical health
    E2eHelpers.expectLocation(
      client,
      `/new-disabilities/ptsd-781a-physical-changes`,
    );
    client.axeCheck('.main');
    Page781aHelpers.completePtsd781aTypeOfChanges(client, formData, 'physical');
    client.click('.form-progress-buttons .usa-button-primary');

    // PSTD - 781a - Changes in mental health or substance abuse
    E2eHelpers.expectLocation(
      client,
      `/new-disabilities/ptsd-781a-mental-changes`,
    );
    client.axeCheck('.main');
    Page781aHelpers.completePtsd781aTypeOfChanges(client, formData, 'mental');
    client.click('.form-progress-buttons .usa-button-primary');

    // PSTD - 781a - Changes in behavior at work
    E2eHelpers.expectLocation(
      client,
      `/new-disabilities/ptsd-781a-work-changes`,
    );
    client.axeCheck('.main');
    Page781aHelpers.completePtsd781aTypeOfChanges(
      client,
      formData,
      'workBehavior',
    );
    client.click('.form-progress-buttons .usa-button-primary');

    // PSTD - 781a - Changes in social behavior
    E2eHelpers.expectLocation(
      client,
      `/new-disabilities/ptsd-781a-social-changes`,
    );
    client.axeCheck('.main');
    Page781aHelpers.completePtsd781aTypeOfChanges(
      client,
      formData,
      'socialBehavior',
    );
    client.click('.form-progress-buttons .usa-button-primary');

    // PSTD - 781a - Changes in Behavior or Activities: Additional Information
    E2eHelpers.expectLocation(
      client,
      `/new-disabilities/ptsd-781a-additional-changes`,
    );
    client.axeCheck('.main');
    Page781aHelpers.completePtsd781aAdditionalChanges(
      client,
      formData,
      'socialBehavior',
    );
    client.click('.form-progress-buttons .usa-button-primary');

    // PSTD - 781a - Conclusion
    E2eHelpers.expectLocation(client, `/ptsd-conclusion-assault`);
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // POW Status
    E2eHelpers.expectLocation(client, '/pow');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completePowStatus(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Additional disability benefits
    E2eHelpers.expectLocation(client, '/additional-disability-benefits');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // Automobile allowance and adaptive benefits
    E2eHelpers.expectLocation(client, '/adaptive-benefits');
    client.axeCheck('.main');
    PageAllClaimsHelpers.completeAdaptiveBenefits(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Aid and Attendance benefits
    E2eHelpers.expectLocation(client, '/aid-and-attendance');
    client.axeCheck('.main');
    PageAllClaimsHelpers.compeleteAidAndAttendance(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // 8940 - Unemployability Status
    E2eHelpers.expectLocation(client, '/individual-unemployability');
    client.axeCheck('.main');
    Page8940Helpers.completeUnemployabilityStatus(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // Summary of additional benefits
    E2eHelpers.expectLocation(
      client,
      '/additional-disability-benefits-summary',
    );
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // Summary of Disabilities
    E2eHelpers.expectLocation(client, '/disabilities/summary');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // 4142 - Supporting Evidence
    // 4142 - Orientation
    E2eHelpers.expectLocation(client, '/supporting-evidence/orientation');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // 4142 - Evidence Types
    E2eHelpers.expectLocation(client, '/supporting-evidence/evidence-types');
    client.axeCheck('.main');
    Page4142Helpers.completeEvidenceTypes(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // 4142 - VA Medical Records Intro
    E2eHelpers.expectLocation(
      client,
      '/supporting-evidence/va-medical-records',
    );
    client.axeCheck('.main');
    Page4142Helpers.completeVaMedicalRecords(client, formData);
    client.click('.form-panel .usa-button-primary');

    // 4142 - Private Medical Records Choice
    E2eHelpers.expectLocation(
      client,
      '/supporting-evidence/private-medical-records',
    );
    client.axeCheck('.main');
    Page4142Helpers.completePrivateMedicalRecordsChoice(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // 4142 - Private Medical Records Release
    E2eHelpers.expectLocation(
      client,
      '/supporting-evidence/private-medical-records-release',
    );
    client.axeCheck('.main');
    Page4142Helpers.completeRecordReleaseInformation(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // 4142 - Additional Evidence
    E2eHelpers.expectLocation(
      client,
      '/supporting-evidence/additional-evidence',
    );
    client.axeCheck('.main');
    Page4142Helpers.completeAdditionalEvidence(client, formData);
    client.click('.form-progress-buttons .usa-button-primary');

    // // Evidence Summary
    // E2eHelpers.expectLocation(client, '/supporting-evidence/summary');
    // client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/supporting-evidence/summary');

    // Possibly used outside of flow to, and including, 4142
    // Veteran Address Information
    // client.axeCheck('.main');
    // PageHelpers.completeVeteranAddressInformation(client, formData);
    // client.click('.form-progress-buttons .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/address-information');

    // Payment Information
    // client.axeCheck('.main');
    // client.click('.form-progress-buttons .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/payment-information');

    // Homelessness
    // client.axeCheck('.main');
    // PageHelpers.completeHomelessness(client, formData);
    // client.click('.form-progress-buttons .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/special-circumstances');

    // VA Facilities
    // client.axeCheck('.main');
    // PageHelpers.completeVAFacilitiesInformation(client, formData);
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(
    //   client,
    //   '/supporting-evidence/0/va-facilities',
    // );

    // Record upload
    // E2eHelpers.expectLocation(client, '/supporting-evidence/0/documents');
    // client.axeCheck('.main');
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(
    //   client,
    //   '/supporting-evidence/0/additionalDocuments',
    // );

    // Additional document upload
    // E2eHelpers.expectLocation(
    //   client,
    //   '/supporting-evidence/0/additionalDocuments',
    // );
    // client.axeCheck('.main');
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/supporting-evidence/0/evidence-summary');

    // Second Disability Evidence Type
    // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-type');
    // client.axeCheck('.main');
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-summary');

    // Second Evidence Summary
    // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-summary');
    // client.axeCheck('.main');
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/chapter-five/page-one');

    // chapter 5 page 1
    // E2eHelpers.expectLocation(client, '/chapter-five/page-one');
    // client.axeCheck('.main');
    // client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/chapter-five/page-one');

    // Review and Submit Page.
    // client.waitForElementVisible(
    //   'label[name="privacyAgreementAccepted-label"]',
    //   Timeouts.slow,
    // );
    // client.assert.cssClassPresent(
    //   '.progress-bar-segmented div.progress-segment:nth-child(4)',
    //   'progress-segment-complete',
    // );
    // client.axeCheck('.main');

    // Accept privacy agreement
    // client.click('input[type="checkbox"]');
    // client.click('.form-progress-buttons .usa-button-primary');
    // E2eHelpers.expectLocation(client, '/review-and-submit');
    // client.expect
    //   .element('.js-test-location')
    //   .attribute('data-location')
    //   .to.not.contain('/review-and-submit')
    //   .before(Timeouts.slow);

    // Submit message
    // client.waitForElementVisible(
    //   '.schemaform-confirmation-section-header',
    //   Timeouts.normal,
    // );

    client.axeCheck('.main');
    client.end();
  }
});

module.exports = runTest;
