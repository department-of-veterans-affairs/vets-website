import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import { Alerts, AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('SM MESSAGING LARGE ATTACHMENT', () => {
  const { TEST_FILES } = Data;
  const cernerEnabled = {
    name: FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot,
    value: true,
  };
  const largeAttachmentsEnabled = {
    name: FEATURE_FLAG_NAMES.mhvSecureMessagingLargeAttachments,
    value: true,
  };

  it('VISTA recipient and large attachments feature flag disabled', () => {
    // keep OH feature toggle on to validate there is no conflict
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      cernerEnabled,
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('Jeasmitha-Cardio-Clinic');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.ATTACH_INFO);

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP4_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    cy.findByText(Alerts.ATTACHMENT.VISTA_TOO_LARGE).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_3MB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_3MB);
    cy.findByText(Alerts.ATTACHMENT.ALREADY_ATTACHED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_4MB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_4_5MB);
    cy.findByText(Alerts.ATTACHMENT.VISTA_ALL_FILES_TOO_LARGE).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_10KB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_1KB, {
      verify: true,
    });
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    PatientComposePage.sendMessage();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('VISTA recipient and feature flag enabled', () => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      largeAttachmentsEnabled,
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('Jeasmitha-Cardio-Clinic');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.LARGE_ATTACH_INFO);

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP3_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES_EXPANDED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_30MB);
    cy.findByText(Alerts.ATTACHMENT.LARGE_UPLOAD_FILE_TOO_LARGE).should(
      'exist',
    );
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP4_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES).should('not.exist');
    cy.findByText(Alerts.ATTACHMENT.TYPES_EXPANDED).should('not.exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    cy.findByText(Alerts.ATTACHMENT.ALREADY_ATTACHED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_25MB);
    cy.findByText(Alerts.ATTACHMENT.LARGE_UPLOAD_TOTAL_TOO_LARGE).should(
      'exist',
    );

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_10KB);
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_1KB);
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('exist');
    PatientComposePage.sendMessage();
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('VISTA recipient with feature flag enabled can upload up to 10 files', () => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      largeAttachmentsEnabled,
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('Jeasmitha-Cardio-Clinic');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.LARGE_ATTACH_INFO);

    PatientComposePage.attachFakeFilesByCount(10, { verify: true });
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('not.exist');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('OH recipient and feature flag disabled', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('OH TG GROUP 002');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.ATTACH_INFO);

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    cy.findByText(Alerts.ATTACHMENT.VISTA_TOO_LARGE).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP4_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_3MB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_3MB);
    cy.findByText(Alerts.ATTACHMENT.ALREADY_ATTACHED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_4MB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_4_5MB);
    cy.findByText(Alerts.ATTACHMENT.VISTA_ALL_FILES_TOO_LARGE).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_10KB, {
      verify: true,
    });
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_1KB, {
      verify: true,
    });
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('not.exist');

    PatientComposePage.sendMessage().then(request => {
      expect(request.url).to.include('is_oh_triage_group=true');
    });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('OH recipient and feature flag enabled', () => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      cernerEnabled,
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('OH TG GROUP 002');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.LARGE_ATTACH_INFO);

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_30MB);
    cy.findByText(Alerts.ATTACHMENT.LARGE_UPLOAD_FILE_TOO_LARGE).should(
      'exist',
    );

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP4_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES).should('not.exist');
    cy.findByText(Alerts.ATTACHMENT.TYPES_EXPANDED).should('not.exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_MP3_FILE);
    cy.findByText(Alerts.ATTACHMENT.TYPES_EXPANDED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_7MB);
    cy.findByText(Alerts.ATTACHMENT.ALREADY_ATTACHED).should('exist');

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_25MB);
    cy.findByText(Alerts.ATTACHMENT.LARGE_UPLOAD_TOTAL_TOO_LARGE).should(
      'exist',
    );

    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_10KB);
    PatientComposePage.attachFakeFile(TEST_FILES.FAKE_FILE_1KB);
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('exist');
    PatientComposePage.sendMessage();
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('OH recipient with feature flag enabled can upload up to 10 files', () => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      cernerEnabled,
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.selectRecipient('OH TG GROUP 002');
    PatientComposePage.enterDataToMessageSubject('Test Subject');
    PatientComposePage.enterDataToMessageBody('Test Body');
    PatientComposePage.selectCategory('COVID');
    PatientComposePage.openAttachmentInfo();
    PatientComposePage.verifyAttachmentInfo(Data.LARGE_ATTACH_INFO);

    PatientComposePage.attachFakeFilesByCount(10, { verify: true });
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE).should('not.exist');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
