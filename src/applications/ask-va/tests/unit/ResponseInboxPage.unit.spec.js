import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import ResponseInboxPage from '../../containers/ResponseInboxPage';

describe('<ResponseInboxPage>', () => {
  const apiRequestWithUrl = `${
    environment.API_URL
  }/ask_va_api/v0/inquiries/123`;

  describe('when the api server succeeds', () => {
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(
            ctx.json({
              data: {
                attributes: {
                  inquiryNumber: '123',
                  processingStatus: 'complete',
                  question: 'Red or blue?',
                  reply: {
                    data: {
                      attributes: {
                        reply: 'Blue',
                      },
                    },
                  },
                },
              },
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

    it('should render user Response Inbox', async () => {
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
      const props = {
        params: { id: '123' },
      };

      const view = render(
        <Provider store={mockStore}>
          <ResponseInboxPage {...props} />
        </Provider>,
      );

      await waitFor(() => {
        expect(view.container.querySelector('h1')).to.contain.text(
          'Response Inbox',
        );
        expect(view.container.querySelector('em')).to.contain.text('complete');
      });
    });
  });
});
