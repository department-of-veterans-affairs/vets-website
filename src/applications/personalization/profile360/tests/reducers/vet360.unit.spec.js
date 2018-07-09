import { expect } from 'chai';

import vet360 from '../../reducers/vet360';
import * as VET360 from '../../constants/vet360';

describe('vet360 reducer', () => {
  it('should return array of transaction data', () => {
    const state = vet360({}, {
      type: 'VET360_TRANSACTIONS_FETCH_SUCCESS',
      data: [1, 2, 3]
    });

    expect(state.transactions.length).to.eql(3);
    expect(state.transactions).to.eql([
      { data: 1 },
      { data: 2 },
      { data: 3 }
    ]);
  });

  it('should set pending transaction', () => {
    const state = vet360({}, {
      type: 'VET360_TRANSACTION_REQUESTED',
      fieldName: 'fieldName',
      method: 'POST'
    });

    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        isPending: true,
        method: 'POST'
      }
    });
  });

  it('should set pending transaction failure', () => {
    const state = vet360({
      fieldTransactionMap: {
        fieldName: {
          retainedField: 'value'
        }
      }
    }, {
      type: 'VET360_TRANSACTION_REQUEST_FAILED',
      fieldName: 'fieldName',
      error: 'errorMessage'
    });

    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        retainedField: 'value',
        isPending: false,
        isFailed: true,
        error: 'errorMessage'
      }
    });
  });

  it('should set pending transaction success', () => {
    const state = vet360({
      fieldTransactionMap: {
        fieldName: {
          retainedField: 'value'
        }
      },
      transactions: []
    }, {
      type: 'VET360_TRANSACTION_REQUEST_SUCCEEDED',
      fieldName: 'fieldName',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
          }
        }
      }
    });

    expect(state.transactions.length).to.eql(1);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
    expect(state.fieldTransactionMap).to.eql({
      fieldName: {
        retainedField: 'value',
        isPending: false,
        transactionId: 111,
      }
    });
  });

  it('should set transaction update request', () => {
    const state = vet360({ transactionsAwaitingUpdate: [] }, {
      type: 'VET360_TRANSACTION_UPDATE_REQUESTED',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
          }
        }
      }
    });

    expect(state.transactionsAwaitingUpdate.length).to.eql(1);
    expect(state.transactionsAwaitingUpdate[0]).to.eql(111);
  });

  it('should set updated transaction request success', () => {
    const state = vet360({
      transactions: [{
        data: {
          attributes: {
            transactionId: 111,
            transactionStatus: 'COMPLETED_SUCCESS'
          }
        }
      }],
      transactionsAwaitingUpdate: [111],
      metadata: {}
    }, {
      type: 'VET360_TRANSACTION_UPDATED',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
            transactionStatus: VET360.TRANSACTION_STATUS.COMPLETED_SUCCESS
          }
        }
      }
    });

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
    expect(state.metadata.mostRecentSuccessfulTransactionId).to.eql(111);
  });

  it('should set updated transaction request failure', () => {
    const state = vet360({
      transactions: [{
        data: {
          attributes: {
            transactionId: 111,
            transactionStatus: 'COMPLETED_SUCCESS'
          }
        }
      }],
      transactionsAwaitingUpdate: [111],
      metadata: {}
    }, {
      type: 'VET360_TRANSACTION_UPDATED',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
            transactionStatus: VET360.TRANSACTION_STATUS.COMPLETED_FAILURE
          }
        }
      }
    });

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
    expect(state.transactions[0].data.attributes.transactionId).to.eql(111);
    expect(state.metadata.mostRecentErroredTransactionId).to.eql(111);
  });

  it('should set transaction update failed', () => {
    const state = vet360({ transactionsAwaitingUpdate: [111] }, {
      type: 'VET360_TRANSACTION_UPDATE_FAILED',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
          }
        }
      }
    });

    expect(state.transactionsAwaitingUpdate.length).to.eql(0);
  });

  it('should set transaction cleared', () => {
    const state = vet360({
      transactions: [{
        data: {
          attributes: {
            transactionId: 111,
          }
        }
      }],
      metadata: {
        mostRecentSuccessfulTransactionId: 111,
      }
    }, {
      type: 'VET360_TRANSACTION_CLEARED',
      transaction: {
        data: {
          attributes: {
            transactionId: 111,
          }
        }
      }
    });

    expect(state.metadata.mostRecentSuccessfulTransactionId).to.eql(null);
    expect(state.transactions.length).to.eql(0);
  });

  it('should set transaction request cleared', () => {
    const state = vet360({
      fieldTransactionMap: {
        fieldName: 'name'
      }
    }, {
      type: 'VET360_TRANSACTION_REQUEST_CLEARED',
      fieldName: 'name'
    });

    expect(state.fieldTransactionMap.name).to.eql(undefined);
  });
});
