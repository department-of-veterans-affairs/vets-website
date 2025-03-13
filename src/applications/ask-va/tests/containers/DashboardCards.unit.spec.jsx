import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';

import { envUrl } from '../../constants';
import DashboardCards from '../../containers/DashboardCards';

describe('<DashboardCards>', () => {
  const apiRequestWithUrl = `${envUrl}/ask_va_api/v0/inquiries`;

  describe('when the api server succeeds', () => {
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
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
            }),
          );
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
        expect(view.getByText('Test question')).to.exist;
      });
    });
  });

  describe('when the api server fails', () => {
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
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
            }),
          );
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          // Add delay to simulate network request
          return res(
            ctx.delay(100),
            ctx.json({
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
            }),
          );
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
              data: [], // Return empty data array
            }),
          );
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
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
            }),
          );
        }),
      );

      server.listen();
    });

    afterEach(() => server.resetHandlers());

    after(() => {
      server.close();
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
        expect(filterInfo.textContent).to.include('in Business');
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
        expect(filterInfo.textContent).to.include('in Business');
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
        expect(filterInfo.textContent).to.include('in Personal');
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
