import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { EVSSClaimsGate } from '../../containers/EVSSClaimsGate';

describe('EVSSClaimsGate', () => {
  const disallowedUser = {
    login: { currentlyLoggedIn: true },
    profile: {
      services: []
    }
  };

  it('should not gate the form on the intro page', () => {
    const tree = mount(
      <EVSSClaimsGate
        user={disallowedUser}
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </EVSSClaimsGate>
    );
    expect(tree.text()).to.equal('It worked!');
  });

  it('should render a RequiredLoginView', () => {
    const tree = shallow(
      <EVSSClaimsGate
        user={disallowedUser}
        location={{ pathname: '/middle-of-the-form' }}>
        <p>It worked!</p>
      </EVSSClaimsGate>
    );
    expect(tree.find('RequiredLoginView').length).to.equal(1);
  });
});
