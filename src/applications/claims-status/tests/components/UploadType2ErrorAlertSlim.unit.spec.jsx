import React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { renderWithRouter } from '../utils';

import UploadType2ErrorAlertSlim from '../../components/UploadType2ErrorAlertSlim';
import { Type2FailureAnalyticsProvider } from '../../contexts/Type2FailureAnalyticsContext';

// Wrapper that provides the analytics context
function TestWrapper({ children }) {
  return (
    <Type2FailureAnalyticsProvider>{children}</Type2FailureAnalyticsProvider>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.node,
};

describe('<UploadType2ErrorAlertSlim>', () => {
  const TEST_CLAIM_ID = 'test-claim-123';
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
      <TestWrapper>
        <UploadType2ErrorAlertSlim
          claimId={TEST_CLAIM_ID}
          failedSubmissions={[]}
        />
      </TestWrapper>,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
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
      <TestWrapper>
        <UploadType2ErrorAlertSlim
          claimId={TEST_CLAIM_ID}
          failedSubmissions={failedSubmissions}
        />
      </TestWrapper>,
    );
    const alert = container.querySelector('va-alert');

    expect(alert).to.exist;
    expect(alert.querySelector('p')).to.have.text(
      'We need you to resubmit files for this claim.',
    );
  });
});
