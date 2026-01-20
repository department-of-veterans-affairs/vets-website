import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import React from 'react';
import { Provider } from 'react-redux';

import { envUrl } from '../../constants';
import DashboardCards from '../../containers/DashboardCards';

describe('<DashboardCards>', () => {
  const apiRequestWithUrl = `${envUrl}/ask_va_api/v0/inquiries`;

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
      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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

      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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
          '.vacardSubmitterQuestion',
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

      const mockStore = {
        getState: () => ({
          form: { data: {} },
          user: {
            login: { currentlyLoggedIn: true },
            profile: {
              userFullName: { first: 'Peter', middle: 'B', last: 'Parker' },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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
      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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

    it('should handle getCurrentTabType correctly', async () => {
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

      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;

        // Initially should show Business tab content
        const filterInfo = view.container.querySelector(
          '.vads-u-padding-x--2p5',
        );
        expect(filterInfo.textContent).to.include('in "Business"');
      });

      // Switch to Personal tab
      const personalTab = view.container.querySelector(
        '.react-tabs__tab-list li:last-child',
      );
      fireEvent.click(personalTab);

      await waitFor(() => {
        const filterInfo = view.container.querySelector(
          '.vads-u-padding-x--2p5',
        );
        expect(filterInfo.textContent).to.include('in "Personal"');
      });
    });

    it('should sort results based on search query', async () => {
      const view = render(<DashboardCards />);

      // Switch to personal tab
      const personalTab = await view.findByRole('tab', { name: /personal/i });
      fireEvent.click(personalTab);

      // Confirm correct tab's content is displayed
      const filterSummary = await view.findByText(/showing/i);
      expect(filterSummary.textContent).to.include('categories in "Personal"');

      const resultsBefore = await view.container.querySelectorAll(
        '.dashboard-card-list',
      );
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
      const resultsAfter = await view.container.querySelectorAll(
        '.dashboard-card-list',
      );
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
      const mockStore = {
        getState: () => ({
          form: {
            data: {},
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'Peter',
                middle: 'B',
                last: 'Parker',
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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

    const mockStore = {
      getState: () => ({
        form: {
          data: {},
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'Peter',
              middle: 'B',
              last: 'Parker',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should display pagination when there are more than 4 items', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      await waitFor(() => {
        const resultsInfo = view.container.querySelector(
          '.vads-u-margin-top--2',
        );
        expect(resultsInfo.textContent).to.include('Showing 1-4 of 6');
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
        const resultsInfo = view.container.querySelector(
          '.vads-u-margin-top--2',
        );
        expect(resultsInfo.textContent).to.include('Showing 5-6 of 6');
      });
    });

    it('should focus on filter summary when page changes', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      await waitFor(() => {
        const resultsInfo = view.container.querySelector(
          '.vads-u-margin-top--2',
        );
        expect(resultsInfo).to.exist;
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
        const filterSummary = view.container.querySelector(
          '.vads-u-margin-top--2',
        );
        expect(document.activeElement).to.equal(filterSummary);
      });
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(`${apiRequestWithUrl}`, () => {
          // Use the adapter's jsonResponse helper instead of manual Promise
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
    });

    const mockStore = {
      getState: () => ({
        form: {
          data: {},
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'Peter',
              middle: 'B',
              last: 'Parker',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should show loading indicator and then content', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      // Initially should show loading indicator
      const loadingIndicator = view.container.querySelector(
        'va-loading-indicator',
      );
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');

      // Wait for content to load
      await waitFor(() => {
        // Loading indicator should be gone
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;

        // Content should be visible
        expect(view.getByText('Your questions')).to.exist;
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

    const mockStore = {
      getState: () => ({
        form: {
          data: {},
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'Peter',
              middle: 'B',
              last: 'Parker',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should show empty state message when no inquiries exist', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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

    const mockStore = {
      getState: () => ({
        form: {
          data: {},
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'Peter',
              middle: 'B',
              last: 'Parker',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should show tabs when both business and personal inquiries exist', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      await waitFor(() => {
        // Check for tabs
        const tabs = view.container.querySelector('.tabs');
        expect(tabs).to.exist;

        // Check for both tab labels
        const businessTab = view.container.querySelector(
          '.react-tabs__tab-list li:first-child',
        );
        const personalTab = view.container.querySelector(
          '.react-tabs__tab-list li:last-child',
        );
        expect(businessTab.textContent).to.equal('Business');
        expect(personalTab.textContent).to.equal('Personal');

        // Business tab should be active by default and show business content
        expect(view.getByText('Business question')).to.exist;

        // Check filtered results info is inside tab panel with correct padding
        const filterInfo = view.container.querySelector(
          '.vads-u-padding-x--2p5',
        );
        expect(filterInfo).to.exist;
        expect(filterInfo.textContent).to.include('in "Business"');
      });
    });

    it('should switch content and filtered results info when changing tabs', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      await waitFor(() => {
        // Initially should show business content and filtered info
        expect(view.getByText('Business question')).to.exist;
        const filterInfo = view.container.querySelector(
          '.vads-u-padding-x--2p5',
        );
        expect(filterInfo.textContent).to.include('in "Business"');
      });

      // Click the Personal tab
      const personalTab = view.container.querySelector(
        '.react-tabs__tab-list li:last-child',
      );
      fireEvent.click(personalTab);

      await waitFor(() => {
        // Should now show personal content and filtered info
        expect(view.getByText('Personal question')).to.exist;
        expect(view.queryByText('Business question')).to.not.exist;
        const filterInfo = view.container.querySelector(
          '.vads-u-padding-x--2p5',
        );
        expect(filterInfo.textContent).to.include('in "Personal"');
      });
    });

    it('should apply filters correctly in business view', async () => {
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

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
      const view = render(
        <Provider store={mockStore}>
          <DashboardCards />
        </Provider>,
      );

      // Wait for initial load
      await waitFor(() => {
        expect(view.container.querySelector('va-loading-indicator')).to.not
          .exist;
        const businessTab = view.container.querySelector(
          '.react-tabs__tab-list li:first-child',
        );
        expect(businessTab.textContent).to.equal('Business');
      });

      // Switch to personal tab
      const personalTab = view.container.querySelector(
        '.react-tabs__tab-list li:last-child',
      );
      fireEvent.click(personalTab);

      // Wait for personal content
      await waitFor(() => {
        expect(view.getByText('Personal question')).to.exist;
        expect(view.queryByText('Business question')).to.not.exist;
      });
    });
  });
});
