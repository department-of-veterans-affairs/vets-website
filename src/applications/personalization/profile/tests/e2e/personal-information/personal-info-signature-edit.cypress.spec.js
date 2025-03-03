import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

const updatedSignatureResponse = {
  ...mockSignature,
  data: {
    ...mockSignature.data,
    attributes: {
      ...mockSignature.data.attributes,
      signatureName: 'Jack Sparrow',
      signatureTitle: `Captain`,
    },
  },
};
describe('PERSONAL INFORMATION EDIT SIGNATURE', () => {
  beforeEach(() => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);
  });

  it(`verify user can cancel editing signature`, () => {
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName-label`)
      .should('be.visible')
      .and('contain.text', `(*Required)`);
    cy.get(`#root_signatureTitle-label`)
      .should('be.visible')
      .and('contain.text', `(*Required)`);

    cy.get(`[data-testid="cancel-edit-button"]`).click();
    cy.get(`#edit-messages-signature`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can edit and save signature', () => {
    cy.get(`#edit-messages-signature`).click();

    cy.get(`#root_signatureName`)
      .should(`be.focused`)
      .type('Jack Sparrow');
    cy.get(`#root_signatureTitle`).type('Captain');

    cy.intercept(
      `POST`,
      `/my_health/v1/messaging/preferences/signature`,
      updatedSignatureResponse,
    ).as('updatedSignature');

    cy.get(`[data-testid="save-edit-button"]`).click();

    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `${updatedSignatureResponse.data.attributes.signatureName +
        updatedSignatureResponse.data.attributes.signatureTitle}`,
    );

    cy.get(`#messagingSignature-alert`)
      .should(`be.visible`)
      .and('have.text', `Update saved.`);
    cy.get(`#edit-messages-signature`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
