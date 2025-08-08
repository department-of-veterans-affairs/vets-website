import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { Alerts, AXE_CONTEXT, Data, Locators } from './utils/constants';
import PilotEnvPage from './pages/PilotEnvPage';
import PatientErrorPage from './pages/PatientErrorPage';

describe('SM MESSAGING VISTA LARGE ATTACHMENT', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      { name: `mhv_secure_messaging_large_attachments`, value: true },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.interceptSentFolder();
  });

  it('verify attachment information block', () => {
    PatientComposePage.openAttachmentInfo();

    PatientComposePage.verifyAttachmentInfo(Data.VISTA_LARGE_ATTACH_INFO);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify attachments types errors', () => {
    PatientComposePage.attachMessageFromFile(Data.TEST_VIDEO_MKV);
    PatientErrorPage.verifyAttachmentErrorMessage(Alerts.ATTACHMENT.TYPES);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify attach file button disappears after 10 files attached', () => {
    const fileList = [
      Data.SAMPLE_XLS,
      Data.SAMPLE_IMG,
      Data.SAMPLE_DOC,
      Data.SAMPLE_PDF,
      Data.TEST_VIDEO,
      Data.TEST_IMAGE,
      Data.SAMPLE_TXT_1,
      Data.SAMPLE_TXT_2,
      Data.SAMPLE_TXT_3,
      Data.SAMPLE_TXT_4,
    ];

    PatientComposePage.attachFewFiles(fileList);

    cy.get(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});

describe.skip('SM MESSAGING OH LARGE ATTACHMENT', () => {
  // TODO: skipping until stepped flow is finalized
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      { name: `mhv_secure_messaging_large_attachments`, value: true },
      { name: 'mhv_secure_messaging_cerner_pilot', value: true },
    ]);

    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
    PilotEnvPage.navigateToComposePage();
    PilotEnvPage.selectCareTeam();
    PilotEnvPage.selectTriageGroup();
    cy.findByTestId(`continue-button`).click();
  });

  it('verify attachment information block', () => {
    PatientComposePage.openAttachmentInfo();

    PatientComposePage.verifyAttachmentInfo(Data.OH_LARGE_ATTACH_INFO);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify attachments types errors', () => {
    PatientComposePage.attachMessageFromFile(Data.TEST_VIDEO_MKV);
    PatientErrorPage.verifyAttachmentErrorMessage(Alerts.ATTACHMENT.TYPES);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify attach file button disappears after 10 files attached', () => {
    const fileList = [
      Data.SAMPLE_XLS,
      Data.SAMPLE_IMG,
      Data.SAMPLE_DOC,
      Data.SAMPLE_PDF,
      Data.TEST_VIDEO,
      Data.TEST_IMAGE,
      Data.SAMPLE_TXT_1,
      Data.SAMPLE_TXT_2,
      Data.SAMPLE_TXT_3,
      Data.SAMPLE_TXT_4,
    ];

    PatientComposePage.attachFewFiles(fileList);

    cy.get(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
