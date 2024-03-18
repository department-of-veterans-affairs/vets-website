import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockUser from '../fixtures/userResponse/user.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import mockRecipients from '../fixtures/recipients-response.json';
import mockFeatureToggles from '../fixtures/toggles-response.json';

describe('Verify Thread - Blocked from particular Triage Group', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  // amend facilities property in user response
  const mockTestUser = JSON.parse(JSON.stringify(mockUser));
  mockTestUser.data.attributes.vaProfile.facilities[0].facilityId = '556';
  mockTestUser.data.attributes.vaProfile.facilities[0].isCerner = true;

  // amend fist object of vamc-ehr response to vha_556 facility
  const mockTestVamc = JSON.parse(JSON.stringify(vamcUser));
  mockTestVamc.data.nodeQuery.entities[0].fieldRegionPage.entity.fieldVamcEhrSystem =
    'cerner';
  mockTestVamc.data.nodeQuery.entities[0].fieldFacilityLocatorApiId = 'vha_556';

  beforeEach(() => {
    site.login(mockTestVamc, true, mockTestUser);
  });

  it('verify alert on landing page', () => {
    SecureMessagingLandingPage.loadMainPage(
      mockFeatureToggles,
      Paths.UI_MAIN,
      mockRecipients,
      mockTestUser,
    );

    cy.get(Locators.HEADLINE).should(
      'have.text',
      'You can’t send messages to some of your care teams right now',
    );
    cy.get(Locators.ALERTS.VA_ALERT_WARNING)
      .find('a')
      .should('be.visible')
      .and('have.attr', 'href', Paths.FIND_LOCATION);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify alert on inbox page', () => {
    landingPage.loadInboxMessages();

    cy.get(Locators.HEADLINE).should(
      'have.text',
      'You can’t send messages to some of your care teams right now',
    );
    cy.get(Locators.ALERTS.VA_ALERT_WARNING)
      .find('a')
      .should('be.visible')
      .and('have.attr', 'href', Paths.FIND_LOCATION);
    cy.get(Locators.ALERTS.CERNER_ALERT)
      .should('be.visible')
      .and('contain.text', 'Make sure you’re in the right health portal');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
