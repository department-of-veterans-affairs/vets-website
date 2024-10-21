import { expect } from 'chai';
import { parse, isValid } from 'date-fns';
import fiscalTransactionData from './e2e/fixtures/mocks/fiscalTransactionData.json';

describe('Fiscal Transaction Data Tests', () => {
  const fiscalTransactions =
    fiscalTransactionData.debts[0].fiscalTransactionData;

  it('should have correct transactionFiscalCode for all transactions', () => {
    fiscalTransactions.forEach(transaction => {
      expect(['04P', '08P']).to.include(transaction.transactionFiscalCode);
    });
  });

  it('should have correct transactionDescription based on transactionFiscalCode', () => {
    fiscalTransactions.forEach(transaction => {
      if (transaction.transactionFiscalCode === '04P') {
        expect(transaction.transactionDescription).to.equal('Increase to AR');
      } else if (transaction.transactionFiscalCode === '08P') {
        expect(transaction.transactionDescription).to.equal('AR Decrease');
      }
    });
  });

  it('should have correct transactionTotalAmount for each transaction', () => {
    fiscalTransactions.forEach(transaction => {
      if (transaction.transactionFiscalCode === '04P') {
        expect(transaction.transactionTotalAmount).to.be.above(0);
      } else if (transaction.transactionFiscalCode === '08P') {
        expect(transaction.transactionTotalAmount).to.be.below(0);
      }
    });
  });

  it('should have valid transaction dates', () => {
    fiscalTransactions.forEach(transaction => {
      const date = parse(transaction.transactionDate, 'MM/dd/yyyy', new Date());
      expect(isValid(date)).to.be.true;
    });
  });

  it('should have matching debtIncreaseAmount and transactionTotalAmount for 04P transactions', () => {
    fiscalTransactions.forEach(transaction => {
      if (transaction.transactionFiscalCode === '04P') {
        expect(transaction.debtIncreaseAmount).to.equal(
          transaction.transactionTotalAmount,
        );
      }
    });
  });

  it('should have matching offsetAmount and absolute transactionTotalAmount for 08P transactions', () => {
    fiscalTransactions.forEach(transaction => {
      if (transaction.transactionFiscalCode === '08P') {
        expect(transaction.offsetAmount).to.equal(
          Math.abs(transaction.transactionTotalAmount),
        );
      }
    });
  });
});
