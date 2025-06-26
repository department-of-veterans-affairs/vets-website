import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import ConnectedConfirmationPage from '../../containers/ConfirmationPage';

const mockStore = configureStore([]);

describe('<ConfirmationPage> conditional render', () => {
  it('shows full name + formatted date when both are present', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '2025-05-23T12:00:00Z' },
        formId: '22-8794',
        data: {
          fullName: {
            first: 'Jane',
            middle: 'A',
            last: 'Doe',
            suffix: 'Jr.',
          },
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage />
      </Provider>,
    );

    // name line
    expect(getByText(/for Jane A Doe, Jr\./i)).to.exist;

    // date line
    expect(getByText('May 23, 2025')).to.exist;
  });

  it('hides name & date blocks when missing/invalid', () => {
    const store = mockStore({
      form: {
        submission: { timestamp: '' }, // ← empty string = Invalid Date
        formId: '22-8794',
        data: {}, // fullName missing
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <ConnectedConfirmationPage />
      </Provider>,
    );

    expect(queryByText(/for .*Doe/i)).to.be.null; // no name line
    expect(queryByText(/Date submitted/i)).to.be.null; // no date block
  });
});
