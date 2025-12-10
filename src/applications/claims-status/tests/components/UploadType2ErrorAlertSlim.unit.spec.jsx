import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithRouter } from '../utils';

import UploadType2ErrorAlertSlim from '../../components/UploadType2ErrorAlertSlim';
import * as analytics from '../../utils/analytics';

describe('<UploadType2ErrorAlertSlim>', () => {
  let recordType2FailureEventListPageStub;

  beforeEach(() => {
    recordType2FailureEventListPageStub = sinon.stub(
      analytics,
      'recordType2FailureEventListPage',
    );
  });

  afterEach(() => {
    recordType2FailureEventListPageStub.restore();
  });

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
    expect(recordType2FailureEventListPageStub.called).to.be.false;
  });

  it('should not render when failedSubmissions is null', () => {
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={null} />,
    );

    expect(container.firstChild).to.be.null;
    expect(recordType2FailureEventListPageStub.called).to.be.false;
  });

  it('should not render when failedSubmissions is undefined', () => {
    const { container } = renderWithRouter(
      <UploadType2ErrorAlertSlim failedSubmissions={undefined} />,
    );

    expect(container.firstChild).to.be.null;
    expect(recordType2FailureEventListPageStub.called).to.be.false;
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

  context('Google Analytics', () => {
    it('should record Type 2 failure analytics event when component renders with failed submissions', async () => {
      const failedSubmissions = [
        createFailedSubmission(
          new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ),
      ];

      renderWithRouter(
        <UploadType2ErrorAlertSlim failedSubmissions={failedSubmissions} />,
      );

      // Wait for the debounced event to fire (100ms timeout)
      await new Promise(resolve => setTimeout(resolve, 101));

      expect(recordType2FailureEventListPageStub.calledOnce).to.be.true;
      expect(
        recordType2FailureEventListPageStub.calledWith({
          failedDocumentCount: 1,
          entryPoint: 'claims-list',
        }),
      ).to.be.true;
    });
  });
});
