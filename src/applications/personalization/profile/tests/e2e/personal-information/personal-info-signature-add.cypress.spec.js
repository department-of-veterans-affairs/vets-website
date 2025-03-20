import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';
import { Locators, Data, Paths } from '../../fixtures/constants';

describe('PERSONAL INFORMATION ADD SIGNATURE', () => {
  beforeEach(() => {
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
  });

  it('verify user can cancel adding signature', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_LABEL)
      .should('be.visible')
      .and('contain.text', `(*Required)`);
    cy.get(Locators.SIGNATURE.TITLE_LABEL)
      .should('be.visible')
      .and('contain.text', `(*Required)`);

    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();
    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it(`verify user can add and save signature`, () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD)
      .should(`be.focused`)
      .type('Name');
    cy.get(Locators.SIGNATURE.TITLE_FIELD).type('TestTitle');

    cy.intercept(`POST`, Paths.INTERCEPT.SIGNATURE, mockSignature).as(
      'updatedSignature',
    );

    cy.get(Locators.SIGNATURE.SAVE_BTN).click();

    cy.get(Locators.SIGNATURE.GENERAL).should(
      `contain.text`,
      `${mockSignature.data.attributes.signatureName +
        mockSignature.data.attributes.signatureTitle}`,
    );

    cy.get(Locators.SIGNATURE.ALERT)
      .should(`be.visible`)
      .and('have.text', Data.SIGNATURE.UPDATE_SAVED);
    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
