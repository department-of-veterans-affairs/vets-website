import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import GiBillApp from '../../../src/js/gi/containers/GiBillApp';
import reducer from '../../../src/js/gi/reducers';

const store = createStore(reducer);

describe('<GiBillApp>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<GiBillApp store={store}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
