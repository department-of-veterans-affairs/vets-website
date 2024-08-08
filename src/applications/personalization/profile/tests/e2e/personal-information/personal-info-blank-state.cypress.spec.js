import { setup } from '@@profile/tests/e2e/personal-information/setup';
import { unsetUserPersonalInfo } from 'applications/personalization/profile/mocks/endpoints/personal-information';

describe('Content on the personal information page', () => {
  it('should render as expected with edit buttons for personal info fields when no personal data set in api', () => {
    setup({ personalInfo: unsetUserPersonalInfo });

    cy.findByText('Date of birth').should('exist');
    cy.findByText('This information is not available right now.').should(
      'exist',
    );

    cy.findByText('Preferred name').should('exist');
    cy.findByTestId('preferredName').contains(
      'Choose edit to add a preferred name.',
    );

    cy.findByText('Gender identity').should('exist');
    cy.findByTestId('genderIdentity').contains(
      'Choose edit to add a gender identity.',
    );

    cy.injectAxeThenAxeCheck();
  });
});
