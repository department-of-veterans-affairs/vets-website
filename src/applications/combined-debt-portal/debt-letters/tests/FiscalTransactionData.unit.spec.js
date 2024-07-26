const { expect } = require('chai');
const dateFns = require('date-fns');

const data = {
  fileNumber: '796123018',
  payeeNumber: '00',
  personEntitled: 'TJONES',
  deductionCode: '71',
  benefitType: 'CH33 Books, Supplies/MISC EDU',
  diaryCode: '100',
  diaryCodeDescription: 'First Demand Letter - Inactive Benefits - Due Process',
  amountOverpaid: 0,
  amountWithheld: 0,
  originalAr: 166.67,
  currentAr: 120.4,
  debtHistory: [
    {
      date: '10/18/2020',
      letterCode: '100',
      description: 'First Demand Letter - Inactive Benefits - Due Process',
    },
  ],
  fiscalTransactionData: [
    {
      debtId: 317876,
      debtIncreaseAmount: 28.53,
      hinesCode: null,
      offsetAmount: 28.53,
      offsetType: null,
      paymentType: null,
      transactionAdminAmount: 28.53,
      transactionCourtAmount: 0,
      transactionDate: '09/06/2024',
      transactionDescription: 'Increase to AR',
      transactionExplanation: 'Increase to AR',
      transactionFiscalCode: '04P',
      transactionFiscalSource: 'MR_FISC_TRX_HIST',
      transactionFiscalYear: null,
      transactionInterestAmount: 0,
      transactionMarshallAmount: 0,
      transactionPrincipalAmount: 0,
      transactionTotalAmount: 28.53,
    },
    {
      debtId: 317876,
      debtIncreaseAmount: 0,
      hinesCode: '97 ',
      offsetAmount: 47.29,
      offsetType: null,
      paymentType: null,
      transactionAdminAmount: 0,
      transactionCourtAmount: 0,
      transactionDate: '09/07/2024',
      transactionDescription: 'AR Decrease',
      transactionExplanation: 'AR Decrease - C&P Benefit Offset',
      transactionFiscalCode: '04P',
      transactionFiscalSource: 'MR_FISC_TRX_HIST',
      transactionFiscalYear: null,
      transactionInterestAmount: 0,
      transactionMarshallAmount: 0,
      transactionPrincipalAmount: 0,
      transactionTotalAmount: -47.29,
    },
    {
      debtId: 317876,
      debtIncreaseAmount: 0,
      hinesCode: '97 ',
      offsetAmount: 19.3,
      offsetType: null,
      paymentType: null,
      transactionAdminAmount: 0,
      transactionCourtAmount: 0,
      transactionDate: '09/08/2024',
      transactionDescription: 'AR Decrease',
      transactionExplanation: 'AR Decrease - C&P Benefit Offset',
      transactionFiscalCode: '04P',
      transactionFiscalSource: 'MR_FISC_TRX_HIST',
      transactionFiscalYear: null,
      transactionInterestAmount: 0,
      transactionMarshallAmount: 0,
      transactionPrincipalAmount: 0,
      transactionTotalAmount: -19.3,
    },
  ],
  debtId: '79612301871',
};

describe('Fiscal Transaction Data Tests', () => {
  const fiscalTransactions = data.fiscalTransactionData;

  it('should have correct transactionFiscalCode for all transactions', () => {
    fiscalTransactions.forEach(transaction => {
      expect(transaction.transactionFiscalCode).to.equal('04P');
    });
  });

  it('should have correct transactionTotalAmount for each transaction', () => {
    const expectedAmounts = [28.53, -47.29, -19.3];
    fiscalTransactions.forEach((transaction, index) => {
      expect(transaction.transactionTotalAmount).to.be.closeTo(
        expectedAmounts[index],
        0.01,
      );
    });
  });

  it('should have correct transactionDates', () => {
    const expectedDates = ['09/06/2024', '09/07/2024', '09/08/2024'];
    fiscalTransactions.forEach((transaction, index) => {
      expect(transaction.transactionDate).to.equal(expectedDates[index]);
    });
  });

  it('should have correct transactionDescription for AR Decrease transactions', () => {
    const arDecreaseTransactions = fiscalTransactions.filter(
      transaction => transaction.transactionTotalAmount < 0,
    );
    arDecreaseTransactions.forEach(transaction => {
      expect(transaction.transactionDescription).to.equal('AR Decrease');
    });
  });

  it('should have valid date format for all transactions', () => {
    fiscalTransactions.forEach(transaction => {
      const date = dateFns.parse(
        transaction.transactionDate,
        'MM/dd/yyyy',
        new Date(),
      );
      expect(dateFns.isValid(date)).to.be.true;
    });
  });
});
