import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { server } from 'platform/testing/unit/mocha-setup';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  FIELD_TITLES,
  FIELD_NAMES,
  DEFAULT_ERROR_MESSAGE,
} from '@@vap-svc/constants';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
  wait,
} from '../../unit-test-helpers';

const ui = (
  <MemoryRouter>
    <ContactInformation />
  </MemoryRouter>
);
let view;

// helper function that returns the Edit va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getEditVaButton(addressName) {
  return view.container.querySelector(`va-button[label="Edit ${addressName}"]`);
}

function updateAddress(addressName) {
  localStorage.setItem('hasSession', 'true');

  userEvent.click(getEditVaButton(addressName));
  const { container } = view;

  const countryDropdown = $('va-select[label="Country"]', container);
  const line1Input = $('va-text-input[label^="Street address"]', container);
  const cityInput = $('va-text-input[label="City"]', container);
  const stateDropdown = $('va-select[label="State or territory"]', container);
  const zipCodeInput = $('va-text-input[label="Zip code"]', container);
  const submitButton = view.getByTestId('save-edit-button');

  // input the address info (can't type into web components using RTL)
  countryDropdown.__events.vaSelect({ target: { value: 'USA' } });
  line1Input.value = '123 main st'; // va-text-input don't have exposed events
  cityInput.value = 'san francisco';
  stateDropdown.__events.vaSelect({ target: { value: 'CA' } });
  zipCodeInput.value = '94105';

  userEvent.click(submitButton);

  // manually submit the form since va-button sets submit="prevent"
  const form = submitButton.closest('form');
  fireEvent.submit(form);

  return { cityInput };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess(addressName) {
  server.use(...mocks.transactionSucceeded);

  const { cityInput } = updateAddress(addressName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

  // confirm that the new address appears
  expect(view.getAllByText(/123 Main St/i).length).to.equal(2);
  expect(view.getAllByText(/San Francisco, CA 94105/i).length).to.equal(2);

  // and the edit address button should exist
  expect(getEditVaButton(addressName)).to.exist;
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { cityInput } = updateAddress(addressName);

  // assert the save va-button is in a loading state
  const saveButton = view.getByTestId('save-edit-button');
  expect(saveButton).to.have.attribute('loading', 'true');

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionSucceeded);

  // update saved alert should appear
  await view.findByTestId('update-success-alert');

  // confirm that the new address appears
  expect(view.getAllByText(/123 Main St/i).length).to.equal(2);
  expect(view.getAllByText(/San Francisco, CA 94105/i).length).to.equal(2);

  // and the edit address button should exist
  expect(getEditVaButton(addressName)).to.exist;
}

async function testAddressValidation500(addressName) {
  server.use(...mocks.validateAddressFailure);

  updateAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('vap-service-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('vap-service-error-alert')).to.exist;
  expect(getEditVaButton(addressName)).to.not.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(addressName) {
  server.use(...mocks.createTransactionFailure);

  updateAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('vap-service-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('vap-service-error-alert')).to.exist;
  expect(getEditVaButton(addressName)).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure(addressName) {
  server.use(...mocks.transactionFailed);

  updateAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('vap-service-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('vap-service-error-alert')).to.exist;
  expect(getEditVaButton(addressName)).to.not.exist;
}

// When the update fails but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowFailure(addressName) {
  server.use(...mocks.transactionPending);

  const { cityInput } = updateAddress(addressName);

  // assert the save va-button is in a loading state
  const saveButton = view.getByTestId('save-edit-button');
  expect(saveButton).to.have.attribute('loading', 'true');

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionFailed);

  // the error alert should appear
  await view.findByTestId('vap-service-error-alert');

  // and the edit button should be back
  expect(getEditVaButton(addressName)).to.exist;
}

describe('Updating', () => {
  beforeEach(() => {
    server.use(
      ...mocks.editAddressSuccess,
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    window.VetsGov = { pollTimeout: 1 };
    const initialState = createBasicInitialState();

    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });

  // the list of address fields that we need to test
  const addresses = [
    FIELD_NAMES.MAILING_ADDRESS,
    FIELD_NAMES.RESIDENTIAL_ADDRESS,
  ];

  addresses.forEach(address => {
    const addressName = FIELD_TITLES[address];
    describe(`${addressName} when the entered address passes address validation`, () => {
      it('should handle a transaction that succeeds quickly', async () => {
        await testQuickSuccess(addressName);
      });
      it('should handle a transaction that does not succeed until after the edit view exits', async () => {
        await testSlowSuccess(addressName);
      });
      it('should show an error and not auto-exit edit mode if the address validation API errors', async () => {
        await testAddressValidation500(addressName);
      });
      it('should show an error and not auto-exit edit mode if the transaction cannot be created', async () => {
        await testTransactionCreationFails(addressName);
      });
      it.skip('should show an error and not auto-exit edit mode if the transaction fails quickly', async () => {
        await testQuickFailure(addressName);
      });
      it('should show an error if the transaction fails after the edit view exits', async () => {
        await testSlowFailure(addressName);
      });
    });
  });
});
