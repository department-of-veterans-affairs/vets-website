import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import DownloadLetters from '../../../src/js/letters/containers/DownloadLetters';

import reducer from '../../../src/js/letters/reducers/index.js';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);

describe('<DownloadLetters>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetters store={store}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});

