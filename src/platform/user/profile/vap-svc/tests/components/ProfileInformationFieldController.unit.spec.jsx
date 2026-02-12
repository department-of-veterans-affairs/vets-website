import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { MemoryRouter } from 'react-router-dom';

import { RoutedProfileInformationFieldController } from '../../components/ProfileInformationFieldController';
import { FIELD_NAMES } from '../../constants';

const createMockStore = initialState =>
  createStore(
    combineReducers({
      vapService: (state = initialState.vapService || {}) => state,
      user: (
        state = initialState.user || {
          profile: { status: 'OK', services: [] },
        },
      ) => state,
    }),
  );

describe('<ProfileInformationFieldController /> shows an error alert when there is a service transaction error', () => {
  // Using the email as a baseline to test fields because it is basic enough
  const fieldName = FIELD_NAMES.EMAIL;

  const state = {
    vapService: {
      hasUnsavedEdits: false,
      formFields: {
        email: {
          value: {
            emailAddress: 'test@va.gov',
            createdAt: '2018-04-20T17:24:13.000Z',
            effectiveEndDate: null,
            effectiveStartDate: '2019-03-07T22:32:40.000Z',
            id: 20648,
            sourceDate: '2019-03-07T22:32:40.000Z',
            sourceSystemUser: null,
            transactionId: '44a0858b-3dd1-4de2-903d-38b147981a9c',
            updatedAt: '2019-03-08T05:09:58.000Z',
            vet360Id: '1273766',
          },
          formSchema: {
            type: 'object',
            properties: {
              emailAddress: {
                type: 'string',
                format: 'email',
                maxLength: 255,
                pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$',
              },
            },
            required: ['emailAddress'],
          },
          uiSchema: {
            emailAddress: {
              'ui:title': 'Email Address',
              'ui:autocomplete': 'email',
              'ui:errorMessages': {
                required:
                  'You must enter your email address, using this format: X@X.com',
                pattern:
                  'You must enter your email address again, using this format: X@X.com',
              },
              'ui:options': {
                inputType: 'email',
              },
            },
          },
        },
      },
      transactions: [],
      // Field used by UI error alert
      fieldTransactionMap: {
        email: {
          isPending: false,
          method: 'PUT',
          isFailed: true,
          error: {
            errors: [
              {
                title: 'Error',
                detail: 'Error Detail',
                code: 'SVC_ERR123',
                status: '401',
              },
            ],
          },
        },
      },
    },
    user: {
      profile: {
        status: 'OK',
        services: [],
        vapContactInfo: {
          email: {
            emailAddress: 'test@va.gov',
          },
        },
      },
    },
  };

  // This is to ensure through the whole field controller component tree
  // that only one error alert can render from a transaction error action
  const assertErrorAlert = initialState => {
    const store = createMockStore(initialState);

    const { getByTestId, getByRole } = render(
      <Provider store={store}>
        <MemoryRouter>
          <RoutedProfileInformationFieldController fieldName={fieldName} />
        </MemoryRouter>
      </Provider>,
    );

    const errorAlert = getByTestId('edit-error-alert');
    expect(errorAlert).to.exist;

    // Ensures only 1 alert for the field controller
    const alertContent = getByRole('alert');
    expect(alertContent.textContent).to.contain(
      'We’re sorry. We can’t update your information right now. We’re working to fix this problem. Try again later.',
    );
  };

  it('shows the alert in read-only mode', () => {
    assertErrorAlert(state);
  });

  it('shows the alert in edit mode', () => {
    assertErrorAlert({
      ...state,
      vapService: { ...state.vapService, modal: fieldName },
    });
  });
});
