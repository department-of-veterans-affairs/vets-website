import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DocumentsFiled from '../../../components/claim-files-tab/DocumentsFiled';

describe('<DocumentsFiled>', () => {
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

      it('should render DocumentsFiled section with message', () => {
        const { container, getByText } = render(
          <DocumentsFiled claim={claim} />,
        );
        const text = 'You haven’t turned in any documents to the VA.';
        expect($('.documents-filed-container', container)).to.exist;
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
          <DocumentsFiled claim={claim} />,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('Received on January 1, 2024')).to.exist;
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
          <DocumentsFiled claim={claim} />,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('Received on January 2, 2024')).to.exist;
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
        const { container, getByText, queryByText } = render(
          <DocumentsFiled claim={claim} />,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(queryByText('Received on January 2, 2024')).not.to.exist;
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

      it('should render a DocumentsFiled section and the received date is the item date', () => {
        const { container, getByText, getAllByText } = render(
          <DocumentsFiled claim={claim} />,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file1.pdf')).to.exist;
        expect(getByText('file2.pdf')).to.exist;
        expect(getAllByText('Request type: Request 1').length).to.equal(2);
        expect(getAllByText('Document type: Correspondence').length).to.equal(
          2,
        );
        expect(getAllByText('Received on January 1, 2024').length).to.equal(2);
        expect(getByText('Pending review')).to.exist;
      });
    },
  );
});
