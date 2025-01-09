import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import { expect } from 'chai';
import set from 'platform/utilities/data/set';

import { getFormDOM } from 'platform/testing/unit/schemaform-utils';
import { DownloadLetterLink } from '../../components/DownloadLetterLink.jsx';
import { DOWNLOAD_STATUSES } from '../../utils/constants';

const defaultProps = {
  letterTitle: 'Commissary Letter',
  letterType: 'commissary',
};

const lhMigrationOptions = {
  listEndpoint: {
    method: 'GET',
    path: '/v0/letters',
  },
  summaryEndpoint: {
    method: 'GET',
    path: '/v0/letters/beneficiary',
  },
  downloadEndpoint: {
    method: 'POST',
    path: '/v0/letters',
  },
  dataEntryPoint: ['data', 'attributes'],
};

describe('<DownloadLetterLink>', () => {
  it('should render', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...defaultProps} />,
    );
    const tree = getFormDOM(component);
    expect(tree.getElement('div')).to.not.be.null;
  });

  it('should show download button', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...defaultProps} />,
    );
    const tree = getFormDOM(component);
    expect(tree.getElement('va-button').text).to.equal(
      'Commissary Letter (PDF)',
    );
  });

  it('should call getLetterPdf when clicked', () => {
    const oldDataLayer = global.window.dataLayer;
    global.window.dataLayer = [];

    const getLetterPdf = sinon.spy();
    const props = set(
      'getLetterPdf',
      getLetterPdf,
      defaultProps,
      lhMigrationOptions,
    );
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...props} />,
    );
    const button = ReactTestUtils.findRenderedDOMComponentWithTag(
      component,
      'va-button',
    );

    ReactTestUtils.Simulate.click(button);

    expect(getLetterPdf.args[0]).to.eql([
      defaultProps.letterType,
      defaultProps.letterTitle,
      undefined,
      undefined,
    ]);
    expect(global.window.dataLayer[0]).to.eql({
      event: 'letter-download',
      'letter-type': defaultProps.letterType,
    });

    // Cleanup on aisle 3
    global.window.dataLayer = oldDataLayer;
  });

  it('should update button when status is downloading', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.downloading,
    };
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...props} />,
    );
    const tree = getFormDOM(component);
    const button = tree.getElement('va-button');

    expect(button.text).to.equal('Downloading...');
    expect(button.disabled).to.be.true;
  });

  it('should show success message', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.success,
    };
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...props} />,
    );
    const tree = getFormDOM(component);

    expect(tree.getElement('va-button').text).to.equal(
      'Commissary Letter (PDF)',
    );
    expect(tree.textContent).to.contain(
      'Your letter has successfully downloaded.',
    );
  });

  it('should show failure message', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.failure,
    };
    const component = ReactTestUtils.renderIntoDocument(
      <DownloadLetterLink {...props} />,
    );
    const tree = getFormDOM(component);

    expect(tree.getElement('va-button').text).to.contain('Retry download');
    expect(tree.textContent).to.contain('Your letter didn’t download.');
  });
});
