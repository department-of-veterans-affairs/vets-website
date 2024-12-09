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
      },
      timestamp: Date.now(),
    },
    data: {
      fullName: {
        first: 'Jack',
        middle: 'W',
        last: 'Witness',
      },
    },
  },
};

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of person', () => {
    const route = {
      formConfig: {
        chapters: {
          chapter1: {
            title: 'Chapter 1',
            pages: {
              page1: {
                title: 'Page 1',
                schema: {},
                uiSchema: {},
              },
            },
          },
        },
      },
    };

    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage route={route} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
  });
});
