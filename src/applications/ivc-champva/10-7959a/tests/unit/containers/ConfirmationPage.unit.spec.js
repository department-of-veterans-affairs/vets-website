import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/test-data.json';

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

const storeBaseTruncated = {
  form: {
    ...formConfig,
    data: {
      fullName: {
        first: 'first',
        middle: 'middle',
        last: 'last',
        suffix: 'jr',
      },
    },
    pages: { page1: { schema: { properties: {} } } },
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: 'invalid',
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

  it('should render fullName if present', () => {
    const { container } = render(
      <Provider store={mockStore(storeBaseTruncated)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container.querySelector('.inset')).to.include.text(
      'first middle last, jr',
    );
  });

  it('should render name without suffix if none present', () => {
    const tmpStore = storeBaseTruncated;
    delete tmpStore.form.data.fullName.suffix;
    const { container } = render(
      <Provider store={mockStore(tmpStore)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container.querySelector('.inset')).to.not.include.text(
      'first middle lastnull',
    );
    expect(container.querySelector('.inset')).to.include.text(
      'first middle last',
    );
  });
});
