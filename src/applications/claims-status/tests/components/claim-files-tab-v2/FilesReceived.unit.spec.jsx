import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import FilesReceived from '../../../components/claim-files-tab-v2/FilesReceived';

describe('<FilesReceived>', () => {
  context(
    'when claim is open, doesnt have trackedItems or supportingDocs',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [],
          supportingDocuments: [],
        },
      };

      it('should render FilesReceived section with message', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'We haven’t received any files yet.';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status SUBMITTED_AWAITING_REVIEW, has a trackedItem with no documents',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Request 1',
              documents: [],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the item date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status SUBMITTED_AWAITING_REVIEW, has a trackedItem with documents and a null upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: null,
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the item date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status SUBMITTED_AWAITING_REVIEW, has a trackedItem with documents and an upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: '2024-01-02',
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status INITIAL_REVIEW_COMPLETE, has a trackedItem with documents and an upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              receivedDate: '2024-01-03',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: '2024-01-02',
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status ACCEPTED, has a trackedItem with documents and an upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              receivedDate: '2024-01-03',
              status: 'ACCEPTED',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: '2024-01-02',
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status NO_LONGER_REQUIRED, has a closedDate, has a trackedItem with documents and an upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              closedDate: '2024-01-03',
              status: 'NO_LONGER_REQUIRED',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: '2024-01-02',
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status SUBMITTED_AWAITING_REVIEW, has a trackedItem with documents and no date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: null,
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file.pdf',
                  trackedItemId: 1,
                  uploadDate: null,
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context(
    'when claim status SUBMITTED_AWAITING_REVIEW, has a trackedItem with multiple documents and a null upload date',
    () => {
      const claim = {
        type: 'claim',
        attributes: {
          trackedItems: [
            {
              id: 1,
              date: '2024-01-01',
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Request 1',
              documents: [
                {
                  documentId: '{1}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file1.pdf',
                  trackedItemId: 1,
                  uploadDate: null,
                },
                {
                  documentId: '{2}',
                  documentTypeLabel: 'Correspondence',
                  originalFileName: 'file2.pdf',
                  trackedItemId: 1,
                  uploadDate: null,
                },
              ],
            },
          ],
          supportingDocuments: [],
        },
      };

      it('should render a FilesReceived section with multiple items in a request', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );
        expect($('.files-received-container', container)).to.exist;
        const text = 'Placeholder for 1 files received';
        expect(getByText(text)).to.exist;
      });
    },
  );

  context('when claim has a multiple trackedItems', () => {
    const claim = {
      type: 'claim',
      attributes: {
        trackedItems: [
          {
            id: 1,
            date: '2024-01-01',
            status: 'SUBMITTED_AWAITING_REVIEW',
            displayName: 'Request 1',
            documents: [
              {
                documentId: '{1}',
                documentTypeLabel: 'Correspondence',
                originalFileName: 'file1.pdf',
                trackedItemId: 1,
                uploadDate: '2024-01-14',
              },
              {
                documentId: '{2}',
                documentTypeLabel: 'Correspondence',
                originalFileName: 'file2.pdf',
                trackedItemId: 1,
                uploadDate: '2024-01-11',
              },
            ],
          },
          {
            id: 2,
            date: '2024-01-07',
            status: 'ACCEPTED',
            receivedDate: '2024-01-09',
            displayName: 'Request 2',
            documents: [
              {
                documentId: '{3}',
                documentTypeLabel: 'Military Personnel Record',
                originalFileName: 'file3.pdf',
                trackedItemId: 2,
                uploadDate: '2024-01-08',
              },
            ],
          },
          {
            id: 3,
            date: '2024-01-15',
            closedDate: '2024-01-03',
            status: 'NO_LONGER_REQUIRED',
            displayName: 'Request 3',
            documents: [
              {
                documentId: '{4}',
                documentTypeLabel: 'Submit buddy statement(s)',
                originalFileName: 'file4.pdf',
                trackedItemId: 3,
                uploadDate: null,
              },
            ],
          },
        ],
        supportingDocuments: [],
      },
    };

    it('should render a FilesReceived section with multiple items in a request', () => {
      const { container, getByText } = render(<FilesReceived claim={claim} />);
      expect($('.files-received-container', container)).to.exist;
      const text = 'Placeholder for 3 files received';
      expect(getByText(text)).to.exist;
    });

    // TODO: Add test for masking filenames from Datadog (no PII) when there are multiple filenames
    // it('should mask filenames from Datadog (no PII)', () => {
    //   const { container } = render(<FilesReceived claim={claim} />);
    //   expect(
    //     $('.filename-title', container).getAttribute('data-dd-privacy'),
    //   ).to.equal('mask');
    // });
  });
});
