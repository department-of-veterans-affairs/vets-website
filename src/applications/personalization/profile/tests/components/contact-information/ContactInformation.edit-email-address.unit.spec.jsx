import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import { beforeEach } from 'mocha';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DEFAULT_ERROR_MESSAGE } from '~/platform/user/profile/vap-svc/constants';
import {
  createBasicInitialState,
  renderWithProfileReducers,
  wait,
} from '../../unit-test-helpers';

const newUserName = 'newemailaddress';
const newEmailAddress = `${newUserName}@domain.com`;
const ui = (
  <MemoryRouter>
    <ContactInformation />
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

  const emailAddressInput = $('va-text-input[label^="Email"]', view.container);
  expect(emailAddressInput).to.exist;

  // enter a new email address in the form
  emailAddressInput.value = newEmailAddress;
  fireEvent.input(emailAddressInput, { target: {} });

  // save
  view.getByTestId('save-edit-button').click();

  return { emailAddressInput };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess() {
  server.use(...mocks.transactionSucceeded);

  const { emailAddressInput } = await editEmailAddress();

  // wait for the edit mode to exit and the new address to show up
  await waitForElementToBeRemoved(emailAddressInput);

  // the edit email button should exist
  expect(view.getByRole('button', { name: /edit.*email address/i })).to.exist;
  // and the new email address should exist in the DOM
  expect(view.container.textContent).to.contain(newEmailAddress);
  // and the add email button should be gone
  expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not.to
    .exist;
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess() {
  server.use(...mocks.transactionPending);

  const { emailAddressInput } = await editEmailAddress();

  // wait for the edit mode to exit and the new address to show up
  await waitForElementToBeRemoved(emailAddressInput);

  // check that the "we're saving your..." message appears
  const savingMessage = await view.findByText(
    /We’re working on saving your new contact email address. We’ll show it here once it’s saved./i,
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
  expect(view.container.textContent).to.contain(newEmailAddress);
  // and the add email button should be gone
  expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not.to
    .exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails() {
  server.use(...mocks.createTransactionFailure);

  editEmailAddress();

  // expect an error to be shown
  const error = await view.findByText(DEFAULT_ERROR_MESSAGE);
  expect(error).to.exist;

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByText(DEFAULT_ERROR_MESSAGE)).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure() {
  server.use(...mocks.transactionFailed);

  editEmailAddress();

  // expect an error to be shown
  const error = await view.findByText(DEFAULT_ERROR_MESSAGE);
  expect(error).to.exist;

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByText(DEFAULT_ERROR_MESSAGE)).to.exist;
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
    /We’re working on saving your new contact email address. We’ll show it here once it’s saved./i,
  );
  expect(savingMessage).to.exist;

  server.use(...mocks.transactionFailed);

  await waitForElementToBeRemoved(savingMessage);

  // make sure the error message appears
  expect(
    view.getByText(
      /We couldn’t save your recent contact email address update. Please try again later/i,
    ),
  ).to.exist;

  // and the new email address should not exist in the DOM
  expect(view.container.textContent).to.not.contain(newEmailAddress);
  // and the add/edit email button should be back
  expect(getEditButton()).to.exist;
}

describe('Editing email address', () => {
  before(() => {
    server = setupServer(
      ...mocks.editEmailAddressSuccess(),
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
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
