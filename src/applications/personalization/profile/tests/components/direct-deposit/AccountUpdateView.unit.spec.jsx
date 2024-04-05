import React from 'react';
import { expect } from 'chai';

import AccountUpdateView from '~/applications/personalization/profile/components/direct-deposit/AccountUpdateView';

import { renderWithProfileReducers } from '../../unit-test-helpers';

describe('<AccountUpdateView/>', () => {
  const createInitialState = ({
    saveError,
    loadError,
    controlInformation = {
      canUpdateDirectDeposit: true,
      canUpdateAddress: true,
      corpAvailIndicator: true,
      corpRecFoundIndicator: true,
      hasNoBdnPaymentsIndicator: true,
      identityIndicator: true,
      isCompetentIndicator: true,
      indexIndicator: true,
      noFiduciaryAssignedIndicator: true,
      notDeceasedIndicator: true,
    },
  } = {}) => {
    const state = {
      directDeposit: {
        controlInformation,
        paymentAccount: loadError
          ? null
          : {
              name: 'TEST BANK NAME',
              accountNumber: 'test acount number',
              routingNumber: 'test routing number',
            },
        loadError: null,
        saveError: saveError || null,
        ui: {
          isEditing: false,
          isSaving: false,
        },
      },
      user: {
        profile: {
          loa: {
            current: 3,
          },
          multifactor: true,
          session: {
            authBroker: 'sis',
          },
          loading: false,
        },
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
    };
    if (loadError) {
      state.directDeposit.loadError = loadError;
    }
    return state;
  };

  it('renders correctly', () => {
    const { getByText, getByRole, getByLabelText } = renderWithProfileReducers(
      <AccountUpdateView>
        <va-button>Save</va-button>
      </AccountUpdateView>,
      {
        initialState: createInitialState(),
      },
    );

    expect(getByText('Account')).to.exist;
    expect(getByRole('group', 'Account type')).to.exist;
    expect(getByLabelText('Checking')).to.exist;
    expect(getByLabelText('Savings')).to.exist;
  });
});
