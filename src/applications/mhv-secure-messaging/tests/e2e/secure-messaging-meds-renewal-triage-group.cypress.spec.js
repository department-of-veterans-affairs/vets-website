import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import { MessageHintText } from '../../util/constants';
import PatientComposePage from './pages/PatientComposePage';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import medicationResponse from './fixtures/medicationResponses/single-medication-response.json';
import medicationNotFoundResponse from './fixtures/medicationResponses/medication-not-found-response.json';
import ohMedicationResponse from './fixtures/medicationResponses/oh-medication-response.json';
import searchMockResponse from './fixtures/searchResponses/search-sent-folder-response.json';
import PatientRecentRecipientsPage from './pages/PatientRecentRecipientsPage';

describe('SM Meds Renewal - Triage Group Selection Prefill', () => {
  // Tests the specific flow: RecentCareTeams radio selection → ComposeForm
  // with prescription data prefill. This covers the scenario where the user
  // selects a triage group before landing on the compose form.

  describe('RecentCareTeams flow with curated list', () => {
    const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_recent_recipients',
        value: true,
      },
    ]);

    beforeEach(() => {
      SecureMessagingSite.login(customFeatureToggles);
      PatientInboxPage.loadInboxMessages();

      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
        mockRecipients,
      ).as('recipients');

      cy.intercept(`POST`, Paths.INTERCEPT.SENT_SEARCH, searchMockResponse).as(
        'recentRecipients',
      );
    });

    it('prefills medication details after selecting first triage group', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');

      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');
      cy.wait('@medicationById');

      // Select the first triage group (index 0)
      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(0);
      PatientRecentRecipientsPage.continueButton().click();

      // Validate the compose form has the medication details prefilled
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Instructions: TAKE 1 BY MOUTH DAILY FOR 30 DAYS`,
        `Provider who prescribed it: Bob Taylor`,
        `Number of refills left: 0`,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: Reason for use not available`,
        `Last filled on: November 6, 2024`,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_SUCCESS,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('prefills medication details when API responds slowly', () => {
      // Simulate a slow medication API response to test race condition:
      // The user selects a triage group and navigates to compose before
      // the prescription data has arrived.
      cy.intercept('GET', `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`, req => {
        req.reply({
          body: medicationResponse,
          delay: 2000,
        });
      }).as('medicationById');

      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');

      // Don't wait for medicationById - proceed immediately to test race condition
      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(0);
      PatientRecentRecipientsPage.continueButton().click();

      // The form should eventually show the prefilled data after the API resolves
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Instructions: TAKE 1 BY MOUTH DAILY FOR 30 DAYS`,
        `Provider who prescribed it: Bob Taylor`,
        `Number of refills left: 0`,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: Reason for use not available`,
        `Last filled on: November 6, 2024`,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_SUCCESS,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('prefills medication details with 404 error after triage group selection', () => {
      cy.intercept('GET', `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`, req => {
        req.reply({
          body: medicationNotFoundResponse,
          statusCode: 404,
        });
      }).as('medicationById');

      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');
      cy.wait('@medicationById');

      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(1);
      PatientRecentRecipientsPage.continueButton().click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_ERROR,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });

  describe('RecentCareTeams flow with Cerner pilot (v2 API)', () => {
    // This is the exact scenario the user reported: Oracle Health patient
    // with station_number, going through recent recipients triage group
    // selection, then landing on compose form.
    const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_recent_recipients',
        value: true,
      },
      {
        name: 'mhv_medications_cerner_pilot',
        value: true,
      },
    ]);

    beforeEach(() => {
      SecureMessagingSite.login(customFeatureToggles);
      PatientInboxPage.loadInboxMessages();

      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS}*`,
        mockRecipients,
      ).as('recipients');

      cy.intercept(`POST`, Paths.INTERCEPT.SENT_SEARCH, searchMockResponse).as(
        'recentRecipients',
      );
    });

    it('prefills medication details via v2 API after triage group selection', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}24654491*`,
        medicationResponse,
      ).as('medicationByIdV2');

      const prescriptionId = '24654491';
      const stationNumber = '989';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&station_number=${stationNumber}&redirectPath=${redirectPath}`,
      );

      // Verify the v2 API was called with station_number
      cy.wait('@medicationByIdV2').then(interception => {
        expect(interception.request.url).to.include('station_number=989');
      });
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');

      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(0);
      PatientRecentRecipientsPage.continueButton().click();

      // Validate compose form is fully prefilled
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Instructions: TAKE 1 BY MOUTH DAILY FOR 30 DAYS`,
        `Provider who prescribed it: Bob Taylor`,
        `Number of refills left: 0`,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: Reason for use not available`,
        `Last filled on: November 6, 2024`,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_SUCCESS,
      );

      // Verify sending the message includes the prefilled data
      cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES}`, {}).as('sentMessage');
      PatientComposePage.sendMessageButton().click();
      cy.wait('@sentMessage')
        .its('request')
        .then(req => {
          const request = req.body;
          expect(request.body).to.contain(
            'Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB',
          );
          expect(request.category).to.eq('MEDICATIONS');
          expect(request.subject).to.eq('Renewal Needed');
          expect(request.recipient_id).to.eq(+mockRecipients.data[0].id);
        });

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('prefills medication details via v2 API with slow response after triage selection', () => {
      // Race condition test: prescription API responds AFTER user has
      // already selected a triage group and navigated to compose form.
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}24654491*`,
        req => {
          req.reply({
            body: medicationResponse,
            delay: 3000,
          });
        },
      ).as('medicationByIdV2');

      const prescriptionId = '24654491';
      const stationNumber = '989';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&station_number=${stationNumber}&redirectPath=${redirectPath}`,
      );
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');

      // Don't wait for medication API - proceed immediately
      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(1);
      PatientRecentRecipientsPage.continueButton().click();

      // The form should eventually show the prefilled data after the API resolves
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Instructions: TAKE 1 BY MOUTH DAILY FOR 30 DAYS`,
        `Provider who prescribed it: Bob Taylor`,
        `Number of refills left: 0`,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: Reason for use not available`,
        `Last filled on: November 6, 2024`,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_SUCCESS,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('handles v2 API 404 after triage group selection', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}24654491*`,
        req => {
          req.reply({
            body: medicationNotFoundResponse,
            statusCode: 404,
          });
        },
      ).as('medicationByIdV2');

      const prescriptionId = '24654491';
      const stationNumber = '989';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&station_number=${stationNumber}&redirectPath=${redirectPath}`,
      );
      cy.wait('@medicationByIdV2');
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');

      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(0);
      PatientRecentRecipientsPage.continueButton().click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_ERROR,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });

    it('prefills OH medication with null prescriptionNumber after triage group selection', () => {
      // Oracle Health medications don't have prescription numbers yet.
      // The form should still prefill correctly with available data.
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}12345678*`,
        ohMedicationResponse,
      ).as('medicationByIdV2');

      const prescriptionId = '12345678';
      const stationNumber = '989';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&station_number=${stationNumber}&redirectPath=${redirectPath}`,
      );
      cy.wait('@medicationByIdV2');
      cy.wait('@vamcUser');
      cy.wait('@recipients');
      cy.wait('@recentRecipients');

      PatientRecentRecipientsPage.selectCareTeamRecipientByIndex(0);
      PatientRecentRecipientsPage.continueButton().click();

      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: METFORMIN HCL 500MG TAB`,
        `Prescription number: Prescription number not available`,
        `Instructions: TAKE ONE TABLET BY MOUTH TWICE DAILY`,
        `Provider who prescribed it: Provider name not available`,
        `Number of refills left: Number of refills left not available`,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: Reason for use not available`,
        `Last filled on: November 6, 2024`,
        `Quantity: 60`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_SUCCESS,
      );

      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });
});
