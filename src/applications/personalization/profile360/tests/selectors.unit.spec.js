import React from 'react';
import { expect } from 'chai';

import backendServices from '../../../../platform/user/profile/constants/backendServices';

import {
  FIELD_NAMES,
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY_TYPES
} from '../constants/vet360';

import * as selectors from '../selectors';
import { exec } from 'child_process';

let state = null;

const hooks = {
  beforeEach() {
    const user = {
      profile: {
        services: [
          backendServices.VET360
        ],
        vet360: {}
      }
    };

    const vet360 = {
      transactions: [],
      fieldTransactionMap: {}
    };

    const vaProfile = {
      modal: null,
      formFields: {}
    };

    state = {
      user,
      vet360,
      vaProfile
    };
  }
}

describe('selectors', () => {

  describe('selectIsVet360AvailableForUser', ()  => {
    beforeEach(hooks.beforeEach);
    it('returns true if vet660 is found in the profile.services list or when the environment is localhost', () => {
      const old = { document: global.document };
      global.document = {
        location: {
          hostname: 'localhost'
        }
      };

      let result = selectors.selectIsVet360AvailableForUser(state);
      expect(result, 'returns true when on localhost so the local mock Vet360 will run').to.be.true;

      global.document.location.hostname = 'working-vet360';
      result = selectors.selectIsVet360AvailableForUser(state);
      expect(result, 'returns true when the environment is not localhost but Vet360 is in the profile services array').to.be.true;

      state.user.profile.services = [];
      result = selectors.selectIsVet360AvailableForUser(state);
      expect(result, 'returns false when the environment is not localhost and Vet360 is not in the services array').to.be.false;

      global.document = old.document
    });
  });

  describe('selectVet360Field', () => {
    beforeEach(hooks.beforeEach);
    it('looks up a field from the user vet360 data', () => {
      state.user.profile.vet360 = { someField: 'data' };
      expect(selectors.selectVet360Field(state, 'someField')).to.equal('data');
    });
  });

  describe('selectVet360Transaction', () => {
    beforeEach(hooks.beforeEach);
    it('accepts a field name to look up a transaction and transaction request using the field-transaction map', () => {
      const fieldName = 'someField';
      const transactionId = 'transaction_1';
      const transaction = {
        data: {
          attributes: {
            transactionId
          }
        }
      };
      const transactions = [transaction];
      const transactionRequest = { transactionId };
      const fieldTransactionMap = {
        [fieldName]: transactionRequest
      };

      state.vet360 = { transactions, fieldTransactionMap };

      let result = selectors.selectVet360Transaction(state, fieldName);
      expect(result).to.deep.equal({ transaction, transactionRequest });

      result = selectors.selectVet360Transaction(state, 'someOtherField');
      expect(result, 'returns a null transaction for a field that has no data in the field-transaction map').to.be.deep.equal({
        transaction: null,
        transactionRequest: null
      });
    });
  });

  describe('selectVet360SuccessfulTransactions', () => {
    beforeEach(hooks.beforeEach);
    it('returns only successful transactions from a list of transactions', () => {
      const successful = [
        { data: { attributes: { transactionStatus: TRANSACTION_STATUS.COMPLETED_SUCCESS }}},
        { data: { attributes: { transactionStatus: TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED }}}
      ];

      state.vet360.transactions = [
        ...successful,
        { data: { attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED }}},
        { data: { attributes: { transactionStatus: TRANSACTION_STATUS.REJECTED }}}
      ];

      expect(selectors.selectVet360SuccessfulTransactions(state)).to.include(successful[0]);
      expect(selectors.selectVet360SuccessfulTransactions(state)).to.include(successful[1]);
    });
  });

  describe('selectVet360FailedTransactions', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectMostRecentSuccessfulTransaction', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectMostRecentErroredTransaction', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectVet360PendingCategoryTransactions', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectEditedFormField', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectCurrentlyOpenEditModal', () => {
    beforeEach(hooks.beforeEach);
  });

});
