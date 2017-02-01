import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DownloadPage } from '../../../src/js/blue-button/containers/DownloadPage';

const props = {};

describe('<DownloadPage>', () => {
  const tree = SkinDeep.shallowRender(<DownloadPage {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});

