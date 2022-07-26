import { setup } from '@@profile/tests/e2e/personal-information/setup';

const checkPersonalInfoFields = () => {
  // preferred name field
  const nameEditButtonLabel = 'Edit Preferred name';
  const nameEditInputLabel =
    'Provide your preferred name (25 characters maximum)';
  const nameEditInputField = 'input[name="root_preferredName"]';

  cy.findByLabelText(nameEditButtonLabel)
    .should('exist')
    .click({ waitForAnimations: true });

  cy.findByText(nameEditInputLabel).should('exist');

  cy.get(nameEditInputField)
    .should('exist')
    .blur();

  cy.axeCheck();

  cy.findAllByTestId('cancel-edit-button')
    .should('exist')
    .click();

  cy.findByText(nameEditInputLabel).should('not.exist');

  cy.get(nameEditInputField).should('not.exist');

  // pronoun fields
  const pronounsEditButtonLabel = 'Edit Pronouns';
  const pronounsEditInputLabel = 'Select all of your pronouns';
  const pronounsEditInputField = 'input[name="root_pronounsNotListedText"]';

  cy.findByLabelText(pronounsEditButtonLabel)
    .should('exist')
    .click();

  cy.findByText(pronounsEditInputLabel).should('exist');

  cy.get(pronounsEditInputField).should('exist');
  cy.findByText('He/him/his').should('exist');
  cy.findByText('She/her/hers').should('exist');
  cy.findByText('They/them/theirs').should('exist');
  cy.findByText('Ze/zir/zirs').should('exist');
  cy.findByText('Use my preferred name').should('exist');
  cy.findByText(
    'If not listed, please provide your preferred pronouns (255 characters maximum)',
  ).should('exist');

  cy.axeCheck();

  cy.findAllByTestId('cancel-edit-button')
    .should('exist')
    .click();

  cy.findByText(pronounsEditInputLabel).should('not.exist');

  cy.get(pronounsEditInputField).should('not.exist');

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

  cy.findByText('Woman').should('exist');
  cy.findByText('Man').should('exist');
  cy.findByText('Transgender woman').should('exist');
  cy.findByText('Transgender man').should('exist');
  cy.findByText('Non-binary').should('exist');
  cy.findByText('Prefer not to answer').should('exist');
  cy.findByText('A gender not listed here').should('exist');

  cy.axeCheck();

  cy.findAllByTestId('cancel-edit-button')
    .should('exist')
    .click();

  cy.findByText(genderEditInputLegend).should('not.exist');

  // sexual orientation fields
  const sexualOrientationEditButtonLabel = 'Edit Sexual orientation';
  const sexualOrientationEditInputLabel = 'Select your sexual orientation';
  const sexualOrientationEditInputField =
    'input[name="root_sexualOrientationNotListedText"]';

  cy.findByLabelText(sexualOrientationEditButtonLabel)
    .should('exist')
    .click();

  cy.get(sexualOrientationEditInputField).should('exist');
  cy.findByText(sexualOrientationEditInputLabel).should('exist');
  cy.findByText('Lesbian, gay, or homosexual').should('exist');
  cy.findByText('Straight or heterosexual').should('exist');
  cy.findByText('Bisexual').should('exist');
  cy.findByText('Queer').should('exist');
  cy.findByText('Don’t know').should('exist');
  cy.findByText('Prefer not to answer (un-checks other options)').should(
    'exist',
  );

  cy.axeCheck();

  cy.findAllByTestId('cancel-edit-button')
    .should('exist')
    .click();

  cy.findByText(sexualOrientationEditInputLabel).should('not.exist');

  cy.get(sexualOrientationEditInputField).should('not.exist');
};

describe('Content in EDIT state on the personal information page', () => {
  it('should render each edit field with update/cancel buttons and remove field on cancel, when enhanced api data is present.', () => {
    setup({ isEnhanced: true });

    cy.injectAxeThenAxeCheck();

    checkPersonalInfoFields();
  });

  it('should render each edit field with update/cancel buttons even when no applicable data is present', () => {
    setup({ isEnhanced: false });

    cy.injectAxeThenAxeCheck();

    checkPersonalInfoFields();
  });
});
