import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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

import { beforeEach } from 'mocha';
import {
  createBasicInitialState,
  renderWithProfileReducers,
  wait,
} from '../../unit-test-helpers';

// change this is more types of phone numbers are added
const numberOfPhoneNumbersSupported = 3;

const defaultAreaCode = '415';
const defaultPhoneNumber = '555-0055';
const ui = (
  <MemoryRouter>
    <ContactInformation />
  </MemoryRouter>
);
let view;

// helper function that returns the Edit va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getEditVaButton(numberName) {
  return view.container.querySelector(`va-button[label="Edit ${numberName}"]`);
}

// helper function that enters the `Edit phone number` view, enters a number,
// and clicks the `Save` button.
function editPhoneNumber(
  numberName,
  options = { areaCode: defaultAreaCode, phoneNumber: defaultPhoneNumber },
) {
  getEditVaButton(numberName).click();

  const phoneNumberInput = $(
    `va-text-input[label^="${numberName}"]`,
    view.container,
  );
  const extensionInput = $('va-text-input[label^="Extension"]', view.container);
  expect(phoneNumberInput).to.exist;

  // enter a new phone number in the form
  phoneNumberInput.value = `${options.areaCode} ${options.phoneNumber}`;
  fireEvent.input(phoneNumberInput, { target: {} });

  if (numberName !== FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]) {
    extensionInput.value = '';
    fireEvent.input(extensionInput, { target: {} });
  }

  // save
  view.getByTestId('save-edit-button').click();

  // manually submit the form since va-button sets submit="prevent"
  const form = view.getByTestId('save-edit-button').closest('form');
  fireEvent.submit(form);

  return { phoneNumberInput };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess(numberName) {
  server.use(...mocks.transactionSucceeded);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // the 'edit' button should exist
  expect(getEditVaButton(numberName)).to.exist;

  // and the new number should exist in the DOM
  // TODO: make better assertions for this?
  expect(view.getAllByTestId('phoneNumber').length).to.eql(
    numberOfPhoneNumbersSupported,
  );
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess(numberName) {
  server.use(...mocks.transactionPending);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // assert the save va-button is in a loading state
  const saveButton = view.getByTestId('save-edit-button');
  expect(saveButton).to.have.attribute('loading', 'true');

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionSucceeded);

  // update saved alert should appear
  await view.findByTestId('update-success-alert');

  // the edit button should exist
  expect(getEditVaButton(numberName)).to.exist;

  // and the updated phone numbers should be in the DOM
  // TODO: make better assertions for this?
  expect(view.getAllByTestId('phoneNumber').length).to.eql(
    numberOfPhoneNumbersSupported,
  );
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(numberName) {
  server.use(...mocks.createTransactionFailure);

  editPhoneNumber(numberName);

  // expect an error to be shown
  const alert = await view.findByTestId('vap-service-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('vap-service-error-alert')).to.exist;
  expect(getEditVaButton(numberName)).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure(numberName) {
  server.use(...mocks.transactionFailed);

  editPhoneNumber(numberName);

  // expect an error to be shown
  const alert = await view.findByTestId('vap-service-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('vap-service-error-alert')).to.exist;
  expect(getEditVaButton(numberName)).to.not.exist;
}

// When the update fails but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowFailure(numberName) {
  server.use(...mocks.transactionPending);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // assert the save va-button is in a loading state
  const saveButton = view.getByTestId('save-edit-button');
  expect(saveButton).to.have.attribute('loading', 'true');

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionFailed);

  // the error alert should appear
  await view.findByTestId('vap-service-error-alert');

  // and the edit button should be back
  expect(getEditVaButton(numberName)).to.exist;
}

const testBase = async numberName => {
  describe(numberName, () => {
    it('should handle a transaction that succeeds quickly', async () => {
      await testQuickSuccess(numberName);
    });
    it('should handle a transaction that does not succeed until after the edit view exits', async () => {
      await testSlowSuccess(numberName);
    });
    it('should show an error and not auto-exit edit mode if the transaction cannot be created', async () => {
      await testTransactionCreationFails(numberName);
    });
    it('should show an error and not auto-exit edit mode if the transaction fails quickly', async () => {
      await testQuickFailure(numberName);
    });
    it('should show an error if the transaction fails after the edit view exits', async () => {
      await testSlowFailure(numberName);
    });
  });
};

describe('Editing', () => {
  beforeEach(() => {
    server.use(
      ...mocks.editPhoneNumberSuccess(),
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    window.VetsGov = { pollTimeout: 1 };
    const initialState = createBasicInitialState();

    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });

  testBase(FIELD_TITLES[FIELD_NAMES.HOME_PHONE]);
  testBase(FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]);
  testBase(FIELD_TITLES[FIELD_NAMES.WORK_PHONE]);

  it('validates a phone number that is too short', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678',
    });

    fireEvent.click(await view.findByTestId('save-edit-button'));

    const homePhoneInput = $('va-text-input[label^="Home phone"]');
    expect(homePhoneInput.error).to.contain('This field should be at least 10');
  });

  it('validates a phone number that has letters in the field', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678a',
    });

    fireEvent.click(await view.findByTestId('save-edit-button'));

    const homePhoneInput = $('va-text-input[label^="Home phone"]');
    expect(homePhoneInput.error).to.eq('Enter a 10 digit phone number');
  });
});
