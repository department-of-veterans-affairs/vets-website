import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import SettingsPage from './pages/SettingsPage';

describe('Medical Records validate settings page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('visits settings page', () => {
    // const site = new MedicalRecordsSite();
    // site.login();

    SettingsPage.visitSettingsPage();

    SettingsPage.verifyOptedInStatus();

    SettingsPage.selectOptOut();

    SettingsPage.verifyOptedOutStatus();

    SettingsPage.verifyOptedOutAlert();

    SettingsPage.selectOptIn();

    SettingsPage.verifyOptedInStatus();

    SettingsPage.verifyOptedInAlert();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
