import { setup } from '@@profile/tests/e2e/personal-information/setup';

const checkPreferredName = () => {
  it('should support preferred name field', () => {
    cy.injectAxeThenAxeCheck();

    // preferred name field
    const nameEditButtonLabel = 'Edit Preferred name';
    const nameEditInputLabel =
      'Provide your preferred name (25 characters maximum)';
    const nameEditInputField = 'input[name="root_preferredName"]';

    cy.findByLabelText(nameEditButtonLabel)
      .should('exist')
      .click({ waitForAnimations: true });

    cy.findByText(nameEditInputLabel).should('exist');

    cy.get(nameEditInputField).should('exist');

    cy.focused().blur();

    cy.axeCheck();

    cy.findAllByTestId('cancel-edit-button')
      .should('exist')
      .click();

    cy.findByText(nameEditInputLabel).should('not.exist');

    cy.get(nameEditInputField).should('not.exist');
  });
};

const checkGenderIdentity = () => {
  it('should support gender identity field', () => {
    cy.injectAxeThenAxeCheck();

    // gender fields
    const genderEditButtonLabel = 'Edit Gender identity';
    const genderEditInputLegend = 'Select your gender identity';

    cy.findByLabelText(genderEditButtonLabel)
      .should('exist')
      .click();

    cy.findByText(genderEditInputLegend).should('exist');

    // radio options should be grouped into fieldset with a legend element
    cy.findByRole('group', {
      name: /Select your gender identity/i,
    }).should('exist');

    cy.findByLabelText('Woman').should('exist');
    cy.findByLabelText('Man').should('exist');
    cy.findByLabelText('Transgender woman').should('exist');
    cy.findByLabelText('Transgender man').should('exist');
    cy.findByLabelText('Non-binary').should('exist');
    cy.findByLabelText('Prefer not to answer').should('exist');
    cy.findByLabelText('A gender not listed here').should('exist');

    cy.axeCheck();

    cy.findAllByTestId('cancel-edit-button')
      .should('exist')
      .click();

    cy.findByText(genderEditInputLegend).should('not.exist');
  });
};

const checkAllFields = () => {
  checkPreferredName();
  checkGenderIdentity();
};

describe('Content in EDIT state on the personal information page', () => {
  describe('should render each edit field with update/cancel buttons and remove field on cancel, when api data is present.', () => {
    beforeEach(() => {
      setup({ isEnhanced: true });
    });

    checkAllFields();
  });

  describe('should render each edit field with update/cancel buttons even when no applicable data is present', () => {
    beforeEach(() => {
      setup({ isEnhanced: false });
    });

    checkAllFields();
  });
});
