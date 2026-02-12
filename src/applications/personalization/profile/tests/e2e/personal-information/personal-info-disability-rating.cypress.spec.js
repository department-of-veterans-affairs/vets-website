import { setup } from '@@profile/tests/e2e/personal-information/setup';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import error500 from '@@profile/tests/fixtures/500.json';
import { set } from 'lodash';
import { findVaLinkByText } from '~/applications/personalization/common/e2eHelpers';

describe('Content for Disability Rating field', () => {
  it('should render NO rating content and links', () => {
    const mockUserWithoutRating = set(
      mockUser,
      'data.attributes.profile.claims.ratingInfo',
      false,
    );

    setup({
      isEnhanced: true,
      customMockUser: mockUserWithoutRating,
    });

    // check disability rating
    cy.findByTestId('disabilityRatingField')
      .contains('Our records show that you don’t have a disability rating.')
      .should('exist');

    findVaLinkByText('Learn more about VA disability ratings').should('exist');
    findVaLinkByText(
      'Learn more about the PACT Act and eligibility updates based on toxic exposure',
    ).should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should render rating content and links', () => {
    const mockUserWithRating = set(
      mockUser,
      'data.attributes.profile.claims.ratingInfo',
      true,
    );

    setup({
      isEnhanced: true,
      customMockUser: mockUserWithRating,
    });

    // check disability rating
    cy.findByTestId('disabilityRatingField')
      .contains('90% service connected')
      .should('exist');

    findVaLinkByText('Learn more about VA disability ratings').should('exist');
    findVaLinkByText(
      'Learn more about the PACT Act and eligibility updates based on toxic exposure',
    ).should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should render an error component when rating_info returns an error', () => {
    const mockUserWithRating = set(
      mockUser,
      'data.attributes.profile.claims.ratingInfo',
      true,
    );

    setup({
      isEnhanced: true,
      customMockUser: mockUserWithRating,
      disabilityRatingMockResponse: {
        statusCode: 500,
        body: error500,
      },
    });

    // check that failure alert is shown
    cy.findByText(
      `We’re sorry. Something went wrong on our end and we can’t load your disability rating information. Please try again later.`,
    ).should('exist');

    findVaLinkByText('Learn more about VA disability ratings').should('exist');
    findVaLinkByText(
      'Learn more about the PACT Act and eligibility updates based on toxic exposure',
    ).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
