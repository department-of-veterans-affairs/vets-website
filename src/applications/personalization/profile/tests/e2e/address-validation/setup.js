import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { PROFILE_PATHS } from '@@profile/constants';
import { createUserResponse } from './user';
import { createAddressValidationResponse } from './addressValidation';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import noChangesTransaction from '@@profile/tests/fixtures/transactions/no-changes-transaction.json';

export const setUp = type => {
  disableFTUXModals();

  cy.login(mockUser);
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  cy.injectAxe();

  cy.findByRole('button', { name: /edit mailing address/i }).click({
    force: true,
  });

  cy.route({
    method: 'POST',
    url: '/v0/profile/address_validation',
    status: 200,
    response: createAddressValidationResponse(type),
  }).as('validateAddress');

  cy.route({
    method: 'PUT',
    url: '/v0/profile/addresses',
    status: 200,
    response: type === 'no-change' ? noChangesTransaction : receivedTransaction,
  }).as('saveAddress');

  cy.route({
    method: 'GET',
    url: '/v0/profile/status/bfedd909-9dc4-4b27-abc2-a6cccaece35d',
    status: 200,
    response: finishedTransaction,
  }).as('finishedTransaction');

  cy.route({
    method: 'GET',
    url: '/v0/user?*',
    status: 200,
    response: createUserResponse(type),
  }).as('getUser');
};
