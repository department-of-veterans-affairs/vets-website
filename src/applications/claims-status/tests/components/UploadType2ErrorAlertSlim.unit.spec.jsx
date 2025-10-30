import React from 'react';
import { expect } from 'chai';
import { renderWithRouter } from '../utils';

import UploadType2ErrorAlertSlim from '../../components/UploadType2ErrorAlertSlim';

describe('<UploadType2ErrorAlertSlim>', () => {
  const createFailedSubmission = (acknowledgementDate, failedDate) => ({
    acknowledgementDate,
    id: 1,
    claimId: '123',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deleteDate: null,
    documentType: 'Medical Records',
    failedDate,
    fileName: 'medical-records.pdf',
    lighthouseUpload: true,
    trackedItemId: null,
    trackedItemDisplayName: null,
    uploadStatus: 'FAILED',
    vaNotifyStatus: 'SENT',
  });

  it('should not render when there are no failed submissions', () => {
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={[]} />,
    );

    expect(container.firstChild).to.be.null;
  });

  it('should not render when failedSubmissions is null', () => {
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={null} />,
    );

    expect(container.firstChild).to.be.null;
  });

  it('should not render when failedSubmissions is undefined', () => {
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={undefined} />,
    );

    expect(container.firstChild).to.be.null;
  });

  it('should render when there are failed submissions', () => {
    const failedSubmissions = [
      createFailedSubmission(
        new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      ),
      createFailedSubmission(
        new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    ];
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={failedSubmissions} />,
    );
    const alert = container.querySelector('va-alert');

    expect(alert).to.exist;
    expect(alert.querySelector('p')).to.have.text(
      'We need you to resubmit files for this claim.',
    );
  });
});
