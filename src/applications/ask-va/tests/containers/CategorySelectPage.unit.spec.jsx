<<<<<<< HEAD
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Provider } from 'react-redux';
import { envUrl } from '../../constants';
import { userData } from '../fixtures/data/mock-form-data';

import CategorySelect from '../../containers/CategorySelectPage';

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

=======
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import CategorySelect from '../../containers/CategorySelectPage';
import { createMockStore } from '../common';

describe('<CategorySelect /> component', () => {
  let sandbox;
>>>>>>> main
  const props = {
    formContext: { reviewMode: false, submitted: undefined },
    id: 'root_selectCategory',
    onChange: () => {},
    required: true,
    value: undefined,
  };

<<<<<<< HEAD
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
=======
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the category list and able to select an option', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    const onChange = sandbox.spy();
    apiRequestStub.resolves({
      data: [
        {
          id: '1',
          attributes: {
            name: 'Education benefits and work study',
          },
        },
      ],
    });

    const { container } = render(
      <Provider store={createMockStore()}>
        <CategorySelect {...props} onChange={onChange} />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('va-select[name="Select category"]')).to
        .exist;
      expect(
        container.querySelector(
          'option[value="Education benefits and work study"]',
        ),
      ).to.exist;
    });

    const vaSelect = container.querySelector(
      'va-select[name="Select category"]',
    );
    vaSelect.__events.vaSelect({
      detail: { value: 'Education benefits and work study' },
    });

    await waitFor(() => {
      expect(onChange.firstCall.args[0].selectCategory).to.equal(
        'Education benefits and work study',
      );
    });
  });

  it.skip('should be able to go back', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    const goBack = sandbox.spy();

    apiRequestStub.resolves({
      data: [
        {
          id: '1',
          attributes: {
            name: 'Education benefits and work study',
          },
        },
      ],
    });

    const { container, getByText } = render(
      <Provider
        store={createMockStore({
          currentlyLoggedIn: true,
        })}
      >
        <CategorySelect {...props} goBack={goBack} isLoggedIn />
      </Provider>,
    );

    await waitFor(() => {
      expect(container.querySelector('va-select[name="Select category"]')).to
        .exist;
    });

    userEvent.click(getByText('Back'));

    await waitFor(() => {
      expect(goBack.called).to.be.true;
    });
  });

  it('should show validation error if no category is selected', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: [
        {
          id: '1',
          attributes: {
            name: 'Education benefits and work study',
          },
        },
      ],
    });

    const { container, getByText } = render(
      <Provider store={createMockStore()}>
>>>>>>> main
        <CategorySelect {...props} />
      </Provider>,
    );

<<<<<<< HEAD
    const selector = container.querySelectorAll('option');
    waitFor(() => {
      expect(selector[0]).to.have.text('');
      expect(selector[1]).to.have.text('Infinity Stones');
      expect(selector[2]).to.have.text('Asgard');
=======
    await waitFor(() => {
      expect(container.querySelector('va-select[name="Select category"]')).to
        .exist;
      expect(
        container.querySelector(
          'option[value="Education benefits and work study"]',
        ),
      ).to.exist;
    });

    userEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(
        container.querySelector('va-select[error="Please select a category"]'),
      ).to.exist;
    });
  });

  it('should show error if unable to get api data', async () => {
    const apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    apiRequestStub.rejects();

    const { getByText } = render(
      <Provider store={createMockStore()}>
        <CategorySelect {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('We’re sorry. Something went wrong on our end')).to
        .exist;
>>>>>>> main
    });
  });
});
