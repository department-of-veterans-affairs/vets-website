import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash/fp';

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

  it('should call getLetterPdf when clicked', () => {
    const oldWindow = global.window;
    global.window = {
      dataLayer: [],
    };
    const getLetterPdf = sinon.spy();
    const props = _.set('getLetterPdf', getLetterPdf, defaultProps);
    const component = (ReactTestUtils.renderIntoDocument(<DownloadLetterLink {...props}/>));
    const link = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'a');
    ReactTestUtils.Simulate.click(link);
    expect(getLetterPdf.calledOnce).to.be.true;
    expect(global.window.dataLayer).not.to.be.empty;
    global.window = oldWindow;
  });
});
