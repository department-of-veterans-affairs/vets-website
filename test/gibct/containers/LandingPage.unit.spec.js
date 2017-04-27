import { createStore } from 'redux';
import { expect } from 'chai';
import React from 'react';
import SkinDeep from 'skin-deep';

import LandingPage from '../../../src/js/gi/containers/LandingPage';
import reducer from '../../../src/js/gi/reducers';

const store = createStore(reducer);

describe('<LandingPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<LandingPage store={store}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
