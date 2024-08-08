import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { envUrl } from '../../constants';
import { userData } from '../fixtures/data/mock-form-data';

import TopicSelect from '../../components/FormFields/TopicSelect';

describe('<TopicSelect /> component', () => {
  const apiRequestWithUrl = `${envUrl}/ask_va_api/v0/categories/2/topics`;

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
        profile: userData,
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

  it('should get the topics list', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <TopicSelect {...props} />
      </Provider>,
    );

    const selector = container.querySelectorAll('option');
    waitFor(() => {
      expect(selector[0]).to.have.text('');
      expect(selector[1]).to.have.text('Spider-man');
      expect(selector[2]).to.have.text('Captain America');
    });
  });
});
