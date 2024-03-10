import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

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

function deletePhoneNumber(numberName) {
  // delete
  view
    .getByLabelText(new RegExp(`remove ${numberName}`, 'i'), {
      selector: 'button',
    })
    .click();
  const confirmDeleteButton = view.getByText('Yes, remove my information', {
    selector: 'button',
  });
  confirmDeleteButton.click();

  return { confirmDeleteButton };
}

// When the update happens while the Delete Modal is still active
async function testQuickSuccess(numberName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deletePhoneNumber(numberName);

  // Button should be disabled while the delete transaction is pending...
  // Waiting 10ms to make this check so that it happens _after_ the initial
  // delete transaction request is created. We had a UX bug where the button
  // was disabled while the initial transaction request was being created but
  // was enabled again while polling the transaction status. This test was
  // added to prevent regressing back to that poor experience where users were
  // able to interact with buttons that created duplicate XHRs.
  await wait(10);
  expect(view.queryByText('Cancel', { selector: 'button' })).to.not.exist;
  expect(!!confirmDeleteButton.attributes.disabled).to.be.true;
  expect(confirmDeleteButton)
    .to.have.descendant('i')
    .and.have.class('fa-spinner');

  server.use(...mocks.transactionSucceeded);

  // wait for the Delete Modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // the edit phone number button should still exist
  view.getByRole('button', { name: new RegExp(`edit.*${numberName}`, 'i') });
  // and the add phone number text should exist
  view.getByText(new RegExp(`add.*${numberName}`, 'i'));
}

// When the update happens but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowSuccess(numberName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deletePhoneNumber(numberName);

  // wait for the Delete Modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${numberName}. We’ll remove this information soon.`,
      'i',
    ),
  );
  expect(deletingMessage).to.exist;

  server.use(...mocks.transactionSucceeded);

  await waitForElementToBeRemoved(deletingMessage);

  // the edit phone number button should still exist
  view.getByRole('button', { name: new RegExp(`edit.*${numberName}`, 'i') });
  // and the add phone number text should exist
  view.getByText(new RegExp(`add.*${numberName}`, 'i'));
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(numberName) {
  server.use(...mocks.createTransactionFailure);

  deletePhoneNumber(numberName);

  // expect an error to be shown
  const alert = await view.findByTestId('delete-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that Delete Modal is not automatically exited
  await wait(75);
  expect(view.getByTestId('delete-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Delete Modal is still active
async function testQuickFailure(numberName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deletePhoneNumber(numberName);

  // Wait for the transaction to be created before checking the state of the
  // buttons. In the past the buttons worked correctly while making the
  // initial transaction but were re-enabled while the transaction was still
  // pending.
  await wait(10);
  expect(view.queryByText('Cancel', { selector: 'button' })).to.not.exist;
  expect(!!confirmDeleteButton.attributes.disabled).to.be.true;
  expect(confirmDeleteButton)
    .to.have.descendant('i')
    .and.have.class('fa-spinner');

  server.use(...mocks.transactionFailed);

  // expect an error to be shown
  const alert = await view.findByTestId('delete-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // waiting to make sure it doesn't auto exit
  await wait(75);

  // the buttons should be enabled again
  expect(!!confirmDeleteButton.attributes.disabled).to.be.false;
  expect(confirmDeleteButton).to.contain.text('Yes, remove my information');
}

// When the update fails but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowFailure(numberName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deletePhoneNumber(numberName);

  // wait for the Delete Modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${numberName}. We’ll remove this information soon.`,
      'i',
    ),
  );
  expect(deletingMessage).to.exist;

  server.use(...mocks.transactionFailed);

  await waitForElementToBeRemoved(deletingMessage);

  // make sure the error message appears
  expect(
    view.getByText(
      /We couldn’t save your recent .* update. Please try again later/i,
    ),
  ).to.exist;

  // and the add/edit button should be back
  expect(getEditButton(numberName)).to.exist;
}

describe('Deleting', () => {
  before(() => {
    server = setupServer(...mocks.deletePhoneNumberSuccess());
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

  // the list of number fields that we need to test
  const numbers = [
    FIELD_NAMES.HOME_PHONE,
    FIELD_NAMES.MOBILE_PHONE,
    FIELD_NAMES.WORK_PHONE,
  ];

  numbers.forEach(number => {
    const numberName = FIELD_TITLES[number];
    describe(numberName, () => {
      it('should handle a transaction that succeeds quickly', async () => {
        await testQuickSuccess(numberName);
      });
      it('should handle a transaction that does not succeed until after the Delete Modal exits', async () => {
        await testSlowSuccess(numberName);
      });
      it('should show an error and not auto-exit Delete Modal if the transaction cannot be created', async () => {
        await testTransactionCreationFails(numberName);
      });
      it.skip('should show an error and not auto-exit Delete Modal if the transaction fails quickly', async () => {
        await testQuickFailure(numberName);
      });
      it('should show an error if the transaction fails after the Delete Modal exits', async () => {
        await testSlowFailure(numberName);
      });
    });
  });
});
