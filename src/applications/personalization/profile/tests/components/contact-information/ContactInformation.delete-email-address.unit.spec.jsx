import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

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

// helper function that enters the `Edit contact email address` view and clicks on the `Remove` and `Confirm` buttons
function deleteEmailAddress() {
  // delete
  view
    .getByLabelText(/remove contact email address/i, { selector: 'button' })
    .click();

  const confirmDeleteButton = $(
    'button[aria-label="Yes, remove my information"]',
    view.container,
  );
  const cancelDeleteButton = $(
    'va-button[label="No, cancel this change"]',
    view.container,
  );
  confirmDeleteButton.click();

  return { confirmDeleteButton, cancelDeleteButton };
}

describe('Deleting email address', () => {
  const userNameRegex = /alongusername/;
  before(() => {
    window.VetsGov = { pollTimeout: 5 };
    server = setupServer(
      ...mocks.deleteEmailAddressSuccess,
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

  it('should handle a deletion that succeeds quickly', async () => {
    server.use(...mocks.transactionPending);
    deleteEmailAddress();

    await wait(100);

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
  it('should handle a deletion succeeds after some time', async () => {
    server.use(...mocks.transactionPending);
    deleteEmailAddress();

    // check that the "we're saving your..." message appears
    const deletingMessage = await view.findByText(
      /We’re in the process of deleting your contact email address. We’ll remove this information soon./i,
    );
    expect(deletingMessage).to.exist;

    server.use(...mocks.transactionSucceeded);

    await wait(100);

    // update saved alert should appear
    await view.findByText('Update saved.');

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
    await view.findByText(
      /We couldn’t save your recent contact email address update. Please try again later./i,
      { exact: false },
    );
    expect(alert).to.exist;
  });
  it('should show an error if the deletion fails quickly', async () => {
    server.use(...mocks.transactionPending);

    deleteEmailAddress();

    server.use(...mocks.transactionFailed);

    await wait(1500);

    // expect an error to be shown
    await view.findByText(
      /We couldn’t save your recent contact email address update. Please try again later./i,
      { exact: false },
    );
    expect(alert).to.exist;
  });
});
