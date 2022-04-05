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

  it('should render `canTransition` is true', () => {
    const { mockStore } = createStore(true);
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const buttonTag = wrapper.find('button');
    const h3Tags = wrapper.find('h3');

    expect(buttonTag.exists()).to.be.true;
    expect(buttonTag.text()).to.eql('Transfer my account to Login.gov');
    expect(h3Tags.length).to.eql(3);
    wrapper.unmount();
  });

  it('should render `canTransition` is false', () => {
    const { mockStore } = createStore();
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const h3Tags = wrapper.find('h3');
    expect(h3Tags.length).to.eql(5);
    wrapper.unmount();
  });

  it('should render a TranstionAccountSteps component', () => {
    const { mockStore } = createStore();
    const wrapper = mount(
      <Provider store={mockStore}>
        <TransitionAccountPage />
      </Provider>,
    );

    const accountSteps = wrapper.find('TransitionAccountSteps');

    expect(accountSteps.exists()).to.be.true;
    wrapper.unmount();
  });
});
