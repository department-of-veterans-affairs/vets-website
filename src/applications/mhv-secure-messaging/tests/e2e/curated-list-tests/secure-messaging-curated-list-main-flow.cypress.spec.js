import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths, Data, Alerts } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';
import PatientComposePage from '../pages/PatientComposePage';
import mockSentMessageResponse from '../fixtures/sentResponse/sent-single-message-response.json';

describe('SM CURATED LIST MAIN FLOW', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
    PilotEnvPage.navigateToSelectCareTeamPage();
  });

  it('verify select care team page', () => {
    GeneralFunctionsPage.verifyPageHeader(`Select care team`);

    PilotEnvPage.verifySelectCareTeamPageInterface();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify page title', () => {
    GeneralFunctionsPage.verifyPageTitle(
      'Select Care Team - Start Message | Veterans Affairs',
    );
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify navigating to compose page', () => {
    PilotEnvPage.selectCareSystem(0);

    PilotEnvPage.selectTriageGroup(2);

    // this is for intercepting repeatedly calling api request for sent threads
    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );

    cy.findByTestId(`continue-button`).click();

    GeneralFunctionsPage.verifyPageHeader(`Start message`);
    cy.findByTestId(`compose-recipient-title`).should(`not.be.empty`);
    cy.contains(Data.CURATED_LIST.SELECT_CARE_TEAM)
      .should(`be.visible`)
      .and(`have.attr`, `href`, Data.LINKS.SELECT_CARE_TEAM);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify user can send a message', () => {
    PilotEnvPage.selectCareSystem(0);

    PilotEnvPage.selectTriageGroup(2);

    // this is for intercepting repeatedly calling api request for sent threads
    cy.intercept(`GET`, Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );
    cy.findByTestId(`continue-button`).click();

    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`TEST SUBJECT`);
    PatientComposePage.getMessageBodyField().clear().type(`TEST BODY`);

    cy.intercept('POST', Paths.SM_API_EXTENDED, mockSentMessageResponse).as(
      'message',
    );

    cy.get(Locators.BUTTONS.SEND).contains('Send').click({ force: true });

    cy.findByTestId(`alert-text`)
      .should(`be.visible`)
      .and(`contain.text`, Alerts.SEND_MESSAGE_SUCCESS);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
