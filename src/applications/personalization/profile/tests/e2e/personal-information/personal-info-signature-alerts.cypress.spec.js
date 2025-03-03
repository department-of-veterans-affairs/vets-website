import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

describe('PERSONAL INFORMATION SIGNATURE ALERTS', () => {
  it('verify empty fields alerts', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);

    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`).clear();
    cy.get(`#root_signatureTitle`).clear();
    cy.get(`[data-testid="save-edit-button"]`).click({
      waitForAnimations: true,
    });

    cy.get('[role="alert"]').each(el => {
      cy.wrap(el).should(
        `have.text`,
        `Error Both fields are required to save a signature.`,
      );
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
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`).type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    // verify alert details
    cy.get(`.first-focusable-child`).should(`be.focused`);
    cy.get(`[data-testid="confirm-cancel-modal"]`)
      .shadow()
      .find(`h2`)
      .should(`have.text`, `Cancel changes?`);
    cy.get(`[data-testid="confirm-cancel-modal"]`)
      .find(`p`)
      .should(
        `contain.text`,
        `You haven't finished editing and saving the changes to your messages signature. If you cancel now, we won't save your changes.`,
      );
    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .first()
      .should(`have.text`, `Yes, cancel my changes`);

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .last()
      .should(`have.text`, `No, go back to editing`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can cancel changes', () => {
    // close modal by cancel btn
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`).type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .first()
      .click();

    cy.get(`#edit-messages-signature`).should(`be.focused`);

    // close modal by cross btn
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`).type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.first-focusable-child`).click();
    cy.get(`[data-testid="cancel-edit-button"]`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can back to editing', () => {
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`).type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .last()
      .click();

    cy.get(`[data-testid="cancel-edit-button"]`).should(`be.focused`);

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
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`)
      .clear()
      .type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    // verify alert details
    cy.get(`.first-focusable-child`).should(`be.focused`);
    cy.get(`[data-testid="confirm-cancel-modal"]`)
      .shadow()
      .find(`h2`)
      .should(`have.text`, `Cancel changes?`);
    cy.get(`[data-testid="confirm-cancel-modal"]`)
      .find(`p`)
      .should(
        `contain.text`,
        `You haven't finished editing and saving the changes to your messages signature. If you cancel now, we won't save your changes.`,
      );
    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .first()
      .should(`have.text`, `Yes, cancel my changes`);

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .last()
      .should(`have.text`, `No, go back to editing`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can cancel changes', () => {
    // close modal by cancel btn
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`)
      .clear()
      .type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .first()
      .click();

    cy.get(`#edit-messages-signature`).should(`be.focused`);

    // close modal by cross btn
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`)
      .clear()
      .type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.first-focusable-child`).click();
    cy.get(`[data-testid="cancel-edit-button"]`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });

  it('verify user can back to editing', () => {
    cy.get(`#edit-messages-signature`).click();
    cy.get(`#root_signatureName`)
      .clear()
      .type('Jack Sparrow');
    cy.get(`[data-testid="cancel-edit-button"]`).click();

    cy.get(`.usa-button-group__item > va-button`, { includeShadowDom: true })
      .find(`button`, { includeShadowDom: true })
      .last()
      .click();

    cy.get(`[data-testid="cancel-edit-button"]`).should(`be.focused`);

    cy.injectAxeThenAxeCheck();
  });
});
