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
      'Your VA.gov profile is connected to the third-party (non-VA) apps listed below. If you want to stop sharing information with an app, you can disconnect it from your profile at any time.',
    );
    expect(text).to.not.include(
      'Connected apps are third-party (non-VA) applications or websites that can share certain information from your VA.gov profile, with your permission. For example, you can connect information from your VA health record to an app that helps you track your health.',
    );
    expect(text).to.not.include('Loading your connected apps...');
    expect(text).to.include('Have more questions about connected apps?');

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
    expect(text).to.include(
      'Connected apps are third-party (non-VA) applications or websites that can share certain information from your VA.gov profile, with your permission. For example, you can connect information from your VA health record to an app that helps you track your health.',
    );
    expect(text).to.not.include('Loading your connected apps...');
    expect(text).to.include(
      'We offer this feature for your convenience. It’s always your choice whether to connect, or stay connected, to a third-party app',
    );
    expect(text).to.include('Third-party apps you can connect to your profile');
    expect(text).to.include('Have more questions about connected apps?');

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
