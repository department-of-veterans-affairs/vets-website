import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import VALettersApp from '../../../src/js/va-letters/containers/VALettersApp';

import reducer from '../../../src/js/va-letters/reducers';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);

describe('<VALettersApp>', () => {
  it('should render', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<VALettersApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
