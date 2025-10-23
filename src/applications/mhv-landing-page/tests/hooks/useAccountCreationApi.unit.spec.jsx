import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { useAccountCreationApi } from '../../hooks';
import {
  fetchAccountStatus,
  fetchAccountStatusSuccess,
} from '../../reducers/account';
import * as apiCalls from '../../utilities/api';

function TestComponent({ spy }) {
  try {
    useAccountCreationApi(spy);
    return <div />;
  } catch (error) {
    return <p />;
  }
}

describe('useAccountCreationApi', () => {
  it('calls dispatch to fetchAccountStatus if not loading and LOA3, and no MHV account', async () => {
    sinon.stub(apiCalls, 'getMHVAccount').resolves({ errors: [] });
    const dispatch = sinon.spy();
    const initialState = {
      user: {
        profile: {
          loa: { current: 3 },
          loading: false,
          mhvAccountState: 'None',
        },
      },
    };
    renderWithStoreAndRouter(<TestComponent spy={dispatch} />, {
      initialState,
    });
    await waitFor(() => {
      expect(dispatch.firstCall.calledWith({ type: fetchAccountStatus })).to.be
        .true;
    });
  });

  it('does not call dispatch if not LOA3', async () => {
    const dispatch = sinon.spy();
    const initialState = {
      user: {
        profile: {
          loa: { current: 2 },
          loading: false,
        },
      },
    };
    renderWithStoreAndRouter(<TestComponent spy={dispatch} />, {
      initialState,
    });
    await waitFor(() => {
      expect(dispatch.called).to.be.false;
    });
  });

  it('calls dispatch with fetchAccountStatusSuccess if user has MHV account', async () => {
    const dispatch = sinon.spy();
    const initialState = {
      user: {
        profile: {
          loa: { current: 3 },
          loading: false,
          mhvAccountState: 'OK',
        },
      },
    };
    renderWithStoreAndRouter(<TestComponent spy={dispatch} />, {
      initialState,
    });
    await waitFor(() => {
      expect(
        dispatch.firstCall.calledWith({
          type: fetchAccountStatusSuccess,
          data: { error: false },
        }),
      ).to.be.true;
    });
  });

  it('does not call dispatch if loading', async () => {
    const dispatch = sinon.spy();
    const initialState = {
      user: {
        profile: {
          loa: { current: 3 },
          loading: true,
        },
      },
    };
    renderWithStoreAndRouter(<TestComponent spy={dispatch} />, {
      initialState,
    });
    await waitFor(() => {
      expect(dispatch.called).to.be.false;
    });
  });
});
