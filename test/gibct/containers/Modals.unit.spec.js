import { createStore } from 'redux';
import { expect } from 'chai';
import React from 'react';
import SkinDeep from 'skin-deep';

import { Modals } from '../../../src/js/gi/containers/Modals';
import reducer from '../../../src/js/gi/reducers';

const defaultProps = createStore(reducer).getState();

describe('<Modals>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Modals {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
