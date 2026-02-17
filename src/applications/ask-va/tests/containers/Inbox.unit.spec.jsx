import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import React from 'react';

import { envApiUrl } from '../../constants';
import Inbox from '../../containers/Inbox';

describe('<Inbox />', () => {
  const apiRequestWithUrl = `${envApiUrl}/ask_va_api/v0/inquiries`;

  describe('when the api server succeeds', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [
                {
                  id: '1',
                  attributes: {
                    inquiryNumber: 'A-1',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Business question',
                    levelOfAuthentication: 'Business',
                  },
                },
                {
                  id: '2',
                  attributes: {
                    inquiryNumber: 'A-2',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Personal question',
                    levelOfAuthentication: 'Personal',
                  },
                },
                {
                  id: '3',
                  attributes: {
                    inquiryNumber: 'A-3',
                    status: 'Replied',
                    categoryName: 'Health care',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Another personal question',
                    levelOfAuthentication: 'Personal',
                  },
                },
              ],
            },
            { status: 200 },
          );
        }),
      );
    });

    it('should render Your questions and filters', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        // Check for the main heading
        expect(view.getByText('Your questions')).to.exist;

        // Check for select elements
        const statusSelect = view.container.querySelector(
          'va-select[name="status"]',
        );
        const categorySelect = view.container.querySelector(
          'va-select[name="category"]',
        );
        expect(statusSelect).to.exist;
        expect(categorySelect).to.exist;

        // Check that the inquiry content is displayed
        expect(view.getByText('Business question')).to.exist;
        expect(view.getByText('A-1')).to.exist;
      });
    });

    it('should transform inquiries data correctly', async () => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [
                {
                  id: '1',
                  attributes: {
                    inquiryNumber: 'A-1',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Test question 1',
                    levelOfAuthentication: 'Personal',
                  },
                },
                {
                  id: '2',
                  attributes: {
                    inquiryNumber: 'A-2',
                    status: 'Replied',
                    categoryName: 'Healthcare',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Test question 2',
                    levelOfAuthentication: 'Personal',
                  },
                },
                {
                  id: '3',
                  attributes: {
                    inquiryNumber: 'A-3',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Test question 3',
                    levelOfAuthentication: 'Unauthenticated',
                  },
                },
              ],
            },
            { status: 200 },
          );
        }),
      );

      const view = render(<Inbox />);

      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;

        // Check that categories are correctly extracted (should exclude Unauthenticated)
        const categorySelect = view.container.querySelector(
          'va-select[name="category"]',
        );
        const options = categorySelect.querySelectorAll('option');
        expect(options).to.have.lengthOf(3); // All + Benefits + Healthcare
        expect(options[1].value).to.equal('Benefits');
        expect(options[2].value).to.equal('Healthcare');

        // Check that statuses are correctly transformed
        const statusLabels = view.container.querySelectorAll('.usa-label');
        expect(statusLabels[0].textContent.trim()).to.equal('In progress');
        expect(statusLabels[1].textContent.trim()).to.equal('Replied');

        // Verify unauthenticated inquiry is not displayed
        const questions = view.container.querySelectorAll(
          '.submitter-question',
        );
        expect(questions).to.have.lengthOf(2);
        expect(questions[0].textContent).to.equal('Test question 1');
        expect(questions[1].textContent).to.equal('Test question 2');
      });
    });

    it('should update filter summary when filters applied', async () => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [
                {
                  id: '1',
                  attributes: {
                    inquiryNumber: 'A-1',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Test question',
                    levelOfAuthentication: 'Personal',
                  },
                },
              ],
            },
            { status: 200 },
          );
        }),
      );

      const view = render(<Inbox />);

      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;
      });

      // Confirm starting value of status filter
      const statusSelect = view.container.querySelector(
        'va-select[name="status"]',
      );
      expect(statusSelect.getAttribute('value')).to.equal('All');

      // Set status filter to "In progress"
      statusSelect.__events.vaSelect({
        target: { value: 'In progress' },
      });

      // Wait for pending filter to update
      await waitFor(() => {
        expect(statusSelect.getAttribute('value')).to.equal('In progress');
      });

      // Apply filters
      const buttonPair = view.container.querySelector('va-button-pair');
      buttonPair.__events.primaryClick();

      // Wait for the filter summary to update
      const filterSummary = await view.findByText(/showing/i);
      expect(filterSummary.textContent).to.include('"In progress"');
    });

    it('should clear filters when clear button is clicked', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;
      });

      // Set filters to non-default values
      const statusSelect = view.container.querySelector(
        'va-select[name="status"]',
      );
      statusSelect.__events.vaSelect({ target: { value: 'In progress' } });
      expect(statusSelect.getAttribute('value')).to.equal('In progress');

      const categorySelect = view.container.querySelector(
        'va-select[name="category"]',
      );
      categorySelect.__events.vaSelect({ target: { value: 'Benefits' } });
      expect(categorySelect.getAttribute('value')).to.equal('Benefits');

      // Click clear filters button
      const clearButton = view.container.querySelector('va-button-pair');
      clearButton.__events.secondaryClick();

      await waitFor(() => {
        // Verify filters are reset to 'All'
        expect(statusSelect.getAttribute('value')).to.equal('All');
        expect(categorySelect.getAttribute('value')).to.equal('All');
      });
    });

    it('should sort results based on search query', async () => {
      const view = render(<Inbox />);

      // Switch to personal tab
      const personalTab = await view.findByRole('tab', { name: /personal/i });
      fireEvent.click(personalTab);

      // Confirm correct tab's content is displayed
      const searchDescription = await view.findByText(/showing/i);
      expect(searchDescription.textContent).to.include('Personal');

      const resultsBefore = view.getAllByTestId('inquiry-card');
      expect(resultsBefore.length).to.equal(2);
      expect(resultsBefore[0].textContent).to.include('Reference number: A-2');

      // Confirm search box starts empty
      const searchBox = view.container.querySelector('va-text-input');
      expect(searchBox.value).to.equal('');

      // Input a search query
      searchBox.__events.vaInput({ target: { value: 'A-3' } });
      expect(searchBox.value).to.equal('A-3');

      // Apply filters
      const filterButtons = view.container.querySelector('va-button-pair');
      filterButtons.__events.primaryClick();

      // Confirrm the list is now just one desired result
      const resultsAfter = view.getAllByTestId('inquiry-card');
      expect(resultsAfter.length).to.equal(1);
      expect(resultsAfter[0].textContent).to.include('Reference number: A-3');
    });
  });

  describe('when the api server fails', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse({}, { status: 500 });
        }),
      );
    });

    it('should show error alert when API request fails', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        const errorAlert = view.container.querySelector('va-alert');
        expect(errorAlert).to.exist;
        expect(errorAlert.getAttribute('status')).to.equal('info');
      });
    });
  });

  describe('pagination functionality', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: Array.from({ length: 6 }, (_, i) => ({
                id: `${i + 1}`,
                attributes: {
                  inquiryNumber: `A-${i + 1}`,
                  status: 'In Progress',
                  categoryName: 'Benefits',
                  createdOn: '01/01/2024 12:00:00 PM',
                  lastUpdate: '01/01/2024 12:00:00 PM',
                  submitterQuestion: `Test question ${i + 1}`,
                  levelOfAuthentication: 'Personal',
                },
              })),
            },
            { status: 200 },
          );
        }),
      );
    });

    it('should display pagination when there are more than 4 items', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        const pagination = view.container.querySelector('va-pagination');
        expect(pagination).to.exist;
        expect(pagination.getAttribute('pages')).to.equal('2');
      });

      // Verify only 4 items are shown initially
      const cards = view.container.querySelectorAll('va-card');
      expect(cards).to.have.lengthOf(4);
    });

    it('should update displayed items when page changes', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        // Verify first page content
        expect(view.getByText('Test question 1')).to.exist;
        expect(view.getByText('Test question 4')).to.exist;
      });

      // Trigger page change
      const pagination = view.container.querySelector('va-pagination');
      pagination.dispatchEvent(
        new CustomEvent('pageSelect', {
          detail: { page: 2 },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        // Verify second page content
        expect(view.getByText('Test question 5')).to.exist;
        expect(view.getByText('Test question 6')).to.exist;
      });
    });

    it('should update results info text when page changes', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        const filterSummary = view.getByRole('heading', {
          name: /showing .+ results/i,
        });
        expect(filterSummary.textContent).to.include('Showing 1-4 of 6');
      });

      // Change to page 2
      const pagination = view.container.querySelector('va-pagination');
      pagination.dispatchEvent(
        new CustomEvent('pageSelect', {
          detail: { page: 2 },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        const filterSummary = view.getByRole('heading', {
          name: /showing .+ results/i,
        });
        expect(filterSummary.textContent).to.include('Showing 5-6 of 6');
      });
    });

    it('should focus on filter summary when page changes', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        const filterSummary = view.getByRole('heading', {
          level: 3,
          name: /showing 1-4 of 6 results/i,
        });
        expect(filterSummary).to.exist;
      });

      // Change to page 2
      const pagination = view.container.querySelector('va-pagination');
      pagination.dispatchEvent(
        new CustomEvent('pageSelect', {
          detail: { page: 2 },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        const searchDescription = view.getByRole('heading', {
          level: 3,
          name: /showing 5-6 of 6 results/i,
        });
        expect(document.activeElement).to.equal(
          searchDescription.parentElement,
        );
      });
    });
  });

  describe('loading state', () => {
    it('should show loading indicator and then content', async () => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [
                {
                  id: '1',
                  attributes: {
                    inquiryNumber: 'A-1',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Test question',
                    levelOfAuthentication: 'Personal',
                  },
                },
              ],
            },
            { status: 200 },
          );
        }),
      );

      const view = render(<Inbox />);

      // Initially should show loading indicator
      const loadingIndicator = view.getByTestId('loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');

      await waitForElementToBeRemoved(loadingIndicator);

      await waitFor(() => {
        // Content should be visible
        const heading = view.getByRole('heading', {
          level: 2,
          name: 'Your questions',
        });
        expect(heading).to.exist;
        expect(view.getByText('Test question')).to.exist;
      });
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [], // Return empty data array
            },
            { status: 200 },
          );
        }),
      );
    });

    it('should show empty state message when no inquiries exist', async () => {
      const view = render(<Inbox />);

      await waitFor(() => {
        // Should show the empty state message
        const alert = view.container.querySelector('va-alert');
        expect(alert).to.exist;

        const messageElement = view.container.querySelector(
          '.vads-u-margin-y--0',
        );
        expect(messageElement.textContent).to.include(
          'submitted a question yet',
        );

        // Should not show filters
        expect(view.container.querySelector('.vacardSelectFilters')).to.not
          .exist;
        expect(view.container.querySelector('va-select[name="status"]')).to.not
          .exist;
        expect(view.container.querySelector('va-select[name="category"]')).to
          .not.exist;

        // Should not show pagination
        expect(view.container.querySelector('va-pagination')).to.not.exist;
      });
    });
  });

  describe('business and personal view', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          return jsonResponse(
            {
              data: [
                {
                  id: '1',
                  attributes: {
                    inquiryNumber: 'A-1',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Business question',
                    levelOfAuthentication: 'Business',
                  },
                },
                {
                  id: '2',
                  attributes: {
                    inquiryNumber: 'A-2',
                    status: 'In Progress',
                    categoryName: 'Benefits',
                    createdOn: '01/01/2024 12:00:00 PM',
                    lastUpdate: '01/01/2024 12:00:00 PM',
                    submitterQuestion: 'Personal question',
                    levelOfAuthentication: 'Personal',
                  },
                },
              ],
            },
            { status: 200 },
          );
        }),
      );
    });

    it('should show switchable tabs when both business and personal inquiries exist', async () => {
      const view = render(<Inbox />);

      const tabButtons = await view.findByRole('tablist');
      const businessTabBefore = await view.findByRole('tab', {
        name: /business/i,
      });
      const personalTabBefore = await view.findByRole('tab', {
        name: /personal/i,
      });

      expect(tabButtons.childNodes.length).to.equal(2);
      expect(businessTabBefore).to.exist;
      expect(personalTabBefore).to.exist;
      expect(businessTabBefore.outerHTML).to.include('aria-selected="true"');
      expect(personalTabBefore.outerHTML).to.include('aria-selected="false"');

      fireEvent.click(personalTabBefore);

      const businessTabAfter = await view.findByRole('tab', {
        name: /business/i,
      });
      const personalTabAfter = await view.findByRole('tab', {
        name: /personal/i,
      });

      expect(businessTabAfter.outerHTML).to.include('aria-selected="false"');
      expect(personalTabAfter.outerHTML).to.include('aria-selected="true"');
    });

    it('should apply filters correctly in business view', async () => {
      const view = render(<Inbox />);

      // Wait for initial load and content
      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;
        expect(view.getByText('Business question')).to.exist;
      });

      // Set status filter to In progress
      const statusSelect = view.container.querySelector(
        'va-select[name="status"]',
      );
      fireEvent(
        statusSelect,
        new CustomEvent('vaSelect', {
          detail: { value: 'In progress' },
          bubbles: true,
        }),
      );

      // Wait for filter to be applied and check status label
      await waitFor(() => {
        const statusLabel = view.container.querySelector('.usa-label');
        expect(statusLabel.textContent.trim()).to.equal('In progress');
      });
    });

    it('should show correct content in personal view', async () => {
      const view = render(<Inbox />);

      // Wait for initial load
      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;
        const businessTab = view.getByRole('tab', {
          name: /business/i,
        });
        expect(businessTab.textContent).to.equal('Business');
      });

      // Switch to personal tab
      const personalTab = view.getByRole('tab', { name: /personal/i });
      fireEvent.click(personalTab);

      // Wait for personal content
      await waitFor(() => {
        expect(view.getByText('Personal question')).to.exist;
        expect(view.queryByText('Business question')).to.not.exist;
      });
    });
  });
});
