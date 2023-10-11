import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import TopicSelect from '../../components/FormFields/TopicSelect';

describe('TopicSelect component', () => {
  const apiRequestWithUrl = `${
    environment.API_URL
  }/ask_va_api/v0/categories/2/topics`;

  let server = null;

  const mockStore = {
    getState: () => ({
      form: {
        data: {
          selectCategory: 'Benefits Issues Outside the US',
        },
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
      askVA: {
        categoryID: '2',
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const props = {
    formContext: { reviewMode: false, submitted: undefined },
    id: 'root_selectTopic',
    onChange: () => {},
    required: true,
    value: undefined,
  };

  before(() => {
    server = setupServer(
      rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
        return res(
          ctx.json({
            data: [
              {
                id: '6',
                type: 'topics',
                attributes: {
                  name: 'Spider-man',
                },
              },
              {
                id: '7',
                type: 'topics',
                attributes: {
                  name: 'Captain America',
                },
              },
              {
                id: '8',
                type: 'topics',
                attributes: {
                  name: 'Iron man',
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

  it('should render', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <TopicSelect {...props} />
      </Provider>,
    );

    const selector = container.querySelectorAll('option');
    await waitFor(() => {
      expect(selector[0]).to.contain.text('');
      expect(selector[1]).to.contain.text('Spider-man');
      expect(selector[2]).to.contain.text('Captain America');
    });
  });
});
