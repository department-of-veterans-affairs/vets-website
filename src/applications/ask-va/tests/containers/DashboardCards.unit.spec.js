import { render, waitFor } from '@testing-library/react';
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
});
