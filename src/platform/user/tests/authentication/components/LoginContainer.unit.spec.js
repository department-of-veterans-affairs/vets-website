/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ConnectedLoginContainer, {
  logoSrc,
} from 'platform/user/authentication/components/LoginContainer';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

const mockStore = configureMockStore();
const generateState = ({
  loginGovOff = false,
  loginGovCerner = false,
  loginGovCreateAccount = false,
}) => ({
  featureToggles: {
    login_gov_disabled: loginGovOff,
    login_gov_myvahealth: loginGovCerner,
    login_gov_create_account: loginGovCreateAccount,
  },
  user: { login: { currentlyLoggedIn: true } },
});

describe('LoginContainer', () => {
  let global;

  beforeEach(() => {
    global = {
      initialState: generateState({}),
    };
  });

  it('should render', async () => {
    const { initialState } = global;
    const screen = renderWithStoreAndRouter(<ConnectedLoginContainer />, {
      initialState,
      reducers: initialState,
    });

    const img = await screen.findByAltText(/VA.gov/);

    expect(img)
      .to.have.attr('src')
      .eql(`${logoSrc}`);
  });

  it('should NOT render the VA logo on the Unified Sign in Page', () => {
    const { initialState } = global;
    const screen = renderWithStoreAndRouter(
      <ConnectedLoginContainer isUnifiedSignIn />,
      {
        initialState,
        reducers: initialState,
        path: '/sign-in/application=mhv',
      },
    );
    expect(screen.queryByAltText(/VA.gov/)).to.be.null;
  });

  it('should render the LoginHeader', async () => {
    const { initialState } = global;
    const screen = renderWithStoreAndRouter(
      <ConnectedLoginContainer loggedOut={false} />,
      {
        initialState,
        reducers: initialState,
      },
    );

    const loginHeader = screen.queryByText('Sign in');
    expect(loginHeader).to.not.be.null;
  });

  it('should render the LoginActions', async () => {
    const { initialState } = global;
    const screen = renderWithStoreAndRouter(<ConnectedLoginContainer />, {
      initialState,
      reducers: initialState,
    });

    const loginActions = screen.queryByText('Or create an account');
    expect(loginActions).to.not.be.null;
  });

  it('should render the LoginInfo', async () => {
    const { initialState } = global;
    const screen = renderWithStoreAndRouter(
      <ConnectedLoginContainer loggedOut={false} />,
      {
        initialState,
        reducers: initialState,
      },
    );

    const loginInfo = screen.queryByText('Having trouble signing in?');
    expect(loginInfo).to.not.be.null;
  });
});

describe('LoginContainer - mapStateToProps', () => {
  let wrapper;
  let store;
  let initialState;

  beforeEach(() => {
    initialState = generateState({});

    store = mockStore(initialState);

    wrapper = shallow(
      <ConnectedLoginContainer store={store} loggedOut isUnifiedSignIn />,
    );
  });

  it('matches the the default state and initial props', () => {
    expect(wrapper.props().children.props).to.includes({
      isUnifiedSignIn: true,
      loggedOut: true,
      loginGovOff: false,
      loginGovCreateAccountEnabled: false,
      loginGovMyVAHealthEnabled: false,
    });
  });

  it('matches the updated state and props', () => {
    initialState = generateState({
      loginGovOff: true,
      loginGovCerner: true,
      loginGovCreateAccount: true,
    });

    store = mockStore(initialState);

    wrapper = shallow(
      <ConnectedLoginContainer
        store={store}
        loggedOut={false}
        isUnifiedSignIn={false}
      />,
    );

    expect(wrapper.props().children.props).to.includes({
      isUnifiedSignIn: false,
      loggedOut: false,
      loginGovOff: true,
      loginGovCreateAccountEnabled: true,
      loginGovMyVAHealthEnabled: true,
    });
    wrapper.unmount();
  });
});
