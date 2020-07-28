import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '../../../msw-mocks';
import {
  getBasicContactInfoState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

import PersonalInformation from '../../../components/personal-information/PersonalInformation';

function createBasicInitialState() {
  return {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    vaProfile: {
      personalInformation: {
        gender: 'M',
        birthDate: '1986-05-06',
      },
    },
    user: {
      profile: {
        vet360: getBasicContactInfoState(),
      },
    },
  };
}

function fillOutAndSubmitBankInfoForm(view) {
  const accountNumberField = view.getByLabelText(/account number/i);
  const routingNumberField = view.getByLabelText(/routing/i);
  const accountTypeSelect = view.getByLabelText(/account type/i);
  const submitButton = view.getByRole('button', { name: /update/i });

  userEvent.type(accountNumberField, '123123123');
  userEvent.type(routingNumberField, '456456456');
  userEvent.selectOptions(accountTypeSelect, ['Savings']);
  userEvent.click(submitButton);
}

function findSetUpBankInfoButton(view) {
  return view.queryByRole('button', {
    name: /please add your bank information/i,
  });
}

function findEditBankInfoButton(view) {
  return view.getByRole('button', {
    name: /edit your direct deposit bank information/i,
  });
}

function findCancelEditButton(view) {
  return view.getByRole('button', {
    name: /cancel/i,
  });
}

describe('PersonalInformation', () => {
  let server;
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is not longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.updateDirectDepositSuccess);
    server.listen();
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
  it('should render personal info data from the Redux state', () => {
    initialState = createBasicInitialState();

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    expect(view.getByText(/^May 6, 1986$/)).to.exist;
    expect(view.getByText(/^Male$/)).to.exist;
  });

  it('should render the correct contact based on what exists in the Redux state', () => {
    initialState = createBasicInitialState();

    const {
      residentialAddress,
      mailingAddress,
    } = initialState.user.profile.vet360;

    const view = renderWithProfileReducers(ui, { initialState });

    expect(view.getByText(residentialAddress.addressLine1, { exact: false })).to
      .exist;
    expect(
      view.getByText(
        `${residentialAddress.city}, ${residentialAddress.stateCode} ${
          residentialAddress.zipCode
        }`,
        { exact: false },
      ),
    ).to.exist;

    expect(view.getByText(mailingAddress.addressLine1, { exact: false })).to
      .exist;
    expect(
      view.getByText(
        `${mailingAddress.city}, ${mailingAddress.stateCode} ${
          mailingAddress.zipCode
        }`,
        { exact: false },
      ),
    ).to.exist;

    // It's too cumbersome to convert the raw phone number data into what is
    // displayed so I'm using strings here.
    expect(view.getByText(`(555) 555-5559`)).to.exist;
    expect(view.getByText(`(804) 205-5544`)).to.exist;
    expect(view.getByText(`x17747`)).to.exist;
    expect(view.getByText(`(214) 718-2112`)).to.exist;

    expect(view.getByRole('button', { name: /please add your fax number/i })).to
      .exist;
    expect(view.getByRole('button', { name: /please add your email/i })).to
      .exist;
  });
});
