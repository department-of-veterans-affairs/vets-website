import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import UploadType2ErrorAlert from '../../components/UploadType2ErrorAlert';
import * as analytics from '../../utils/analytics';

describe('<UploadType2ErrorAlert>', () => {
  let recordType2FailureEventStub;

  beforeEach(() => {
    recordType2FailureEventStub = sinon.stub(
      analytics,
      'recordType2FailureEvent',
    );
  });

  afterEach(() => {
    recordType2FailureEventStub.restore();
  });

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
      <UploadType2ErrorAlert failedSubmissions={[]} isStatusPage />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
    expect(recordType2FailureEventStub.called).to.be.false;
  });

  it('should render null when failed submissions array is undefined', () => {
    const { container } = render(
      <UploadType2ErrorAlert failedSubmissions={undefined} isStatusPage />,
    );

    expect(container.querySelector('va-alert')).to.not.exist;
    expect(recordType2FailureEventStub.called).to.be.false;
  });

  context('Google Analytics', () => {
    it('should record Type 2 failure analytics event when component renders with failed submissions on status tab', () => {
      const failedSubmissions = [
        createFailedSubmission({ id: 1, fileName: 'test1.pdf' }),
        createFailedSubmission({ id: 2, fileName: 'test2.pdf' }),
        createFailedSubmission({ id: 3, fileName: 'test3.pdf' }),
      ];

      render(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage
        />,
      );

      expect(recordType2FailureEventStub.calledOnce).to.be.true;
      expect(recordType2FailureEventStub.calledWith({ count: 1 })).to.be.true;
    });

    it('should NOT record analytics event when isStatusPage is false (files tab)', () => {
      const failedSubmissions = [
        createFailedSubmission({ id: 1, fileName: 'test1.pdf' }),
      ];

      render(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage={false}
        />,
      );

      expect(recordType2FailureEventStub.called).to.be.false;
    });

    it('should not record analytics event multiple times for same submissions', () => {
      const failedSubmissions = [createFailedSubmission()];

      const { rerender } = render(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage
        />,
      );

      expect(recordType2FailureEventStub.calledOnce).to.be.true;
      // Rerender with same data
      rerender(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage
        />,
      );
      // Should still only be called once
      expect(recordType2FailureEventStub.calledOnce).to.be.true;
    });
  });

  context(
    'when there are one or two failed submissions within the last 30 days',
    () => {
      it('should render alert and show the first two failed submissions in chronological order', () => {
        const failedSubmissions = [
          createFailedSubmission({
            id: 2,
            fileName: 'first-document.pdf',
            failedDate: tenDaysAgo,
          }),
          createFailedSubmission({
            id: 1,
            fileName: 'second-document.pdf',
            documentType: 'L034',
            failedDate: fiveDaysAgo,
          }),
        ];

        const { container } = render(
          <UploadType2ErrorAlert
            failedSubmissions={failedSubmissions}
            isStatusPage
          />,
        );
        const alert = container.querySelector('va-alert');

        expect(alert).to.exist;

        const listItems = container.querySelectorAll('ul li');
        // The failures should be in chronological order
        expect(listItems).to.have.length(2);
        expect(listItems[0].textContent).to.include('second-document.pdf');
        expect(listItems[0].textContent).to.include('File type: L034');
        expect(listItems[1].textContent).to.include('first-document.pdf');
        expect(listItems[1].textContent).to.include('File type: L023');
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
          <UploadType2ErrorAlert
            failedSubmissions={failedSubmissions}
            isStatusPage
          />,
        );
        const alert = container.querySelector('va-alert');

        expect(alert).to.exist;
        // Should show most recent failure
        getByText('file-1.pdf');
        // Should not show other failures
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
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage
        />,
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
      <UploadType2ErrorAlert
        failedSubmissions={failedSubmissions}
        isStatusPage
      />,
    );
    const link = container.querySelector('va-link-action');

    expect(link).to.exist;
    expect(link).to.have.attr('href', '../files-we-couldnt-receive');
    expect(link).to.have.attr(
      'text',
      "Review files we couldn't process and learn other ways to send your documents",
    );
  });

  context('heading level based on page context', () => {
    it('should render h4 heading when isStatusPage is true', () => {
      const failedSubmissions = [createFailedSubmission()];

      const { container } = render(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage
        />,
      );

      expect(container.querySelector('h4')).to.exist;
      expect(container.querySelector('h3')).to.not.exist;
    });

    it('should render h3 heading when isStatusPage is false', () => {
      const failedSubmissions = [createFailedSubmission()];

      const { container } = render(
        <UploadType2ErrorAlert
          failedSubmissions={failedSubmissions}
          isStatusPage={false}
        />,
      );

      expect(container.querySelector('h3')).to.exist;
      expect(container.querySelector('h4')).to.not.exist;
    });
  });
});
