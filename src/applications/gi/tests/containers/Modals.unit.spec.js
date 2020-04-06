import React from 'react';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../../platform/startup/store';
import { Modals } from '../../containers/Modals';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<Modals>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Modals {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).toBeDefined();
  });
});
