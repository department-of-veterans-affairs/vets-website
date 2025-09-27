import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import SignInAlert from '../../../../components/FormAlerts/SignInAlert';

describe('1010d <SignInAlert>', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  afterEach(() => {
    dispatch.resetHistory();
  });

  const subject = ({ loggedIn = false } = {}) => {
    const mockStore = {
      getState: () => ({
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: false,
            verified: loggedIn,
            loa: { current: loggedIn ? 3 : null },
          },
        },
      }),
      subscribe: () => {},
      dispatch,
    };
    const { container } = render(
      <Provider store={mockStore}>
        <SignInAlert />
      </Provider>,
    );
    const selectors = () => ({
      loginBtn: container.querySelector('.va-button-link'),
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors };
  };

  it('should not render when user is logged in', () => {
    const { selectors } = subject({ loggedIn: true });
    expect(selectors().vaAlert).to.not.exist;
  });

  it('should trigger login modal on button click', () => {
    const { selectors } = subject();
    fireEvent.click(selectors().loginBtn);
    sinon.assert.calledOnceWithMatch(dispatch, toggleLoginModal(true));
  });
});
