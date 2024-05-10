import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import ConfirmationPage from '../../containers/ConfirmationPage';
import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

const subDate = new Date('11/13/2023').toString();

const storeBase = {
  form: {
    ...formConfig,
    ...mockData,
    pages: { page1: { schema: { properties: {} } } },
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: subDate,
    },
  },
};

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should exist', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container).to.exist;
  });
});
