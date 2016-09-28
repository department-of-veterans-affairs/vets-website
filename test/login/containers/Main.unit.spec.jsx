import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import Main from '../../../src/js/login/containers/Main';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

describe('<Main>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Main store={store} location={{ pathname: '/blah' }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
