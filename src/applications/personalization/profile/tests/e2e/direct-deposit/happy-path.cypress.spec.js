import { mockGETEndpoints } from '../helpers';
import DirectDepositPage from './page-objects/DirectDeposit';

const directDeposit = new DirectDepositPage();

describe('Direct Deposit - Happy Path', () => {
  beforeEach(() => {
    mockGETEndpoints(
      [
        '/v0/disability_compensation_form/rating_info',
        '/v0/user_transition_availabilities',
        'v0/profile/personal_information',
        'v0/profile/service_history',
        'v0/profile/full_name',
      ],
      200,
      {},
    );
  });

  describe('loading page', () => {
    it('should show new unified page when profileShowDirectDepositSingleForm is true', () => {
      directDeposit.setup();

      directDeposit.visitPage();

      directDeposit.confirmDirectDepositInSubnav();

      // exclusive to new unified page
      cy.findAllByTestId('unified-direct-deposit').should('exist');

      cy.findByRole('heading', { name: 'Direct deposit information' }).should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('unified direct deposit page', () => {
    it('should show the direct deposit account information when present and eligible', () => {
      directDeposit.setup();

      directDeposit.visitPage();

      directDeposit.confirmDirectDepositInSubnav();

      cy.findAllByTestId('unified-direct-deposit').should('exist');

      cy.findByRole('heading', { name: 'Direct deposit information' }).should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Gi Bill information', () => {
    const triggerTestId = 'gi-bill-additional-info';
    const descriptionTestId = 'gi-bill-description';
    const linkTestId = 'gi-bill-update-link';
    const linkHref =
      'https://www.va.gov/education/verify-school-enrollment/#for-montgomery-gi-bill-benefit';

    it('should reveal additional info and verify the link functionality', () => {
      directDeposit.setup();

      directDeposit.visitPage();
      // the trigger element is visible and clickable
      cy.get(`[data-testid="${triggerTestId}"]`)
        .should('be.visible')
        .click();

      // the additional information description is visible
      cy.get(`[data-testid="${descriptionTestId}"]`).should('be.visible');

      // the link is visible, has the correct href, and opens the expected URL
      cy.get(`[data-testid="${linkTestId}"]`)
        .should('be.visible')
        .and('have.attr', 'href', linkHref)
        .click();

      cy.url().should('eq', linkHref);

      cy.injectAxeThenAxeCheck();
    });
  });
});
