import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '@@profile/msw-mocks';
import PersonalInformation from '@@profile/components/personal-information/PersonalInformation';

import {
  createBasicInitialState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';
import { beforeEach } from 'mocha';

const ui = (
  <MemoryRouter>
    <PersonalInformation />
  </MemoryRouter>
);
let view;
let server;

const savingMessageRegex = /We’re working on saving your.*text alert preference/i;

const smsCheckboxLabelRegex = /We’ll send VA health care appointment text reminders to this number/i;

function getCheckbox(_view) {
  return _view.getByLabelText(smsCheckboxLabelRegex);
}

function queryCheckbox(_view) {
  return _view.queryByLabelText(smsCheckboxLabelRegex);
}

describe('When not enrolled in health care', () => {
  beforeEach(() => {
    const initialState = createBasicInitialState();
    view = renderWithProfileReducers(ui, {
      initialState,
    });
  });
  it('the text messages checkbox should not be shown in view mode', () => {
    expect(queryCheckbox(view)).to.not.exist;
  });
  it('the text messages checkbox should not be shown in edit mode', () => {
    view.getByRole('button', { name: /edit mobile phone number/i }).click();
    expect(
      view.queryByLabelText(
        /Send me text message \(SMS\) reminders for my VA health care appointments/i,
      ),
    ).to.not.exist;
  });
});

describe('When enrolled in health care', () => {
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is no longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.toggleSMSNotificationsSuccess());
    server.listen();
  });
  beforeEach(() => {
    window.VetsGov = { pollTimeout: 1 };
    const initialState = createBasicInitialState();
    initialState.user.profile.vaPatient = true;
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
  it('should show an error if it is unable to create the transaction', async () => {
    server.use(...mocks.createTransactionFailure);
    getCheckbox(view).click();

    expect(await view.findByText(savingMessageRegex)).to.exist;

    expect(
      await view.findByText(
        /We couldn’t save your recent mobile phone number update. Please try again later./i,
      ),
    ).to.exist;
  });
  it('should show an error if the transaction fails', async () => {
    server.use(...mocks.transactionPending);
    getCheckbox(view).click();

    expect(await view.findByText(savingMessageRegex)).to.exist;

    server.use(...mocks.transactionFailed);

    expect(
      await view.findByText(
        /We couldn’t save your recent mobile phone number update. Please try again later./i,
      ),
    ).to.exist;
  });
  it('should should show the updated checkbox state if the transaction succeeds', async () => {
    server.use(...mocks.transactionPending);
    getCheckbox(view).click();

    const savingMessage = await view.findByText(savingMessageRegex);

    expect(savingMessage).to.exist;

    server.use(...mocks.transactionSucceeded);

    await view.findByLabelText(smsCheckboxLabelRegex);

    expect(getCheckbox(view)).to.have.attr('checked');
  });
  it('the text messages checkbox should be shown in mobile phone edit mode', () => {
    view.getByRole('button', { name: /edit mobile phone number/i }).click();
    expect(
      view.getByLabelText(
        /Send me text message \(SMS\) reminders for my VA health care appointments/i,
      ),
    ).to.exist;
  });
  it('the text messages checkbox should not be shown in home phone edit mode', () => {
    view.getByRole('button', { name: /edit home phone number/i }).click();
    expect(
      view.queryByLabelText(
        /Send me text message \(SMS\) reminders for my VA health care appointments/i,
      ),
    ).not.to.exist;
  });
});
