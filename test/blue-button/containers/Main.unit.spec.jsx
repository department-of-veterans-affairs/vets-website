import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Main } from '../../../src/js/blue-button/containers/Main';

const props = {};

describe('<DownloadPage>', () => {
  const tree = SkinDeep.shallowRender(<Main {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
