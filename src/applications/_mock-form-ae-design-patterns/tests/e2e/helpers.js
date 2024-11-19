import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';
import { prefill } from '../../mocks/endpoints/in-progress-forms/mock-form-ae-design-patterns';
import {
  loa3User,
  loa3UserWithUpdatedHomePhoneTimeStamp,
} from '../../mocks/endpoints/user';

export const mockInterceptors = () => {
  cy.login(loa3User);
  cy.intercept(
    'GET',
    '/v0/user?now=*',
    loa3UserWithUpdatedHomePhoneTimeStamp,
  ).as('mockUserUpdated');
  cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles()).as(
    'mockFeatureToggles',
  );

  cy.intercept('/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS', {
    statusCode: 200,
    body: prefill,
  }).as('mockSip');

  cy.intercept('GET', '/v0/profile/status/*', req => {
    // Extract the ID from the URL params
    const id = req.url.split('/').pop();

    req.reply({
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'async_transaction_va_profile_mock_transactions',
          attributes: {
            transactionId: id,
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::MockTransaction',
            metadata: [],
          },
        },
      },
    });
  }).as('getStatus');

  cy.intercept('GET', '/v0/profile/status', { statusCode: 200, body: [] }).as(
    'getInitialStatus',
  );
};
