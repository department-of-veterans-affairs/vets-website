import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import DocumentDownload from '../../components/DocumentDownload';

const defaultProps = {
  claimId: 'ABC',
  documentId: '123',
  filename: 'file.pdf',
  mimetype: 'application/pdf',
  text: 'Download file.pdf',
};

describe('DocumentDownload', () => {
  let apiStub;
  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest');
  });
  afterEach(() => {
    apiStub.restore();
  });

  it('renders', () => {
    render(<DocumentDownload {...defaultProps} />);
    expect($('va-link[text="Download file.pdf"]')).to.exist;
  });

  it('renders loading state', () => {
    render(<DocumentDownload {...defaultProps} />);

    const link = $('va-link[text="Download file.pdf"]');
    expect(link).to.exist;

    fireEvent.click(link);
    expect($('va-icon[icon="autorenew"]')).to.exist;
  });

  it('renders error state', async () => {
    apiStub.rejects();
    const screen = render(<DocumentDownload {...defaultProps} />);

    const link = $('va-link[text="Download file.pdf"]');
    expect(link).to.exist;

    fireEvent.click(link);

    await waitFor(() => {
      expect($('va-icon[icon="error"]')).to.exist;
      expect(
        screen.getByText(
          'We were unable to get your file to download. Please try again later.',
        ),
      ).to.exist;
    });
  });
});
