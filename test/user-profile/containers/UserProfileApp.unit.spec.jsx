import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import UserProfileApp from '../../../src/js/user-profile/containers/UserProfileApp';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

describe('UserProfileApp', () => {
  const props = {
    store,
    location: { pathname: '/test-user-profile' },
    route: { childRoutes: [{ path: '/test-child-routes' }] },
    loginUrl: 'http://fake-login',
    profile: {}
  };
  const tree = SkinDeep.shallowRender(<UserProfileApp {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
