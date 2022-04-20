import { setup } from '@@profile/tests/e2e/personal-information/setup';

describe('Content on the personal information page', () => {
  it('should render personal information as expected', () => {
    setup({ isEnhanced: true });

    // Check preferred name
    cy.findByText('Wes').should('exist');

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
    cy.findByText('Prefer not to answer').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
