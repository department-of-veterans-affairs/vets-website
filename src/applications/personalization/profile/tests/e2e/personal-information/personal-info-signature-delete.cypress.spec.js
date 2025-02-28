import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

describe('PERSONAL INFORMATION SIGNATURE', () => {
  beforeEach(() => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);
  });

  it('verify user can cancel delete signature', () => {
    // close modal by cancel btn
    cy.get(`#remove-messaging-signature`).click();

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
      .should(`have.text`, `No, cancel this change`)
      .click();

    cy.get('#edit-messaging-signature').should('be.focused');

    // close modal by cross btn
    cy.get(`#remove-messaging-signature`).click();
    cy.get(`.first-focusable-child`).click();

    cy.get('#edit-messaging-signature').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can delete signature', () => {
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

    cy.get(`#remove-messaging-signature`).click();
    cy.get(`[modal-title="Remove signature?"] > div > button`).click();

    cy.get(`#messagingSignature-alert`)
      .should(`be.visible`)
      .and('have.text', `Update saved.`);
    cy.get(`#edit-messaging-signature`).should(`be.focused`);

    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `Choose edit to add a messaging signature.`,
    );
    cy.injectAxeThenAxeCheck();
  });
});
