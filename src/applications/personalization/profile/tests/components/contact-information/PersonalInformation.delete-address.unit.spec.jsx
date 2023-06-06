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

function getEditButton(addressName) {
  // Need to use `queryByRole` since the visible label is simply `Edit`, but
  // the aria-label is more descriptive
  return view.queryByRole('button', {
    name: new RegExp(`edit.*${addressName}`, 'i'),
  });
}

function deleteAddress(addressName) {
  // delete
  view
    .getByLabelText(new RegExp(`remove ${addressName}`, 'i'), {
      selector: 'button',
    })
    .click();
  const confirmDeleteButton = view.getByText('Yes, remove my information', {
    selector: 'button',
  });
  confirmDeleteButton.click();

  return {
    confirmDeleteButton,
  };
}

// When the update happens while the delete modal is still active
async function testQuickSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // Buttons should be disabled while the delete transaction is pending...
  // Waiting 10ms to make this check so that it happens _after_ the initial
  // delete transaction request is created. We had a UX bug where the buttons
  // were disabled while the initial transaction request was being created but
  // were enabled again while polling the transaction status. This test was
  // added to prevent regressing back to that poor experience where users were
  // able to interact with buttons that created duplicate XHRs.
  await wait(10);
  expect(view.queryByText('Cancel', { selector: 'button' })).to.not.exist;
  expect(!!confirmDeleteButton.attributes.disabled).to.be.true;
  expect(confirmDeleteButton)
    .to.have.descendant('i')
    .and.have.class('fa-spinner');

  server.use(...mocks.transactionSucceeded);

  // wait for the delete modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // the edit address button should still exist
  view.getByRole('button', { name: new RegExp(`edit.*${addressName}`, 'i') });
  // and the add text should exist
  view.getByText(new RegExp(`add.*${addressName}`, 'i'));
}

// When the update happens but not until after the delete modal has exited and the
// user returned to the read-only view
async function testSlowSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // wait for the delete modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${addressName}. We’ll remove this information soon.`,
      'i',
    ),
  );
  expect(deletingMessage).to.exist;

  server.use(...mocks.transactionSucceeded);

  await waitForElementToBeRemoved(deletingMessage);

  // the edit button should exist
  view.getByRole('button', { name: new RegExp(`edit.*${addressName}`, 'i') });
  // and the add address text should exist
  expect(view.getByText(new RegExp(`add.*${addressName}`, 'i'))).to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(addressName) {
  server.use(...mocks.createTransactionFailure);

  deleteAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('delete-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // make sure that delete modal is not automatically exited
  await wait(75);
  expect(view.getByTestId('delete-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Delete Modal is still active
async function testQuickFailure(addressName) {
  server.use(...mocks.transactionFailed);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('delete-error-alert');
  expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);

  // waiting to make sure it doesn't auto exit
  await wait(75);
  expect(view.getByTestId('delete-error-alert')).to.exist;
  expect(confirmDeleteButton).to.exist;
}

// When the update fails but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowFailure(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deleteAddress(addressName);

  // wait for the delete modal to exit
  await waitForElementToBeRemoved(confirmDeleteButton);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${addressName}. We’ll remove this information soon.`,
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
  expect(getEditButton(addressName)).to.exist;
}

describe('Deleting', () => {
  before(() => {
    server = setupServer(...mocks.deleteResidentialAddressSuccess);
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

  // the list of address fields that we need to test
  const addresses = [FIELD_NAMES.RESIDENTIAL_ADDRESS];

  addresses.forEach(address => {
    const addressName = FIELD_TITLES[address];
    describe(addressName, () => {
      it('should handle a transaction that succeeds quickly', async () => {
        await testQuickSuccess(addressName);
      });
      it('should handle a transaction that does not succeed until after the delete modal exits', async () => {
        await testSlowSuccess(addressName);
      });
      it('should show an error and not auto-exit delete modal if the transaction cannot be created', async () => {
        await testTransactionCreationFails(addressName);
      });
      it('should show an error and not auto-exit delete modal if the transaction fails quickly', async () => {
        await testQuickFailure(addressName);
      });
      it('should show an error if the transaction fails after the delete modal exits', async () => {
        await testSlowFailure(addressName);
      });
    });
  });
  it('should not be supported for mailing address', () => {
    const addressName = FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS];
    getEditButton(addressName).click();

    expect(
      view.queryByText(new RegExp(`remove ${addressName}`, 'i'), {
        selector: 'button',
      }),
    ).to.not.exist;
  });
});
