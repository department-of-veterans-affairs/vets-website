/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { RESPONSE_PAGE } from '../../../constants';
import ResponseInboxPage from '../../../containers/ResponseInboxPage';

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
                  lastUpdate: '08/07/23',
                  attachments: [
                    {
                      id: '012345',
                      name: 'File_ABC.pdf',
                    },
                  ],
                  reply: {
                    data: [
                      {
                        id: '456',
                        modifiedon: '08/10/23',
                        status_reason: 'Completed/Sent',
                        message_type: '722310000: Reply to VA',
                        enable_reply: true,
                        attributes: {
                          reply: 'Blue',
                          attachmentNames: [],
                        },
                      },
                    ],
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

      // TODO: update tests to look for data from api call. Currently page is rendered with mock data in component.
      const h2List = [
        RESPONSE_PAGE.YOUR_QUESTION,
        RESPONSE_PAGE.ATTACHMENTS,
        RESPONSE_PAGE.INBOX,
        'Need help?',
      ];
      const h3List = [
        RESPONSE_PAGE.SEND_REPLY,
        RESPONSE_PAGE.UPLOAD_YOUR_FILES,
      ];

      await waitFor(() => {
        expect(view.container.querySelector('h1')).to.contain.text(
          RESPONSE_PAGE.QUESTION_DETAILS,
        );
        expect(view.container.querySelectorAll('h2')).to.contain.text(
          RESPONSE_PAGE.YOUR_QUESTION,
        );
        expect(view.container.querySelectorAll('h2')).to.have.length(4);
        h2List.forEach(h2 =>
          expect(view.container.querySelectorAll('h2')).to.contain.text(h2),
        );

        expect(view.container.querySelectorAll('h3')).to.have.length(2);
        h3List.forEach(h3 =>
          expect(view.container.querySelectorAll('h3')).to.contain.text(h3),
        );
      });
    });
  });
});
