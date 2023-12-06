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
      response: {
        attributes: {
          trackingNumber: '123456',
        },
      },
      submittedAt: 'Oct. 25, 2023',
    },
    data: {
      application: {
        claimant: {
          name: {
            first: 'test',
            middle: 't',
            last: 'test',
            suffix: 'T',
          },
        },
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
        <ConfirmationPage />
      </Provider>,
    );
    expect(screen.getByText('Your claim has been submitted.')).to.exist;
  });

  it('it should show response dependent text', () => {
    const screen = render(
      <Provider store={mockStore(storeBase1)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(screen.getByText('123456')).to.exist;
    expect(screen.getByText('Oct. 25, 2023')).to.exist;
  });

  const storeBase2 = {
    form: {
      formId: formConfig.formId,
      submission: {
        submittedAt: 'Oct. 25, 2023',
      },
      data: {
        application: {
          claimant: {
            name: {
              first: 'test',
              middle: 't',
              last: 'test',
              suffix: 'T',
            },
          },
        },
      },
    },
  };

  it('it should not show response dependent text', () => {
    const screen = render(
      <Provider store={mockStore(storeBase2)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(screen.queryByText('123456')).to.not.exist;
    expect(screen.queryByText('Oct. 25, 2023')).to.not.exist;
  });
});
