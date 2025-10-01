import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'platform/testing/unit/msw-adapter';

import { DEFAULT_ERROR_MESSAGE } from '@@vap-svc/constants';

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

// helper function that returns the va-button for Edit or Remove actions
// since RTL doesn't support getByRole/getByText queries for web components
function getEmailVaButton(action) {
  return view.container.querySelector(
    `va-button[label="${action} Contact email address"]`,
  );
}

// helper function that enters the `Edit contact email address` view and clicks on the `Remove` and `Confirm` buttons
function deleteEmailAddress() {
  // delete
  getEmailVaButton('Remove').click();

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

    server.use(...mocks.transactionSucceeded);
    await wait(100);

    // update saved alert should appear
    await view.findByText('Update saved.');

    // the edit email button should still exist
    expect(getEmailVaButton('Edit')).to.exist;
    // and the email address should not exist
    expect(view.queryByText(userNameRegex)).not.to.exist;
  });

  it('should handle a deletion succeeds after some time', async () => {
    server.use(...mocks.transactionPending);
    const { confirmDeleteButton } = deleteEmailAddress();

    // wait for the confirm removal modal to close
    await waitForElementToBeRemoved(confirmDeleteButton);
    await wait(100);

    // assert the va-loading-indicator is shown
    const loadingIndicator = view.container.querySelector(
      'va-loading-indicator',
    );
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator).to.have.attribute(
      'message',
      'Updating your information...',
    );

    server.use(...mocks.transactionSucceeded);
    await wait(100);

    // update saved alert should appear
    await view.findByText('Update saved.');

    // the edit email button should still exist
    expect(getEmailVaButton('Edit')).to.exist;
    // and the email address should not exist
    expect(view.queryByText(userNameRegex)).not.to.exist;
  });

  it('should show an error if the transaction cannot be created', async () => {
    server.use(...mocks.createTransactionFailure);
    deleteEmailAddress();

    // assert the error alert appears
    await wait(100);
    const error = await view.findByText(DEFAULT_ERROR_MESSAGE);
    expect(error).to.exist;
  });

  it('should show an error if the deletion fails quickly', async () => {
    server.use(...mocks.transactionPending);
    deleteEmailAddress();

    server.use(...mocks.transactionFailed);

    // assert the error alert appears
    await wait(100);
    const error = await view.findByText(DEFAULT_ERROR_MESSAGE);
    expect(error).to.exist;
  });
});
