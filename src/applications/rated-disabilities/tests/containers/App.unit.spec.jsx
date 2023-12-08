import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import { headline as MVIErrorHeadline } from '../../components/MVIError';
import { App } from '../../containers/App';

// This is needed for the DowntimeNotification component
// to render correctly
const store = createStore(() => ({
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: { get() {} },
    dismissedDowntimeWarnings: [],
  },
}));

const loggedInUser = {
  login: {
    currentlyLoggedIn: true,
  },
};

const badStateUser = {
  ...loggedInUser,
  profile: {
    status: 'SERVER_ERROR',
    verified: true,
  },
};

const unverifiedUser = {
  ...loggedInUser,
  profile: {
    status: 'OK',
    verified: false,
  },
};

const props = {
  ratedDisabilities: [],
  user: {
    profile: {
      status: 'OK',
      verified: true,
    },
  },
  loginUrl: '',
  verifyUrl: '',
  fetchRatedDisabilities: sinon.stub(),
};

describe('<App>', () => {
  context("when the users' profile is not in the expected state", () => {
    it('will render an error when the profile status is not OK', () => {
      const screen = render(
        <Provider store={store}>
          <App user={badStateUser} ratedDisabilities={[]} />
        </Provider>,
      );

      expect(screen.findByText(MVIErrorHeadline)).to.exist;
    });

    it('will render an error when the profile is not verified', () => {
      const screen = render(
        <Provider store={store}>
          <App user={unverifiedUser} ratedDisabilities={[]} />
        </Provider>,
      );

      expect(screen.findByText(MVIErrorHeadline)).to.exist;
    });
  });

  it('should render a RequiredLoginView', () => {
    const wrapper = shallow(
      <App {...props}>
        <div>App Children</div>
      </App>,
    );

    expect(wrapper.find('RequiredLoginView').length).to.equal(1);
    wrapper.unmount();
  });
});
