import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { envUrl } from '../../constants';
import { userData } from '../fixtures/data/mock-form-data';

import SubtopicSelect from '../../components/FormFields/SubtopicSelect';

describe('<SubtopicSelect /> component', () => {
  const apiRequestWithUrl = `${envUrl}/ask_va_api/v0/topics/1/subtopics`;

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
    id: 'root_selectSubtopic',
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
                type: 'subtopics',
                attributes: {
                  name: 'Avengers Assemble',
                },
              },
              {
                id: '2',
                type: 'subtopics',
                attributes: {
                  name: 'Avengers Defend',
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

  it('should get the subtopic list', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SubtopicSelect {...props} />
      </Provider>,
    );

    const selector = container.querySelectorAll('option');
    waitFor(() => {
      expect(selector[0]).to.have.text('');
      expect(selector[1]).to.have.text('Avengers Assemble');
      expect(selector[2]).to.have.text('Avengers Defend');
    });
  });
});
