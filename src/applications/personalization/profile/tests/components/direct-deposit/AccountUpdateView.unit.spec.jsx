import React from 'react';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
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
    expect(getByText('Routing number')).to.exist;
    expect(getByText('Account number (No more than 17 digits)')).to.exist;
  });

  context('formCancel', () => {
    const setShouldShowCancelModal = sinon.spy();
    const setFormData = sinon.spy();
    const toggleDirectDepositEdit = sinon.spy();

    const paymentAccount = {
      name: 'BASE TEST - DIRECT DEPOSIT',
      accountType: 'Checking',
      accountNumber: '*******5487',
      routingNumber: '*****1533',
    };

    it("shouldn't show modal if form isn't dirty", () => {
      const formData = {
        name: '',
        accountType: '',
        accountNumber: undefined,
        routingNumber: undefined,
      };

      const { container } = renderWithProfileReducers(
        <AccountUpdateView
          formData={formData}
          setFormData={setFormData}
          paymentAccount={paymentAccount}
        >
          <va-button>Save</va-button>
        </AccountUpdateView>,
        {
          initialState: createInitialState(),
        },
      );

      const cancelButton = container.querySelector('[text="Cancel"]');
      fireEvent.click(cancelButton);
      expect(setFormData.calledWith({})).to.be.false;
      expect(setShouldShowCancelModal.calledWith(true)).to.be.false;
      expect(toggleDirectDepositEdit.calledWith(true)).to.be.false;
    });

    it('should show modal if form is dirty', () => {
      const formData = {
        name: 'BASE TEST - DIRECT DEPOSIT',
        accountType: 'Checking',
        accountNumber: '*******5487',
        routingNumber: '*****1533',
      };

      const { container } = renderWithProfileReducers(
        <AccountUpdateView
          formData={formData}
          setFormData={setFormData}
          paymentAccount={paymentAccount}
        >
          <va-button>Save</va-button>
        </AccountUpdateView>,
        {
          initialState: createInitialState(),
        },
      );

      const cancelButton = container.querySelector('[text="Cancel"]');
      fireEvent.click(cancelButton);
      expect(setFormData.calledWith({})).to.be.true;
      expect(setShouldShowCancelModal.calledWith(false)).to.be.false;
      expect(toggleDirectDepositEdit.calledWith(false)).to.be.false;
    });
  });
});
