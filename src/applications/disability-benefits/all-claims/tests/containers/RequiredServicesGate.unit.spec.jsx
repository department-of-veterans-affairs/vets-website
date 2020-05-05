import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { RequiredServicesGate } from '../../containers/RequiredServicesGate';

import backendServices from 'platform/user/profile/constants/backendServices';

describe('RequiredServicesGate', () => {
  const disallowedUser = {
    login: { currentlyLoggedIn: true },
    profile: {
      services: [],
    },
  };

  const allowedUser = {
    login: { currentlyLoggedIn: true },
    profile: {
      services: [backendServices.FORM526],
    },
  };

  it('should not gate the form on the intro page', () => {
    const tree = mount(
      <RequiredServicesGate
        user={disallowedUser}
        location={{ pathname: '/introduction' }}
      >
        <p>It worked!</p>
      </RequiredServicesGate>,
    );
    expect(tree.text()).to.equal('It worked!');
    tree.unmount();
  });

  it('should render a RequiredLoginView', () => {
    const tree = shallow(
      <RequiredServicesGate
        user={allowedUser}
        location={{ pathname: '/middle-of-the-form' }}
      >
        <p>It worked!</p>
      </RequiredServicesGate>,
    );
    expect(tree.find('RequiredLoginView').length).to.equal(1);
    tree.unmount();
  });
});
