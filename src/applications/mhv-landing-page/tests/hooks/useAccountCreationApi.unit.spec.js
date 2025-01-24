import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { useAccountCreationApi } from '../../hooks';

function TestComponent({ spy }) {
  try {
    useAccountCreationApi(spy);
    return <div />;
  } catch (error) {
    return <p />;
  }
}

describe('useAccountCreationApi', () => {
  it('calls dispatch if not loading and LOA3', async () => {
    const dispatch = sinon.spy();
    const initialState = {
      user: {
        profile: {
          loa: { current: 3 },
          loading: false,
        },
      },
    };
    renderWithStoreAndRouter(<TestComponent spy={dispatch} />, {
      initialState,
    });
    expect(dispatch.called).to.be.true;
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
    expect(dispatch.called).to.be.false;
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
    expect(dispatch.called).to.be.false;
  });
});
