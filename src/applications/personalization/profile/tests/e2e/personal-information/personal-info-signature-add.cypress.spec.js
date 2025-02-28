import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

describe('PERSONAL INFORMATION ADD SIGNATURE', () => {
  it('verify user can add signature', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

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

    PersonalInformationPage.load(updatedFeatureToggles, noSignatureResponse);

    cy.get(`#edit-messaging-signature`).click();
    cy.get(`#root_signatureName-label`)
      .should('be.visible')
      .and('contain.text', `(*Required)`);
    cy.get(`#root_signatureTitle-label`)
      .should('be.visible')
      .and('contain.text', `(*Required)`);

    cy.get(`#root_signatureName`)
      .should(`be.focused`)
      .type('Name');
    cy.get(`#root_signatureTitle`).type('TestTitle');

    cy.intercept(
      `POST`,
      `/my_health/v1/messaging/preferences/signature`,
      mockSignature,
    ).as('updatedSignature');

    cy.get(`[data-testid="save-edit-button"]`).click();

    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `${mockSignature.data.attributes.signatureName +
        mockSignature.data.attributes.signatureTitle}`,
    );

    cy.get(`#messagingSignature-alert`)
      .should(`be.visible`)
      .and('have.text', `Update saved.`);
    cy.get(`#edit-messaging-signature`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
