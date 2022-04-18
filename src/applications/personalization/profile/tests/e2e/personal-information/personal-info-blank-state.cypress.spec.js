import { setup } from '@@profile/tests/e2e/personal-information/setup';

describe('Content on the personal information page', () => {
  it('should render as expected with edit buttons for personal info fields when no personal data set in api', () => {
    setup({ isEnhanced: true, personalInfo: {} });

    cy.findByText('Date of birth').should('exist');
    cy.findByText('This information is not available right now.').should(
      'exist',
    );

    cy.findByText('Preferred name').should('exist');
    cy.findByText('Edit your profile to add a preferred name.').should('exist');

    cy.findByText('Pronouns').should('exist');
    cy.findByText('Edit your profile to add pronouns.').should('exist');

    cy.findByText('Gender identity').should('exist');
    cy.findByText('Edit your profile to add a gender identity.').should(
      'exist',
    );

    cy.findByText('Sexual orientation').should('exist');
    cy.findByText('Edit your profile to add a sexual orientation.').should(
      'exist',
    );

    cy.injectAxeThenAxeCheck();
  });
});
