import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';
import { Locators, Data } from '../../fixtures/constants';

describe('PERSONAL INFORMATION SIGNATURE ALERTS', () => {
  it('verify empty fields alerts', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);

    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).clear();
    cy.get(Locators.SIGNATURE.TITLE_FIELD).clear();
    cy.get(Locators.SIGNATURE.SAVE_BTN).click({
      waitForAnimations: true,
    });

    cy.get(Locators.SIGNATURE.ALERTS.FIELD_ERROR).each(el => {
      cy.wrap(el).should(`have.text`, Data.SIGNATURE.ALERTS.EMPTY_FIELD);
    });

    cy.injectAxeThenAxeCheck();
  });
});

describe('PERSONAL INFORMATION ADD SIGNATURE ALERTS', () => {
  beforeEach(() => {
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

    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);
    PersonalInformationPage.load(updatedFeatureToggles, noSignatureResponse);
  });

  it('verify alert modal details', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    // verify alert details
    cy.get(Locators.SIGNATURE.ALERTS.CROSS_BTN).should(`be.focused`);

    cy.get(Locators.SIGNATURE.ALERTS.CONFIRM_CANCEL_MODAL)
      .shadow()
      .find(`h2`)
      .should(`have.text`, Data.SIGNATURE.ALERTS.CANCEL_CHANGES);

    cy.get(Locators.SIGNATURE.ALERTS.CONFIRM_CANCEL_MODAL)
      .find(`p`)
      .should(`contain.text`, Data.SIGNATURE.ALERTS.CANCEL_ALERT);

    PersonalInformationPage.getCancelChangesBtn().should(
      `have.text`,
      Data.SIGNATURE.ALERTS.CANCEL_BTN,
    );

    PersonalInformationPage.getBackToEditBtn().should(
      `have.text`,
      Data.SIGNATURE.ALERTS.BACK_TO_EDIT_BTN,
    );

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can cancel changes', () => {
    // close modal by cancel btn
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    PersonalInformationPage.getCancelChangesBtn().click();

    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    // close modal by cross btn
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    cy.get(Locators.SIGNATURE.ALERTS.CROSS_BTN).click();
    cy.get(Locators.SIGNATURE.CANCEL_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can back to editing', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    PersonalInformationPage.getBackToEditBtn().click();

    cy.get(Locators.SIGNATURE.CANCEL_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});

describe('PERSONAL INFORMATION EDIT SIGNATURE ALERTS', () => {
  beforeEach(() => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);
    PersonalInformationPage.load(updatedFeatureToggles);
  });

  it('verify alert modal details', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD)
      .clear()
      .type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    // verify alert details
    cy.get(Locators.SIGNATURE.ALERTS.CONFIRM_CANCEL_MODAL)
      .shadow()
      .find(`h2`)
      .should(`have.text`, Data.SIGNATURE.ALERTS.CANCEL_CHANGES);

    cy.get(Locators.SIGNATURE.ALERTS.CONFIRM_CANCEL_MODAL)
      .find(`p`)
      .should(`contain.text`, Data.SIGNATURE.ALERTS.CANCEL_ALERT);

    PersonalInformationPage.getCancelChangesBtn().should(
      `have.text`,
      Data.SIGNATURE.ALERTS.CANCEL_BTN,
    );

    PersonalInformationPage.getBackToEditBtn().should(
      `have.text`,
      Data.SIGNATURE.ALERTS.BACK_TO_EDIT_BTN,
    );

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can cancel changes', () => {
    // close modal by cancel btn
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD)
      .clear()
      .type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    PersonalInformationPage.getCancelChangesBtn().click();

    cy.get(Locators.SIGNATURE.EDIT_BTN).should(`be.focused`);

    // close modal by cross btn
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD)
      .clear()
      .type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    cy.get(Locators.SIGNATURE.ALERTS.CROSS_BTN).click();
    cy.get(Locators.SIGNATURE.CANCEL_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can back to editing', () => {
    cy.get(Locators.SIGNATURE.EDIT_BTN).click();
    cy.get(Locators.SIGNATURE.NAME_FIELD).type('Jack Sparrow');
    cy.get(Locators.SIGNATURE.CANCEL_BTN).click();

    PersonalInformationPage.getBackToEditBtn().click();

    cy.get(Locators.SIGNATURE.CANCEL_BTN).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
