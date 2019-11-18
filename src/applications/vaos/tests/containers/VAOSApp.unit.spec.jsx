import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import backendServices from 'platform/user/profile/constants/backendServices';
import { VAOSApp } from '../../containers/VAOSApp';

describe('VAOS <VAOSApp>', () => {
  it('should render login gate and downtime notification', () => {
    const user = {
      profile: {
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
  it('should render app unavailble messages', () => {
    const user = {
      profile: {
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
});
