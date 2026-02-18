import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import ConnectedProfileInformationFieldController, {
  ProfileInformationFieldController,
} from '../../components/ProfileInformationFieldController';
import { FIELD_NAMES } from '../../constants';

describe('ProfileInformationFieldController vap service transaction error', () => {
  // This is to ensure through the whole field controller component tree
  // that only one error alert can render from a transaction error action

  // Using the email as a baseline to test fields because it is basic enough
  const fieldName = FIELD_NAMES.EMAIL;

  const requiredProps = {
    fieldName,

    analyticsSectionName: fieldName,
    apiRoute: '/profile/email_addresses',
    blockEditMode: false,
    clearTransactionRequest() {},
    convertCleanDataToPayload() {},
    createSchedulingPreferencesUpdate() {},
    createTransaction() {},
    formSchema: {},
    hasUnsavedEdits: false,
    isEmpty: false,
    isEnrolledInVAHealthCare: false,
    openModal() {},
    showEditView: false,
    showValidationView: false,
    uiSchema: {},
    activeEditView: null,
    data: null,
    editViewData: null,
    email: null,
    forceEditView: false,
    homePhone: null,
    mailingAddress: null,
    mobilePhone: null,
    refreshTransaction() {},
    showCopyAddressModal: false,
    showErrorAlert: false,
    showRemoveModal: false,
    showUpdateSuccessAlert: false,
    title: 'Email Address',
    transaction: null,
    transactionError: null,
    transactionRequest: null,
    updateMessagingSignature() {},
    workPhone: null,
  };

  it('does not show alert if no tranaction request error', () => {
    const { queryByRole, queryByTestId } = render(
      <ProfileInformationFieldController {...requiredProps} />,
    );
    expect(queryByRole('alert')).to.not.exist;
    expect(queryByTestId('vap-service-error-alert')).to.not.exist;
  });

  it('shows alert on tranaction request error property', () => {
    const { getByRole, getByTestId } = render(
      <ProfileInformationFieldController
        {...requiredProps}
        transactionError={{ error: true }}
      />,
    );
    expect(getByRole('alert')).to.exist;

    const errorAlert = getByTestId('vap-service-error-alert');
    expect(errorAlert.textContent).to.contain(
      'We’re sorry. We can’t update your information right now. We’re working to fix this problem. Try again later.',
    );
  });

  it('shows alert on tranaction request error object', () => {
    const { getByRole, getByTestId } = render(
      <ProfileInformationFieldController
        {...requiredProps}
        transactionError={{ error: {} }}
      />,
    );
    expect(getByRole('alert')).to.exist;
    expect(getByTestId('vap-service-error-alert')).to.exist;
  });

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

  const errorState = {
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
      transactions: [
        {
          data: {
            attributes: {
              transactionId: 'email_address_tx_id',
              transactionStatus: 'COMPLETED_FAILURE',
            },
          },
        },
      ],
      fieldTransactionMap: {
        email: {
          isPending: false,
          transactionId: 'email_address_tx_id',
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

  it('shows alert on transaction error in read-only', () => {
    const { getByTestId, getByRole } = render(
      <Provider store={createMockStore(errorState)}>
        <ConnectedProfileInformationFieldController {...requiredProps} />
      </Provider>,
    );
    expect(getByRole('alert')).to.exist;
    expect(getByTestId('vap-service-error-alert')).to.exist;
  });

  it('shows alert on transaction error in edit mode', () => {
    const { getByTestId, getByRole } = render(
      <Provider
        store={createMockStore({
          ...errorState,
          vapService: {
            ...errorState.vapService,
            modal: fieldName,
          },
        })}
      >
        <ConnectedProfileInformationFieldController {...requiredProps} />
      </Provider>,
    );
    expect(getByRole('alert')).to.exist;
    expect(getByTestId('vap-service-error-alert')).to.exist;
  });
});
