import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';

describe('SM CURATED LIST MAIN FLOW', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('verify select care team page', () => {
    PatientMessageDraftsPage.loadDrafts();
    PatientMessageDraftsPage.loadSingleDraft();

    cy.contains(`Select a different care team`).click();

    cy.get('.usa-combo-box').click();

    cy.get(`.usa-combo-box__list > li`)
      .eq(4)
      .click();

    cy.get(`.usa-combo-box__list > li`)
      .eq(4)
      .invoke('text')
      .then(text => {
        cy.wrap(text).as(`updatedTGName`);
      });

    cy.get(`@updatedTGName`).then(text => {
      cy.findByTestId(`continue-button`).click();
      cy.findByTestId(`compose-recipient-title`).should('include.text', text);
    });

    cy.findByTestId(`message-subject-field`).should(
      `have.attr`,
      `value`,
      mockSavedDraftResponse.data[0].attributes.subject,
    );
    cy.findByTestId(`message-body-field`).should(
      `have.attr`,
      `value`,
      mockSavedDraftResponse.data[0].attributes.body,
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
