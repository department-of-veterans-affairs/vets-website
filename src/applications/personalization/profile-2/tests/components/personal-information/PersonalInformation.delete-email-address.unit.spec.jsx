import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '../../../msw-mocks';
import PersonalInformation from '../../../components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
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

// helper function that enters the `Edit email address` view and clicks on the `Delete` and `Confirm` buttons
function deleteEmailAddress() {
  const editButton = getEditButton();
  editButton.click();

  const emailAddressInput = view.getByLabelText(/email address/i);
  expect(emailAddressInput).to.exist;

  // delete
  view.getByText('Delete', { selector: 'button *' }).click();
  view.getByText('Confirm', { selector: 'button' }).click();

  return { emailAddressInput };
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
    emailAddress = initialState.user.profile.vet360.email.emailAddress;

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
    server.use(...mocks.transactionSucceeded);

    const { emailAddressInput } = deleteEmailAddress();

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
  it('should show an error if the transaction cannot be created', async () => {
    server.use(...mocks.createTransactionFailure);

    deleteEmailAddress();

    // expect an error to be shown
    const alert = await view.findByTestId('edit-error-alert');
    expect(alert).to.have.descendant('div.usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );
  });
  it('should show an error if the deletion fails quickly', async () => {
    server.use(...mocks.transactionFailed);

    deleteEmailAddress();

    // expect an error to be shown
    const alert = await view.findByTestId('edit-error-alert');
    expect(alert).to.have.descendant('div.usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );
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
