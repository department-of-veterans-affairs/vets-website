import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DownloadPage } from '../../../src/js/blue-button/containers/DownloadPage';

describe('DownloadPage', () => {
  const tree = SkinDeep.shallowRender(<DownloadPage/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});

