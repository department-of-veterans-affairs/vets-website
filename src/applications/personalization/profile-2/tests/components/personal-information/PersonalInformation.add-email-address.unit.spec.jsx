import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '../../../msw-mocks';
import PersonalInformation from '../../../components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

describe('Adding email address', () => {
  // before we can use msw, we need to make sure that global.fetch has been
  // restored and is no longer a sinon stub.
  let server;
  before(() => {
    resetFetch();
    server = setupServer(...mocks.addEmailAddressSuccess());
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

  const ui = (
    <MemoryRouter>
      <PersonalInformation />
    </MemoryRouter>
  );

  let initialState;
  it('should handle a transaction that succeeds quickly', async () => {
    server.use(...mocks.addEmailAddressTransactionSuccess);

    const newEmailAddress = 'new-address@domain.com';
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // click the button
    view.getByText(/add.*email address/i, { selector: 'button' }).click();

    const emailAddressInput = view.getByLabelText(/email address/i);

    expect(emailAddressInput).to.exist;

    // enter data in the form
    user.type(emailAddressInput, newEmailAddress);

    // save
    view.getByText('Update', { selector: 'button' }).click();

    // wait for the edit mode to exit and the new address to show up
    await waitForElementToBeRemoved(emailAddressInput);

    // the edit email button should exist
    expect(view.getByRole('button', { name: /edit.*email address/i })).to.exist;
    // and the new email address should exist in the DOM
    expect(view.getByText(newEmailAddress)).to.exist;
    // and the add email button should be gone
    expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not
      .to.exist;
  });
  it('should handle a transaction that does not succeed until after the edit view exits', async () => {
    server.use(...mocks.addEmailAddressTransactionPending);

    const newEmailAddress = 'new-address@domain.com';
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // click the button
    view.getByText(/add.*email address/i, { selector: 'button' }).click();

    const emailAddressInput = view.getByLabelText(/email address/i);

    expect(emailAddressInput).to.exist;

    // enter data in the form
    user.type(emailAddressInput, newEmailAddress);

    // save
    view.getByText('Update', { selector: 'button' }).click();

    // wait for the edit mode to exit and the new address to show up
    await waitForElementToBeRemoved(emailAddressInput);

    // check that the "we're saving your..." message appears
    const savingMessage = await view.findByText(
      /We’re working on saving your new email address. We’ll show it here once it’s saved./i,
    );
    expect(savingMessage).to.exist;

    server.use(...mocks.addEmailAddressTransactionSuccess);

    await waitForElementToBeRemoved(savingMessage);

    // the edit email button should exist
    expect(
      view.getByRole('button', {
        name: /edit.*email address/i,
      }),
    ).to.exist;
    // and the new email address should exist in the DOM
    expect(view.getByText(newEmailAddress)).to.exist;
    // and the add email button should be gone
    expect(view.queryByText(/add.*email address/i, { selector: 'button' })).not
      .to.exist;
  });
  it('should show an error if the transaction cannot be created', async () => {
    server.use(...mocks.addEmailAddressCreateTransactionFailure);

    const newEmailAddress = 'new-address@domain.com';
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // click the button
    view.getByText(/add.*email address/i, { selector: 'button' }).click();

    const emailAddressInput = view.getByLabelText(/email address/i);

    expect(emailAddressInput).to.exist;

    // enter data in the form
    user.type(emailAddressInput, newEmailAddress);

    // save
    view.getByText('Update', { selector: 'button' }).click();

    // expect an error to be shown
    const alert = await view.findByRole('alert');
    expect(alert).to.have.class('usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );
  });
  it('should show an error if the transaction fails quickly', async () => {
    server.use(...mocks.addEmailAddressTransactionFailure);

    const newEmailAddress = 'new-address@domain.com';
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // click the button
    view.getByText(/add.*email address/i, { selector: 'button' }).click();

    const emailAddressInput = view.getByLabelText(/email address/i);

    expect(emailAddressInput).to.exist;

    // enter data in the form
    user.type(emailAddressInput, newEmailAddress);

    // save
    view.getByText('Update', { selector: 'button' }).click();

    // expect an error to be shown
    const alert = await view.findByRole('alert');
    expect(alert).to.have.class('usa-alert-error');
    expect(alert).to.contain.text(
      'We’re sorry. We couldn’t update your email address. Please try again.',
    );
  });
  it('should show an error if the transaction fails after the edit view exits', async () => {
    server.use(...mocks.addEmailAddressTransactionPending);

    const newEmailAddress = 'new-address@domain.com';
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // click the button
    view.getByText(/add.*email address/i, { selector: 'button' }).click();

    const emailAddressInput = view.getByLabelText(/email address/i);

    expect(emailAddressInput).to.exist;

    // enter data in the form
    user.type(emailAddressInput, newEmailAddress);

    // save
    view.getByText('Update', { selector: 'button' }).click();

    // wait for the edit mode to exit and the new address to show up
    await waitForElementToBeRemoved(emailAddressInput);

    // check that the "we're saving your..." message appears
    const savingMessage = await view.findByText(
      /We’re working on saving your new email address. We’ll show it here once it’s saved./i,
    );
    expect(savingMessage).to.exist;

    server.use(...mocks.addEmailAddressTransactionFailure);

    await waitForElementToBeRemoved(savingMessage);

    // make sure the error message appears
    expect(
      view.getByText(
        /We couldn’t save your recent email address update. Please try again later/i,
      ),
    ).to.exist;

    // and the new email address should not exist in the DOM
    expect(view.queryByText(newEmailAddress)).not.to.exist;
    // and the add email button should be back
    expect(view.getByText(/add.*email address/i, { selector: 'button' })).to
      .exist;
  });
});
