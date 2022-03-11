import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import TransitionAccountPage from '../components/TransitionAccountPage';

const createStore = (mhvTransitionEligible = false) => ({
  mockStore: {
    getState: () => ({
      user: {
        profile: { mhvTransitionEligible },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('TransitionAccountPage', () => {
  it('should render', () => {
    const { mockStore } = createStore();
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const h1Tag = wrapper.find('h1');

    expect(h1Tag.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render additional question div if `canTransition` is false', () => {
    const { mockStore } = createStore();
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const h2Tag = wrapper.find('[data-testid="cant-transition"]');

    expect(h2Tag.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should NOT render additional question div if `canTransition` is true', () => {
    const { mockStore } = createStore(true);
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const h2Tag = wrapper.find('[data-testid="cant-transition"]');

    expect(h2Tag.exists()).to.be.false;
    wrapper.unmount();
  });

  it('should render a CTA', () => {
    const { mockStore } = createStore();
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const accountCTA = wrapper.find('TransitionAccountCTA');

    expect(accountCTA.exists()).to.be.true;
    wrapper.unmount();
  });
});
