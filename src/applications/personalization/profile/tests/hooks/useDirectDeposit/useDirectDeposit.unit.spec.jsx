import React from 'react';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { useDirectDeposit } from '../../../hooks';

const mockStore = configureMockStore();

const baseState = {
  directDeposit: {
    controlInformation: {
      canUpdateDirectDeposit: true,
      isCorpAvailable: true,
      isEduClaimAvailable: true,
      isCorpRecFound: true,
      hasNoBdnPayments: true,
      hasIdentity: true,
      hasIndex: true,
      isCompetent: true,
      hasMailingAddress: true,
      hasNoFiduciaryAssigned: true,
      isNotDeceased: true,
      hasPaymentAddress: true,
    },
    paymentAccount: {
      name: 'BASE TEST - DIRECT DEPOSIT',
      accountType: 'CHECKING',
      accountNumber: '*******5487',
      routingNumber: '*****1533',
    },
    error: null,
    ui: {
      isEditing: false,
      isSaving: false,
    },
  },
  user: {
    profile: {
      multifactor: true,
      loa: {
        current: 3,
      },
      signIn: {
        serviceName: 'idme',
      },
      session: {
        ssoe: true,
      },
    },
  },
};

describe('useDirectDeposit hook', () => {
  let store;

  beforeEach(() => {
    store = mockStore(baseState);
  });

  it('returns direct deposit information for account and ui state', () => {
    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // direct deposit paymentAccount is passed through
    expect(result.current.paymentAccount.name).to.equal(
      'BASE TEST - DIRECT DEPOSIT',
    );
    expect(result.current.paymentAccount.accountType).to.equal('CHECKING');
    expect(result.current.paymentAccount.accountNumber).to.equal('*******5487');
    expect(result.current.paymentAccount.routingNumber).to.equal('*****1533');

    // main controlInformation is passed through
    expect(result.current.controlInformation.canUpdateDirectDeposit).to.be.true;
    expect(result.current.controlInformation.isCorpAvailable).to.be.true;
    expect(result.current.controlInformation.isEduClaimAvailable).to.be.true;

    // isBlocked and useOauth selectors are returned correctly
    expect(result.current.isBlocked).to.be.false;
    expect(result.current.useOAuth).to.be.false;

    // isIdentityVerified is returned correctly
    expect(result.current.isIdentityVerified).to.be.true;

    // showUpdateSuccess and formIsDirty are returned correctly
    expect(result.current.showUpdateSuccess).to.be.false;
  });

  it('returns isIdentityVerified as false when not all conditions are met', () => {
    store = mockStore({
      ...baseState,
      user: {
        ...baseState.user,
        profile: {
          ...baseState.user.profile,
          loa: {
            current: 1,
          },
        },
      },
    });

    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.isIdentityVerified).to.be.false;
  });

  it('returns isBlocked as false when controlInformation is not provided', () => {
    store = mockStore({
      ...baseState,
      directDeposit: {
        ...baseState.directDeposit,
        controlInformation: null,
      },
    });

    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.isBlocked).to.be.false;
  });
});
