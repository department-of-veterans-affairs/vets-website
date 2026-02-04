/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import userEvent from '@testing-library/user-event';

import FileSubmissionsInProgress from '../../../components/claim-files-tab-v2/FileSubmissionsInProgress';

// Redux store with feature toggle enabled
const store = createStore(() => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    cst_timezone_discrepancy_mitigation: true,
  },
}));

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
          <Provider store={store}>
            <FileSubmissionsInProgress claim={claim} />
          </Provider>,
        );

        expect($('.file-submissions-in-progress-container', container)).to
          .exist;
        const heading = $('h3#file-submissions-in-progress', container);
        expect(heading).to.exist;
        expect(heading.textContent).to.equal('File submissions in progress');
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
          <Provider store={store}>
            <FileSubmissionsInProgress claim={claim} />
          </Provider>,
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
            fileName: 'test-document-1.pdf',
            documentType: 'Medical records',
            createdAt: '2024-01-15T10:00:00Z',
            uploadStatus: 'QUEUED',
          },
          {
            id: 2,
            fileName: 'test-document-2.pdf',
            documentType: 'Birth Certificate',
            createdAt: '2024-01-10T10:00:00Z',
            uploadStatus: 'PROCESSING',
          },
        ],
        supportingDocuments: [],
      },
    };

    it('should render cards for in progress items', () => {
      const {
        container,
        getByText,
        getAllByText,
        queryByText,
        getByTestId,
      } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claim} />
        </Provider>,
      );

      expect($('.file-submissions-in-progress-container', container)).to.exist;
      expect(getByText('File submissions in progress')).to.exist;
      expect(queryByText('You don’t have any file submissions in progress.')).to
        .not.exist;

      // Check that both cards are rendered
      expect(getByTestId('file-in-progress-card-0')).to.exist;
      expect(getByTestId('file-in-progress-card-1')).to.exist;

      // Check file names
      expect(getByText('test-document-1.pdf')).to.exist;
      expect(getByText('test-document-2.pdf')).to.exist;

      // Check document types
      expect(getByText('Document type: Medical records')).to.exist;
      expect(getByText('Document type: Birth Certificate')).to.exist;

      // Check status badges
      expect(getAllByText('SUBMISSION IN PROGRESS')).to.have.lengthOf(2);

      // Check dates
      expect(getByText('Submission started on January 15, 2024')).to.exist;
      expect(getByText('Submission started on January 10, 2024')).to.exist;
    });
  });

  context('when claim has more than 5 evidence submissions', () => {
    const claim = {
      type: 'claim',
      attributes: {
        evidenceSubmissions: Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          fileName: `file${i + 1}.pdf`,
          documentType: 'Medical records',
          createdAt: `2024-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
          uploadStatus: 'QUEUED',
        })),
        supportingDocuments: [],
      },
    };

    it('should initially show only 5 items and a show more button', () => {
      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claim} />
        </Provider>,
      );

      for (let i = 0; i < 5; i++) {
        expect(getByTestId(`file-in-progress-card-${i}`)).to.exist;
      }
      expect(queryByTestId('file-in-progress-card-5')).to.not.exist;

      const showMoreButton = getByTestId('show-more-in-progress-button');
      expect(showMoreButton).to.exist;
      expect(showMoreButton.getAttribute('text')).to.equal(
        'Show more in progress (3)',
      );
    });

    it('should show more items when show more button is clicked', async () => {
      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claim} />
        </Provider>,
      );

      const showMoreButton = getByTestId('show-more-in-progress-button');
      userEvent.click(showMoreButton);

      for (let i = 0; i < 8; i++) {
        expect(getByTestId(`file-in-progress-card-${i}`)).to.exist;
      }
      expect(queryByTestId('show-more-in-progress-button')).to.not.exist;
    });
  });

  context('when claim has failed uploads', () => {
    const claimWithFailedUploads = {
      type: 'claim',
      attributes: {
        evidenceSubmissions: [
          {
            id: 1,
            fileName: 'failed-document.pdf',
            documentType: 'Medical records',
            createdAt: '2024-01-15T10:00:00Z',
            uploadStatus: 'FAILED',
          },
        ],
        supportingDocuments: [],
      },
    };

    it('should show updated empty state message when there are failed uploads but no in-progress items', () => {
      const { getByText, queryByText } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claimWithFailedUploads} />
        </Provider>,
      );

      expect(
        getByText(
          'We received your uploaded files, except the ones our system couldn’t accept',
          { exact: false },
        ),
      ).to.exist;
      expect(queryByText('You don’t have any file submissions in progress.')).to
        .not.exist;
      expect(queryByText('We’ve received all the files you’ve uploaded.')).to
        .not.exist;
    });

    it('should show anchor link to files we could not receive section in empty state', () => {
      const { container } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claimWithFailedUploads} />
        </Provider>,
      );

      const link = container.querySelector(
        'va-link[href="#files-we-couldnt-receive"]',
      );
      expect(link).to.exist;
      expect(link.getAttribute('text')).to.equal(
        'Files we couldn’t receive section',
      );
    });
  });

  context('when claim has no failed uploads', () => {
    const claimWithoutFailedUploads = {
      type: 'claim',
      attributes: {
        evidenceSubmissions: [
          {
            id: 1,
            fileName: 'successful-document.pdf',
            documentType: 'Medical records',
            createdAt: '2024-01-15T10:00:00Z',
            uploadStatus: 'SUCCESS',
          },
        ],
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

    it('should show standard empty state message when there are no failed or in-progress uploads', () => {
      const { getByText } = render(
        <Provider store={store}>
          <FileSubmissionsInProgress claim={claimWithoutFailedUploads} />
        </Provider>,
      );

      expect(getByText('We’ve received all the files you’ve uploaded.')).to
        .exist;
    });
  });
});
