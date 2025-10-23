import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import noChangesTransaction from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';

import set from 'lodash/set';
import { generateFeatureToggles } from '~/applications/personalization/profile/mocks/endpoints/feature-toggles';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { createAddressValidationResponse } from './addressValidation';
import { createUserResponse } from './user';

export const setUp = (type, toggles = {}) => {
  const statusCode = type === 'validation-error' ? 400 : 200;

  cy.intercept('POST', '/v0/profile/address_validation', {
    statusCode,
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
    body: generateFeatureToggles(toggles),
  });

  disableFTUXModals();

  cy.login(mockUser);

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  cy.get('va-button[label="Edit Mailing address"]', { timeout: 10000 })
    .shadow()
    .find('button')
    .click({ force: true });
};
