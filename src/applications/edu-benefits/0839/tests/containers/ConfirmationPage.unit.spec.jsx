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

describe('ConfirmationPage', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    const { container } = getPage({
      response: { confirmationNumber: '1234567890' },
      timestamp: new Date().toISOString(),
    });

    expect(container).to.exist;
  });

  // it('shows success alert, heading, and confirmation number', () => {
  //   const { container, getByText } = getPage({
  //     response: { confirmationNumber: '1234567890' },
  //     timestamp: new Date().toISOString(),
  //   });

  //   expect(container.querySelector('va-alert')).to.have.attribute(
  //     'status',
  //     'success',
  //   );
  //   getByText(/Form submission started/i);
  //   getByText(/1234567890/);
  // });

  // it('renders safely when submission object is empty (defaults kick in)', () => {
  //   const { container, queryByText } = getPage({});

  //   expect(container.querySelector('va-alert')).to.have.attribute(
  //     'status',
  //     'success',
  //   );

  //   expect(queryByText(/\d{6,}/)).to.be.null;
  // });
});
