import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

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
let server;

function getEditButton(numberName) {
  let editButton = view.queryByText(new RegExp(`add.*${numberName}`, 'i'), {
    selector: 'button',
  });
  if (!editButton) {
    // Need to use `queryByRole` since the visible label is simply `Edit`, but
    // the aria-label is more descriptive
    editButton = view.queryByRole('button', {
      name: new RegExp(`edit.*${numberName}`, 'i'),
    });
  }
  return editButton;
}

// helper function that enters the `Edit phone number` view, enters a number,
// and clicks the `Update` button.
function editPhoneNumber(
  numberName,
  options = { areaCode: defaultAreaCode, phoneNumber: defaultPhoneNumber },
) {
  const editButton = getEditButton(numberName);
  editButton.click();

  const phoneNumberInput = $(
    `va-text-input[label^="${numberName}"]`,
    view.container,
  );
  const extensionInput = $('va-text-input[label^="Extension"]', view.container);
  expect(phoneNumberInput).to.exist;

  // enter a new phone number in the form
  phoneNumberInput.value = `${options.areaCode} ${options.phoneNumber}`;
  fireEvent.input(phoneNumberInput, { target: {} });

  extensionInput.value = '';
  fireEvent.input(extensionInput, { target: {} });

  // save
  view.getByText('Save', { selector: 'button' }).click();

  return { phoneNumberInput };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess(numberName) {
  server.use(...mocks.transactionSucceeded);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // the 'edit' button should exist
  expect(
    view.getByRole('button', { name: new RegExp(`edit.*${numberName}`, 'i') }),
  ).to.exist;
  // and the new number should exist in the DOM
  // TODO: make better assertions for this?
  expect(view.getAllByTestId('phoneNumber').length).to.eql(
    numberOfPhoneNumbersSupported,
  );
  // and the 'add' button should be gone
  expect(
    view.queryByText(new RegExp(`new.*${numberName}`, 'i'), {
      selector: 'button',
    }),
  ).not.to.exist;
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess(numberName) {
  server.use(...mocks.transactionPending);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // check that the "we're saving your..." message appears
  const savingMessage = await view.findByText(
    /We’re working on saving your new.*/i,
  );
  expect(savingMessage).to.exist;

  server.use(...mocks.transactionSucceeded);

  await waitForElementToBeRemoved(savingMessage);

  // the edit email button should exist
  expect(
    view.getByRole('button', {
      name: new RegExp(`edit.*${numberName}`, 'i'),
    }),
  ).to.exist;
  // and the updated phone numbers should be in the DOM
  // TODO: make better assertions for this?
  expect(view.getAllByTestId('phoneNumber').length).to.eql(
    numberOfPhoneNumbersSupported,
  );
  // and the 'add' button should be gone
  expect(
    view.queryByText(new RegExp(`new.*${numberName}`, 'i'), {
      selector: 'button',
    }),
  ).not.to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(numberName) {
  server.use(...mocks.createTransactionFailure);

  editPhoneNumber(numberName);

  // expect an error to be shown
  const alert = await view.findByTestId('edit-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('edit-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure(numberName) {
  server.use(...mocks.transactionFailed);

  editPhoneNumber(numberName);

  // expect an error to be shown
  const alert = await view.findByTestId('edit-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('edit-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowFailure(numberName) {
  server.use(...mocks.transactionPending);

  const { phoneNumberInput } = editPhoneNumber(numberName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(phoneNumberInput);

  // check that the "we're saving your..." message appears
  const savingMessage = await view.findByText(
    /We’re working on saving your new.*/i,
  );
  expect(savingMessage).to.exist;

  server.use(...mocks.transactionFailed);

  await waitForElementToBeRemoved(savingMessage);

  // make sure the error message appears
  expect(
    view.getByText(
      /We couldn’t save your recent .* number update. Please try again later/i,
    ),
  ).to.exist;

  // and the add/edit button should be back
  expect(getEditButton(numberName)).to.exist;
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
  before(() => {
    server = setupServer(
      ...mocks.editPhoneNumberSuccess(),
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 1 };
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

  testBase(FIELD_TITLES[FIELD_NAMES.HOME_PHONE]);
  testBase(FIELD_TITLES[FIELD_NAMES.MOBILE_PHONE]);
  testBase(FIELD_TITLES[FIELD_NAMES.WORK_PHONE]);

  it('validates a phone number that is too short', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678',
    });

    fireEvent.click(await view.findByText(/Save/i));

    const homePhoneInput = $('va-text-input[label^="Home phone"]');
    expect(homePhoneInput.error).to.contain('This field should be at least 10');
  });

  it('validates a phone number that has letters in the field', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678a',
    });

    fireEvent.click(await view.findByText(/Save/i));

    const homePhoneInput = $('va-text-input[label^="Home phone"]');
    expect(homePhoneInput.error).to.eq('Enter a 10 digit phone number');
  });
});
