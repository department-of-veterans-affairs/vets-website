import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import HealthCareApp from '../../../src/client/components/HealthCareApp';
import reducer from '../../../src/client/reducers';

const store = createStore(reducer);

describe('<HealthCareApp>', () => {
  it('Sanity check the component renders', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<HealthCareApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
