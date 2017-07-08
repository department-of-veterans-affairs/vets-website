import React from 'react';
// import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
// import sinon from 'sinon';
import SkinDeep from 'skin-deep';
// import ReactTestUtils from 'react-dom/test-utils';

import { DownloadLetterLink } from '../../../src/js/letters/components/DownloadLetterLink.jsx';

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
  /*
  it('should call getLetterPdf when clicked', () => {
    const oldWindow = global.window;
    global.window = {
      dataLayer: [],
    };
    const getLetterPdf = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...defaultProps}/>);
    const findDOM = findDOMNode(tree);

    const link = findDOM.querySelector('a');
    expect(link).to.exist;
    ReactTestUtils.Simulate.click(findDOM.querySelector('a'));
    expect(getLetterPdf.calledOnce).to.be.true;

    global.window = oldWindow;
  });
  */
});
