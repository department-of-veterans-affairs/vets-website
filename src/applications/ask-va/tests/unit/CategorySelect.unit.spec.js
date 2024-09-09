import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { envUrl } from '../../constants';
import { userData } from '../fixtures/data/mock-form-data';

import CategorySelect from '../../components/FormFields/CategorySelect';

describe('<CategorySelect /> component', () => {
  const apiRequestWithUrl = `${envUrl}/ask_va_api/v0/categories`;

  let server = null;

  const mockStore = {
    getState: () => ({
      form: {
        data: {},
      },
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: userData,
      },
      askVA: {},
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const props = {
    formContext: { reviewMode: false, submitted: undefined },
    id: 'root_selectCategory',
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
                id: '1',
                type: 'category',
                attributes: {
                  name: 'Infinity Stones',
                },
              },
              {
                id: '2',
                type: 'category',
                attributes: {
                  name: 'Asgard',
                },
              },
              {
                id: '3',
                type: 'category',
                attributes: {
                  name: 'Hydra',
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

  it('should get the category list', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <CategorySelect {...props} />
      </Provider>,
    );

    const selector = container.querySelectorAll('option');
    waitFor(() => {
      expect(selector[0]).to.have.text('');
      expect(selector[1]).to.have.text('Infinity Stones');
      expect(selector[2]).to.have.text('Asgard');
    });
  });
});
