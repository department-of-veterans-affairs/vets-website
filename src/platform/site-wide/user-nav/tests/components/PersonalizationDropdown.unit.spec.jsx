import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { logoutUrl } from 'platform/user/authentication/utilities';
import { logoutUrlSiS } from 'platform/utilities/oauth/utilities';
import { PersonalizationDropdown } from 'platform/site-wide/user-nav/components/PersonalizationDropdown';

describe('<PersonalizationDropdown>', () => {
  let oldWindow = null;
  let store = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      dataLayer: [],
    });
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      featureToggles: {},
      user: {},
    };
    store = mockStore(initState);
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('should report analytics when clicking My VA', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    wrapper
      .find({ children: 'My VA' })
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-va');
    wrapper.unmount();
  });

  it('should report analytics when clicking My Health', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    wrapper
      .find({ children: 'My Health' })
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-health');
    wrapper.unmount();
  });

  it('should report analytics when clicking Dependents', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );

    const dependentsLink = wrapper.find({ children: 'Dependents' }).at(0);
    expect(dependentsLink.length).to.equal(1);
    dependentsLink.simulate('click');

    const recordedDependentsEvent = global.window.dataLayer[0];
    expect(recordedDependentsEvent.event).to.equal('nav-user');
    expect(recordedDependentsEvent['nav-user-section']).to.equal('dependents');

    wrapper.unmount();
  });

  it('should report analytics when clicking Letters', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );

    const lettersLink = wrapper.find({ children: 'Letters' }).at(0);
    expect(lettersLink.length).to.equal(1);
    lettersLink.simulate('click');

    const recordedLettersEvent = global.window.dataLayer[0];
    expect(recordedLettersEvent.event).to.equal('nav-user');
    expect(recordedLettersEvent['nav-user-section']).to.equal('letters');

    wrapper.unmount();
  });

  it('should report analytics when clicking Profile', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    wrapper
      .find({ children: 'Profile' })
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('profile');
    wrapper.unmount();
  });

  it('should use the logoutUrl if using SSOe', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown isSSOe />
      </Provider>,
    );
    const signoutLink = wrapper.find({ children: 'Sign Out' }).at(0);
    const expectedUrl = logoutUrl();
    expect(signoutLink.prop('href')).to.equal(expectedUrl);
    wrapper.unmount();
  });

  it('should use the logoutUrlSiS if using OAuth', () => {
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    const signoutLink = wrapper.find({ children: 'Sign Out' }).at(0);
    const expectedUrl = logoutUrlSiS();
    expect(signoutLink.prop('href')).to.equal(expectedUrl);
    wrapper.unmount();
  });
});
