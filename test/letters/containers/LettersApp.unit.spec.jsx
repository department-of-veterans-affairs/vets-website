import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import LettersApp from '../../../src/js/letters/containers/LettersApp';

import reducer from '../../../src/js/letters/reducers';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);

describe('<LettersApp>', () => {
  it('should render', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<LettersApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
