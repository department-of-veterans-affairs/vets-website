import { PROFILE_PATHS } from '@@profile/constants';
import { createUserResponse } from './user';
import { createAddressValidationResponse } from './addressValidation';

import mockUser from 'applications/personalization/profile/tests/fixtures/users/user-36.json';
import receivedTransaction from 'applications/personalization/profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from 'applications/personalization/profile/tests/fixtures/transactions/finished-transaction.json';

export const setUp = type => {
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro']),
  );

  cy.login(mockUser);
  cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
  cy.injectAxe();

  cy.findByRole('button', { name: /edit mailing address/i }).click();

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
    response: receivedTransaction,
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
