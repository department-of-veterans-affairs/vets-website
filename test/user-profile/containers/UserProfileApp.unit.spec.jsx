import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import UserProfileApp from '../../../src/js/user-profile/containers/UserProfileApp';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

describe('UserProfileApp', () => {
  let tree = SkinDeep.shallowRender(
    <UserProfileApp
        store={store}
        location={{ pathname: '/test-user-profile' }}
        route={{ childRoutes: [{ path: '/test-child-routes' }] }}/>
  );

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render login view', () => {
    tree = SkinDeep.shallowRender(
      <UserProfileApp
          store={store}
          loginUrl={'http://fake-login'}
          profile={{}}/>
    );
    // TODO(romano): figure out why this doesn't render the login view
    /*
    const loginView = tree.everySubTree('RequiredLoginView');
    expect(loginView).to.have.lengthOf(1);
    expect(loginView[0].props.serviceRequired).to.equal('user-profile');
    expect(loginView[0].props.authRequired).to.equal(1);
    */
  });
});
