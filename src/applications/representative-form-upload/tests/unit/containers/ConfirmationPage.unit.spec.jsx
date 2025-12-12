import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const TEST_URL = 'https://dev.va.gov/form-upload/21-686c/confirmation';
const config = formConfig;

const veteranFullName = {
  first: 'John',
  middle: '',
  last: 'Veteran',
};
const address = {
  city: 'Boston',
  state: 'MA',
  postalCode: '12345',
};
const storeBase = {
  form: {
    formId: config.formId,
    submission: {
      response: {
        attributes: { creationDate: Date.now(), expirationDate: Date.now() },
      },
      timestamp: Date.now(),
    },
    data: {
      veteranFullName,
      address,
      benefitType: 'compensation',
    },
  },
};

describe('Confirmation page', () => {
  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('throws error if state.form is undefined', () => {
    const storeWithUndefinedForm = {
      ...storeBase,
      form: undefined,
    };

    expect(() => {
      render(
        <Provider store={mockStore(storeWithUndefinedForm)}>
          <ConfirmationPage />
        </Provider>,
      );
    }).to.throw();
  });

  it('shows status success', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
  });

  it('throws error when state.form is empty', () => {
    const storeWithEmptyForm = {
      ...storeBase,
      form: {},
    };

    expect(() => {
      render(
        <Provider store={mockStore(storeWithEmptyForm)}>
          <ConfirmationPage />
        </Provider>,
      );
    }).to.throw();
  });
});
