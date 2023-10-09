import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import DashboardCards from '../../containers/DashboardCards';

describe('<DashboardCards>', () => {
  const apiRequestWithUrl = `${environment.API_URL}/ask_va_api/v0/inquiries`;

  describe('when the api server succeeds', () => {
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
              data: [
                {
                  attributes: {
                    inquiryNumber: 'A-1',
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

    it('should render Inquiry Number', async () => {
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
        expect(view.container.querySelector('p')).to.contain.text(
          'Inquiry Number:',
        );
      });
    });
  });
});
