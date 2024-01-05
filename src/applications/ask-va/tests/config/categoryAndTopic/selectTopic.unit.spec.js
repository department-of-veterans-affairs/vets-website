import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.categoryAndTopic.pages.selectTopic;

describe('selectTopic config', () => {
  const apiRequestWithUrl = `${
    environment.API_URL
  }/ask_va_api/v0/categories/2/topics`;

  let server = null;

  before(() => {
    server = setupServer(
      rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
        return res(
          ctx.json({
            peter: {
              dataInfo: 'peter.parker@email.com',
            },
            eddie: {
              dataInfo: 'eddie.brock@mail.com',
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

  it('should render', async () => {
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

    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('h3', container)[1].textContent).to.eq('Topic');
    });
  });
});
