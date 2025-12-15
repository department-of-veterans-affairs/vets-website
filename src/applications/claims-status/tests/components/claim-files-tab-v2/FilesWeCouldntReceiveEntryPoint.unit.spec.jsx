import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FilesWeCouldntReceiveEntryPoint from '../../../components/claim-files-tab-v2/FilesWeCouldntReceiveEntryPoint';

describe('<FilesWeCouldntReceiveEntryPoint>', () => {
  context('when there are failed uploads', () => {
    const evidenceSubmissionsWithFailures = [
      {
        id: 1,
        fileName: 'failed-document.pdf',
        documentType: 'Medical records',
        uploadStatus: 'FAILED',
        failedDate: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        fileName: 'successful-document.pdf',
        documentType: 'Birth Certificate',
        uploadStatus: 'SUCCESS',
      },
    ];

    it('should render the entry point section', () => {
      const { getByTestId, getByText } = render(
        <FilesWeCouldntReceiveEntryPoint
          evidenceSubmissions={evidenceSubmissionsWithFailures}
        />,
      );

      expect(getByTestId('files-we-couldnt-receive-entry-point')).to.exist;
      expect(getByText('Files we couldn’t receive')).to.exist;
    });

    it('should display a link to the Files We Couldn’t Receive page', () => {
      const { container } = render(
        <FilesWeCouldntReceiveEntryPoint
          evidenceSubmissions={evidenceSubmissionsWithFailures}
        />,
      );

      const link = container.querySelector('va-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('../files-we-couldnt-receive');
      expect(link.getAttribute('text')).to.equal(
        'Learn which files we couldn’t receive and other ways to send your documents',
      );
    });
  });

  context('when there are no failed uploads', () => {
    const evidenceSubmissionsWithoutFailures = [
      {
        id: 1,
        fileName: 'successful-document.pdf',
        documentType: 'Medical records',
        uploadStatus: 'SUCCESS',
      },
      {
        id: 2,
        fileName: 'in-progress-document.pdf',
        documentType: 'Birth Certificate',
        uploadStatus: 'QUEUED',
      },
    ];

    it('should not render anything', () => {
      const { queryByTestId } = render(
        <FilesWeCouldntReceiveEntryPoint
          evidenceSubmissions={evidenceSubmissionsWithoutFailures}
        />,
      );

      expect(queryByTestId('files-we-couldnt-receive-entry-point')).to.not
        .exist;
    });
  });

  context('when evidenceSubmissions is null or undefined', () => {
    it('should not render when evidenceSubmissions is null', () => {
      const { queryByTestId } = render(
        <FilesWeCouldntReceiveEntryPoint evidenceSubmissions={null} />,
      );

      expect(queryByTestId('files-we-couldnt-receive-entry-point')).to.not
        .exist;
    });

    it('should not render when evidenceSubmissions is undefined', () => {
      const { queryByTestId } = render(
        <FilesWeCouldntReceiveEntryPoint evidenceSubmissions={undefined} />,
      );

      expect(queryByTestId('files-we-couldnt-receive-entry-point')).to.not
        .exist;
    });

    it('should not render when evidenceSubmissions is an empty array', () => {
      const { queryByTestId } = render(
        <FilesWeCouldntReceiveEntryPoint evidenceSubmissions={[]} />,
      );

      expect(queryByTestId('files-we-couldnt-receive-entry-point')).to.not
        .exist;
    });
  });
});
