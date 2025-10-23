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
      response: {
        confirmationNumber: '123456',
      },
      timestamp: Date.now(),
    },
    data: {
      fullName: {
        first: 'Jack',
        middle: 'W',
        last: 'Witness',
      },
      preparerFullName: {
        first: 'Arthur',
        middle: '',
        last: 'Preparer',
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
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText('Arthur');
    getByText('Preparer');
  });
});
