import { setup } from '@@profile/tests/e2e/personal-information/setup';
import {
  basicUserPersonalInfo,
  putBadRequestFailure400,
  createPutPreferredNameSuccess,
  unsetUserPersonalInfo,
} from '@@profile/mocks/endpoints/personal-information';
import set from 'lodash/set';

describe('Preferred name field tests on the personal information page', () => {
  it('when api data is available, should render preferred name field and alert when cancel is attempted with unsaved edits', () => {
    setup({ isEnhanced: true });

    // preferred name field
    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputLabel =
      'Provide your preferred name (25 characters maximum)';
    const nameEditInputField = 'input[name="root_preferredName"]';

    // check that 'WES' is formatted to 'Wes'
    cy.findByTestId('preferredName').contains('Wes');

    cy.get(`va-button[label="${nameEditButtonLabel}"]`).click({
      waitForAnimations: true,
    });

    cy.findByText(nameEditInputLabel).should('exist');

    cy.get(nameEditInputField).clear();

    cy.get(nameEditInputField).type('newname');

    cy.findByTestId('cancel-edit-button').click();

    // should show cancel editing alert
    cy.get('va-modal[visible]').should('exist');

    cy.findByTestId('confirm-cancel-modal')
      .shadow()
      .find('.usa-button-group')
      .first()
      .find('va-button')
      .shadow()
      .findByText(/Cancel changes/i)
      .click();

    cy.findByText(nameEditInputLabel).should('not.exist');

    cy.get(nameEditInputField).should('not.exist');

    cy.findByTestId('preferredName').contains('Wes');

    cy.injectAxeThenAxeCheck();
  });

  it('when api data is empty, should render preferred name field and placeholder content', () => {
    setup({ isEnhanced: true, personalInfo: unsetUserPersonalInfo });

    cy.findByTestId('preferredName')
      .contains('Choose edit to add a preferred name.')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when updating preferred name is successful, should show success alert and the updated name', () => {
    setup({ isEnhanced: true });

    const updatedName = 'George';

    cy.intercept(
      'PUT',
      'v0/profile/preferred_names',
      createPutPreferredNameSuccess(updatedName),
    );

    cy.intercept('GET', 'v0/profile/personal_information*', req => {
      if (req?.query?.now) {
        req.reply(
          set(
            { ...basicUserPersonalInfo },
            'data.attributes.preferredName',
            updatedName,
          ),
        );
      }
    });

    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.get(`va-button[label="${nameEditButtonLabel}"]`).click({
      waitForAnimations: true,
    });

    cy.get(nameEditInputField)
      .clear()
      .type(updatedName);

    cy.findAllByTestId('save-edit-button').click({ waitForAnimations: true });

    cy.findByTestId('preferredName')
      .contains(updatedName)
      .should('exist');

    cy.findByTestId('update-success-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when there is an API error, should show error alert', () => {
    setup({ isEnhanced: true });

    const updatedName = 'George';

    cy.intercept('PUT', 'v0/profile/preferred_names', putBadRequestFailure400);

    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.get(`va-button[label="${nameEditButtonLabel}"]`).click({
      waitForAnimations: true,
    });

    cy.get(nameEditInputField)
      .clear()
      .type(updatedName);

    cy.findAllByTestId('save-edit-button').click({ waitForAnimations: true });

    cy.findByTestId('edit-error-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
