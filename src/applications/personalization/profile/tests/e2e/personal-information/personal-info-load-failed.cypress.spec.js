import { setup } from '@@profile/tests/e2e/personal-information/setup';
import { userPersonalInfoFailure } from 'applications/personalization/profile/mocks/endpoints/personal-information';
import error403 from '../../fixtures/403.json';

describe('Loading errors present when viewing personal information page', () => {
  it('should render alert for personal_information api error response', () => {
    setup({ personalInfo: userPersonalInfoFailure });

    cy.injectAxeThenAxeCheck();

    cy.findByTestId('service-is-down-banner').should('exist');
  });

  it('should render alerts for legal name and disability rating fields', () => {
    setup({
      fullNameMockResponse: { statusCode: 403, body: error403 },
      disabilityRatingMockResponse: { statusCode: 403, body: error403 },
    });

    cy.findByText(
      'We’re sorry. Something went wrong on our end and we can’t load your legal name. Please try again later.',
    ).should('exist');

    cy.findByText(
      'We’re sorry. Something went wrong on our end and we can’t load your disability rating information. Please try again later.',
    ).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
