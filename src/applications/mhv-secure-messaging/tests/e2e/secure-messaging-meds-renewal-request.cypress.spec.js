import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths, Alerts } from './utils/constants';
import { MessageHintText } from '../../util/constants';
import PatientComposePage from './pages/PatientComposePage';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import medicationResponse from './fixtures/medicationResponses/single-medication-response.json';
import medicationNotFoundResponse from './fixtures/medicationResponses/medication-not-found-response.json';
import searchMockResponse from './fixtures/searchResponses/search-sent-folder-response.json';
import PatientRecentRecipientsPage from './pages/PatientRecentRecipientsPage';
import SharedComponents from './pages/SharedComponents';

const baseUrl = Cypress.config('baseUrl');

describe('SM Medications Renewal Request', () => {
  describe('in curated list flow', () => {
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
    });

    it('verify med renewal request flow', () => {
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
      cy.wait('@medicationById');
      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        decodeURIComponent(redirectPath),
      );
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        '/my-health/secure-messages/new-message/select-care-team/',
      );
      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

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
      cy.findByText('Message Sent.').should('not.exist');
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal flow when recent recipients are available', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');
      cy.intercept(`POST`, Paths.INTERCEPT.SENT_SEARCH, searchMockResponse).as(
        'recentRecipients',
      );
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
      // validate breadcrumbs back link is correct for recent recipients flow
      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        decodeURIComponent(redirectPath),
      );
      PatientRecentRecipientsPage.continueButton().click();

      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        '/my-health/secure-messages/new-message/select-care-team/',
      );

      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Kansas City health care - ${
          mockRecipients.data[1].attributes.name
        }`,
      );

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
          expect(request.recipient_id).to.eq(+mockRecipients.data[1].id);
        });
      cy.findByText('Message Sent.').should('not.exist');
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal request flow when medication is not found', () => {
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
      cy.wait('@medicationById');
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      cy.findByText(`Select a different care team`).click();
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);

      const expectedMessageBodyText = [
        `Medication name, strength, and form: `,
        `Prescription number: `,
        `Instructions: `,
        `Provider who prescribed it: `,
        `Number of refills left: `,
        `Prescription expiration date: `,
        `Reason for use: `,
        `Last filled on: `,
        `Quantity: `,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_ERROR,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES}`, {}).as('sentMessage');
      PatientComposePage.sendMessageButton().click();
      cy.wait('@sentMessage')
        .its('request')
        .then(req => {
          const request = req.body;
          expect(request.body).to.contain(
            'Medication name, strength, and form:',
          );
          expect(request.category).to.eq('MEDICATIONS');
          expect(request.subject).to.eq('Renewal Needed');
          expect(request.recipient_id).to.eq(+mockRecipients.data[0].id);
        });
      cy.findByText('Message Sent.').should('not.exist');
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal request flow without redirectPath', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';

      cy.visit(`${Paths.UI_MAIN}/new-message?prescriptionId=${prescriptionId}`);
      cy.wait('@medicationById');

      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        '/my-health/secure-messages/new-message/',
      );
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();
      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        '/my-health/secure-messages/new-message/select-care-team/',
      );
      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

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
      cy.findByText(Alerts.SEND_MESSAGE_SUCCESS).should('be.visible');
      cy.url().should('include', '/my-health/secure-messages/inbox/');
    });

    it('verify user is redirected to redirectPath after deleting a draft', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent(
        '/my-health/medications?page=1&rxRenewalMessageSuccess=true',
      );

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@medicationById');
      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        decodeURIComponent(redirectPath),
      );
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      SharedComponents.backBreadcrumb().should(
        'have.attr',
        'href',
        '/my-health/secure-messages/new-message/select-care-team/',
      );
      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

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
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
      PatientComposePage.deleteUnsavedDraft();
      cy.url().should(
        'include',
        `${baseUrl}/my-health/medications/?page=1&draftDeleteSuccess=true`,
      );
    });
  });
  describe('in curated list flow with Cerner pilot enabled', () => {
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
    });

    it('verify med renewal request uses v2 API for Oracle Health patient', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}24654491`,
        medicationResponse,
      ).as('medicationByIdV2');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@medicationByIdV2');
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(false);
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

    it('verify med renewal request handles 404 from v2 API', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS_V2}24654491`,
        req => {
          req.reply({
            body: medicationNotFoundResponse,
            statusCode: 404,
          });
        },
      ).as('medicationByIdV2');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      cy.wait('@medicationByIdV2');
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_ERROR,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    });
  });

  describe('not in curated list flow', () => {
    const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: false,
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
    });

    it('verify med renewal request flow', () => {
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
      cy.wait('@medicationById');

      PatientComposePage.validateAddYourMedicationWarningBanner(false);

      PatientComposePage.selectRecipient(3);
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
      cy.findByText('Message Sent.').should('not.exist');
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal request flow when medication is not found', () => {
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
      cy.wait('@medicationById');
      PatientComposePage.validateAddYourMedicationWarningBanner(true);

      PatientComposePage.selectRecipient(3);
      PatientComposePage.validateLockedCategoryDisplay();
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: `,
        `Prescription number: `,
        `Instructions: `,
        `Provider who prescribed it: `,
        `Number of refills left: `,
        `Prescription expiration date: `,
        `Reason for use: `,
        `Last filled on: `,
        `Quantity: `,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
      PatientComposePage.validateMessageBodyHint(
        MessageHintText.RX_RENEWAL_ERROR,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      cy.intercept('POST', `${Paths.INTERCEPT.MESSAGES}`, {}).as('sentMessage');
      PatientComposePage.sendMessageButton().click();
      cy.wait('@sentMessage')
        .its('request')
        .then(req => {
          const request = req.body;
          expect(request.body).to.contain(
            'Medication name, strength, and form:',
          );
          expect(request.category).to.eq('MEDICATIONS');
          expect(request.subject).to.eq('Renewal Needed');
          expect(request.recipient_id).to.eq(+mockRecipients.data[0].id);
        });
      cy.findByText('Message Sent.').should('not.exist');
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal request flow without redirectPath', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';

      cy.visit(`${Paths.UI_MAIN}/new-message?prescriptionId=${prescriptionId}`);
      cy.wait('@medicationById');

      PatientComposePage.validateAddYourMedicationWarningBanner(false);

      PatientComposePage.selectRecipient(3);
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
      cy.findByText(Alerts.SEND_MESSAGE_SUCCESS).should('be.visible');
      cy.url().should('include', '/my-health/secure-messages/inbox/');
    });
  });
});
