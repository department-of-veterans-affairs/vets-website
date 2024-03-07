import { expect } from 'chai';
import backendServices from '../../constants/backendServices';

import {
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY_TYPES,
  INIT_VAP_SERVICE_ID,
  VAP_SERVICE_INITIALIZATION_STATUS,
} from '../constants';

import * as selectors from '../selectors';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

let state = null;

const hooks = {
  beforeEach() {
    const user = {
      profile: {
        services: [backendServices.VA_PROFILE],
        vapContactInfo: {},
      },
    };

    const vapService = {
      modal: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      metadata: {
        mostRecentErroredTransactionId: '',
      },
    };

    state = {
      user,
      vapService,
    };
  },
};

describe('selectors', () => {
  describe('selectIsVAProfileServiceAvailableForUser', () => {
    beforeEach(hooks.beforeEach);
    it('returns true if vet360 is found in the profile.services list or when the environment is localhost', () => {
      const old = { document: global.document };
      global.document = {
        location: {
          hostname: 'localhost',
        },
      };

      let result = selectors.selectIsVAProfileServiceAvailableForUser(state);
      expect(
        result,
        'returns true when on localhost so the local VA Profile Service mock will run',
      ).to.be.true;

      global.document.location.hostname = 'staging.va.gov';
      result = selectors.selectIsVAProfileServiceAvailableForUser(state);
      expect(
        result,
        'returns true when the environment is not localhost but Vet360 is in the profile services array',
      ).to.be.true;

      state.user.profile.services = [];
      result = selectors.selectIsVAProfileServiceAvailableForUser(state);
      expect(
        result,
        'returns false when the environment is not localhost and Vet360 is not in the services array',
      ).to.be.false;

      global.document = old.document;
    });
  });

  describe('selectVAPContactInfoField', () => {
    beforeEach(hooks.beforeEach);
    it('looks up a field from the user VAP contact info data', () => {
      state.user.profile.vapContactInfo = { someField: 'data' };
      expect(selectors.selectVAPContactInfoField(state, 'someField')).to.equal(
        'data',
      );
    });
  });

  describe('selectVAPServiceTransaction', () => {
    beforeEach(hooks.beforeEach);
    it.skip('accepts a field name to look up a transaction and transaction request using the field-transaction map', async () => {
      const fieldName = 'someField';
      const transactionId = 'transaction_1';
      const transaction = {
        data: {
          attributes: {
            transactionId,
          },
        },
      };
      const transactions = [transaction];
      const transactionRequest = { transactionId };
      const fieldTransactionMap = {
        [fieldName]: transactionRequest,
      };

      state.vapService = { transactions, fieldTransactionMap };

      let result = selectors.selectVAPServiceTransaction(state, fieldName);
      expect(result).to.deep.equal({ transaction, transactionRequest });

      result = selectors.selectVAPServiceTransaction(state, 'someOtherField');

      await wait(300);

      expect(
        result,
        'returns a null transaction for a field that has no data in the field-transaction map',
      ).to.be.deep.equal({
        transaction: null,
        transactionRequest: null,
      });
    });
  });

  describe('selectVAPServiceFailedTransactions', () => {
    beforeEach(hooks.beforeEach);
    it.skip('returns only failed transactions from a list of transactions', async () => {
      const failed = [
        {
          data: {
            attributes: {
              transactionStatus: TRANSACTION_STATUS.COMPLETED_FAILURE,
            },
          },
        },
        {
          data: {
            attributes: { transactionStatus: TRANSACTION_STATUS.REJECTED },
          },
        },
      ];

      state.vapService.transactions = [
        ...failed,
        {
          data: {
            attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED },
          },
        },
        {
          data: {
            attributes: {
              transactionStatus: TRANSACTION_STATUS.COMPLETED_SUCCESS,
            },
          },
        },
        {
          data: {
            attributes: {
              transactionStatus:
                TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED,
            },
          },
        },
      ];

      await wait(500);

      const result = selectors.selectVAPServiceFailedTransactions(state);

      expect(result).to.include(failed[0]);
      expect(result).to.include(failed[1]);
    });
  });

  describe('selectMostRecentErroredTransaction', () => {
    beforeEach(hooks.beforeEach);
    it('selects the transaction of the ID stored in the metadata mostRecentErroredTransactionId', () => {
      const transactionId = 'transaction_id';
      const transaction = { data: { attributes: { transactionId } } };
      state.vapService.transactions = [transaction];
      state.vapService.metadata.mostRecentErroredTransactionId = transactionId;
      expect(selectors.selectMostRecentErroredTransaction(state)).to.be.equal(
        transaction,
      );
    });
  });

  describe('selectVAPServicePendingCategoryTransactions', () => {
    beforeEach(hooks.beforeEach);
    it('selects transactions of the passed transaction category type that is still pending and without field-level data', () => {
      const type = TRANSACTION_CATEGORY_TYPES.ADDRESS;
      const pendingAddressTransactions = [
        {
          data: {
            attributes: {
              type,
              transactionId: 'transaction_1',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type,
              transactionId: 'transaction_2',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
      ];

      const transactions = [
        ...pendingAddressTransactions,
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.EMAIL,
              transactionId: 'transaction_3',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.PHONE,
              transactionId: 'transaction_4',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.ADDRESS,
              transactionId: 'transaction_5',
              transactionStatus: TRANSACTION_STATUS.COMPLETED_SUCCESS,
            },
          },
        },
      ];

      state.vapService.transactions = transactions;

      const result = selectors.selectVAPServicePendingCategoryTransactions(
        state,
        type,
      );

      expect(result).to.include(pendingAddressTransactions[0]);
      expect(result).to.include(pendingAddressTransactions[1]);
    });
  });

  describe('selectEditedFormField', () => {
    beforeEach(hooks.beforeEach);
    it('looks up the form value in state for a given field name', () => {
      const fieldName = 'someField';
      const fieldValue = 'someFieldValue';
      state.vapService.formFields[fieldName] = fieldValue;

      expect(selectors.selectEditedFormField(state, fieldName)).to.be.equal(
        fieldValue,
      );
    });
  });

  describe('selectCurrentlyOpenEditModal', () => {
    beforeEach(hooks.beforeEach);
    it('looks up the form value in state for a given field name', () => {
      const currentlyOpenModal = 'someField';
      state.vapService.modal = currentlyOpenModal;

      expect(selectors.selectCurrentlyOpenEditModal(state)).to.be.equal(
        currentlyOpenModal,
      );
    });
  });

  describe('selectAddressValidation', () => {
    beforeEach(hooks.beforeEach);
    it('should return the address validation data', () => {
      const addressValidation = {
        addressValidationType: 'foo',
        validationKey: '123',
        addressValidationError: null,
      };
      state.vapService.addressValidation = addressValidation;

      expect(selectors.selectAddressValidation(state)).to.deep.equal(
        addressValidation,
      );
    });
  });

  describe('selectAddressValidationType', () => {
    beforeEach(hooks.beforeEach);
    it('should return the current address validation type', () => {
      const addressValidationType = 'home';
      state.vapService.addressValidation = {
        addressValidationType,
      };

      expect(selectors.selectAddressValidationType(state)).to.be.equal(
        addressValidationType,
      );
    });
  });
});

describe('selectVAPServiceInitializationStatus', () => {
  const old = { document: global.document };

  beforeEach(() => {
    hooks.beforeEach();
    global.document = {
      location: {
        hostname: 'staging.va.gov',
      },
    };
  });

  afterEach(() => {
    global.document = old.document;
  });

  it('returns UNINITIALIZED if Vet360 is not found in the services array and there is not an associated transaction', () => {
    state.user.profile.services = [];
    const result = selectors.selectVAPServiceInitializationStatus(state);
    expect(result.status).to.be.equal(
      VAP_SERVICE_INITIALIZATION_STATUS.UNINITIALIZED,
    );
  });

  it('returns INITIALIZED if Vet360 is found in the services array', () => {
    const result = selectors.selectVAPServiceInitializationStatus(state);
    expect(result.status).to.be.equal(
      VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZED,
    );
  });

  it('returns INITIALIZING if there is an ongoing transaction', () => {
    const transactionId = 'transaction_1';
    state.user.profile.services = [];
    state.vapService.transactions = [
      {
        data: {
          attributes: {
            transactionId,
            transactionStatus: TRANSACTION_STATUS.RECEIVED,
          },
        },
      },
    ];
    state.vapService.fieldTransactionMap[INIT_VAP_SERVICE_ID] = {
      transactionId,
    };
    const result = selectors.selectVAPServiceInitializationStatus(state);
    expect(result.status).to.be.equal(
      VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZING,
    );
  });

  it('returns INITIALIZATION_FAILURE if there is a failed transaction', () => {
    const transactionId = 'transaction_1';
    state.user.profile.services = [];
    state.vapService.transactions = [
      {
        data: {
          attributes: {
            transactionId,
            transactionStatus: TRANSACTION_STATUS.REJECTED,
          },
        },
      },
    ];
    state.vapService.fieldTransactionMap[INIT_VAP_SERVICE_ID] = {
      transactionId,
    };
    const result = selectors.selectVAPServiceInitializationStatus(state);
    expect(result.status).to.be.equal(
      VAP_SERVICE_INITIALIZATION_STATUS.INITIALIZATION_FAILURE,
    );
  });

  describe('selectVAProfilePersonalInformation selector', () => {
    let personalInfoState;
    beforeEach(() => {
      personalInfoState = {
        vaProfile: {
          personalInformation: {
            gender: 'M',
            birthDate: '1986-05-06',
            preferredName: 'WES',
            pronouns: ['heHimHis', 'theyThemTheirs'],
            pronounsNotListedText: 'Other/pronouns/here',
            genderIdentity: { code: 'M', name: 'Male' },
            sexualOrientation: ['straightOrHeterosexual'],
            sexualOrientationNotListedText: 'Some other orientation',
          },
        },
      };
    });
    it('returns preferredName', () => {
      expect(
        selectors.selectVAProfilePersonalInformation(
          personalInfoState,
          'preferredName',
        ),
      ).to.deep.equal({
        preferredName: 'WES',
      });
    });

    it('returns genderIdentity', () => {
      expect(
        selectors.selectVAProfilePersonalInformation(
          personalInfoState,
          'genderIdentity',
        ),
      ).to.deep.equal({
        genderIdentity: { code: 'M', name: 'Male' },
      });
    });

    it('returns pronouns and pronounsNotListedText', () => {
      expect(
        selectors.selectVAProfilePersonalInformation(
          personalInfoState,
          'pronouns',
        ),
      ).to.deep.equal({
        pronouns: ['heHimHis', 'theyThemTheirs'],
        pronounsNotListedText: 'Other/pronouns/here',
      });
    });

    it('returns sexualOrientation and sexualOrientationNotListedText', () => {
      expect(
        selectors.selectVAProfilePersonalInformation(
          personalInfoState,
          'sexualOrientation',
        ),
      ).to.deep.equal({
        sexualOrientation: ['straightOrHeterosexual'],
        sexualOrientationNotListedText: 'Some other orientation',
      });
    });
  });
});
