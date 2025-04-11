import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';
import { Locators, Data } from '../../fixtures/constants';

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
    cy.get(Locators.SIGNATURE.REMOVE_BTN).click();

    cy.get(Locators.SIGNATURE.ALERTS.CROSS_BTN).should(`be.focused`);

    cy.get(Locators.SIGNATURE.ALERTS.REMOVE_TITLE).should(
      `have.text`,
      Data.SIGNATURE.ALERTS.REMOVE,
    );
    cy.get(Locators.SIGNATURE.ALERTS.REMOVE_TEXT).should(
      `have.text`,
      Data.SIGNATURE.ALERTS.REMOVE_TEXT,
    );

    cy.get(Locators.SIGNATURE.ALERTS.CONFIRM_REMOVE_BTN).should(
      `have.text`,
      Data.SIGNATURE.ALERTS.REMOVE_BTN,
    );

    cy.get(Locators.SIGNATURE.ALERTS.CANCEL_REMOVE_BTN)
      .shadow()
      .find(`button`)
      .should(`have.text`, Data.SIGNATURE.ALERTS.CANCEL_REMOVE_BTN);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can cancel remove signature', () => {
    // close modal by cancel btn
    cy.get(Locators.SIGNATURE.REMOVE_BTN).click();

    cy.get(Locators.SIGNATURE.ALERTS.CANCEL_REMOVE_BTN)
      .shadow()
      .find(`button`)
      .click();

    cy.get(Locators.SIGNATURE.REMOVE_BTN).should('be.focused');

    // close modal by cross btn
    cy.get(Locators.SIGNATURE.REMOVE_BTN).click();
    cy.get(Locators.SIGNATURE.ALERTS.CROSS_BTN).click();

    cy.get(Locators.SIGNATURE.REMOVE_BTN).should('be.focused');

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

    PersonalInformationPage.removeSignature(noSignatureResponse);

    cy.get(Locators.SIGNATURE.ALERTS.SUCCESS)
      .should(`be.visible`)
      .and('have.text', Data.SIGNATURE.UPDATE_SAVED);
    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    cy.get(Locators.SIGNATURE.GENERAL).should(
      `contain.text`,
      Data.SIGNATURE.CHOOSE_EDIT,
    );

    cy.injectAxeThenAxeCheck();
  });
});
