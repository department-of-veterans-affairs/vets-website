import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths, Data } from '../utils/constants';
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
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
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

    cy.findByText(`Select a different care team`).click();

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

    cy.findByText(`Select a different care team`).click();

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

  it('prepopulates care system and triage group if we have them', () => {
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    cy.findByText(`Select a different care team`).click();
    cy.findByTestId(`care-system-589`).should(
      `have.attr`,
      `checked`,
      `checked`,
    );
    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('input')
      .should('have.value', 'TG-7410');
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
    cy.findByText(Data.CURATED_LIST.CONTACT_LIST_UPDATE).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'not.exist',
    );
    cy.findByTestId(`contact-list-go-back`).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'not.exist',
    );
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.selectCategory(draftMessage.category);
    PatientComposePage.getMessageSubjectField().type(draftMessage.subject);
    cy.findByText(Data.CURATED_LIST.SELECT_CARE_TEAM).click();
    cy.findByText(Data.CURATED_LIST.CONTACT_LIST_UPDATE).click();

    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'be.visible',
    );

    cy.get('va-modal[modal-title="We can\'t save this message yet"]')
      .find('va-button[text="Edit draft"]')
      .click();

    cy.findByTestId(`continue-button`).click();
    PatientComposePage.getMessageBodyField()
      .clear()
      .type(draftMessage.body);
    const saveDraftResponse = {
      ...newDraft.data,
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
    cy.findByText(Data.CURATED_LIST.SELECT_CARE_TEAM).click();
    cy.findByText(Data.CURATED_LIST.CONTACT_LIST_UPDATE).click();
    cy.get(
      'va-modal[modal-title="Do you want to save your changes to this draft?"]',
    ).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
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
    cy.findByText(Data.CURATED_LIST.CONTACT_LIST_UPDATE).click();
    cy.get('va-modal[modal-title="We can\'t save this message yet"]').should(
      'not.exist',
    );

    cy.findByTestId(`contact-list-go-back`).click();
    cy.findByTestId(`continue-button`).click();
    PatientComposePage.selectCategory(draftMessage.category);
    PatientComposePage.getMessageSubjectField().type(draftMessage.subject);

    cy.findByText(Data.CURATED_LIST.SELECT_CARE_TEAM).click();
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
    cy.findByText(Data.CURATED_LIST.SELECT_CARE_TEAM).click();
    cy.findByTestId(`compose-recipient-combobox`).click();
    PatientComposePage.selectComboBoxRecipient('###ABC_XYZ_TRIAGE_TEAM###');

    cy.findByText(Data.CURATED_LIST.CONTACT_LIST_UPDATE).click();
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

    cy.contains(Data.CURATED_LIST.CANT_FIND_TEAM_LINK).click({
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

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe('dynamically updating healthcare system', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingRecipientOptGroups,
        value: true,
      },
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('updates healthcare system when user selects a different care team', () => {
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

    cy.findByText(`Select a different care team`).click();

    cy.findByTestId(`care-system-589`).should(
      `have.attr`,
      `checked`,
      `checked`,
    );
    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('input')
      .should('have.value', '###ABC_XYZ_TRIAGE_TEAM###');

    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('input')
      .as('comboBoxInput');

    cy.get('@comboBoxInput').clear();
    cy.get('@comboBoxInput').type('###ABC_XYZ_TRIAGE_TEAM###');
    cy.findByTestId(`care-system-607`).should(
      `have.attr`,
      `checked`,
      `checked`,
    );

    cy.get('@comboBoxInput').clear();
    cy.get('@comboBoxInput').type('***TG 200_APPT_SLC4%');
    cy.findByTestId(`care-system-589`).should(
      `have.attr`,
      `checked`,
      `checked`,
    );

    cy.findByTestId('continue-button').click();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
