import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import { DEFAULT_ERROR_MESSAGE } from 'platform/user/profile/vap-svc/constants';

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

// helper function that enters the `Edit contact email address` view and clicks on the `Remove` and `Confirm` buttons
function deleteEmailAddress() {
  // delete
  view
    .getByLabelText(/remove contact email address/i, { selector: 'button' })
    .click();
  const confirmDeleteButton = view.getByText('Yes, remove my information', {
    selector: 'button',
  });
  const cancelDeleteButton = view.getByText('No, cancel this change', {
    selector: 'button',
  });
  confirmDeleteButton.click();

  return { confirmDeleteButton, cancelDeleteButton };
}

describe('Deleting email address', () => {
  const userNameRegex = /alongusername/;
  before(() => {
    server = setupServer(...mocks.deleteEmailAddressSuccess);
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

  it('should handle a deletion that succeeds quickly', async () => {
    server.use(...mocks.transactionPending);
    const { confirmDeleteButton } = deleteEmailAddress();

    // Button should be disabled while the delete transaction is pending...
    // Waiting 10ms to make this check so that it happens _after_ the initial
    // delete transaction request is created. We had a UX bug where the buttons
    // were disabled while the initial transaction request was being created but
    // were enabled again while polling the transaction status. This test was
    // added to prevent regressing back to that poor experience where users were
    // able to interact with buttons that created duplicate XHRs.
    await wait(10);
    expect(!!confirmDeleteButton.attributes.disabled).to.be.true;
    expect(confirmDeleteButton)
      .to.have.descendant('i')
      .and.have.class('fa-spinner');
    // wait for the modal to exit
    await waitForElementToBeRemoved(confirmDeleteButton);

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your contact email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionSucceeded);

    await waitForElementToBeRemoved(deletingMessage);
    // shouldn't the above actually wait for this element to be removed?
    // await wait(13);

    // the edit email button should still exist
    view.getByRole('button', { name: /edit.*email address/i });
    // and the email address should not exist
    expect(view.queryByText(userNameRegex)).not.to.exist;
    // and the add email text should exist
    view.getByText(/add.*email address/i);
  });
  it('should handle a deletion that does not succeed until after the delete modal exits', async () => {
    server.use(...mocks.transactionPending);
    const { confirmDeleteButton } = deleteEmailAddress();

    // wait for the modal to exit
    await waitForElementToBeRemoved(confirmDeleteButton);

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your contact email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionSucceeded);

    await waitForElementToBeRemoved(deletingMessage);

    // the edit email button should still exist
    view.getByRole('button', { name: /edit.*email address/i });
    // and the email address should not exist
    expect(view.queryByText(userNameRegex)).not.to.exist;
    // and the add email text should exist
    view.getByText(/add.*email address/i);
  });
  it('should show an error if the transaction cannot be created', async () => {
    server.use(...mocks.createTransactionFailure);

    deleteEmailAddress();

    // expect an error to be shown
    const alert = await view.findByTestId('delete-error-alert');
    expect(alert).to.contain.text(DEFAULT_ERROR_MESSAGE);
  });
  it('should show an error if the deletion fails quickly', async () => {
    server.use(...mocks.transactionPending);

    const { confirmDeleteButton } = deleteEmailAddress();

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
  });
  it('should show an error if the deletion fails after the delete modal exits', async () => {
    server.use(...mocks.transactionPending);

    const { confirmDeleteButton } = deleteEmailAddress();

    // wait for the delete modal to exit and the new address to show up
    await waitForElementToBeRemoved(confirmDeleteButton);

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your contact email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionFailed);

    await waitForElementToBeRemoved(deletingMessage);

    // make sure the error message appears
    expect(
      view.getByText(
        /We couldn’t save your recent contact email address update. Please try again later/i,
      ),
    ).to.exist;

    // and the email address should still exist
    expect(view.getByText(userNameRegex)).to.exist;
    // and the edit email button should be back
    expect(getEditButton()).to.exist;
  });
});
