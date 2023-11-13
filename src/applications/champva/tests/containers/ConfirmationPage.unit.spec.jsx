import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const subDate = new Date('11/13/2023').toString();

const storeBase = {
  form: {
    formId: formConfig.formId,
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: subDate,
    },
    data: {
      veteransFullName: {
        first: 'Jack',
        middle: 'W',
        last: 'Veteran',
        suffix: 'Jr.',
      },
    },
  },
};

// Prepare some alternate data for different tests
const storeBaseNoVetName = JSON.parse(JSON.stringify(storeBase));
delete storeBaseNoVetName.form.data.veteransFullName;

const storeBaseNoVetSuffix = JSON.parse(JSON.stringify(storeBase));
delete storeBaseNoVetSuffix.form.data.veteransFullName.suffix;

const storeBaseNoSubmissionDate = JSON.parse(JSON.stringify(storeBase));
storeBaseNoSubmissionDate.form.submission.timestamp = '';

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

  it('should display correct name of person', () => {
    const { getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(getByText(/Jack W Veteran, Jr./)).to.exist;
  });

  it('should display correct name of person without a suffix', () => {
    const { getByText } = render(
      <Provider store={mockStore(storeBaseNoVetSuffix)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(getByText(/Jack W Veteran/)).to.exist;
  });

  it('should not display a full name if no full name is provided', () => {
    const { container } = render(
      <Provider store={mockStore(storeBaseNoVetName)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container.querySelector('.veterans-full-name')).to.not.exist;
  });

  it('should not display submission date if it is invalid', () => {
    const { container } = render(
      <Provider store={mockStore(storeBaseNoSubmissionDate)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(container.querySelector('.date-submitted')).to.not.exist;
  });

  it('should display submission date if it is valid', () => {
    const { getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );

    expect(getByText(/November 13, 2023/)).to.exist;
  });
});
