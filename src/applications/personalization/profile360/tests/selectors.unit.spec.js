import React from 'react';
import { expect } from 'chai';

import {
  FIELD_NAMES,
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY_TYPES
} from '../constants/vet360';

import selectors from '../selectors';

let state = null;

const hooks = {
  beforeEach() {
    const user = {
      profile: {
        vet360: {

        }
      }
    };

    const vet360 = {
      transactions: [

      ],
      fieldTransactionMap: {

      }
    };

    const vaProfile = {
      modal: null,
      formFields: {

      }
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
  });

  describe('selectVet360Field', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectVet360Transaction', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectVet360SuccessfulTransactions', () => {
    beforeEach(hooks.beforeEach);
  });

  describe('selectVet360FailedTransactions', () => {
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
