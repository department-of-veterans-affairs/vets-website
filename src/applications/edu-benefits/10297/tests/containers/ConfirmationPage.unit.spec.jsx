import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';

import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

before(() => {
  if (!global.scrollTo) global.scrollTo = () => {};
});

const getPage = submission =>
  render(
    <Provider
      store={mockStore({
        form: {
          ...createInitialState(formConfig),
          submission,
        },
      })}
    >
      <ConfirmationPage route={{ formConfig }} />
    </Provider>,
  );

describe('<ConfirmationPage />', () => {
  afterEach(cleanup);

  it('shows success alert', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );
  });

  it('shows summary box with button to print page', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-summary-box')).to.exist;
    expect(container.querySelectorAll('va-summary-box h4').length).to.equal(3);
    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Print this page',
    );
  });

  it('shows process list section', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-process-list')).to.exist;
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  it('shows action link to return to VA.gov homepage', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container.querySelector('va-link-action')).to.have.attribute(
      'text',
      'Go back to VA.gov',
    );
  });

  it('renders safely when submission object is empty (defaults kick in)', () => {
    const { container, queryByText } = getPage({});

    expect(container.querySelector('va-alert')).to.have.attribute(
      'status',
      'success',
    );

    expect(queryByText(/\d{6,}/)).to.be.null;
  });
});
