import { setup } from '@@profile/tests/e2e/personal-information/setup';

describe('Content on the personal information page', () => {
  it('should render personal information as expected', () => {
    setup({ isEnhanced: true });

    // Check legal name
    cy.findByTestId('legalNameField')
      .contains('Wesley Watson Ford')
      .should('exist');

    // Check preferred name and value is shown
    cy.findByTestId('preferredName')
      .children()
      .findByText('Wes')
      .should('exist');

    // Check pronouns
    cy.findByText('He/him/his; They/them/theirs; Other/pronouns/here').should(
      'exist',
    );

    // Check gender identity
    cy.findByText('Man').should('exist');

    // Check sexual orientation
    cy.findByText('Straight or heterosexual; Some other orientation').should(
      'exist',
    );

    // check disability rating
    cy.findByTestId('disabilityRatingField')
      .contains('90% service connected')
      .should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should render preferNotToAnswer for Sexual Orientation with correctly formatted string', () => {
    setup({
      isEnhanced: true,
      personalInfo: {
        data: {
          attributes: {
            sexualOrientation: ['preferNotToAnswer'],
            sexualOrientationNotListedText: '',
          },
        },
      },
    });

    // Check sexual orientation
    cy.get('#sexual-orientation').within(() => {
      cy.findByText('Prefer not to answer').should('exist');
    });

    cy.injectAxeThenAxeCheck();
  });
});
