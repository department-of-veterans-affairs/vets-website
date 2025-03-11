import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Locators, Data } from './utils/constants';

describe('SM RECIPIENTS GROUPING ON COMPOSE', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: `mhv_secure_messaging_recipient_opt_groups`,
      value: true,
    },
  ]);
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientComposePage.verifyHeader(Data.START_NEW_MSG);
  });

  it('verify groups quantity', () => {
    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`optgroup`)
      .should(`have.length`, 4);

    cy.get(Locators.DROPDOWN.RECIPIENTS)
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
    PatientComposePage.verifyRecipientsQuantityInGroup(0, 3);
    PatientComposePage.verifyRecipientsQuantityInGroup(1, 3);
    PatientComposePage.verifyRecipientsQuantityInGroup(2, 1);
    PatientComposePage.verifyRecipientsQuantityInGroup(3, 2);

    PatientComposePage.verifyRecipientsGroupName(
      0,
      'VA Kansas City health care',
    );

    PatientComposePage.verifyRecipientsGroupName(1, 'VA Madison health care');

    PatientComposePage.verifyRecipientsGroupName(
      2,
      'VA Martinsburg health care',
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
      `TG-7410`,
      'VA Kansas City health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `SLC4 PCMM`,
      'VA Martinsburg health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `OH TG GROUP 002`,
      'VA Puget Sound health care',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
