import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
import { mockGETEndpoints } from '../helpers';
import DirectDepositPage from './DirectDeposit';

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
      directDeposit.setup({
        featureToggles: generateFeatureToggles({
          profileShowDirectDepositSingleForm: true,
        }),
      });

      directDeposit.confirmDirectDepositIsAvailable();

      // exclusive to new unified page
      cy.findAllByTestId('unified-direct-deposit').should('exist');

      cy.findByRole('heading', { name: 'Direct deposit information' }).should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });

    it('should show legacy direct deposit page when profileShowDirectDepositSingleForm is false', () => {
      directDeposit.setup({
        featureToggles: generateFeatureToggles({
          profileShowDirectDepositSingleForm: false,
        }),
      });

      directDeposit.confirmDirectDepositIsAvailable();

      // exclusive to legacy page
      cy.findAllByTestId('legacy-direct-deposit').should('exist');

      cy.findByRole('heading', { name: 'Direct deposit information' }).should(
        'exist',
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});
