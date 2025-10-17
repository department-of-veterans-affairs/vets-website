import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'platform/testing/unit/msw-adapter';

import { FIELD_TITLES, FIELD_NAMES } from '@@vap-svc/constants';

import * as mocks from '@@profile/msw-mocks';
import ContactInformation from '@@profile/components/contact-information/ContactInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

const ui = (
  <MemoryRouter>
    <ContactInformation />
  </MemoryRouter>
);
let view;
let server;

// helper function that returns the Edit or Remove va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getVaButton(action, numberName) {
  const label = `${action} ${numberName}`;
  return view.container.querySelector(`va-button[label="${label}"]`);
}

function deletePhoneNumber(numberName) {
  // delete
  getVaButton('Remove', numberName).click();
  const confirmDeleteButton = view.getByTestId('confirm-remove-button');
  confirmDeleteButton.click();

  return { confirmDeleteButton };
}

async function testSuccess(numberName, shortNumberName) {
  server.use(...mocks.transactionPending);

  deletePhoneNumber(numberName);

  server.use(...mocks.transactionSucceeded);

  // update saved alert should appear
  await view.findByTestId('update-success-alert');

  // the edit phone number button should still exist
  expect(getVaButton('Edit', numberName)).to.exist;
  // and the add phone number text should exist
  expect(view.getByText(new RegExp(`add.*${shortNumberName}`, 'i'))).to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(numberName) {
  server.use(...mocks.createTransactionFailure);

  deletePhoneNumber(numberName);

  // the error alert should appear
  await view.findByTestId('generic-error-alert');

  expect(getVaButton('Edit', numberName)).to.exist;
}

// When the update fails but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowFailure(numberName) {
  server.use(...mocks.transactionPending);

  const { confirmDeleteButton } = deletePhoneNumber(numberName);

  // wait for the confirm removal modal to close
  await waitForElementToBeRemoved(confirmDeleteButton);

  // the va-loading-indicator should display
  await view.findByTestId('loading-indicator');

  server.use(...mocks.transactionFailed);

  // the error alert should appear
  await view.findByTestId('generic-error-alert');

  // and the add/edit button should be back
  expect(getVaButton('Edit', numberName)).to.exist;
}

describe('Deleting', () => {
  before(() => {
    server = setupServer(
      ...mocks.deletePhoneNumberSuccess(),
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 5 };
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
    const numberName = FIELD_TITLES[number]; // e.g. 'Home phone number'
    // The short name is used in the add phone number text,
    // e.g. 'Click edit to add a home number.'
    const shortNumberName = numberName.replace(/ phone/i, ''); // e.g. 'Home number'
    describe(numberName, () => {
      it('should handle a transaction that succeeds quickly', async () => {
        await testSuccess(numberName, shortNumberName);
      });
      it('should show an error if the transaction cannot be created', async () => {
        await testTransactionCreationFails(numberName);
      });
      it('should show an error if the transaction fails after some time', async () => {
        await testSlowFailure(numberName);
      });
    });
  });
});
