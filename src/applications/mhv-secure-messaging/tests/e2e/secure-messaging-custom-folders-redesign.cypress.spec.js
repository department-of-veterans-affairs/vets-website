import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';
import threadResponse from './fixtures/thread-response-new-api.json';
import singleSentThreadResponse from './fixtures/sentResponse/sent-thread-response.json';
import singleTrashThreadResponse from './fixtures/trashResponse/trash-thread-response.json';

describe('SM REPLY LINK', () => {
  const date = new Date();
  threadResponse.data[0].attributes.sentDate = date.toISOString();
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_custom_folders_redesign',
      value: true,
    },
  ]);

  const updatedSingleSentThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleSentThreadResponse,
  );

  const updatedSingleTrashThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleTrashThreadResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
  });

  it('verify inbox detailed thread', () => {
    PatientMessageDetailsPage.loadSingleThread();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sent detailed thread', () => {
    PatientMessageSentPage.loadMessages();
    PatientMessageSentPage.loadSingleThread(updatedSingleSentThreadResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify trash detailed thread', () => {
    PatientMessageTrashPage.loadMessages();
    PatientMessageTrashPage.loadSingleThread(updatedSingleTrashThreadResponse);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  afterEach(() => {
    cy.findByTestId(Locators.LINKS.REPLY).should('be.visible');
    cy.findByTestId(Locators.LINKS.REPLY).click();
    cy.url().should('include', '/reply');
    GeneralFunctionsPage.verifyPageHeader(Data.REPLY_HEADER);
    cy.contains(`Continue to reply`).should('be.visible');
  });
});
