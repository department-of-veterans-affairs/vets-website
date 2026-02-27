import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM RECIPIENTS GROUPING ON COMPOSE', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups,
      value: true,
    },
    {
      name: FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow,
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

  it('verify groups quantity', () => {
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

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify recipient is in a correct group', () => {
    PatientComposePage.verifyFacilityNameByRecipientName(
      `TG-7410`,
      'VA Kansas City health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `SLC4 PCMM`,
      'VA Kansas City health care',
    );

    PatientComposePage.verifyFacilityNameByRecipientName(
      `OH TG GROUP 002`,
      'VA Spokane health care',
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify option text includes shortened system names in parentheses', () => {
    cy.findByTestId('compose-recipient-combobox')
      .find('optgroup[label="VA Kansas City health care"]')
      .find('option')
      .each($option => {
        const text = $option.text();
        // Each option should have format: "Team Name\t(Shortened System Name)"
        cy.wrap(text).should('match', /\t\(.+\)/);
        // Should contain shortened name "Kansas City", not full "VA Kansas City health care"
        cy.wrap(text).should('include', '(Kansas City)');
      });

    cy.findByTestId('compose-recipient-combobox')
      .find('optgroup[label="VA Madison health care"]')
      .find('option')
      .each($option => {
        const text = $option.text();
        cy.wrap(text).should('match', /\t\(.+\)/);
        cy.wrap(text).should('include', '(Madison)');
      });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify system names are shortened by removing "VA " prefix and " health care" suffix', () => {
    cy.findByTestId('compose-recipient-combobox')
      .find('optgroup')
      .each($group => {
        const label = $group.attr('label');

        // Skip Recent care teams group for this test
        if (label !== 'Recent care teams') {
          cy.wrap($group)
            .find('option')
            .each($option => {
              const text = $option.text();
              const match = text.match(/\t\((.+)\)/);

              if (match) {
                const systemNameInParens = match[1];
                // System name should NOT start with "VA "
                cy.wrap(systemNameInParens).should('not.match', /^VA\s+/i);
                // System name should NOT end with " health care"
                cy.wrap(systemNameInParens).should(
                  'not.match',
                  /\s+health care$/i,
                );
              }
            });
        }
      });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify Recent care teams optgroup options show shortened system names', () => {
    cy.findByTestId('compose-recipient-combobox')
      .find('optgroup')
      .then($optgroups => {
        const recentOptgroup = Array.from($optgroups).find(
          og => og.getAttribute('label') === 'Recent care teams',
        );

        if (recentOptgroup) {
          // If Recent care teams exists, verify its options have shortened names
          cy.wrap(recentOptgroup)
            .find('option')
            .each($option => {
              const text = $option.text();
              // Should have tab and parentheses format
              cy.wrap(text).should('match', /\t\(.+\)/);
              // Should NOT contain full "VA ... health care" format
              cy.wrap(text).should('not.match', /\t\(VA\s+.*health care\)/i);
            });
        }
      });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
