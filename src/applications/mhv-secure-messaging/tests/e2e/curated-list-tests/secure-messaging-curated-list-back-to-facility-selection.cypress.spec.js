import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';
import PatientComposePage from '../pages/PatientComposePage';

describe('SM CURATED LIST BACK TO SELECTION', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('back navigation from new draft', () => {
    PilotEnvPage.navigateToSelectCareTeamPage();

    PilotEnvPage.selectCareTeam(0);

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

    // temporary solution to remove save draft alert
    cy.contains(`Delete draft`).click();

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

    PilotEnvPage.selectTriageGroup(4);

    cy.get(`.usa-combo-box__list > li`)
      .eq(4)
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
});
