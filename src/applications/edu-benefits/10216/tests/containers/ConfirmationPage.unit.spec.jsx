import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

const storeBase = {
  form: {
    submission: {
      timestamp: '2024-01-02T03:04:05.067Z',
      response: {
        confirmationNumber: '123456',
        pdfUrl: '',
      },
    },
    data: {
      fullName: {
        first: 'John',
        middle: '',
        last: 'Doe',
        suffix: '',
      },
    },
  },
};

describe('<ConfirmationPage>', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render with data', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
