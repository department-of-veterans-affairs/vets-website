import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash/fp';

import { getFormDOM } from '../../util/schemaform-utils';
import { DownloadLetterLink } from '../../../src/js/letters/components/DownloadLetterLink.jsx';
import { DOWNLOAD_STATUSES } from '../../../src/js/letters/utils/constants';

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
    const component = ReactTestUtils.renderIntoDocument(<DownloadLetterLink {...props}/>);
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'button');

    ReactTestUtils.Simulate.click(button);

    expect(getLetterPdf.args[0]).to.eql([defaultProps.letterType, defaultProps.letterName, undefined]);
    expect(global.window.dataLayer[0]).to.eql({
      event: 'letter-download',
      'letter-type': defaultProps.letterType
    });

    // Cleanup on aisle 3
    global.window = oldWindow;
  });

  it('should update button when status is downloading', () => {
    const props = Object.assign({}, defaultProps, { downloadStatus: DOWNLOAD_STATUSES.downloading });
    const component = ReactTestUtils.renderIntoDocument(<DownloadLetterLink {...props}/>);
    const tree = getFormDOM(component);
    const button = tree.getElement('button');

    expect(button.textContent).to.equal('Downloading...');
    expect(button.disabled).to.be.true;
  });
});
