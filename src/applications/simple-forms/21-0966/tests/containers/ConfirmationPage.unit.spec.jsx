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
        expirationDate: '2022-03-16T19:15:20.000-05:00',
      },
      timestamp: Date.now(),
    },
    data: {
      benefitSelection: {
        COMPENSATION: true,
      },
      veteranFullName: {
        first: 'Jack',
        middle: 'W',
        last: 'Veteran',
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
    getByText(/Jack W Veteran/);
  });
});
