import { PROFILE_PATHS } from '@@profile/constants';

import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import errorTransaction from '@@profile/tests/fixtures/transactions/error-transaction.json';
import set from 'lodash/set';
import personalInfo from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import { createAddressValidationResponse } from '../address-validation/addressValidation';
import { createUserResponse } from '../address-validation/user';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';

export const setupHomeAddressModalBase = type => {
  disableFTUXModals();

  cy.login(mockUser);

  cy.intercept('POST', '/v0/profile/address_validation', {
    statusCode: 200,
    body: createAddressValidationResponse(type),
  });

  cy.intercept('GET', '/v0/feature_toggles?*', {
    statusCode: 200,
    body: generateFeatureToggles(),
  });

  cy.intercept('GET', '/v0/profile/full_name', {
    statusCode: 200,
    body: fullName,
  });

  cy.intercept('GET', '/v0/profile/personal_information', {
    statusCode: 200,
    body: personalInfo,
  });

  // for when the mailing address is being checked from the home address modal prompt and should succeed saving
  cy.intercept('GET', '/v0/profile/status/willSucceedTest', req => {
    req.reply({
      statusCode: 200,
      body: set(
        finishedTransaction,
        'data.attributes.transactionId',
        'willSucceedTest',
      ),
    });
  });

  // for when the mailing address is being checked from the home address modal prompt and should fail saving
  cy.intercept('GET', '/v0/profile/status/willErrorTest', req => {
    req.reply({
      statusCode: 200,
      body: set(
        errorTransaction,
        'data.attributes.transactionId',
        'willErrorTest',
      ),
    });
  });

  // for when home address status is initially being checked
  cy.intercept(
    'GET',
    '/v0/profile/status/bfedd909-9dc4-4b27-abc2-a6cccaece35d',
    req => {
      req.reply({
        statusCode: 200,
        body: finishedTransaction,
      });
    },
  );

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: createUserResponse(type),
  });

  cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);

  cy.findByRole('button', { name: /edit home address/i }).click({
    force: true,
  });
};

export const setupHomeAddressModalUpdateFailure = type => {
  setupHomeAddressModalBase(type);
  cy.intercept('PUT', '/v0/profile/addresses', req => {
    const {
      data: {
        attributes: {
          vet360ContactInformation: { mailingAddress, residentialAddress },
        },
      },
    } = mockUser;

    if (req.body.addressPou === mailingAddress.addressPou) {
      req.body.id = residentialAddress.id;
    }

    // would create an error if the update was sent for updating
    // the mailing address, but using the id of the home address aka id mismatch
    if (
      req.body.addressPou === mailingAddress.addressPou &&
      req.body.id === residentialAddress.id
    ) {
      req.reply(
        set(
          receivedTransaction,
          'data.attributes.transactionId',
          'willErrorTest',
        ),
      );
      return;
    }

    // for when home address is initially being updated
    req.reply({ status: 200, body: receivedTransaction });
  });
};

export const setupHomeAddressModalUpdateSuccess = type => {
  setupHomeAddressModalBase(type);
  cy.intercept('PUT', '/v0/profile/addresses', req => {
    const {
      data: {
        attributes: {
          vet360ContactInformation: { mailingAddress, residentialAddress },
        },
      },
    } = mockUser;

    // would create an error if the update was sent for updating
    // the mailing address, but using the id of the home address aka id mismatch
    if (
      req.body.addressPou === mailingAddress.addressPou &&
      req.body.id === residentialAddress.id
    ) {
      req.reply(
        set(
          receivedTransaction,
          'data.attributes.transactionId',
          'willErrorTest',
        ),
      );
      return;
    }

    // for when the mailing address is being updated from the home address modal prompt
    if (req.body.addressPou === mailingAddress.addressPou) {
      req.reply({
        status: 200,
        body: set(
          receivedTransaction,
          'data.attributes.transactionId',
          'willSucceedTest',
        ),
      });
      return;
    }

    // for when home address is initially being updated
    req.reply({ status: 200, body: receivedTransaction });
  });
};
