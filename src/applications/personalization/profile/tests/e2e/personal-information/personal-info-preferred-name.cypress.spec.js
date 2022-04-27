import { setup } from '@@profile/tests/e2e/personal-information/setup';
import {
  basicUserPersonalInfoResponse,
  putPreferredNameFailureResponse,
  makePutPreferredNameSuccessResponse,
} from '@@profile/mocks/personalInformation';
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

    cy.findByLabelText(nameEditButtonLabel).click({ waitForAnimations: true });

    cy.findByText(nameEditInputLabel).should('exist');

    cy.get(nameEditInputField)
      .clear()
      .type('newname');

    cy.findByTestId('cancel-edit-button').click();

    // should show cancel editing alert
    cy.findByRole('alertdialog').should('exist');

    cy.findByRole('button', { name: 'Cancel' })
      .should('exist')
      .click();

    cy.findByText(nameEditInputLabel).should('not.exist');

    cy.get(nameEditInputField).should('not.exist');

    cy.findByTestId('preferredName').contains('Wes');

    cy.injectAxeThenAxeCheck();
  });

  it('when updating preferred name is successful, should show success alert and the updated name', () => {
    setup({ isEnhanced: true });

    const updatedName = 'George';

    cy.intercept(
      'PUT',
      'v0/profile/preferred_names',
      makePutPreferredNameSuccessResponse(updatedName.toUpperCase()),
    );

    cy.intercept('GET', 'v0/profile/personal_information*', req => {
      if (req?.query?.now) {
        req.reply(
          set(
            { ...basicUserPersonalInfoResponse },
            'data.attributes.preferredName',
            updatedName.toUpperCase(),
          ),
        );
      }
    });

    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.findByLabelText(nameEditButtonLabel).click({ waitForAnimations: true });

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

    cy.intercept(
      'PUT',
      'v0/profile/preferred_names',
      putPreferredNameFailureResponse,
    );

    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.findByLabelText(nameEditButtonLabel).click({ waitForAnimations: true });

    cy.get(nameEditInputField)
      .clear()
      .type(updatedName);

    cy.findAllByTestId('save-edit-button').click({ waitForAnimations: true });

    cy.findByTestId('edit-error-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('when there is an network error, should show error alert', () => {
    setup({ isEnhanced: true });

    const nameEditButtonLabel = 'Edit Preferred name';

    cy.findByLabelText(nameEditButtonLabel).click({ waitForAnimations: true });

    cy.findAllByTestId('save-edit-button')
      .should('exist')
      .click({ waitForAnimations: true });

    cy.findByTestId('edit-error-alert').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show field validation errors', () => {
    setup({ isEnhanced: true });

    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.findByLabelText(nameEditButtonLabel).click({ waitForAnimations: true });

    cy.get(nameEditInputField).clear();

    cy.findAllByTestId('save-edit-button')
      .should('exist')
      .click({ waitForAnimations: true });

    cy.get('#root_preferredName-error-message').contains(
      'Please provide a response',
    );

    cy.get(nameEditInputField)
      .clear()
      .type('1234');

    cy.findAllByTestId('save-edit-button')
      .should('exist')
      .click({ waitForAnimations: true });

    cy.get('#root_preferredName-error-message').contains(
      'This field accepts alphabetic characters only',
    );

    cy.injectAxeThenAxeCheck();
  });
});
