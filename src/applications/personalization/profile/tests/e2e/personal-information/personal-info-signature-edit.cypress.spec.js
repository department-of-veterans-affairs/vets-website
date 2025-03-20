import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';
import { Locators, Data, Paths } from '../../fixtures/constants';

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
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();

    cy.get(Locators.SIGNATURE.NAME_LABEL)
      .should('be.visible')
      .and('contain.text', Data.SIGNATURE.ALERTS.REQUIRED);

    cy.get(Locators.SIGNATURE.TITLE_LABEL)
      .should('be.visible')
      .and('contain.text', Data.SIGNATURE.ALERTS.REQUIRED);

    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can edit and save signature', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();

    cy.get(Locators.SIGNATURE.NAME_FIELD)
      .should(`be.focused`)
      .type('Jack Sparrow');

    cy.get(Locators.SIGNATURE.TITLE_FIELD).type('Captain');

    cy.intercept(
      `POST`,
      Paths.INTERCEPT.SIGNATURE,
      updatedSignatureResponse,
    ).as('updatedSignature');

    cy.get(Locators.SIGNATURE.SAVE_BTN).click();

    cy.get(Locators.SIGNATURE.GENERAL).should(
      `contain.text`,
      `${updatedSignatureResponse.data.attributes.signatureName +
        updatedSignatureResponse.data.attributes.signatureTitle}`,
    );

    cy.get(Locators.SIGNATURE.ALERTS.SUCCESS)
      .should(`be.visible`)
      .and('have.text', Data.SIGNATURE.UPDATE_SAVED);

    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
