import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import backendServices from 'platform/user/profile/constants/backendServices';
import { VAOSApp } from '../../containers/VAOSApp';

describe('VAOS <VAOSApp>', () => {
  it('should render login gate and downtime notification', () => {
    const user = {
      profile: {
        verified: true,
        services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(<VAOSApp user={user} showApplication />);

    expect(tree.find('RequiredLoginView').exists()).to.be.true;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('Connect(DowntimeNotification)')
        .exists(),
    ).to.be.true;

    tree.unmount();
  });

  it('should render app unavailable messages', () => {
    const user = {
      profile: {
        verified: true,
        services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(<VAOSApp user={user} />);

    expect(tree.find('RequiredLoginView').exists()).to.be.true;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('Connect(DowntimeNotification)')
        .exists(),
    ).to.be.false;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('AppUnavailable')
        .exists(),
    ).to.be.true;

    tree.unmount();
  });

  it('should render error boundary UI', () => {
    const user = {
      profile: {
        verified: true,
        services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(<VAOSApp user={user} showApplication />);
    tree.setState({ hasError: true });
    tree.update();
    expect(tree.find('ErrorMessage').exists()).to.be.true;

    tree.unmount();
  });

  it('should render spinner when loading feature toggles', () => {
    const user = {
      profile: {
        verified: true,
        services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <VAOSApp user={user} loadingFeatureToggles showApplication />,
    );

    expect(tree.find('RequiredLoginView').exists()).to.be.true;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('Connect(DowntimeNotification)')
        .exists(),
    ).to.be.false;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('AppUnavailable')
        .exists(),
    ).to.be.false;
    expect(
      tree
        .find('RequiredLoginView')
        .dive()
        .find('LoadingIndicator')
        .exists(),
    ).to.be.true;

    tree.unmount();
  });
});
