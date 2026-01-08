import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const storeBase1 = {
  form: {
    formId: formConfig.formId,
    submission: {
      submittedAt: 'Oct. 25, 2023',
      timestamp: 'Oct. 25, 2023',
      response: {
        confirmationNumber: 'TEST-123',
      },
    },
    data: {
      firstLastName: {
        first: 'test',
        last: 'test',
      },
    },
  },
};

describe('Pre-need ConfirmationPage component', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should render', () => {
    const screen = render(
      <Provider store={mockStore(storeBase1)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(screen.getByText('We sent your application to the cemetery')).to
      .exist;
  });

  it('it should show response dependent text', () => {
    const screen = render(
      <Provider store={mockStore(storeBase1)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(screen.getByText('Applicant information')).to.exist;
  });
});
