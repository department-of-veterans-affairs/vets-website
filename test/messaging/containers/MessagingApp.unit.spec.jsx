import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import MessagingApp from '../../../src/js/messaging/containers/MessagingApp';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

describe('MessagingApp', () => {
  it('should render', () => {
    const mockRoutes = [{ path: '/test' }];
    const app = (
      <MessagingApp
          store={store}
          location={{ pathname: '/messaging' }}
          route={{ childRoutes: mockRoutes }}/>
    );
    const tree = SkinDeep.shallowRender(app);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
