import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DownloadFormPDF } from './DownloadFormPDF';
import * as pdfUtils from '../../utils/pdfDownload';

describe('DownloadFormPDF', () => {
  let fetchPdfApiStub;
  let downloadBlobStub;

  const mockGuid = '12345678-1234-1234-1234-123456789abc';

  const mockVeteranName = {
    first: 'Anakin',
    middle: 'L',
    last: 'Skywalker',
  };

  beforeEach(() => {
    fetchPdfApiStub = sinon.stub(pdfUtils, 'fetchPdfApi');
    downloadBlobStub = sinon.stub(pdfUtils, 'downloadBlob');

    // Mock successful PDF blob
    const mockBlob = new Blob(['mock pdf content'], {
      type: 'application/pdf',
    });
    fetchPdfApiStub.resolves(mockBlob);
  });

  afterEach(() => {
    fetchPdfApiStub.restore();
    downloadBlobStub.restore();
  });

  it('should render the download button', () => {
    const { container, getByText } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    expect(getByText('Download your form')).to.exist;
    expect(
      getByText(
        'Download a PDF copy of your completed VA Form 21-0779 for your records.',
      ),
    ).to.exist;

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Download a copy of your VA Form 21-0779 (PDF)',
    );
  });

  it('should show loading state when downloading', async () => {
    // Make the fetch take some time
    fetchPdfApiStub.returns(
      new Promise(resolve => {
        setTimeout(() => resolve(new Blob()), 100);
      }),
    );

    const { container } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    // Should show loading indicator
    await waitFor(() => {
      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Downloading your completed form...',
      );
    });
  });

  it('should download the PDF when button is clicked', async () => {
    const { container } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(fetchPdfApiStub.calledOnce).to.be.true;
      expect(fetchPdfApiStub.calledWith(mockGuid)).to.be.true;
      expect(downloadBlobStub.calledOnce).to.be.true;
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-0779_Anakin_Skywalker.pdf',
      );
    });
  });

  it('should show error message when download fails', async () => {
    fetchPdfApiStub.rejects(new Error('API Error'));

    const { container, getByText, getByRole } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      const alert = getByRole('alert');
      expect(alert).to.exist;
      expect(getByText('Download failed')).to.exist;
      expect(
        getByText(
          "We're sorry. Something went wrong when downloading your form. Please try again later.",
        ),
      ).to.exist;
    });
  });

  it('should show try again button after error', async () => {
    fetchPdfApiStub.rejects(new Error('API Error'));

    const { container } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      const retryButton = container.querySelector(
        'va-alert va-button[text="Try again"]',
      );
      expect(retryButton).to.exist;
    });

    // Reset stub to succeed
    fetchPdfApiStub.reset();
    const mockBlob = new Blob(['mock pdf content'], {
      type: 'application/pdf',
    });
    fetchPdfApiStub.resolves(mockBlob);

    // Click try again
    const tryAgainButton = container.querySelector(
      'va-alert va-button[text="Try again"]',
    );
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(fetchPdfApiStub.calledOnce).to.be.true;
      expect(downloadBlobStub.called).to.be.true;
    });
  });

  it('should show error when submission ID is missing', () => {
    const { container, getByText } = render(
      <DownloadFormPDF guid="" veteranName={mockVeteranName} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    waitFor(() => {
      expect(
        getByText('No submission ID available. Please submit the form first.'),
      ).to.exist;
      expect(fetchPdfApiStub.called).to.be.false;
    });
  });

  it('should use default veteran name when not provided', () => {
    const { container } = render(<DownloadFormPDF guid={mockGuid} />);

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    waitFor(() => {
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-0779_Veteran_Submission.pdf',
      );
    });
  });

  it('should format filename correctly with special characters', async () => {
    const specialNameVeteran = {
      first: "Obi-Wan's",
      middle: 'K',
      last: 'Kenobi-Solo',
    };

    const { container } = render(
      <DownloadFormPDF guid={mockGuid} veteranName={specialNameVeteran} />,
    );

    const link = container.querySelector('va-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(downloadBlobStub.calledOnce).to.be.true;
      // Special characters should be removed from filename
      expect(downloadBlobStub.getCall(0).args[1]).to.equal(
        '21-0779_ObiWans_KenobiSolo.pdf',
      );
    });
  });
});
