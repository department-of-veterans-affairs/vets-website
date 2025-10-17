import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';
import PatientComposePage from '../pages/PatientComposePage';
import newDraft from '../fixtures/draftsResponse/drafts-single-message-response.json';

describe('SM CURATED LIST BACK TO SELECTION', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('back navigation from new draft', () => {
    PilotEnvPage.navigateToSelectCareTeamPage();

    PilotEnvPage.selectCareSystem(0);

    PilotEnvPage.selectTriageGroup(2);

    // this is for intercepting repeatedly calling api request for sent threads
    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );

    cy.findByTestId(`continue-button`).click();

    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`TEST SUBJECT`);
    PatientComposePage.getMessageBodyField()
      .clear()
      .type(`TEST BODY`);

    cy.contains(`Select a different care team`).click();

    PilotEnvPage.selectTriageGroup(2);

    cy.get(`.usa-combo-box__list > li`)
      .eq(2)
      .invoke('text')
      .then(name => {
        cy.wrap(name).as(`updatedTGName`);
      });

    cy.get(`@updatedTGName`).then(updatedTGName => {
      cy.findByTestId(`continue-button`).click();
      cy.findByTestId(`compose-recipient-title`).should(
        'include.text',
        updatedTGName,
      );
    });

    cy.findByTestId(`message-subject-field`).should(
      `have.attr`,
      `value`,
      `TEST SUBJECT`,
    );
    cy.findByTestId(`message-body-field`).should(
      `have.attr`,
      `value`,
      `TEST BODY`,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify back navigation from existing draft', () => {
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    cy.contains(`Select a different care team`).click();

    PilotEnvPage.selectTriageGroup(1);

    cy.get(`.usa-combo-box__list > li`)
      .eq(1)
      .invoke('text')
      .then(name => {
        cy.wrap(name).as(`updatedTGName`);
      });

    cy.get(`@updatedTGName`).then(updatedTGName => {
      cy.findByTestId(`continue-button`).click();
      cy.findByTestId(`compose-recipient-title`).should(
        'include.text',
        updatedTGName,
      );
    });

    cy.findByTestId(`message-subject-field`).should(
      `have.attr`,
      `value`,
      mockSavedDraftResponse.data[0].attributes.subject,
    );
    cy.findByTestId(`message-body-field`).should(
      `have.attr`,
      `value`,
      mockSavedDraftResponse.data[0].attributes.body,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify route guard when draft is not saved', () => {
    const draftMessage = {
      subject: 'TEST SUBJECT',
      body: 'TEST BODY',
      recipientId: '6910405',
      category: 'OTHER',
    };
    PilotEnvPage.navigateToSelectCareTeamPage();

    PilotEnvPage.selectCareSystem(0);

    PilotEnvPage.selectTriageGroup(2);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // this is for intercepting repeatedly calling api request for sent threads
    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );
    cy.findByText(/Update your contact list/i).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'be.visible',
    );

    cy.get('va-modal[modal-title="We can\'t save this message yet"]')
      .find('va-button[text="Edit draft"]')
      .click();
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.selectCategory(draftMessage.category);
    PatientComposePage.getMessageSubjectField().type(draftMessage.subject);

    cy.findByText(/Select a different care team/i).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'not.be.visible',
    );
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.getMessageBodyField()
      .clear()
      .type(draftMessage.body);
    const saveDraftResponse = {
      ...newDraft.data,
      // type: 'message_drafts',
      attributes: {
        ...newDraft.data.attributes,
        ...draftMessage,
      },
    };

    PatientComposePage.saveNewDraft(
      draftMessage.category,
      draftMessage.subject,
      saveDraftResponse,
    );
    cy.wait('@new_draft');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    cy.findByText(/Select a different care team/i).click();
    cy.findByText(/Update your contact list/i).click();
    cy.get(
      'va-modal[modal-title="Do you want to save your changes to this draft?"]',
    ).should('not.exist');
  });

  it('saves draft when routing to contact list and cant-find-care-team', () => {
    const draftMessage = {
      subject: 'TEST SUBJECT',
      body: 'TEST BODY',
      recipientId: '6910405',
      category: 'OTHER',
    };
    PilotEnvPage.navigateToSelectCareTeamPage();

    PilotEnvPage.selectCareSystem(0);

    PilotEnvPage.selectTriageGroup(2);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // this is for intercepting repeatedly calling api request for sent threads
    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );
    cy.findByText(/Update your contact list/i).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'be.visible',
    );

    cy.get('va-modal[modal-title="We can\'t save this message yet"]')
      .find('va-button[text="Edit draft"]')
      .click();
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.selectCategory(draftMessage.category);
    PatientComposePage.getMessageSubjectField().type(draftMessage.subject);

    cy.findByText(/Select a different care team/i).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'not.be.visible',
    );
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.getMessageBodyField()
      .clear()
      .type(draftMessage.body);
    const saveDraftResponse = {
      ...newDraft.data,
      // type: 'message_drafts',
      attributes: {
        ...newDraft.data.attributes,
        ...draftMessage,
      },
    };

    PatientComposePage.saveNewDraft(
      draftMessage.category,
      draftMessage.subject,
      saveDraftResponse,
    );
    cy.wait('@new_draft');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
    cy.findByText(/Select a different care team/i).click();
    cy.findByTestId(`compose-recipient-combobox`).click();
    PatientComposePage.selectComboBoxRecipient('###ABC_XYZ_TRIAGE_TEAM###');

    cy.findByText(/Update your contact list/i).click();
    cy.get(
      'va-modal[modal-title="Do you want to save your changes to this draft?"]',
    ).should('exist');
    cy.get(`[status="warning"]`)
      .find(`va-button[text="Save changes"]`)
      .click();

    cy.findByTestId(Locators.BUTTONS.CL_GO_BACK).click();

    PatientComposePage.getComboBox().should(
      'have.value',
      '###ABC_XYZ_TRIAGE_TEAM###',
    );

    PatientComposePage.selectComboBoxRecipient('Jeasmitha-Cardio-Clinic');

    cy.contains(/What to do if you can’t find your care team/i).click({
      force: true,
    });

    cy.get(`[status="warning"]`)
      .find(`va-button[text="Save changes"]`)
      .click();

    cy.get('[back=""]').click();

    PatientComposePage.getComboBox().should(
      'have.value',
      'Jeasmitha-Cardio-Clinic',
    );
  });
});
