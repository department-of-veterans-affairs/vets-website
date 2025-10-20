import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import UploadType2ErrorAlert from '../../components/UploadType2ErrorAlert';

describe('<UploadType2ErrorAlert>', () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(
    Date.now() - 1 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const fiveDaysAgo = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const tenDaysAgo = new Date(
    Date.now() - 10 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const createFailedSubmission = (overrides = {}) => ({
    id: 1,
    fileName: 'test-document.pdf',
    documentType: 'L023',
    uploadStatus: 'FAILED',
    acknowledgementDate: tomorrow,
    ...overrides,
  });

  it('should render null when there are no failed submissions', () => {
    const { container } = render(
      <UploadType2ErrorAlert failedSubmissions={[]} />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('should render null when failed submissions array is undefined', () => {
    const { container } = render(
      <UploadType2ErrorAlert failedSubmissions={undefined} />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  context(
    'when there are one or two failed submissions within the last 30 days',
    () => {
      it('should render alert and show the first two failed submissions', () => {
        const failedSubmissions = [
          createFailedSubmission({
            id: 1,
            fileName: 'first-document.pdf',
            failedDate: tenDaysAgo,
          }),
          createFailedSubmission({
            id: 2,
            fileName: 'second-document.pdf',
            documentType: 'L034',
            failedDate: fiveDaysAgo,
          }),
        ];

        const { container, getByText } = render(
          <UploadType2ErrorAlert failedSubmissions={failedSubmissions} />,
        );
        const alert = container.querySelector('va-alert');

        expect(alert).to.exist;
        // The failures should be in chronological order
        getByText('second-document.pdf');
        getByText('File type: L023');
        getByText('first-document.pdf');
        getByText('File type: L034');
      });
    },
  );

  context(
    'when there are more than two failed submissions within the last 30 days',
    () => {
      it('should render alert showing only the most recent failed submission and then text showing the count for the remaining failed submissions', () => {
        const failedSubmissions = [
          createFailedSubmission({
            id: 3,
            fileName: 'file-3.pdf',
            failedDate: tenDaysAgo,
          }),
          createFailedSubmission({
            id: 2,
            fileName: 'file-2.pdf',
            documentType: 'L034',
            failedDate: fiveDaysAgo,
          }),
          createFailedSubmission({
            id: 1,
            fileName: 'file-1.pdf',
            documentType: 'L107',
            failedDate: yesterday,
          }),
        ];

        const { container, getByText, queryByText } = render(
          <UploadType2ErrorAlert failedSubmissions={failedSubmissions} />,
        );
        const alert = container.querySelector('va-alert');

        expect(alert).to.exist;
        // Should show most recent item (by failedDate)
        getByText('file-1.pdf');
        // Should not show other items
        expect(queryByText('file-2.pdf')).to.not.exist;
        expect(queryByText('file-3.pdf')).to.not.exist;
        // Should show count message
        getByText('And 2 more within the last 30 days');
      });
    },
  );

  context('when the submission is a tracked item', () => {
    it('should display request type', () => {
      const failedSubmissions = [
        createFailedSubmission({
          fileName: 'medical-records.pdf',
          trackedItemId: 1,
          trackedItemDisplayName: 'Medical records',
        }),
      ];

      const { getByText } = render(
        <UploadType2ErrorAlert failedSubmissions={failedSubmissions} />,
      );

      getByText('Request type: Medical records');
    });
  });

  context('when the submission is not a tracked item', () => {
    it('should display a static evidence submission message', () => {
      const failedSubmissions = [createFailedSubmission()];

      const { getByText } = render(
        <UploadType2ErrorAlert failedSubmissions={failedSubmissions} />,
      );

      getByText('test-document.pdf');
      getByText('File type: L023');
      getByText('You submitted this file as additional evidence');
    });
  });

  it('should render link to files we couldnt receive page', () => {
    const failedSubmissions = [createFailedSubmission()];

    const { container } = render(
      <UploadType2ErrorAlert failedSubmissions={failedSubmissions} />,
    );
    const link = container.querySelector('va-link-action');

    expect(link).to.exist;
    expect(link).to.have.attr(
      'href',
      '/track-claims/your-claims/files-we-couldnt-receive',
    );
    expect(link).to.have.attr(
      'text',
      "Review files we couldn't process and learn other ways to send your documents",
    );
  });
});
