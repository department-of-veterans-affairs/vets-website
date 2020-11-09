import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';
import { FIELD_TITLES, FIELD_NAMES } from '@@vap-svc/constants';

import * as mocks from '@@profile/msw-mocks';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
  wait,
} from '../../unit-test-helpers';

const ui = (
  <MemoryRouter>
    <PersonalInformation />
  </MemoryRouter>
);
let view;
let server;

function getEditButton(addressName) {
  let editButton = view.queryByText(new RegExp(`add.*${addressName}`, 'i'), {
    selector: 'button',
  });
  if (!editButton) {
    // Need to use `queryByRole` since the visible label is simply `Edit`, but
    // the aria-label is more descriptive
    editButton = view.queryByRole('button', {
      name: new RegExp(`edit.*${addressName}`, 'i'),
    });
  }
  return editButton;
}

function deleteAddress(addressName) {
  getEditButton(addressName).click();

  const cityInput = view.getByLabelText(/City/);
  expect(cityInput).to.exist;

  // delete
  view
    .getByText(new RegExp(`remove ${addressName}`, 'i'), {
      selector: 'button',
    })
    .click();
  const confirmDeleteButton = view.getByText('Confirm', { selector: 'button' });
  confirmDeleteButton.click();

  return {
    cityInput,
    confirmDeleteButton,
  };
}

// When the update happens while the Edit View is still active
async function testQuickSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton, cityInput } = deleteAddress(addressName);

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

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

  // the edit address button should not exist
  expect(
    view.queryByText(new RegExp(`edit.*${addressName}`, 'i'), {
      selector: 'button',
    }),
  ).not.to.exist;
  // and the add address button should exist
  expect(
    view.getByText(new RegExp(`add.*${addressName}`, 'i'), {
      selector: 'button',
    }),
  ).to.exist;
}

// When the update happens but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowSuccess(addressName) {
  server.use(...mocks.transactionPending);

  const { cityInput } = deleteAddress(addressName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

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

  // the edit phone number button should not exist
  expect(
    view.queryByText(new RegExp(`edit.*${addressName}`, 'i'), {
      selector: 'button',
    }),
  ).not.to.exist;
  // and the add phone number button should exist
  expect(
    view.getByText(new RegExp(`add.*${addressName}`, 'i'), {
      selector: 'button',
    }),
  ).to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(addressName) {
  server.use(...mocks.createTransactionFailure);

  deleteAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('edit-error-alert');
  expect(alert).to.have.descendant('div.usa-alert-error');
  expect(alert).to.contain.text(
    `We’re sorry. We couldn’t update your ${addressName.toLowerCase()}. Please try again.`,
  );

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('edit-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails while the Edit View is still active
async function testQuickFailure(addressName) {
  server.use(...mocks.transactionFailed);

  deleteAddress(addressName);

  // expect an error to be shown
  const alert = await view.findByTestId('edit-error-alert');
  expect(alert).to.have.descendant('div.usa-alert-error');
  expect(alert).to.contain.text(
    `We’re sorry. We couldn’t update your ${addressName.toLowerCase()}. Please try again.`,
  );

  // make sure that edit mode is not automatically exited
  await wait(75);
  expect(view.getByTestId('edit-error-alert')).to.exist;
  const editButton = getEditButton();
  expect(editButton).to.not.exist;
}

// When the update fails but not until after the Edit View has exited and the
// user returned to the read-only view
async function testSlowFailure(addressName) {
  server.use(...mocks.transactionPending);

  const { cityInput } = deleteAddress(addressName);

  // wait for the edit mode to exit
  await waitForElementToBeRemoved(cityInput);

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
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
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
      it('should handle a transaction that does not succeed until after the edit view exits', async () => {
        await testSlowSuccess(addressName);
      });
      it('should show an error and not auto-exit edit mode if the transaction cannot be created', async () => {
        await testTransactionCreationFails(addressName);
      });
      it('should show an error and not auto-exit edit mode if the transaction fails quickly', async () => {
        await testQuickFailure(addressName);
      });
      it('should show an error if the transaction fails after the edit view exits', async () => {
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
