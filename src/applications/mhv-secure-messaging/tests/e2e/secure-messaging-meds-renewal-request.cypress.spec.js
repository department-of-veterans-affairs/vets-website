import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from './utils/constants';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import mockRecipients from './fixtures/recipientsResponse/recipients-response.json';
import medicationResponse from './fixtures/medicationResponses/single-medication-response.json';
import medicationNotFoundResponse from './fixtures/medicationResponses/medication-not-found-response.json';

describe('SM Meds Renewal Request Interstitial', () => {
  describe('in curated list flow', () => {
    const customFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
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
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Provider who prescribed it: RAJASREE VENKATESH`,
        `Number of refills left: `,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: `,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      cy.url().should('include', decodeURIComponent(redirectPath));
    });

    it('verify med renewal request flow without redirectPath', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';
      //   const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(`${Paths.UI_MAIN}/new-message?prescriptionId=${prescriptionId}`);
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(false);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Provider who prescribed it: RAJASREE VENKATESH`,
        `Number of refills left: `,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: `,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      cy.url().should('include', '/my-health/secure-messages/inbox/');
    });

    it('verify med renewal request flow when medication is not found', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationNotFoundResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectComboBoxRecipient(
        mockRecipients.data[0].attributes.name,
      );
      cy.findByTestId(`continue-button`).click();

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateRecipientTitle(
        `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
      );

      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: `,
        `Prescription number: `,
        `Provider who prescribed it: `,
        `Number of refills left: `,
        `Prescription expiration date: `,
        `Reason for use: `,
        `Quantity: `,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      cy.url().should('include', decodeURIComponent(redirectPath));
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
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectRecipient(3);

      PatientComposePage.validateAddYourMedicationWarningBanner(false);

      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Provider who prescribed it: RAJASREE VENKATESH`,
        `Number of refills left: `,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: `,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectRecipient(3);

      PatientComposePage.validateAddYourMedicationWarningBanner(false);

      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
        `Prescription number: 2721195`,
        `Provider who prescribed it: RAJASREE VENKATESH`,
        `Number of refills left: `,
        `Prescription expiration date: November 8, 2025`,
        `Reason for use: `,
        `Quantity: 4`,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      cy.url().should('include', '/my-health/secure-messages/inbox/');
    });

    it('verify med renewal request flow when medication is not found', () => {
      cy.intercept(
        'GET',
        `${Paths.INTERCEPT.PRESCRIPTIONS}/24654491`,
        medicationNotFoundResponse,
      ).as('medicationById');
      const prescriptionId = '24654491';
      const redirectPath = encodeURIComponent('/my-health/medications');

      cy.visit(
        `${
          Paths.UI_MAIN
        }/new-message?prescriptionId=${prescriptionId}&redirectPath=${redirectPath}`,
      );
      PatientInterstitialPage.getContinueButton().click();
      PatientComposePage.selectRecipient(3);

      PatientComposePage.validateAddYourMedicationWarningBanner(true);
      PatientComposePage.validateCategorySelection('MEDICATIONS');
      PatientComposePage.validateMessageSubjectField('Renewal Needed');

      const expectedMessageBodyText = [
        `Medication name, strength, and form: `,
        `Prescription number: `,
        `Provider who prescribed it: `,
        `Number of refills left: `,
        `Prescription expiration date: `,
        `Reason for use: `,
        `Quantity: `,
      ].join('\n');

      PatientComposePage.validateMessageBodyField(expectedMessageBodyText);
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
      cy.url().should('include', decodeURIComponent(redirectPath));
    });
  });
});
