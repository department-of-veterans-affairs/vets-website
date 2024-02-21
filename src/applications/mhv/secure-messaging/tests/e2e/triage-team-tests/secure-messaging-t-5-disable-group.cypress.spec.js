import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockUser from '../fixtures/userResponse/user.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import mockRecipients from '../fixtures/recipients-response.json';

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
    'cerner_staged';
  mockTestVamc.data.nodeQuery.entities[0].fieldFacilityLocatorApiId = 'vha_556';

  beforeEach(() => {
    site.login(mockTestVamc, true, mockTestUser);
  });

  it('verify alert on landing page', () => {
    SecureMessagingLandingPage.loadMainPage(mockRecipients, mockTestUser);

    cy.get('h1[slot="headline"]').should(
      'have.text',
      'You can’t send messages to some of your care teams right now',
    );
    cy.get('va-alert[status="warning"]')
      .find('a')
      .should('be.visible')
      .and('have.attr', 'href', '/find-locations');

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

    cy.get('h1[slot="headline"]').should(
      'have.text',
      'You can’t send messages to some of your care teams right now',
    );
    cy.get('va-alert[status="warning"]')
      .find('a')
      .should('be.visible')
      .and('have.attr', 'href', '/find-locations');
    cy.get('[data-testid="cerner-facilities-alert"]')
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
