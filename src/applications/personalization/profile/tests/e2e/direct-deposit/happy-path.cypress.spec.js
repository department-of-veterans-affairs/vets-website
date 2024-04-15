import { generateFeatureToggles } from '@@profile/mocks/endpoints/feature-toggles';
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

    it('should show legacy direct deposit page when profileShowDirectDepositSingleForm is false', () => {
      directDeposit.setup({
        featureToggles: generateFeatureToggles(),
      });

      directDeposit.visitPage();

      directDeposit.confirmDirectDepositInSubnav();

      // exclusive to legacy page
      cy.findAllByTestId('legacy-direct-deposit').should('exist');

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
});
