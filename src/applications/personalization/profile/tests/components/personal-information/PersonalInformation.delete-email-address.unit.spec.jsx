import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
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

let emailAddress;

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

// helper function that enters the `Edit email address` view and clicks on the `Remove` and `Confirm` buttons
function deleteEmailAddress() {
  const editButton = getEditButton();
  editButton.click();

  const emailAddressInput = view.getByLabelText(/email address/i);
  expect(emailAddressInput).to.exist;

  // delete
  view.getByText('Remove email address').click();
  const confirmDeleteButton = view.getByText('Confirm', { selector: 'button' });
  const cancelDeleteButton = view.getByText('Cancel', { selector: 'button' });
  confirmDeleteButton.click();

  return { emailAddressInput, confirmDeleteButton, cancelDeleteButton };
}

describe('Deleting email address', () => {
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.deleteEmailAddressSuccess);
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 1 };
    const initialState = createBasicInitialState();
    emailAddress = initialState.user.profile.vapContactInfo.email.emailAddress;

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

  it('should handle a deletion that succeeds quickly', async () => {
    server.use(...mocks.transactionPending);
    const { confirmDeleteButton, emailAddressInput } = deleteEmailAddress();

    // Button should be disabled while the delete transaction is pending...
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

    // wait for the edit mode to exit
    await waitForElementToBeRemoved(emailAddressInput);

    // the edit email button should not exist
    expect(view.queryByRole('button', { name: /edit.*email address/i })).not.to
      .exist;
    // and the email address should not exist
    expect(view.queryByText(emailAddress)).not.to.exist;
    // and the add email button should exist
    expect(view.getByText(/add.*email address/i, { selector: 'button' })).to
      .exist;
  });
  it('should handle a deletion that does not succeed until after the edit view exits', async () => {
    server.use(...mocks.transactionPending);

    const { emailAddressInput } = deleteEmailAddress();

    // wait for the edit mode to exit
    await waitForElementToBeRemoved(emailAddressInput);

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionSucceeded);

    await waitForElementToBeRemoved(deletingMessage);

    // the edit email button should not exist
    expect(view.queryByRole('button', { name: /edit.*email address/i })).not.to
      .exist;
    // and the email address should not exist
    expect(view.queryByText(emailAddress)).not.to.exist;
    // and the add email button should exist
    expect(view.getByText(/add.*email address/i, { selector: 'button' })).to
      .exist;
  });
  it('should show an error and not exit edit mode if the transaction cannot be created', async () => {
    server.use(...mocks.createTransactionFailure);

    deleteEmailAddress();

    // expect an error to be shown
    const alert = await view.findByTestId('edit-error-alert');
    expect(alert).to.have.descendant('div.usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );

    // make sure that edit mode is not automatically exited
    await wait(75);
    expect(view.getByTestId('edit-error-alert')).to.exist;
    const editButton = getEditButton();
    expect(editButton).to.not.exist;
  });
  it('should show an error and not auto-exit edit mode if the deletion fails quickly', async () => {
    server.use(...mocks.transactionPending);

    const { cancelDeleteButton, confirmDeleteButton } = deleteEmailAddress();

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
    const alert = await view.findByTestId('edit-error-alert');
    expect(alert).to.have.descendant('div.usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );

    // the buttons should be enabled again
    expect(cancelDeleteButton).to.be.visible;
    expect(!!confirmDeleteButton.attributes.disabled).to.be.false;
    expect(confirmDeleteButton).to.contain.text('Confirm');

    // make sure that edit mode is not automatically exited
    await wait(75);
    expect(view.getByTestId('edit-error-alert')).to.exist;
    const editButton = getEditButton();
    expect(editButton).to.not.exist;
  });
  it('should show an error if the deletion fails after the edit view exits', async () => {
    server.use(...mocks.transactionPending);

    const { emailAddressInput } = deleteEmailAddress();

    // wait for the edit mode to exit and the new address to show up
    await waitForElementToBeRemoved(emailAddressInput);

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionFailed);

    await waitForElementToBeRemoved(deletingMessage);

    // make sure the error message appears
    expect(
      view.getByText(
        /We couldn’t save your recent email address update. Please try again later/i,
      ),
    ).to.exist;

    // and the email address should still exist
    expect(view.getByText(emailAddress)).to.exist;
    // and the edit email button should be back
    expect(getEditButton()).to.exist;
  });
});
