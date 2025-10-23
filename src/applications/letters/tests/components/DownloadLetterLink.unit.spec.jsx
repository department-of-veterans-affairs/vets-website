import React from 'react';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
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
    const { container } = render(<DownloadLetterLink {...defaultProps} />);
    const tree = getFormDOM(container);
    expect(tree.getElement('div')).to.not.be.null;
  });

  it('should show download button', () => {
    const props = {
      letterTitle: 'Download Benefit Summary Letter',
      letterType: 'benefit_summary',
    };

    const { container } = render(<DownloadLetterLink {...props} />);
    const tree = getFormDOM(container);
    expect(tree.getElement('va-button').text).to.equal(
      'Download Benefit Summary Letter (PDF)',
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
    const { container } = render(<DownloadLetterLink {...props} />);
    const button = container.querySelector('va-button');
    fireEvent.click(button);

    expect(getLetterPdf.called).to.be.true;
    expect(getLetterPdf.callCount).to.equal(1);

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

    // Cleanup on aisle 5
    global.window.dataLayer = oldDataLayer;
  });

  it('should update button when status is downloading', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.downloading,
    };
    const { container } = render(<DownloadLetterLink {...props} />);
    const tree = getFormDOM(container);
    const button = tree.getElement('va-button');

    expect(button.text).to.equal('Downloading...');
    expect(button.disabled).to.be.true;
  });

  it('should show success message', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.success,
    };
    const { container } = render(<DownloadLetterLink {...props} />);
    const tree = getFormDOM(container);

    expect(tree.getElement('va-button').text).to.equal(
      'Commissary Letter (PDF)',
    );
    expect(tree.textContent).to.contain('You downloaded your benefit letter');
    expect(tree.textContent).to.contain(
      'Your letter includes the 0 topics you selected.',
    );
    expect(tree.textContent).to.contain(
      'If you want to create a new letter with different information, select different topics and download your letter again.',
    );
  });

  it('should show failure message', () => {
    const props = {
      ...defaultProps,
      downloadStatus: DOWNLOAD_STATUSES.failure,
    };
    const { container } = render(<DownloadLetterLink {...props} />);
    const tree = getFormDOM(container);

    expect(tree.getElement('va-button').text).to.contain('Retry download');
    expect(tree.textContent).to.contain(
      'Your letter isn’t available at this time. If you need help with accessing your letter',
    );
  });
});
