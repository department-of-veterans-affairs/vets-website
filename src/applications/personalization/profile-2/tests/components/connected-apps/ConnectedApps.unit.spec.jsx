import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { ConnectedApps } from '../../../components/connected-apps/ConnectedApps';

describe('<ConnectedApps>', () => {
  it('renders correctly with apps', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: false }],
      loading: false,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = shallow(<ConnectedApps {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.include('Connected apps');
    expect(text).to.include(
      'You’ve given these third-party apps or websites access to some of your Veteran data, like health or service records. You can remove their access at any time by disconnecting the app. Disconnected apps can’t receive any new data from VA, but may still have access to information that you’ve previously shared.',
    );
    expect(text).to.not.include(
      'You don’t currently have any third-party apps or websites connected to your Veteran data, like health or service records. When you do, this is where you can manage them.',
    );
    expect(text).to.not.include('Loading your connected apps...');
    expect(text).to.include('Have questions about connecting to VA.gov?');
    expect(text).to.include(
      'Get answers to frequently asked questions about how connected third-party apps work, what types of information they can see, and the benefits of sharing your information.',
    );
    expect(text).to.include('Go to Connected Account FAQs');

    wrapper.unmount();
  });

  it('renders correctly with all deleted apps', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: true }],
      loading: false,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = shallow(<ConnectedApps {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.include('Connected apps');
    expect(text).to.not.include(
      'You’ve given these third-party apps or websites access to some of your Veteran data, like health or service records. You can remove their access at any time by disconnecting the app. Disconnected apps can’t receive any new data from VA, but may still have access to information that you’ve previously shared.',
    );
    expect(text).to.include(
      'You don’t currently have any third-party apps or websites connected to your Veteran data, like health or service records. When you do, this is where you can manage them.',
    );
    expect(text).to.not.include('Loading your connected apps...');
    expect(text).to.include('Have questions about connecting to VA.gov?');
    expect(text).to.include(
      'Get answers to frequently asked questions about how connected third-party apps work, what types of information they can see, and the benefits of sharing your information.',
    );
    expect(text).to.include('Go to Connected Account FAQs');

    wrapper.unmount();
  });

  it('renders correctly when loading', () => {
    const defaultProps = {
      apps: [{ deleted: true }, { deleted: true }],
      loading: true,
      loadConnectedApps: () => {},
      deleteConnectedApp: () => {},
      dismissDeletedAppAlert: () => {},
    };

    const wrapper = mount(<ConnectedApps {...defaultProps} />);

    const text = wrapper.text();
    expect(text).to.include('Loading your connected apps...');

    wrapper.unmount();
  });
});
