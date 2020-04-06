import {
  addCountryCodeIso3ToAddress,
  isFailedTransaction,
  isPendingTransaction,
  isSuccessfulTransaction,
} from 'vet360/util/transactions';

describe('isPendingTransaction', () => {
  it('returns `false` if passed nothing', () => {
    expect(isPendingTransaction()).toBe(false);
  });
  it('returns `true` if passed a transaction with a pending status', () => {
    const transaction = {
      data: {
        attributes: {
          transactionStatus: 'RECEIVED',
        },
      },
    };
    expect(isPendingTransaction(transaction)).toBe(true);
    transaction.data.attributes.transactionStatus =
      'RECEIVED_DEAD_LETTER_QUEUE';
    expect(isPendingTransaction(transaction)).toBe(true);
    transaction.data.attributes.transactionStatus = 'RECEIVED_ERROR_QUEUE';
    expect(isPendingTransaction(transaction)).toBe(true);
  });
});

describe('isFailedTransaction', () => {
  it('returns `false` if passed nothing', () => {
    expect(isFailedTransaction()).toBe(false);
  });
  it('returns `true` if passed a transaction with a failed status', () => {
    const transaction = {
      data: {
        attributes: {
          transactionStatus: 'COMPLETED_FAILURE',
        },
      },
    };
    expect(isFailedTransaction(transaction)).toBe(true);
    transaction.data.attributes.transactionStatus = 'REJECTED';
    expect(isFailedTransaction(transaction)).toBe(true);
  });
});

describe('isSuccessfulTransaction', () => {
  it('returns `false` if passed nothing', () => {
    expect(isSuccessfulTransaction()).toBe(false);
  });
  it('returns `true` if passed a transaction with a successful status', () => {
    const transaction = {
      data: {
        attributes: {
          transactionStatus: 'COMPLETED_SUCCESS',
        },
      },
    };
    expect(isSuccessfulTransaction(transaction)).toBe(true);
    transaction.data.attributes.transactionStatus =
      'COMPLETED_NO_CHANGES_DETECTED';
    expect(isSuccessfulTransaction(transaction)).toBe(true);
  });
});

describe('addCountryCodeIso3ToAddress', () => {
  describe('when passed an object with a countryName', () => {
    describe('and the countryName is valid', () => {
      it('adds the countryCodeIso3 prop', () => {
        const address = {
          countryName: 'United States',
        };
        const output = addCountryCodeIso3ToAddress(address);
        expect(output).toEqual({
          countryName: 'United States',
          countryCodeIso3: 'USA',
        });
      });
    });
    describe('and the countryName is not valid', () => {
      it('simply returns the data it was passed', () => {
        const address = {
          countryName: 'Not A Real Country',
        };
        const output = addCountryCodeIso3ToAddress(address);
        expect(output).toEqual(address);
      });
    });
  });
  describe('when passed an object without a countryName', () => {
    it('returns the data it was passed', () => {
      const address = {
        state: 'CA',
        street1: '123 Main St',
      };
      const output = addCountryCodeIso3ToAddress(address);
      expect(output).toEqual(address);
    });
  });
});
