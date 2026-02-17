import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';
import { Locators, Data } from '../../fixtures/constants';

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
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles(
      [],
    );

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

    PersonalInformationPage.saveSignature(updatedSignatureResponse);

    cy.get(Locators.SIGNATURE.GENERAL).should(
      `contain.text`,
      `${
        updatedSignatureResponse.data.attributes.signatureName +
        updatedSignatureResponse.data.attributes.signatureTitle
      }`,
    );

    cy.get(Locators.SIGNATURE.ALERTS.SUCCESS)
      .should(`be.visible`)
      .and('contain.text', Data.SIGNATURE.UPDATE_SAVED);

    cy.get('va-alert[status="success"]').should('be.focused');

    cy.injectAxeThenAxeCheck();
  });
});
