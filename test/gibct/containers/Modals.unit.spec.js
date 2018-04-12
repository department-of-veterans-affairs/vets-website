import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../src/platform/startup/store';
import { Modals } from '../../../src/js/gi/containers/Modals';
import reducer from '../../../src/js/gi/reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<Modals>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Modals {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
