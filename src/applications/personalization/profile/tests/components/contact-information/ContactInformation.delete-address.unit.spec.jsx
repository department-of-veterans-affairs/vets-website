import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';

import { expect } from 'chai';
import { setupServer } from 'platform/testing/unit/msw-adapter';

import { FIELD_TITLES, FIELD_NAMES } from '@@vap-svc/constants';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

const ui = (
  <MemoryRouter>
    <ContactInformation />
  </MemoryRouter>
);
let view;
let server;

// helper function that returns the Edit or Remove va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getVaButton(action, addressName) {
  const label = `${action} ${addressName}`;
  return view.container.querySelector(`va-button[label="${label}"]`);
}

function deleteAddress(addressName) {
  // delete
  getVaButton('Remove', addressName).click();
  const confirmDeleteButton = view.getByTestId('confirm-remove-button');
  confirmDeleteButton.click();

  return { confirmDeleteButton };
}

// When the update happens but not until after the delete modal has exited and the
// user returned to the read-only view
async function testSlowSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // wait for the confirm removal modal to close
  await waitForElementToBeRemoved(confirmDeleteButton);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionSucceeded);

  // update saved alert should appear
  await view.findByTestId('update-success-alert');

  // the edit button should exist
  expect(getVaButton('Edit', addressName)).to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(addressName) {
  server.use(...mocks.createTransactionFailure);
  deleteAddress(addressName);

  // the error alert should appear
  await view.findByTestId('generic-error-alert');

  expect(getVaButton('Edit', addressName)).to.exist;
}

// When the update fails but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowFailure(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // wait for the confirm removal modal to close
  await waitForElementToBeRemoved(confirmDeleteButton);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionFailed);

  // the error alert should appear
  await view.findByTestId('generic-error-alert');

  // and the edit button should be back
  expect(getVaButton('Edit', addressName)).to.exist;
}

describe('Deleting', () => {
  before(() => {
    server = setupServer(
      ...mocks.deleteResidentialAddressSuccess,
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 5 };
    const initialState = createBasicInitialState();

    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  const resAddressName = FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS];
  describe(resAddressName, () => {
    it('should handle a transaction that succeeds', async () => {
      await testSlowSuccess(resAddressName);
    });
    it('should show an error if the transaction cannot be created', async () => {
      await testTransactionCreationFails(resAddressName);
    });
    it('should show an error if the transaction fails after some time', async () => {
      await testSlowFailure(resAddressName);
    });
  });

  it('should not be supported for mailing address', () => {
    const addressName = FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS];
    getVaButton('Edit', addressName).click();

    expect(getVaButton('Remove', addressName)).to.not.exist;
  });
});
