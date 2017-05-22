import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import VALettersApp from '../../../src/js/va-letters/containers/VALettersApp';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

describe('<VALettersApp>', () => {
  it('should render', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<VALettersApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
