import { expect } from 'chai';

import vet360 from '../../reducers';
import * as VET360 from '../../constants';
import {
  ADDRESS_VALIDATION_RESET,
  UPDATE_SELECTED_ADDRESS,
  ADDRESS_VALIDATION_INITIALIZE,
  ADDRESS_VALIDATION_UPDATE,
} from '../../actions';

describe('vet360 reducer', () => {
  it('should return array of transaction data', () => {
    const state = vet360(
      {},
      {
        type: 'VET360_TRANSACTIONS_FETCH_SUCCESS',
        data: [1, 2, 3],
      },
    );

    expect(state.transactions.length).to.eql(3);
    expect(state.transactions).to.eql([{ data: 1 }, { data: 2 }, { data: 3 }]);
  });

  it('should set pending transaction', () => {
    const state = vet360(
      {},
      {
        type: 'VET360_TRANSACTION_REQUESTED',
        fieldName: 'fieldName',
        method: 'POST',
      },
    );

    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        isPending: true,
        method: 'POST',
      },
    });
  });

  it('should set pending transaction failure', () => {
    const state = vet360(
      {
        fieldTransactionMap: {
          fieldName: {
            retainedField: 'value',
          },
        },
      },
      {
        type: 'VET360_TRANSACTION_REQUEST_FAILED',
        fieldName: 'fieldName',
        error: 'errorMessage',
      },
    );

    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        retainedField: 'value',
        isPending: false,
        isFailed: true,
        error: 'errorMessage',
      },
    });
  });

  it('should set pending transaction success', () => {
    const state = vet360(
      {
        fieldTransactionMap: {
          fieldName: {
            retainedField: 'value',
          },
        },
        transactions: [],
      },
      {
        type: 'VET360_TRANSACTION_REQUEST_SUCCEEDED',
        fieldName: 'fieldName',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
            },
          },
        },
      },
    );

    expect(state.modal, 'The modal remains open').to.not.be.null;
    expect(state.transactions.length).to.eql(1);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        retainedField: 'value',
        isPending: false,
        transactionId: 111,
      },
    });
  });

  it('should set transaction update request', () => {
    const state = vet360(
      { transactionsAwaitingUpdate: [] },
      {
        type: 'VET360_TRANSACTION_UPDATE_REQUESTED',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
            },
          },
        },
      },
    );

    expect(state.transactionsAwaitingUpdate.length).to.eql(1);
    expect(state.transactionsAwaitingUpdate[0]).to.eql(111);
  });

  it('should set updated transaction request success', () => {
    const state = vet360(
      {
        transactions: [
          {
            data: {
              attributes: {
                transactionId: 111,
                transactionStatus: 'COMPLETED_SUCCESS',
              },
            },
          },
        ],
        transactionsAwaitingUpdate: [111],
        metadata: {},
      },
      {
        type: 'VET360_TRANSACTION_UPDATED',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
              transactionStatus: VET360.TRANSACTION_STATUS.COMPLETED_SUCCESS,
            },
          },
        },
      },
    );

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
  });

  it('should set updated transaction request failure', () => {
    const state = vet360(
      {
        transactions: [
          {
            data: {
              attributes: {
                transactionId: 111,
                transactionStatus: 'COMPLETED_SUCCESS',
              },
            },
          },
        ],
        transactionsAwaitingUpdate: [111],
        metadata: {},
      },
      {
        type: 'VET360_TRANSACTION_UPDATED',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
              transactionStatus: VET360.TRANSACTION_STATUS.COMPLETED_FAILURE,
            },
          },
        },
      },
    );

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
    expect(state.metadata.mostRecentErroredTransactionId).to.eql(111);
  });

  it('should set transaction update failed', () => {
    const state = vet360(
      { transactionsAwaitingUpdate: [111] },
      {
        type: 'VET360_TRANSACTION_UPDATE_FAILED',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
            },
          },
        },
      },
    );

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
  });

  it('should set transaction status cleared', () => {
    const state = vet360({}, { type: 'VET360_CLEAR_TRANSACTION_STATUS' });
    expect(state.transactionStatus.length).to.eql(0);
  });

  it('should set transaction cleared', () => {
    const state = vet360(
      {
        transactions: [
          {
            data: {
              attributes: {
                transactionId: 111,
              },
            },
          },
        ],
        metadata: {
          mostRecentErroredTransactionId: 111,
        },
      },
      {
        type: 'VET360_TRANSACTION_CLEARED',
        transaction: {
          data: {
            attributes: {
              transactionId: 111,
            },
          },
        },
      },
    );

    expect(state.metadata.mostRecentErroredTransactionId).to.eql(null);
    expect(state.modal).to.be.null;
    expect(state.transactions.length).to.eql(0);
  });

  it('should set transaction request cleared', () => {
    const state = vet360(
      {
        fieldTransactionMap: {
          fieldName: 'name',
        },
      },
      {
        type: 'VET360_TRANSACTION_REQUEST_CLEARED',
        fieldName: 'name',
      },
    );

    expect(state.fieldTransactionMap.name).to.eql(undefined);
  });

  it('should update profile form fields', () => {
    const state = vet360(
      {},
      {
        type: 'UPDATE_PROFILE_FORM_FIELD',
        field: 'fieldName',
        newState: {
          fieldValue: 'value',
        },
      },
    );

    expect(state.formFields.fieldName).to.eql({
      fieldValue: 'value',
    });
  });

  it('should open modal', () => {
    const state = vet360(
      {},
      {
        type: 'OPEN_MODAL',
        modal: 'modalName',
      },
    );

    expect(state.modal).to.eql('modalName');
  });

  it('should update addressValidation on confirm', () => {
    const state = vet360(
      {},
      {
        type: 'ADDRESS_VALIDATION_CONFIRM',
        addressValidationType: 'mailingAddress',
        suggestedAddresses: [],
        modal: 'addressValidation',
        validationKey: 123456,
      },
    );
    expect(state.modal).to.eql('addressValidation');
    expect(state.addressValidation.addressValidationType).to.eql(
      'mailingAddress',
    );
    expect(state.addressValidation.suggestedAddresses).to.eql([]);
    expect(state.addressValidation.validationKey).to.eql(123456);
  });

  describe('ADDRESS_VALIDATION_ERROR', () => {
    it('sets the correct data on the redux state', () => {
      const state = {
        metadata: {},
        otherData: true,
        modal: null,
        addressValidation: {
          suggestedAddresses: [{ street: '123 oak st' }],
          selectedAddress: { street: '456 elm' },
          selectedAddressId: 'userEntered',
        },
        fieldTransactionMap: {
          mailingAddress: { isPending: true },
        },
      };
      const action = {
        type: 'ADDRESS_VALIDATION_ERROR',
        addressFromUser: { street: '987 main' },
        addressValidationError: true,
        fieldName: 'mailingAddress',
        error: 'Foo',
      };
      const expectedState = {
        ...state,
        addressValidation: {
          addressValidationError: true,
          addressValidationType: 'mailingAddress',
          addressFromUser: { street: '987 main' },
          selectedAddress: {},
          selectedAddressId: null,
          suggestedAddresses: [],
          confirmedSuggestions: [],
          validationKey: null,
        },
        fieldTransactionMap: {
          mailingAddress: {
            isPending: false,
            isFailed: true,
            error: 'Foo',
          },
        },
        modal: 'mailingAddress',
      };
      expect(vet360(state, action)).to.eql(expectedState);
    });
  });

  describe('ADDRESS_VALIDATION_RESET action', () => {
    it('resets the addressValidation state', () => {
      const state = {
        modal: 'modalName',
        modalData: { foo: 'bar' },
        addressValidation: {
          addressValidationType: 'address',
          confirmedSuggestions: [],
          suggestedAddresses: [{ street: '123 Main St' }],
          addressFromUser: {
            addressLine1: '123 main',
            addressLine2: '',
            addressLine3: '',
            city: 'sf',
            stateCode: 'CA',
            zipCode: '12345',
          },
          addressValidationError: false,
          validationKey: 1234,
          selectedAddress: {},
          selectedAddressId: null,
        },
      };
      const action = {
        type: ADDRESS_VALIDATION_RESET,
      };
      const expectedState = {
        ...state,
        addressValidation: {
          addressValidationType: '',
          suggestedAddresses: [],
          confirmedSuggestions: [],
          addressFromUser: {
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            city: '',
            stateCode: '',
            zipCode: '',
            countryCodeIso3: '',
          },
          addressValidationError: false,
          validationKey: null,
          selectedAddress: {},
          selectedAddressId: null,
        },
      };
      expect(vet360(state, action)).to.eql(expectedState);
    });
  });

  describe('UPDATE_SELECTED_ADDRESS action', () => {
    it('sets the selectedAddress and selectedAddressId from the action', () => {
      const state = {
        metadata: {},
        otherData: true,
        addressValidation: {
          selectedAddress: { street: '456 elm' },
          selectedAddressId: 'userEntered',
        },
      };
      const action = {
        type: UPDATE_SELECTED_ADDRESS,
        selectedAddress: {
          street: '123 main',
        },
        selectedAddressId: '0',
      };
      const expectedState = {
        ...state,
        addressValidation: {
          selectedAddress: { street: '123 main' },
          selectedAddressId: '0',
        },
      };
      expect(vet360(state, action)).to.eql(expectedState);
    });
  });

  describe('ADDRESS_VALIDATION_INITIALIZE action', () => {
    it('sets inProgress to true', () => {
      const state = {
        fieldTransactionMap: {
          mailingAddress: { isPending: false },
        },
      };
      const action = {
        type: ADDRESS_VALIDATION_INITIALIZE,
        fieldName: 'mailingAddress',
      };
      const expectedState = {
        addressValidation: {
          addressFromUser: {
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            city: '',
            stateCode: '',
            zipCode: '',
            countryCodeIso3: '',
          },
          addressValidationError: false,
          addressValidationType: '',
          confirmedSuggestions: [],
          selectedAddress: {},
          selectedAddressId: null,
          suggestedAddresses: [],
          validationKey: null,
        },
        fieldTransactionMap: {
          mailingAddress: { isPending: true },
        },
      };
      expect(vet360(state, action)).to.eql(expectedState);
    });
  });

  describe('ADDRESS_VALIDATION_UPDATE action', () => {
    it('sets inProgress to true', () => {
      const expectedState = {
        fieldTransactionMap: {
          mailingAddress: { isPending: true },
        },
      };
      const state = {
        fieldTransactionMap: {
          mailingAddress: { isPending: false },
        },
      };
      const action = {
        type: ADDRESS_VALIDATION_UPDATE,
        fieldName: 'mailingAddress',
      };
      expect(vet360(state, action)).to.eql(expectedState);
    });
  });
});
