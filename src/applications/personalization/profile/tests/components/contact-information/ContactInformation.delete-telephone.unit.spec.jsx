import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { server } from 'platform/testing/unit/mocha-setup';

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

// helper function that returns the Edit or Remove va-button
// since RTL doesn't support getByRole/getByText queries for web components
function getVaButton(action, numberName) {
  const label = `${action} ${numberName}`;
  return view.container.querySelector(`va-button[label="${label}"]`);
}

function deletePhoneNumber(numberName) {
  // delete
  getVaButton('Remove', numberName).click();
  const confirmRemoveModal = view.getByTestId('confirm-remove-modal');
  const dummyEvent = new Event('click');
  confirmRemoveModal.__events.primaryButtonClick(dummyEvent);
  return { confirmRemoveModal };
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
  await view.findByTestId('vap-service-error-alert');

  expect(getVaButton('Edit', numberName)).to.exist;
}

describe('Deleting', () => {
  beforeEach(() => {
    server.use(
      ...mocks.deletePhoneNumberSuccess(),
      ...mocks.apmTelemetry,
      ...mocks.rootTransactionStatus,
    );
    window.VetsGov = { pollTimeout: 5 };
    const initialState = createBasicInitialState();

    view = renderWithProfileReducers(ui, {
      initialState,
    });
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
    });
  });
});
