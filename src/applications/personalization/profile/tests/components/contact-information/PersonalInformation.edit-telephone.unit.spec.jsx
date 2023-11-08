import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  fireEvent,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';
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

// the list of number fields that we need to test
const numbers = [
  FIELD_NAMES.HOME_PHONE,
  FIELD_NAMES.MOBILE_PHONE,
  FIELD_NAMES.WORK_PHONE,
];

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

  const phoneNumberInput = view.getByLabelText(
    `${numberName} (U.S. numbers only)`,
    { exact: false },
  );
  const extensionInput = view.getByLabelText('Extension (6 digits maximum)');
  expect(phoneNumberInput).to.exist;

  // enter a new phone number in the form
  user.clear(phoneNumberInput);
  user.type(phoneNumberInput, `${options.areaCode} ${options.phoneNumber}`);
  user.clear(extensionInput);

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
  expect(view.getAllByTestId('phoneNumber').length).to.eql(numbers.length);
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
  expect(view.getAllByTestId('phoneNumber').length).to.eql(numbers.length);
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

describe('Editing', () => {
  before(() => {
    server = setupServer(...mocks.editPhoneNumberSuccess());
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

  numbers.forEach(number => {
    const numberName = FIELD_TITLES[number];
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
  });

  it('validates a phone number that is too short', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678',
    });

    fireEvent.click(await view.findByText(/Save/i));

    const alert = await view.findByRole('alert');
    expect(alert).to.exist;

    within(alert).getByText('This field should be at least 10', {
      exact: false,
    });
  });

  it('validates a phone number that has letters in the field', async () => {
    server.use(...mocks.transactionSucceeded);

    editPhoneNumber(FIELD_TITLES[FIELD_NAMES.HOME_PHONE], {
      areaCode: '231',
      phoneNumber: '45678a',
    });

    fireEvent.click(await view.findByText(/Save/i));

    const alert = await view.findByRole('alert');
    expect(alert).to.exist;

    within(alert).getByText('Enter a 10 digit phone number', {
      exact: false,
    });
  });
});
