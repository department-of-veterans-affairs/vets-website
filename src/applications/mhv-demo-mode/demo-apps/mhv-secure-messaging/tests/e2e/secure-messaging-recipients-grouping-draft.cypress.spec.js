import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM RECIPIENTS GROUPING ON DRAFT', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: `mhv_secure_messaging_recipient_opt_groups`,
      value: true,
    },
    {
      name: `mhv_secure_messaging_curated_list_flow`,
      value: true,
    },
  ]);
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    // Navigate through curated list flow: create message -> interstitial -> select care team
    PatientInboxPage.clickCreateNewMessage();
    PatientInterstitialPage.getStartMessageLink().click({ force: true });
    PatientComposePage.verifyHeader('Select care team');
  });

  it('verify verify groups quantity', () => {
    cy.findByTestId('compose-recipient-combobox')
      .find(`optgroup`)
      .should(`have.length`, 5);

    cy.findByTestId('compose-recipient-combobox')
      .find(`optgroup`)
      .each(el => {
        cy.wrap(el)
          .find(`option`)
          .its(`length`)
          .should(`be.greaterThan`, 0);
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify particular group', () => {
    PatientComposePage.verifyRecipientsQuantityInGroup(0, 4);
    PatientComposePage.verifyRecipientsQuantityInGroup(1, 3);
    PatientComposePage.verifyRecipientsQuantityInGroup(2, 1);
    PatientComposePage.verifyRecipientsQuantityInGroup(3, 1);

    PatientComposePage.verifyRecipientsGroupName(
      0,
      'VA Kansas City health care',
    );
    PatientComposePage.verifyRecipientsGroupName(1, 'VA Madison health care');
    PatientComposePage.verifyRecipientsGroupName(
      2,
      'VA Northern Arizona health care',
    );
    PatientComposePage.verifyRecipientsGroupName(
      3,
      'VA Puget Sound health care',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify recipient is in a correct group', () => {
    PatientComposePage.verifyFacilityNameByRecipientName(
      `Record Amendment Admin`,
      'VA Kansas City health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `Jeasmitha-Cardio-Clinic`,
      'VA Madison health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `CAMRY_PCMM`,
      'VA Puget Sound health care',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
