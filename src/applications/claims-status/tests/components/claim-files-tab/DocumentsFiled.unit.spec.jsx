/* eslint-disable camelcase */
import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DocumentsFiled from '../../../components/claim-files-tab/DocumentsFiled';

// Redux store with feature toggle enabled
const store = createStore(() => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    cst_timezone_discrepancy_mitigation: true,
  },
}));

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
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText(/You haven.t turned in any documents to the VA/)).to
          .exist;
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
        const { container, getByText, queryByText } = render(
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('File name unknown')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(queryByText('Document type: Correspondence')).not.to.exist;
        expect(getByText('Pending review')).to.exist;
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

      it('should render, show pending review and the received date is the item date', () => {
        const { container, getByText } = render(
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
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
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
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
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Reviewed by VA on January 3, 2024')).to.exist;
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

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('Reviewed by VA on January 3, 2024')).to.exist;
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

      it('should render, show pending review and the received date is the upload date', () => {
        const { container, getByText } = render(
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
        );
        expect($('.documents-filed-container', container)).to.exist;
        expect(getByText('file.pdf')).to.exist;
        expect(getByText('Request type: Request 1')).to.exist;
        expect(getByText('Document type: Correspondence')).to.exist;
        expect(getByText('No longer needed')).to.exist;
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
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
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

      it('should render a DocumentsFiled section with multiple items in a request', () => {
        const { container, getByText, getAllByText } = render(
          <Provider store={store}>
            <DocumentsFiled claim={claim} />
          </Provider>,
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

    it('should render a DocumentsFiled section with multiple items in a request', () => {
      const { container, getByText, getAllByText, getByRole } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );
      expect($('.documents-filed-container', container)).to.exist;

      // Check order of docsFiled
      const list = getByRole('list');
      const { getAllByRole } = within(list);
      const items = getAllByRole('listitem');
      const docsFiled = items.map(item => item.textContent);
      expect(docsFiled[0]).to.contain('file4.pdfRequest');
      expect(docsFiled[1]).to.contain('file1.pdfRequest');
      expect(docsFiled[1]).to.contain('file2.pdfRequest');
      expect(docsFiled[2]).to.contain('file3.pdfRequest');

      // Item 1
      expect(getByText('file4.pdf')).to.exist;
      expect(getAllByText('Request type: Request 3')).to.exist;
      expect(getAllByText('Document type: Submit buddy statement(s)')).to.exist;
      expect(getAllByText('Received on January 15, 2024')).to.exist;
      expect(getByText('No longer needed')).to.exist;

      // Item 2
      expect(getByText('file1.pdf')).to.exist;
      expect(getByText('file2.pdf')).to.exist;
      expect(getAllByText('Request type: Request 1').length).to.equal(2);
      expect(getAllByText('Document type: Correspondence').length).to.equal(2);
      expect(getAllByText('Received on January 14, 2024').length).to.equal(1);
      expect(getByText('Pending review')).to.exist;

      // Item 3
      expect(getByText('file3.pdf')).to.exist;
      expect(getAllByText('Request type: Request 2')).to.exist;
      expect(getAllByText('Document type: Military Personnel Record')).to.exist;
      expect(getAllByText('Received on January 8, 2024')).to.exist;
      expect(getByText('Reviewed by VA on January 9, 2024')).to.exist;
    });

    it('should mask filenames from Datadog (no PII)', () => {
      const { container } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );
      expect(
        $('.filename-title', container).getAttribute('data-dd-privacy'),
      ).to.equal('mask');
    });
  });

  context('Timezone-aware message display', () => {
    let timezoneStub;

    beforeEach(() => {
      // Stub CST timezone (-360 = UTC-6) for all tests by default
      // Individual tests can override by restoring and re-stubbing
      timezoneStub = sinon
        .stub(Date.prototype, 'getTimezoneOffset')
        .returns(-360);
    });

    afterEach(() => {
      if (timezoneStub) {
        timezoneStub.restore();
        timezoneStub = null;
      }
    });

    const claim = {
      type: 'claim',
      attributes: {
        trackedItems: [],
        supportingDocuments: [],
      },
    };

    it('should display timezone message below Documents filed heading', () => {
      const { getByText } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );

      getByText('Documents filed');
      expect(getByText(/Files uploaded (after|before).*will show (with|as)/)).to
        .exist;
    });

    it('should include time and timezone in message', () => {
      const { getByText } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );

      const messageParagraph = getByText(
        /Files uploaded (after|before).*will show (with|as)/,
      );
      expect(messageParagraph.textContent).to.match(
        /\d{1,2}:\d{2}\s+(a|p)\.m\./,
      );
    });

    it('should NOT display message when in UTC timezone', () => {
      // Restore beforeEach stub and re-stub with UTC timezone (0)
      timezoneStub.restore();
      timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

      const { queryByText } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );

      expect(queryByText('Documents filed')).to.exist;
      expect(queryByText(/Files uploaded/)).to.not.exist;
    });

    it('should not render message paragraph element when timezone offset is 0', () => {
      // Restore beforeEach stub and re-stub with UTC timezone (0)
      timezoneStub.restore();
      timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

      const { container } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );

      const activityContainer = container.querySelector(
        '.documents-filed-container',
      );
      const paragraphs = activityContainer.querySelectorAll('p');

      paragraphs.forEach(p => {
        expect(p.textContent).to.not.include('Files uploaded');
      });
    });

    it('should conditionally render message based on timezone offset', () => {
      const { container, rerender } = render(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );

      let messageParagraph = container.querySelector(
        '.vads-u-color--gray-medium',
      );
      expect(messageParagraph).to.exist;

      // Restore beforeEach stub and re-stub with UTC timezone (0)
      timezoneStub.restore();
      timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

      rerender(
        <Provider store={store}>
          <DocumentsFiled claim={claim} />
        </Provider>,
      );
      messageParagraph = container.querySelector('.vads-u-color--gray-medium');
      expect(messageParagraph?.textContent || '').to.not.include(
        'Files uploaded',
      );
    });
  });
});
