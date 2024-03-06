// import React from 'react';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react';
// import configureStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import { expect } from 'chai';
import formConfig from '../../config/form';
// import ConfirmationPage from '../../containers/ConfirmationPage';

import mockData from '../fixtures/data/test-data.json';

const subDate = new Date('11/13/2023').toString();

const storeBase = {
  form: {
    ...formConfig,
    pages: {
      page1: {
        schema: {
          properties: {
            applicants: {
              items: [],
            },
          },
        },
      },
    },
    formId: formConfig.formId,
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: subDate,
    },
    data: mockData.data,
  },
};

// const fullName = `${mockData.data.veteransFullName.first} ${
//   mockData.data.veteransFullName.last
// }`;

// Prepare some alternate data for different tests
const storeBaseNoSubmissionDate = JSON.parse(JSON.stringify(storeBase));
storeBaseNoSubmissionDate.form.submission.timestamp = '';

/*
// TODO: These tests need rework. Commenting out until that can be tackled.
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

    expect(getByText(fullName)).to.exist;
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
*/
