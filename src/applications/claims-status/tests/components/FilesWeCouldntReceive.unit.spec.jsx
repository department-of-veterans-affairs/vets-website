import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import FilesWeCouldntReceive from '../../components/FilesWeCouldntReceive';

describe('<FilesWeCouldntReceive>', () => {
  // Helper function to create a mock store with failed uploads data
  const createMockStore = (failedUploadsData = null) => {
    return createStore(
      () => ({
        disability: {
          status: {
            failedUploads: {
              loading: false,
              data: failedUploadsData,
              error: null,
            },
          },
        },
      }),
      applyMiddleware(thunk),
    );
  };

  // Helper function to render the component with store and router
  const renderComponent = store => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<FilesWeCouldntReceive />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  /**
   * Helper function to create mock failed files data for testing
   * @param {number} count - Number of mock failed files to create
   * @param {number} [startIndex=1] - Starting index for file IDs and names
   * @returns {Array} Array of mock failed upload objects with consistent data structure
   */
  const createMockFailedFiles = (count, startIndex = 1) => {
    return Array.from({ length: count }, (_, index) => ({
      id: startIndex + index,
      fileName: `document${startIndex + index}.pdf`,
      trackedItemDisplayName: '21-4142',
      failedDate: `2025-01-${String(startIndex + index).padStart(
        2,
        '0',
      )}T10:35:00.000Z`,
      documentType: 'VA Form 21-4142',
      claimId: `${startIndex + index}`,
    }));
  };

  describe('Basic Rendering', () => {
    it('should render all static content', () => {
      const store = createMockStore();
      const { getByText, getByRole } = renderComponent(store);

      // Test main heading
      expect(getByRole('heading', { name: 'Files we couldn\u2019t receive' }))
        .to.exist;

      // Test main description
      expect(
        getByText(
          'If we couldn\u2019t receive files you submitted online, you\u2019ll need to submit them by mail or in person.',
        ),
      ).to.exist;

      // Test "Learn about other ways" link
      expect(
        document.querySelector(
          'va-link[text="Learn about other ways to send your documents."]',
        ),
      ).to.exist;

      // Test "Files not received" section heading
      expect(getByRole('heading', { name: 'Files not received' })).to.exist;

      // Test section description
      expect(
        getByText(
          'This is a list of files you submitted using this tool that we couldn\u2019t receive. You\u2019ll need to resubmit these documents by mail or in person. We\u2019re sorry about this.',
        ),
      ).to.exist;

      // Test note section
      expect(getByText('Note:')).to.exist;
      expect(
        getByText(
          'If you already resubmitted these files, you don\u2019t need to do anything else. Files submitted by mail or in person, by you or by others, don\u2019t appear in this tool.',
        ),
      ).to.exist;
    });

    it('should render imported components', () => {
      const store = createMockStore();
      const { getByTestId } = renderComponent(store);

      // Test OtherWaysToSendYourDocuments component is rendered
      expect(getByTestId('other-ways-to-send-documents')).to.exist;

      // Test NeedHelp component is rendered
      expect(document.querySelector('va-need-help')).to.exist;
    });
  });

  describe('Failed Files Display', () => {
    it('should render failed files in sorted order and with proper accessibility', () => {
      const mockFailedFiles = [
        {
          id: 1,
          fileName: 'document1.pdf',
          trackedItemDisplayName: '21-4142',
          failedDate: '2025-01-15T10:35:00.000Z',
          documentType: 'VA Form 21-4142',
          claimId: '123',
        },
        {
          id: 2,
          fileName: 'document2.pdf',
          trackedItemDisplayName: '21-4142',
          failedDate: '2025-01-22T10:35:00.000Z',
          documentType: 'VA Form 21-4142',
          claimId: '456',
        },
        {
          id: 3,
          fileName: 'document3.pdf',
          trackedItemDisplayName: '21-4142',
          failedDate: '2025-01-10T10:35:00.000Z',
          documentType: 'VA Form 21-4142',
          claimId: '789',
        },
      ];

      const store = createMockStore(mockFailedFiles);
      const { container, getAllByTestId } = renderComponent(store);

      // Test that the list has proper accessibility structure
      const failedFilesList = container.querySelector(
        'ul[data-testid="failed-files-list"]',
      );
      expect(failedFilesList).to.exist;

      // Test that the list has proper className and role attributes
      expect(failedFilesList).to.have.class('failed-files-list');
      expect(failedFilesList).to.have.attribute('role', 'list');
      expect(failedFilesList).to.have.attribute(
        'data-testid',
        'failed-files-list',
      );

      // Test that we have the correct number of failed file cards
      const failedFileCards = getAllByTestId(/failed-file-/);
      expect(failedFileCards).to.have.length(3);

      // Test that files are sorted by date (most recent first)
      // The dates should be: 2025-01-22, 2025-01-15, 2025-01-10
      const firstCard = failedFileCards[0];
      const secondCard = failedFileCards[1];
      const thirdCard = failedFileCards[2];

      // Check that the first card (most recent) contains document2.pdf
      expect(firstCard).to.contain.text('document2.pdf');
      expect(firstCard).to.contain.text('January 22, 2025'); // Most recent date

      // Check that the second card contains document1.pdf
      expect(secondCard).to.contain.text('document1.pdf');
      expect(secondCard).to.contain.text('January 15, 2025'); // Middle date

      // Check that the third card (oldest) contains document3.pdf
      expect(thirdCard).to.contain.text('document3.pdf');
      expect(thirdCard).to.contain.text('January 10, 2025'); // Oldest date

      // Test that each card has proper structure with VaCard
      failedFileCards.forEach(card => {
        // The card should be a VaCard component (rendered as va-card)
        expect(card.tagName.toLowerCase()).to.equal('va-card');
        // The parent should be an li element
        expect(card.parentElement.tagName.toLowerCase()).to.equal('li');
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination when there are more than 10 failed files', () => {
      // Create 15 mock failed files to trigger pagination
      const mockFailedFiles = createMockFailedFiles(15);
      const store = createMockStore(mockFailedFiles);
      const { container, getAllByTestId } = renderComponent(store);

      // Test that pagination component is rendered
      const pagination = container.querySelector('va-pagination');
      expect(pagination).to.exist;

      // Test that only 10 items are shown on the first page (ITEMS_PER_PAGE = 10)
      const failedFileCards = getAllByTestId(/failed-file-/);
      expect(failedFileCards).to.have.length(10);

      // Test that the first 10 items are displayed (sorted by date, most recent first)
      // Since we're using dates like 2025-01-01, 2025-01-02, etc., the most recent dates
      // (higher numbers) will appear first after sorting
      expect(failedFileCards[0]).to.contain.text('document15.pdf'); // Most recent date
      expect(failedFileCards[9]).to.contain.text('document6.pdf'); // 10th most recent
    });

    it('should not render pagination when there are 10 or fewer failed files', () => {
      // Create 5 mock failed files (less than ITEMS_PER_PAGE)
      const mockFailedFiles = createMockFailedFiles(5);
      const store = createMockStore(mockFailedFiles);
      const { container, getAllByTestId } = renderComponent(store);

      // Test that pagination component is NOT rendered
      const pagination = container.querySelector('va-pagination');
      expect(pagination).to.not.exist;

      // Test that all 5 items are shown
      const failedFileCards = getAllByTestId(/failed-file-/);
      expect(failedFileCards).to.have.length(5);
    });

    it('should scroll to files section when pagination is clicked', () => {
      // Create 15 mock failed files to trigger pagination
      const mockFailedFiles = createMockFailedFiles(15);
      const store = createMockStore(mockFailedFiles);
      const { container } = renderComponent(store);

      // Mock the scrollIntoView method
      const mockScrollIntoView = sinon.spy();
      const filesSection = container.querySelector(
        '#files-not-received-section',
      );
      if (filesSection) {
        filesSection.scrollIntoView = mockScrollIntoView;
      }

      // Find the pagination component
      const pagination = container.querySelector('va-pagination');
      expect(pagination).to.exist;

      // Simulate clicking on page 2
      const pageSelectEvent = new CustomEvent('pageSelect', {
        detail: { page: 2 },
      });

      // Trigger the pageSelect event on the pagination component
      pagination.dispatchEvent(pageSelectEvent);

      // Verify that scrollIntoView was called on the files section
      expect(mockScrollIntoView.calledOnce).to.be.true;
    });
  });
});
