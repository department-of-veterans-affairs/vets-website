import React from 'react';
import { expect } from 'chai';
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {
  createPutHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import {
  DIRECT_DEPOSIT_API_ENDPOINT,
  DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  toggleDirectDepositEdit,
} from '@@profile/actions/directDeposit';

import thunk from 'redux-thunk';
import environment from '~/platform/utilities/environment';
import { useDirectDeposit } from '../../../hooks';
import { wait } from '../../unit-test-helpers';
import directDeposits from '../../../mocks/endpoints/direct-deposits';

const mockStore = configureMockStore([thunk]);

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
  const endpointUrl = `${environment.API_URL}/v0${DIRECT_DEPOSIT_API_ENDPOINT}`;
  let store;

  beforeEach(() => {
    server.use(
      createPutHandler(endpointUrl, () =>
        jsonResponse(directDeposits.updates.success, { status: 200 }),
      ),
    );
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

  it('should handle exitUpdateView correctly', () => {
    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current.setFormData({ accountType: 'Checking' });
    });

    expect(result.current.formData).to.deep.equal({ accountType: 'Checking' });

    act(() => {
      result.current.exitUpdateView();
    });

    expect(result.current.formData).to.deep.equal({});
    expect(store.getActions()).to.deep.equal([toggleDirectDepositEdit(false)]);
  });

  it('should handle onCancel correctly when there are unsaved form edits', () => {
    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current.setFormData({ accountType: 'Checking' });
    });

    act(() => {
      result.current.onCancel();
    });

    expect(result.current.showCancelModal).to.be.true;
  });

  it('should handle onCancel correctly when there are no unsaved form edits', () => {
    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current.onCancel();
    });

    expect(result.current.showCancelModal).to.be.false;
    expect(store.getActions()).to.deep.equal([toggleDirectDepositEdit(false)]);
  });

  it('should handle onFormSubmit correctly', async () => {
    window.VetsGov = { pollTimeout: 5 };
    const formData = {
      accountType: 'Checking',
      routingNumber: '123456789',
      accountNumber: '987654321',
    };

    const { result } = renderHook(() => useDirectDeposit(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current.setFormData(formData);
    });

    act(() => {
      result.current.onFormSubmit();
    });

    await wait(20);

    expect(store.getActions()).to.deep.equal([
      { type: DIRECT_DEPOSIT_SAVE_STARTED },
      { type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED },
      {
        response: directDeposits.updates.success.data.attributes,
        type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
      },
    ]);
  });
});
