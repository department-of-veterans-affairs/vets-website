import { setup } from '@@profile/tests/e2e/personal-information/setup';
import { userPersonalInfoFailure } from '../../../mocks/personal-information';

describe('Loading errors present when viewing personal information page', () => {
  it('should render alert for api error response', () => {
    setup({ personalInfo: userPersonalInfoFailure });

    cy.injectAxeThenAxeCheck();

    cy.findByText(/We can’t load your personal information/i).should('exist');
  });
});
