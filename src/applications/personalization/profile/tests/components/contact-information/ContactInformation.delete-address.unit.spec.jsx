import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { expect } from 'chai';
import { server } from 'platform/testing/unit/mocha-setup';

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

// helper function that returns the Edit or Remove va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getVaButton(action, addressName) {
  const label = `${action} ${addressName}`;
  return view.container.querySelector(`va-button[label="${label}"]`);
}

function deleteAddress(addressName) {
  // delete
  getVaButton('Remove', addressName).click();
  const confirmRemoveModal = view.getByTestId('confirm-remove-modal');
  const dummyEvent = new Event('click');
  confirmRemoveModal.__events.primaryButtonClick(dummyEvent);
}

// When the update happens but not until after the delete modal has exited and the
// user returned to the read-only view
async function testSlowSuccess(addressName) {
  server.use(...mocks.transactionPending);

  deleteAddress(addressName);

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
  await view.findByTestId('vap-service-error-alert');

  expect(getVaButton('Edit', addressName)).to.exist;
}

describe('Deleting', () => {
  beforeEach(() => {
    server.use(
      ...mocks.deleteResidentialAddressSuccess,
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    window.VetsGov = { pollTimeout: 5 };
    const initialState = createBasicInitialState();

    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });

  const resAddressName = FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS];
  describe(resAddressName, () => {
    it('should handle a transaction that succeeds', async () => {
      await testSlowSuccess(resAddressName);
    });
    it('should show an error if the transaction cannot be created', async () => {
      await testTransactionCreationFails(resAddressName);
    });
  });

  it('should not be supported for mailing address', () => {
    const addressName = FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS];
    getVaButton('Edit', addressName).click();

    expect(getVaButton('Remove', addressName)).to.not.exist;
  });
});
