import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DirectDepositCustomReview from '../../components/DirectDepositCustomReview';

const mockStore = configureStore([]);

describe('DirectDepositCustomReview', () => {
  it('renders without crashing', () => {
    const initialState = {
      form: {
        data: {
          'view:directDeposit': {
            bankAccount: {
              accountType: 'checking',
              routingNumber: '123456789',
              accountNumber: '123456789012',
            },
          },
        },
      },
      formContext: { onReviewPage: true },
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <DirectDepositCustomReview editPage={() => {}} />
      </Provider>,
    );

    expect(getByText('Review your direct deposit information')).to.exist;
  });
});
