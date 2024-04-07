import React from 'react';
import sinon from 'sinon';
import { findByText, fireEvent } from '@testing-library/react';
import { expect } from 'chai';

import AccountUpdateView from '~/applications/personalization/profile/components/direct-deposit/AccountUpdateView';

import { renderWithProfileReducers } from '../../unit-test-helpers';
import { useDirectDeposit } from '../../../hooks';

const TestComponent = ({ formSubmitSpy, formData = null }) => {
  const directDepositHookResult = useDirectDeposit();
  const formSubmit = sinon.spy();
  if (formData) {
    directDepositHookResult.setFormData(formData);
  }
  return (
    <>
      {directDepositHookResult.ui.isEditing ? (
        <AccountUpdateView
          isSaving={directDepositHookResult.ui.isSaving}
          formSubmit={formSubmitSpy || formSubmit}
          {...directDepositHookResult}
        />
      ) : (
        <p>Info View</p>
      )}
    </>
  );
};

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
            accountNumber: 'test account number',
            routingNumber: 'test routing number',
          },
      loadError: null,
      saveError: saveError || null,
      ui: {
        isEditing: true,
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

describe('<AccountUpdateView/>', () => {
  it('renders form correctly', () => {
    const { getByText, container } = renderWithProfileReducers(
      <TestComponent />,
      {
        initialState: createInitialState(),
      },
    );

    expect(getByText('Account')).to.exist;

    // using these query selectors since the web components don't have an accessible name
    // that is easily queryable in unit tests
    expect(container.querySelector('va-radio[label="Account type"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="Checking"]')).to
      .exist;
    expect(container.querySelector('va-radio-option[label="Savings"]')).to
      .exist;
    expect(container.querySelector('va-text-input[label="Routing number"]')).to
      .exist;
    expect(
      container.querySelector(
        'va-text-input[label="Account number (No more than 17 digits)"]',
      ),
    ).to.exist;
  });

  context('formCancel', () => {
    it('allows cancelling when form has no pending changes', () => {
      const { container } = renderWithProfileReducers(<TestComponent />, {
        initialState: createInitialState(),
      });

      const cancelButton = container.querySelector('[text="Cancel"]');
      expect(cancelButton).to.exist;
      fireEvent.click(cancelButton);

      expect(findByText('Info View')).to.exist;
    });

    it('should show modal if form hasUnsavedFormEdits', () => {
      const formData = {
        accountType: 'Checking',
        accountNumber: '123456789',
        routingNumber: '111111111111',
      };

      const { container } = renderWithProfileReducers(
        <TestComponent formData={formData} />,
        {
          initialState: createInitialState(),
        },
      );

      const cancelButton = container.querySelector('[text="Cancel"]');

      fireEvent.click(cancelButton);
    });
  });
});
