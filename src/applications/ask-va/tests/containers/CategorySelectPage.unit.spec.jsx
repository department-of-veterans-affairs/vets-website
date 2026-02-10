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
  const props = {
    formContext: { reviewMode: false, submitted: undefined },
    id: 'root_selectCategory',
    onChange: () => {},
    required: true,
    value: undefined,
  };

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
        <CategorySelect {...props} />
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

    userEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(container.querySelector('va-select[error="Select a category"]')).to
        .exist;
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
    });
  });
});
