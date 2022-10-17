/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import TransitionAccountPage from '../components/TransitionAccountPage';

const generateState = (
  mhvTransitionEligible = undefined,
  mhvToLogingovAccountTransition = undefined,
) => ({
  featureToggles: {
    mhv_to_logingov_account_transition: mhvToLogingovAccountTransition,
  },
  user: {
    profile: { mhvTransitionEligible },
  },
});
const mockStore = configureMockStore();

describe('TransitionAccountPage', () => {
  let initialState;
  let store;
  let wrapper;

  beforeEach(() => {
    initialState = generateState();
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <TransitionAccountPage />
      </Provider>,
    );
  });

  afterEach(() => {
    initialState = generateState();
    store = mockStore(initialState);
  });

  it('should render', () => {
    const h1Tag = wrapper.find('h1');
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(h1Tag.exists()).to.be.false;
    expect(loadingIndicator.exists()).to.be.true;
    wrapper.unmount();
  });

  it.skip('should render `canTransition` is true', () => {
    initialState = generateState(true, true);
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <TransitionAccountPage />,
      </Provider>,
    );

    const buttonTag = wrapper.find('[data-testid="transition-btn"]');
    const h3Tags = wrapper.find('h3');
    expect(buttonTag.length).to.eql(1);
    expect(buttonTag.text()).to.eql('Transfer my account to Login.gov');
    expect(h3Tags.length).to.eql(3);
    wrapper.unmount();
  });

  it.skip('should render `canTransition` is false', () => {
    initialState = generateState(false, true);
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <TransitionAccountPage />,
      </Provider>,
    );
    const h3Tags = wrapper.find('h3');
    expect(h3Tags.length).to.eql(5);
    wrapper.unmount();
  });

  it.skip('should render a TranstionAccountSteps component', () => {
    initialState = generateState(false, true);
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <TransitionAccountPage />
      </Provider>,
    );

    const accountSteps = wrapper.find('TransitionAccountSteps');

    expect(accountSteps.exists()).to.be.true;
    wrapper.unmount();
  });
});
