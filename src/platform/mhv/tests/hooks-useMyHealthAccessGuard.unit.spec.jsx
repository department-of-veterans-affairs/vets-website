import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import { useMyHealthAccessGuard } from '../hooks/useMyHealthAccessGuard';

describe('useMyHealthAccessGuard', () => {
  let container = null;
  let store;
  const mockStore = configureMockStore();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('should redirect to /my-health when mhvAccountState is NONE', () => {
    const initialState = {
      user: {
        profile: {
          mhvAccountState: 'NONE',
        },
      },
    };
    store = mockStore(initialState);

    const TestComponent = () => {
      useMyHealthAccessGuard();
      return <div>Test Component</div>;
    };

    const originalLocation = window.location;
    delete window.location;
    window.location = { replace: sinon.stub() };

    act(() => {
      render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
        container,
      );
    });

    expect(window.location.replace.calledWith('/my-health')).to.be.true;
    window.location = originalLocation;
  });

  it('should not redirect when mhvAccountState is OK', () => {
    const initialState = {
      user: {
        profile: {
          mhvAccountState: 'OK',
        },
      },
    };
    store = mockStore(initialState);

    const TestComponent = () => {
      useMyHealthAccessGuard();
      return <div>Test Component</div>;
    };

    const originalLocation = window.location;
    delete window.location;
    window.location = { replace: sinon.stub() };

    act(() => {
      render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
        container,
      );
    });

    expect(window.location.replace.called).to.be.false;
    window.location = originalLocation;
  });
});
