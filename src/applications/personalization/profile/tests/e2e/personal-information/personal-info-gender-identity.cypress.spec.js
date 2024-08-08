import { setup } from '@@profile/tests/e2e/personal-information/setup';
import {
  putBadRequestFailure,
  createPutGenderIdentitySuccess,
  unsetUserPersonalInfo,
} from '@@profile/mocks/endpoints/personal-information';

describe('Gender identity field tests on the personal information page', () => {
  it('when api data is available, should render gender identity field and alert when cancel is attempted with unsaved edits', () => {
    setup({ isEnhanced: true });

    const genderEditButtonLabel = 'Edit Gender identity';
    const genderEditInputLabel = 'Select your gender identity';
    const nameEditInputField = 'input[name="root_genderIdentity"]';

    cy.findByTestId('genderIdentity').contains('Man');

    cy.findByLabelText(genderEditButtonLabel).click({
      waitForAnimations: true,
    });

    cy.get('#root_genderIdentity-label')
      .contains(genderEditInputLabel)
      .should('exist');

    cy.get('#root_genderIdentity_1').click({
      waitForAnimations: true,
    });

    cy.findByTestId('cancel-edit-button').click();

    // should show cancel editing alert
    cy.get('va-modal[visible]').should('exist');

    cy.findByTestId('confirm-cancel-modal')
      .shadow()
      .find('.usa-button-group')
      .first()
      .find('va-button')
      .shadow()
      .findByText(/yes, cancel my changes/i)
      .click();

    cy.findByText(genderEditInputLabel).should('not.exist');

    cy.get(nameEditInputField).should('not.exist');

    cy.findByTestId('genderIdentity').contains('Man');

    cy.injectAxeThenAxeCheck();
  });

  it('when api data is empty, should render gender identity field and placeholder content', () => {
    setup({ isEnhanced: true, personalInfo: unsetUserPersonalInfo });

    cy.findByTestId('genderIdentity')
      .contains('Choose edit to add a gender identity.')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when updating gender identity is successful, should show success alert and the updated name', () => {
    setup({ isEnhanced: true });

    const updatedGenderIdentityCode = 'B';

    const updatedGenderIdentityLabel = 'Non-binary';

    cy.intercept(
      'PUT',
      'v0/profile/gender_identities',
      createPutGenderIdentitySuccess(updatedGenderIdentityCode),
    );

    const genderEditButtonLabel = 'Edit Gender identity';

    cy.findByLabelText(genderEditButtonLabel).click({
      waitForAnimations: true,
    });

    cy.get('#root_genderIdentity_1').click({
      waitForAnimations: true,
    });

    cy.findAllByTestId('save-edit-button').click({ waitForAnimations: true });

    cy.findByTestId('genderIdentity')
      .contains(updatedGenderIdentityLabel)
      .should('exist');

    cy.findByTestId('update-success-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when there is an API error, should show error alert', () => {
    setup({ isEnhanced: true });

    cy.intercept('PUT', 'v0/profile/gender_identities', putBadRequestFailure);

    const genderEditButtonLabel = 'Edit Gender identity';

    cy.findByLabelText(genderEditButtonLabel).click({
      waitForAnimations: true,
    });

    cy.get('#root_genderIdentity_1').click({
      waitForAnimations: true,
    });

    cy.findAllByTestId('save-edit-button').click({ waitForAnimations: true });

    cy.findByTestId('edit-error-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when there is an network error, should show error alert', () => {
    setup({ isEnhanced: true });

    const genderEditButtonLabel = 'Edit Gender identity';

    cy.findByLabelText(genderEditButtonLabel).click({
      waitForAnimations: true,
    });

    cy.get('#root_genderIdentity_1').click({
      waitForAnimations: true,
    });

    cy.findAllByTestId('save-edit-button')
      .should('exist')
      .click({ waitForAnimations: true });

    cy.findByTestId('edit-error-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
