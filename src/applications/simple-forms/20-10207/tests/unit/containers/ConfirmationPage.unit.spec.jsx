import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const veteranFullName = {
  first: 'John',
  middle: '',
  last: 'Veteran',
};
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
      preparerType: 'veteran',
      veteranFullName,
    },
  },
};
const fullNameString = veteranFullName.middle
  ? `${veteranFullName.first} ${veteranFullName.middle} ${veteranFullName.last}`
  : `${veteranFullName.first} ${veteranFullName.last}`;
const fullNameStringRegex = new RegExp(fullNameString, 'i');

describe('Confirmation page', () => {
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

  it('shows status success and the correct name of applicant', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(fullNameStringRegex);
  });

  it('handles missing submission response', () => {
    const storeWithMissingResponse = {
      ...storeBase,
      form: {
        ...storeBase.form,
        submission: {
          ...storeBase.form.submission,
          response: null,
        },
      },
    };

    const { queryByText } = render(
      <Provider store={mockStore(storeWithMissingResponse)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(queryByText(/123456/)).to.be.null;
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
