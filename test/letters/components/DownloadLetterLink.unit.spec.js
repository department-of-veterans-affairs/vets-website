import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import DownloadLetterLink from '../../../src/js/letters/components/DownloadLetterLink.jsx';

const defaultProps = {
  letterName: 'Commissary Letter',
  letterType: 'commissary'
};

describe('<DownloadLetterLink>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render Link component', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    expect(tree.subTree('Link')).to.exist;
  });

  it('should show download button', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetterLink {...defaultProps}/>);
    expect(tree.dive(['.usa-button-primary']).text()).to.equal('Download Letter');
  });
});
