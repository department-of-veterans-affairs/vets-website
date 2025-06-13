import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { setupServer } from 'platform/testing/unit/msw-adapter';

import { FIELD_TITLES, FIELD_NAMES } from '@@vap-svc/constants';

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

function getEditVaButton(numberName) {
  const label = `Edit ${numberName}`;
  // RTL doesn't support getByRole/getByText for web components
  return view.container.querySelector(`va-button[label="${label}"]`);
}

function deletePhoneNumber(numberName) {
  // delete
  view.container
    .querySelector(`va-button[label="Remove ${numberName}"]`)
    .click();
  const confirmDeleteButton = view.getByText('Yes, remove my information', {
    selector: 'button',
  });
  confirmDeleteButton.click();

  return { confirmDeleteButton };
}

async function testSuccess(numberName, shortNumberName) {
  server.use(...mocks.transactionPending);

  deletePhoneNumber(numberName);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${numberName}. We’ll remove this information soon.`,
      'i',
    ),
  );
  expect(deletingMessage).to.exist;

  server.use(...mocks.transactionSucceeded);

  await wait(1500);

  // update saved alert should appear
  await view.findByText('Update saved.');

  // the edit phone number button should still exist
  expect(getEditVaButton(numberName)).to.exist;
  // and the add phone number text should exist
  expect(view.getByText(new RegExp(`add.*${shortNumberName}`, 'i'))).to.exist;
}

// When the initial transaction creation request fails
async function testTransactionCreationFails(numberName) {
  server.use(...mocks.createTransactionFailure);

  deletePhoneNumber(numberName);

  // expect an error to be shown
  await view.findByText(
    `We couldn’t save your recent ${numberName} update. Please try again later.`,
    { exact: false },
  );

  expect(getEditVaButton(numberName)).to.exist;
}

// When the update fails but not until after the Delete Modal has exited and the
// user returned to the read-only view
async function testSlowFailure(numberName) {
  server.use(...mocks.transactionPending);

  deletePhoneNumber(numberName);

  // check that the "we're deleting your..." message appears
  const deletingMessage = await view.findByText(
    new RegExp(
      `We’re in the process of deleting your ${numberName}. We’ll remove this information soon.`,
      'i',
    ),
  );
  expect(deletingMessage).to.exist;

  server.use(...mocks.transactionFailed);

  await wait(1500);

  // make sure the error message appears
  expect(
    view.getByText(
      /We couldn’t save your recent .* update. Please try again later/i,
    ),
  ).to.exist;

  // and the add/edit button should be back
  expect(getEditVaButton(numberName)).to.exist;
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
