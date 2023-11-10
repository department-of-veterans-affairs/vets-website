import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import noChangesTransaction from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';

import set from 'lodash/set';
import { createAddressValidationResponse } from './addressValidation';
import { createUserResponse } from './user';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { generateFeatureToggles } from '~/applications/personalization/profile/mocks/endpoints/feature-toggles';

export const setUp = type => {
  cy.intercept('POST', '/v0/profile/address_validation', {
    statusCode: 200,
    body: createAddressValidationResponse(type),
  });

  cy.intercept('PUT', '/v0/profile/addresses', req => {
    const response =
      type === 'no-change'
        ? noChangesTransaction
        : set(
            receivedTransaction,
            'data.attributes.transactionId',
            `${Date.now()}`,
          );

    req.reply({
      statusCode: 200,
      body: response,
    });
  });

  cy.intercept('GET', '/v0/profile/status/*', req => {
    delete req.headers['if-none-match'];
    const id = req.url.split('/').pop();
    req.reply({
      statusCode: 200,
      body: set(finishedTransaction, 'data.attributes.transactionId', `${id}`),
    });
  }).as('saveAddressStatus');

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: createUserResponse(type),
  }).as('getUser');

  cy.intercept('GET', '/v0/feature_toggles?*', {
    statusCode: 200,
    body: generateFeatureToggles(),
  });

  disableFTUXModals();

  cy.login(mockUser);

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  cy.findByRole('button', { name: /edit mailing address/i }).click({
    force: true,
    timeout: 10000,
  });
};
