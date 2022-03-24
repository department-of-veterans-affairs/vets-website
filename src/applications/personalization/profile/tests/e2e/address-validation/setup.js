import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import noChangesTransaction from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';
import { createAddressValidationResponse } from './addressValidation';
import { createUserResponse } from './user';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';

export const setUp = type => {
  disableFTUXModals();

  cy.login(mockUser);
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  cy.injectAxe();

  cy.findByRole('button', { name: /edit mailing address/i }).click({
    force: true,
  });

  cy.intercept('POST', '/v0/profile/address_validation', {
    statusCode: 200,
    body: createAddressValidationResponse(type),
  });

  cy.intercept('PUT', '/v0/profile/addresses', {
    statusCode: 200,
    body: type === 'no-change' ? noChangesTransaction : receivedTransaction,
  });

  cy.intercept(
    'GET',
    '/v0/profile/status/bfedd909-9dc4-4b27-abc2-a6cccaece35d',
    {
      statusCode: 200,
      body: finishedTransaction,
    },
  );

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: createUserResponse(type),
  });
};
