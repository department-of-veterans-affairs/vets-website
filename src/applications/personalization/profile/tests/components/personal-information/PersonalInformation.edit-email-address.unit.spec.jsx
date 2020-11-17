import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '@@profile/msw-mocks';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
  wait,
} from '../../unit-test-helpers';
import { beforeEach } from 'mocha';

const errorText =
  'We’re sorry. We couldn’t update your email address. Please try again.';
const newEmailAddress = 'new-address@domain.com';
const ui = (
  <MemoryRouter>
    <PersonalInformation />
  </MemoryRouter>
);
let view;
let server;

function getEditButton() {
  let editButton = view.queryByText(/add.*email address/i, {
    selector: 'button',
  });
  if (!editButton) {
    // Need to use `queryByRole` since the visible label is simply `Edit`, but
    // the aria-label is more descriptive
    editButton = view.queryByRole('button', { name: /edit.*email address/i });
  }
  return editButton;
}

// helper function that enters the `Edit email address` view, enters an
// address, and clicks the `Update` button.
function editEmailAddress() {
  const editButton = getEditButton();
  editButton.click();

  const emailAddressInput = view.getByLabelText(/email address/i);
  expect(emailAddressInput).to.exist;

  // enter a new email address in the form
  user.clear(emailAddressInput);
  user.type(emailAddressInput, newEmailAddress);

  // save
  view.getByText('Update', { selector: 'button' }).click();

  return { emailAddressInput };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess() {
  server.use(...mocks.transactionSucceeded);

  const { emailAddressInput } = editEmailAddress();

  // wait for the edit mode to exit and the new address to show up
  await waitForElementToBeRemoved(emailAddressInput);

  // the edit email button should exist
  expect(view.getByRole('button', { name: /edit.*email address/i })).to.exist;
  // and the new email address should exist in the DOM
  expect(view.getByText(newEmailAddress)).to.exist;
  // and the add email button should be gone
  expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not.to
    .exist;
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess() {
  server.use(...mocks.transactionPending);

  const { emailAddressInput } = editEmailAddress();

  // wait for the edit mode to exit and the new address to show up
  await waitForElementToBeRemoved(emailAddressInput);

  // check that the "we're saving your..." message appears
  const savingMessage = await view.findByText(
    /We’re working on saving your new email address. We’ll show it here once it’s saved./i,
  );
  expect(savingMessage).to.exist;

  server.use(...mocks.transactionSucceeded);

  await waitForElementToBeRemoved(savingMessage);

  // the edit email button should exist
  expect(
    view.getByRole('button', {
      name: /edit.*email address/i,
    }),
  ).to.exist;
  // and the new email address should exist in the DOM
  expect(view.getByText(newEmailAddress)).to.exist;
  // and the add email button should be gone
  expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not.to
    .exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails() {
  server.use(...mocks.createTransactionFailure);

  editEmailAddress();

  // expect an error to be shown
  const error = await view.findByText(errorText);
  expect(error).to.exist;

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByText(errorText)).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure() {
  server.use(...mocks.transactionFailed);

  editEmailAddress();

  // expect an error to be shown
  const error = await view.findByText(errorText);
  expect(error).to.exist;

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByText(errorText)).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowFailure() {
  server.use(...mocks.transactionPending);

  const { emailAddressInput } = editEmailAddress();

  // wait for the edit mode to exit and the new address to show up
  await waitForElementToBeRemoved(emailAddressInput);

  // check that the "we're saving your..." message appears
  const savingMessage = await view.findByText(
    /We’re working on saving your new email address. We’ll show it here once it’s saved./i,
  );
  expect(savingMessage).to.exist;

  server.use(...mocks.transactionFailed);

  await waitForElementToBeRemoved(savingMessage);

  // make sure the error message appears
  expect(
    view.getByText(
      /We couldn’t save your recent email address update. Please try again later/i,
    ),
  ).to.exist;

  // and the new email address should not exist in the DOM
  expect(view.queryByText(newEmailAddress)).not.to.exist;
  // and the add/edit email button should be back
  expect(getEditButton()).to.exist;
}

describe('Editing email address', () => {
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.editEmailAddressSuccess());
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 1 };
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  describe('when an address does not exist yet', () => {
    beforeEach(() => {
      const initialState = createBasicInitialState();
      initialState.user.profile.vapContactInfo.email = null;

      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });

    it('should handle a transaction that succeeds quickly', async () => {
      await testQuickSuccess();
    });
    it('should handle a transaction that does not succeed until after the edit view exits', async () => {
      await testSlowSuccess();
    });
    it('should show an error and not auto-exit edit mode if the transaction cannot be created', async () => {
      await testTransactionCreationFails();
    });
    it('should show an error and not auto-exit edit mode if the transaction fails quickly', async () => {
      await testQuickFailure();
    });
    it('should show an error if the transaction fails after the edit view exits', async () => {
      await testSlowFailure();
    });
  });

  describe('when an address already exists', () => {
    beforeEach(() => {
      const initialState = createBasicInitialState();

      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });

    it('should handle a transaction that succeeds quickly', async () => {
      await testQuickSuccess();
    });
    it('should handle a transaction that does not succeed until after the edit view exits', async () => {
      await testSlowSuccess();
    });
    it('should show an error and not auto-exit edit mode if the transaction cannot be created', async () => {
      await testTransactionCreationFails();
    });
    it('should show an error and not auto-exit edit mode if the transaction fails quickly', async () => {
      await testQuickFailure();
    });
    it('should show an error if the transaction fails after the edit view exits', async () => {
      await testSlowFailure();
    });
  });
});
