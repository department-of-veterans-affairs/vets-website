import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockDebts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Diary Codes - Next Steps', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.intercept('GET', '/v0/debts', mockDebts);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
    cy.axeCheck();
    cy.findByText('Continue to VA.gov', { selector: 'button' }).click();
  });

  it('renders a debt card with next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('[data-testid="diary-codes-next-step"]')
      .first()
      .findByText(/Next step:/i)
      .should('exist');
  });

  it('renders debt details with next step', () => {
    cy.findByText(/Current debts/i, { selector: 'a' }).click();
    cy.get('.usa-button')
      .first()
      .click();
    // TODO: test is passing because it finds the default case for next step here
    // https://github.com/department-of-veterans-affairs/vets-website/blob/dbbf4dfdc89a682e62aad01f1773021a28209cdc/src/applications/debt-letters/const/diary-codes/index.js#L783
    // Need to revisit once work is completed on passing debts by id here and renders the correct next step
    // https://app.zenhub.com/workspaces/vsa---debt-607736a6c8b7e2001084e3ab/issues/department-of-veterans-affairs/va.gov-team/27789
    // cy.get('[data-testid="diary-code-080-nextstep"]');
    cy.get('[data-testid="diary-code-default-nextstep"]');
  });
});
