import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

describe('PERSONAL INFORMATION REMOVE SIGNATURE', () => {
  beforeEach(() => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);
  });

  it('verify remove alert details', () => {
    cy.get(`#remove-messages-signature`).click();

    cy.get(`.first-focusable-child`).should(`be.focused`);

    cy.get(`#heading`).should(`have.text`, `Remove signature?`);
    cy.get(`[modal-title="Remove signature?"] > p`).should(
      `have.text`,
      `Your signature will no longer appear on outgoing secure messages.You can always come back to your profile later if you want to add this signature again.`,
    );

    cy.get(`[modal-title="Remove signature?"] > div > button`).should(
      `have.text`,
      `Yes, remove my signature`,
    );

    cy.get(`[modal-title="Remove signature?"] > div > va-button`)
      .shadow()
      .find(`button`)
      .should(`have.text`, `No, cancel this change`);
  });

  it('verify user can cancel remove signature', () => {
    // close modal by cancel btn
    cy.get(`#remove-messages-signature`).click();

    cy.get(`[modal-title="Remove signature?"] > div > va-button`)
      .shadow()
      .find(`button`)
      .click();

    cy.get('#remove-messages-signature').should('be.focused');

    // close modal by cross btn
    cy.get(`#remove-messages-signature`).click();
    cy.get(`.first-focusable-child`).click();

    cy.get('#remove-messages-signature').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can remove signature', () => {
    const noSignatureResponse = {
      ...mockSignature,
      data: {
        ...mockSignature.data,
        attributes: {
          ...mockSignature.data.attributes,
          signatureName: null,
          signatureTitle: null,
        },
      },
    };

    cy.intercept(
      `POST`,
      `/my_health/v1/messaging/preferences/signature`,
      noSignatureResponse,
    ).as('updatedSignature');

    cy.get(`#remove-messages-signature`).click();
    cy.get(`[modal-title="Remove signature?"] > div > button`).click();

    cy.get(`#messagingSignature-alert`)
      .should(`be.visible`)
      .and('have.text', `Update saved.`);
    cy.get(`#edit-messages-signature`).should(`be.focused`);

    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `Choose edit to add a messages signature.`,
    );
    cy.injectAxeThenAxeCheck();
  });
});
