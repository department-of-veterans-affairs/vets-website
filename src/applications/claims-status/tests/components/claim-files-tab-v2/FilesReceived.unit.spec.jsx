import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import userEvent from '@testing-library/user-event';

import FilesReceived from '../../../components/claim-files-tab-v2/FilesReceived';

/**
 * Helper function to verify that filename titles have data-dd-privacy="mask" attribute
 * @param {HTMLElement} container - The container element to search within
 * @param {number} expectedCount - Expected number of filename titles to be masked
 */
const expectMaskedFilenames = (container, expectedCount = 1) => {
  const filenameTitles = container.querySelectorAll('.filename-title');
  expect(filenameTitles).to.have.lengthOf(expectedCount);

  filenameTitles.forEach(title => {
    expect(title.getAttribute('data-dd-privacy')).to.equal('mask');
  });
};

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

      it('should render card with pending review status and file name unknown', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('File name unknown')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
        expect(getByText('Received on January 1, 2024')).to.exist;
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

      it('should render card with pending review and received date is the item date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
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

      it('should render card with pending review and received date is the upload date', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
        expect(getByText('Received on January 2, 2024')).to.exist;
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

      it('should render card with reviewed by VA status', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Reviewed by VA')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
        expect(getByText('Received on January 2, 2024')).to.exist;
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

      it('should render card with reviewed by VA status', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Reviewed by VA')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
        expect(getByText('Received on January 2, 2024')).to.exist;
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

      it('should render card with on file status', () => {
        const { container, getByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('On File')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(
          getByText(
            'We received this file for a closed evidence request: Request 1',
          ),
        ).to.exist;
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

      it('should render card with pending review and no received date', () => {
        const { container, getByText, queryByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByText('Pending review')).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expectMaskedFilenames(container);
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Submitted in response to request: Request 1')).to
          .exist;
        expect(queryByText(/Received on/)).to.not.exist;
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

      it('should render separate cards for each document in the tracked item', () => {
        const { container, getByTestId, getByText, getAllByText } = render(
          <FilesReceived claim={claim} />,
        );

        expect($('.files-received-container', container)).to.exist;
        expect(getByTestId('file-received-card-0')).to.exist;
        expect(getByTestId('file-received-card-1')).to.exist;
        expect(getByText('file1.pdf')).to.exist;
        expect(getByText('file2.pdf')).to.exist;
        expectMaskedFilenames(container, 2);
        expect(getAllByText('Pending review')).to.have.lengthOf(2);
        expect(
          getAllByText('Submitted in response to request: Request 1'),
        ).to.have.lengthOf(2);
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

    it('should render multiple cards sorted by date', () => {
      const { container, getByTestId, getByText, getAllByText } = render(
        <FilesReceived claim={claim} />,
      );

      expect($('.files-received-container', container)).to.exist;
      expect(getByTestId('file-received-card-0')).to.exist;
      expect(getByTestId('file-received-card-1')).to.exist;
      expect(getByTestId('file-received-card-2')).to.exist;
      expect(getByTestId('file-received-card-3')).to.exist;

      expect(getAllByText('Pending review')).to.have.lengthOf(2);
      expect(getByText('Reviewed by VA')).to.exist;
      expect(getByText('On File')).to.exist;

      expect(getByText('file1.pdf')).to.exist;
      expect(getByText('file2.pdf')).to.exist;
      expect(getByText('file3.pdf')).to.exist;
      expect(getByText('file4.pdf')).to.exist;
      expectMaskedFilenames(container, 4);
    });
  });
});

context('when claim has more than 5 items', () => {
  const claim = {
    type: 'claim',
    attributes: {
      trackedItems: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        status: 'SUBMITTED_AWAITING_REVIEW',
        displayName: `Request ${i + 1}`,
        documents: [
          {
            documentId: `{${i + 1}}`,
            documentTypeLabel: 'Correspondence',
            originalFileName: `file${i + 1}.pdf`,
            trackedItemId: i + 1,
            uploadDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
          },
        ],
      })),
      supportingDocuments: [],
    },
  };

  it('should initially show only 5 items and a show more button', () => {
    const { getByTestId, queryByTestId } = render(
      <FilesReceived claim={claim} />,
    );

    for (let i = 0; i < 5; i++) {
      expect(getByTestId(`file-received-card-${i}`)).to.exist;
    }
    expect(queryByTestId('file-received-card-5')).to.not.exist;

    const showMoreButton = getByTestId('show-more-button');
    expect(showMoreButton).to.exist;
    expect(showMoreButton.getAttribute('text')).to.equal(
      'Show more received (3)',
    );
  });

  it('should show more items when show more button is clicked', async () => {
    const { getByTestId, queryByTestId } = render(
      <FilesReceived claim={claim} />,
    );

    const showMoreButton = getByTestId('show-more-button');
    userEvent.click(showMoreButton);

    for (let i = 0; i < 8; i++) {
      expect(getByTestId(`file-received-card-${i}`)).to.exist;
    }
    expect(queryByTestId('show-more-button')).to.not.exist;
  });
});

context('when claim has supporting documents (additional evidence)', () => {
  const claim = {
    type: 'claim',
    attributes: {
      trackedItems: [],
      supportingDocuments: [
        {
          originalFileName: 'additional-evidence.pdf',
          documentTypeLabel: 'Additional Evidence',
          date: '2024-01-10',
        },
      ],
    },
  };

  it('should render card with on file badge', () => {
    const { container, getByText } = render(<FilesReceived claim={claim} />);

    expect($('.files-received-container', container)).to.exist;
    expect(getByText('On File')).to.exist;
    expect(getByText('additional-evidence.pdf')).to.exist;
    expect(getByText('Document type: Additional Evidence')).to.exist;
    expect(getByText('You submitted this file as additional evidence.')).to
      .exist;
    expect(getByText('Received on January 10, 2024')).to.exist;

    expectMaskedFilenames(container);
  });
});
