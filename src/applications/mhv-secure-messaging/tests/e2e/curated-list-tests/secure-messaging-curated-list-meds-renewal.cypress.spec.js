import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import PatientComposePage from '../pages/PatientComposePage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import medicationResponse from '../fixtures/medicationResponses/single-medication-response.json';
import medicationNotFoundResponse from '../fixtures/medicationResponses/medication-not-found-response.json';

// Tests for medication renewal flow with curated list feature flag enabled.
// The prescription data is loaded in the InterstitialPage and persists through
// Redux state as the user navigates through the select care team flow.

describe('SM CURATED LIST MEDICATIONS RENEWAL REQUEST', () => {
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

  it('verify med renewal request flow with curated list', () => {
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

    // InterstitialPage shows start-message-link with curated flow enabled
    PatientInterstitialPage.getStartMessageLink().click();

    // Navigate through select care team flow - prescription data persists via Redux
    PatientComposePage.selectComboBoxRecipient(
      mockRecipients.data[0].attributes.name,
    );
    cy.findByTestId('ce-button').click();
    PatientComposePage.validateAddYourMedicationWarningBanner(false);
    PatientComposePage.validateRecipientTitle(
      `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
    );

    PatientComposePage.validateCategorySelection('MEDICATIONS');
    PatientComposePage.validateMessageSubjectField('Renewal Needed');

    const expectedMessageBodyText = [
      `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
      `Prescription number: 2721195`,
      `Provider who prescribed it: Bob Taylor`,
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

    // Should show start-message-link with curated flow enabled
    PatientInterstitialPage.getStartMessageLink().click();

    PatientComposePage.selectComboBoxRecipient(
      mockRecipients.data[0].attributes.name,
    );
    cy.findByTestId('continue-button').click();

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
        expect(request.body).to.contain('Medication name, strength, and form:');
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
    cy.wait('@medicationById');

    // Should show start-message-link with curated flow enabled
    PatientInterstitialPage.getStartMessageLink().click();

    PatientComposePage.selectComboBoxRecipient(
      mockRecipients.data[0].attributes.name,
    );
    cy.findByTestId('continue-button').click();

    PatientComposePage.validateAddYourMedicationWarningBanner(false);
    PatientComposePage.validateRecipientTitle(
      `VA Madison health care - ${mockRecipients.data[0].attributes.name}`,
    );

    PatientComposePage.validateCategorySelection('MEDICATIONS');
    PatientComposePage.validateMessageSubjectField('Renewal Needed');

    const expectedMessageBodyText = [
      `Medication name, strength, and form: ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB`,
      `Prescription number: 2721195`,
      `Provider who prescribed it: Bob Taylor`,
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
});
