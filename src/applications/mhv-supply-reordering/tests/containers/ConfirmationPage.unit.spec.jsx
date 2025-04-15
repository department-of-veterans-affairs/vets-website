import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const storeBase = {
  form: {
    formId: formConfig.formId,
    submission: {
      response: [{ productId: '1234', orderId: '4567' }],
      timestamp: Date.now(),
    },
    data: {
      fullName: {
        first: 'John',
        middle: '',
        last: 'Doe',
      },
    },
  },
};

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of person', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/John Doe/);
  });
});
