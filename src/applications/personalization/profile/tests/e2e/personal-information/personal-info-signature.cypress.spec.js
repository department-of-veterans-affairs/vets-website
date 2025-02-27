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
  it('verify signature content', () => {
    cy.get(`h2`)
      .should('be.visible')
      .and('contain.text', 'Messaging signature');
    cy.get('#edit-messaging-signature')
      .should('be.visible')
      .and('have.text', 'Edit');
    cy.get(`[aria-label="Remove Messaging signature"]`)
      .should('be.visible')
      .and('have.text', 'Remove');
    cy.get(`[data-testid="messagingSignature"]`).should(
      `contain.text`,
      `${mockSignature.data.attributes.signatureName}` +
        `${mockSignature.data.attributes.signatureTitle}`,
    );

    cy.injectAxeThenAxeCheck();
  });
});
