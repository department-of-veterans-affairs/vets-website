import React from 'react';
import { expect } from 'chai';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import FilesWeCouldntReceive from '../../components/FilesWeCouldntReceive';
import { renderWithCustomStore } from '../utils';

describe('<FilesWeCouldntReceive>', () => {
  // Helper function to create a mock store with failed uploads data
  const createMockStore = (
    failedUploadsData = null,
    featureFlagEnabled = true,
  ) => {
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
        featureToggles: {
          // eslint-disable-next-line camelcase
          cst_show_document_upload_status: featureFlagEnabled,
        },
      }),
      applyMiddleware(thunk),
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
      const { getByText, getByRole } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      expect(getByRole('heading', { name: 'Files we couldn\u2019t receive' }))
        .to.exist;
      expect(
        getByText(
          'If we couldn\u2019t receive files you submitted online, you\u2019ll need to submit them by mail or in person.',
        ),
      ).to.exist;
      expect(
        document.querySelector(
          'va-link[text="Learn about other ways to send your documents."]',
        ),
      ).to.exist;
      expect(getByRole('heading', { name: 'Files not received' })).to.exist;
      expect(getByText('We\u2019ve received all files you submitted online.'))
        .exist;
    });

    it('should render detailed explanation when there are failed files', () => {
      const store = createMockStore(createMockFailedFiles(5)); // 5 failed files
      const { getByText } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      expect(
        getByText(
          'This is a list of files you submitted using this tool that we couldn\u2019t receive. You\u2019ll need to resubmit these documents by mail or in person. We\u2019re sorry about this.',
        ),
      ).to.exist;
      expect(getByText('Note:')).to.exist;
      expect(
        getByText(
          'If you already resubmitted these files, you don\u2019t need to do anything else. Files submitted by mail or in person, by you or by others, don\u2019t appear in this tool.',
        ),
      ).to.exist;
    });

    it('should render imported components', () => {
      const store = createMockStore();
      const { getByTestId } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      expect(getByTestId('other-ways-to-send-documents')).to.exist;
      expect(document.querySelector('va-need-help')).to.exist;
    });
  });

  describe('Feature Flag', () => {
    it('should redirect when feature flag is disabled', () => {
      const store = createMockStore(null, false); // Feature flag disabled
      const { container } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      // When feature flag is disabled, the main content should not be rendered
      expect(container.querySelector('h1')).to.not.exist; // Main heading should not be there
      expect(container.textContent).to.not.include('Files we couldn'); // Main content should not be there
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no failed files exist (empty array)', () => {
      const store = createMockStore([]); // Empty array of failed files
      const {
        getByText,
        getByTestId,
        queryByText,
        queryByTestId,
      } = renderWithCustomStore(<FilesWeCouldntReceive />, store);

      expect(getByText('Files not received')).to.exist;
      expect(getByText('We\u2019ve received all files you submitted online.'))
        .exist;
      expect(
        queryByText('This is a list of files you submitted using this tool'),
      ).to.not.exist;
      expect(queryByTestId('failed-files-list')).to.not.exist;
      expect(getByTestId('other-ways-to-send-documents')).to.exist;
    });

    it('should render empty state when failed files is null', () => {
      const store = createMockStore(null); // null failed files
      const {
        getByText,
        getByTestId,
        queryByText,
        queryByTestId,
      } = renderWithCustomStore(<FilesWeCouldntReceive />, store);

      expect(getByText('Files not received')).to.exist;
      expect(getByText('We\u2019ve received all files you submitted online.'))
        .to.exist;
      expect(
        queryByText('This is a list of files you submitted using this tool'),
      ).to.not.exist;
      expect(queryByTestId('failed-files-list')).to.not.exist;
      expect(getByTestId('other-ways-to-send-documents')).to.exist;
    });
  });

  describe('Failed Files Display', () => {
    const mockFailedFilesWithSorting = [
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

    it('should render failed files in sorted order with proper structure', () => {
      const store = createMockStore(mockFailedFilesWithSorting);
      const { container, getAllByTestId } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

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

    it('should render VaLink components with proper aria-labels for accessibility', () => {
      const store = createMockStore(mockFailedFilesWithSorting);
      const { container } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      const vaLinks = container.querySelectorAll(
        'ul[data-testid="failed-files-list"] va-link',
      );
      expect(vaLinks).to.have.length(3);

      // Files are sorted by date (most recent first)
      const expectedFileOrder = [
        'document2.pdf', // 2025-01-22 (most recent)
        'document1.pdf', // 2025-01-15 (middle)
        'document3.pdf', // 2025-01-10 (oldest)
      ];

      vaLinks.forEach((link, index) => {
        const expectedLabel = `Go to the claim this file was uploaded for: ${
          expectedFileOrder[index]
        }`;
        expect(link).to.have.attribute('label', expectedLabel);
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination when there are more than 10 failed files', () => {
      // Create 15 mock failed files to trigger pagination
      const mockFailedFiles = createMockFailedFiles(15);
      const store = createMockStore(mockFailedFiles);
      const { container, getAllByTestId } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

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
      const { container, getAllByTestId } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      // Test that pagination component is NOT rendered
      const pagination = container.querySelector('va-pagination');
      expect(pagination).to.not.exist;

      // Test that pagination info text is NOT rendered
      const paginationInfo = container.querySelector('#pagination-info');
      expect(paginationInfo).to.not.exist;

      // Test that all 5 items are shown
      const failedFileCards = getAllByTestId(/failed-file-/);
      expect(failedFileCards).to.have.length(5);
    });

    it('should display pagination info text with correct format when pagination is shown', () => {
      // Create 15 mock failed files to trigger pagination
      const mockFailedFiles = createMockFailedFiles(15);
      const store = createMockStore(mockFailedFiles);
      const { container, getByText } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      // Test that pagination info text is rendered with correct format
      const paginationInfo = container.querySelector('#pagination-info');
      expect(paginationInfo).to.exist;

      // Test that the text shows the correct range for first page
      expect(getByText('Showing 1 ‒ 10 of 15 items')).to.exist;
    });

    it('should focus on pagination info when pagination is clicked', () => {
      // Create 15 mock failed files to trigger pagination
      const mockFailedFiles = createMockFailedFiles(15);
      const store = createMockStore(mockFailedFiles);
      const { container } = renderWithCustomStore(
        <FilesWeCouldntReceive />,
        store,
      );

      // Mock the setPageFocus function from utils/page
      const mockSetPageFocus = sinon.spy();
      const originalSetPageFocus = require('../../utils/page').setPageFocus;
      require('../../utils/page').setPageFocus = mockSetPageFocus;

      // Find the pagination component
      const pagination = container.querySelector('va-pagination');
      expect(pagination).to.exist;

      // Simulate clicking on page 2
      const pageSelectEvent = new CustomEvent('pageSelect', {
        detail: { page: 2 },
      });

      // Trigger the pageSelect event on the pagination component
      pagination.dispatchEvent(pageSelectEvent);

      // Verify that setPageFocus was called with the correct selector
      expect(mockSetPageFocus.calledOnce).to.be.true;
      expect(mockSetPageFocus.calledWith('#pagination-info')).to.be.true;

      // Restore the original function
      require('../../utils/page').setPageFocus = originalSetPageFocus;
    });
  });
});
