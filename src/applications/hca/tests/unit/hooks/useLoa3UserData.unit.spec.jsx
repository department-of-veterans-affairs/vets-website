import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { useLoa3UserData } from '../../../hooks/useLoa3UserData';

// create wrapper component for our hook
const TestComponent = () => {
  useLoa3UserData();
  return null;
};

describe('hca `useLoa3UserData` hook', () => {
  const getData = ({ loggedIn = true }) => ({
    mockStore: {
      getState: () => ({
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loa: { current: loggedIn ? 3 : null },
            loading: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ mockStore }) =>
    render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>,
    );

  it('should fire the dispatch action(s) when the user is logged in', () => {
    const { mockStore } = getData({});
    const { dispatch } = mockStore;
    subject({ mockStore });
    expect(dispatch.called).to.be.true;
  });

  it('should not fire the dispatch action(s) when the user is logged out', () => {
    const { mockStore } = getData({ loggedIn: false });
    const { dispatch } = mockStore;
    subject({ mockStore });
    expect(dispatch.called).to.be.false;
  });
});
