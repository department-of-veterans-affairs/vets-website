import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import FileSubmissionsInProgress from '../../../components/claim-files-tab-v2/FileSubmissionsInProgress';

describe('<FileSubmissionsInProgress>', () => {
  context(
    'when claim has no evidence submissions and no supporting documents',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          evidenceSubmissions: [],
          supportingDocuments: [],
        },
      };

      it('should render with message that there are no file submissions in progress', () => {
        const { container, getByText } = render(
          <FileSubmissionsInProgress claim={claim} />,
        );

        expect($('.file-submissions-in-progress-container', container)).to
          .exist;
        expect(getByText('File submissions in progress')).to.exist;
        expect(getByText('You don’t have any file submissions in progress.')).to
          .exist;
      });
    },
  );

  context(
    'when claim has no evidence submissions but has supporting documents',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          evidenceSubmissions: [],
          supportingDocuments: [
            {
              documentId: '{1}',
              documentTypeLabel: 'Medical records',
              originalFileName: 'medical-record.pdf',
              uploadDate: '2024-01-01',
            },
          ],
        },
      };

      it('should render with message that all files have been received', () => {
        const { container, getByText } = render(
          <FileSubmissionsInProgress claim={claim} />,
        );

        expect($('.file-submissions-in-progress-container', container)).to
          .exist;
        expect(getByText('File submissions in progress')).to.exist;
        expect(getByText('We’ve received all the files you’ve uploaded.')).to
          .exist;
      });
    },
  );

  context('when claim has evidence submissions', () => {
    const claim = {
      type: 'claim',
      attributes: {
        evidenceSubmissions: [
          {
            id: 1,
            createdAt: '2024-01-15T10:00:00Z',
          },
          {
            id: 2,
            createdAt: '2024-01-10T10:00:00Z',
          },
        ],
        supportingDocuments: [],
      },
    };

    it('should render with placeholder for in progress items', () => {
      const { container, getByText, queryByText } = render(
        <FileSubmissionsInProgress claim={claim} />,
      );

      expect($('.file-submissions-in-progress-container', container)).to.exist;
      expect(getByText('File submissions in progress')).to.exist;
      expect(getByText('Placeholder for 2 in progress items')).to.exist;
      expect(queryByText('You don’t have any file submissions in progress.')).to
        .not.exist;
    });
  });
});
