import { expect } from 'chai';
import { normalizePaymentData } from '../../../components/view-payments-lists/helpers';

describe('View Payments helpers', () => {
  describe('normalizePaymentData', () => {
    it('should handle payment data with all expected fields', () => {
      const payments = [
        {
          payCheckDt: '2023-01-01',
          payCheckAmount: '$1,000.00',
          payCheckType: 'Compensation',
          paymentMethod: 'Direct Deposit',
          bankName: 'Test Bank',
          accountNumber: '****1234',
        },
      ];

      const result = normalizePaymentData(payments);
      expect(result[0]).to.have.all.keys(
        'payCheckDt',
        'payCheckAmount',
        'payCheckType',
        'paymentMethod',
        'bankName',
        'accountNumber',
      );
    });

    it('should handle payment data with missing fields', () => {
      const payments = [
        {
          payCheckAmount: '$1,000.00',
          payCheckType: 'Compensation',
          // Missing payCheckDt, paymentMethod, bankName, accountNumber
        },
      ];

      const result = normalizePaymentData(payments);
      expect(result[0].payCheckDt).to.be.null;
      expect(result[0].payCheckAmount).to.equal('$1,000.00');
      expect(result[0].payCheckType).to.equal('Compensation');
      expect(result[0].paymentMethod).to.be.null;
      expect(result[0].bankName).to.be.null;
      expect(result[0].accountNumber).to.be.null;
    });

    it('should handle payment data as arrays', () => {
      const payments = [
        [
          '2023-01-01',
          '$1,000.00',
          'Compensation',
          'Direct Deposit',
          'Test Bank',
          '****1234',
        ],
      ];

      const result = normalizePaymentData(payments);
      expect(result[0].payCheckDt).to.equal('2023-01-01');
      expect(result[0].payCheckAmount).to.equal('$1,000.00');
      expect(result[0].payCheckType).to.equal('Compensation');
      expect(result[0].paymentMethod).to.equal('Direct Deposit');
      expect(result[0].bankName).to.equal('Test Bank');
      expect(result[0].accountNumber).to.equal('****1234');
    });

    it('should handle malformed payment data', () => {
      const payments = [null, undefined, {}, { unexpectedField: 'value' }];

      const result = normalizePaymentData(payments);

      // All should have the expected fields set to null
      result.forEach(payment => {
        expect(payment).to.have.property('payCheckDt', null);
        expect(payment).to.have.property('payCheckAmount', null);
        expect(payment).to.have.property('payCheckType', null);
        expect(payment).to.have.property('paymentMethod', null);
        expect(payment).to.have.property('bankName', null);
        expect(payment).to.have.property('accountNumber', null);
      });
    });

    it('should handle data that simulates the column misalignment issue', () => {
      // Simulating the issue where data appears shifted
      const payments = [
        {
          // First payment - missing payCheckDt and payCheckAmount
          payCheckType: '$3,021.00',
          paymentMethod: 'Compensation & Pension - Recurring',
          bankName: 'Direct Deposit',
          accountNumber: 'WELLS FARGO BANK',
        },
        {
          // Second payment - data in wrong fields
          payCheckDt: '********3121',
          payCheckType: '$1,259.00',
          paymentMethod: 'Compensation & Pension - Recurring',
          bankName: 'Direct Deposit',
        },
        {
          // Third payment - only has bank name in wrong field
          payCheckDt: 'WELLS FARGO BANK',
        },
      ];

      const result = normalizePaymentData(payments);

      // After normalization, all records should have all fields
      result.forEach(payment => {
        expect(payment).to.have.property('payCheckDt');
        expect(payment).to.have.property('payCheckAmount');
        expect(payment).to.have.property('payCheckType');
        expect(payment).to.have.property('paymentMethod');
        expect(payment).to.have.property('bankName');
        expect(payment).to.have.property('accountNumber');
      });
    });

    it('should detect and fix the column misalignment issue', () => {
      // This test demonstrates the fix for misaligned data
      const payments = [
        {
          // First payment - missing payCheckDt and payCheckAmount
          payCheckType: '$3,021.00',
          paymentMethod: 'Compensation & Pension - Recurring',
          bankName: 'Direct Deposit',
          accountNumber: 'WELLS FARGO BANK',
        },
        {
          // Second payment - data in wrong fields
          payCheckDt: '********3121',
          payCheckType: '$1,259.00',
          paymentMethod: 'Compensation & Pension - Recurring',
          bankName: 'Direct Deposit',
        },
        {
          // Third payment - only has bank name in wrong field
          payCheckDt: 'WELLS FARGO BANK',
        },
      ];

      // Without normalization, data would be missing expected fields
      expect(payments[0]).to.not.have.property('payCheckDt');
      expect(payments[0]).to.not.have.property('payCheckAmount');
      expect(payments[1].payCheckDt).to.equal('********3121'); // Wrong data in date field
      expect(payments[2].payCheckDt).to.equal('WELLS FARGO BANK'); // Wrong data in date field

      // Apply normalization
      const normalized = normalizePaymentData(payments);

      // After normalization, all payments should have all fields
      // First payment should have amount moved from type field
      expect(normalized[0].payCheckDt).to.be.null;
      expect(normalized[0].payCheckAmount).to.equal('$3,021.00');
      expect(normalized[0].payCheckType).to.equal(
        'Compensation & Pension - Recurring',
      );
      expect(normalized[0].paymentMethod).to.equal('Direct Deposit');
      expect(normalized[0].bankName).to.equal('WELLS FARGO BANK');
      expect(normalized[0].accountNumber).to.be.null;

      // Second payment should have account number moved from date field
      expect(normalized[1].payCheckDt).to.be.null;
      expect(normalized[1].payCheckAmount).to.equal('$1,259.00');
      expect(normalized[1].accountNumber).to.equal('********3121');

      // Third payment should have all fields with proper nulls
      expect(normalized[2].payCheckDt).to.be.null;
      expect(normalized[2].accountNumber).to.be.null;
    });

    it('should handle real-world correct data format', () => {
      const payments = [
        {
          payCheckDt: '2019-04-01T00:00:00.000-05:00',
          payCheckAmount: '$3,261.10',
          payCheckType: 'Compensation & Pension - Recurring',
          paymentMethod: 'Direct Deposit',
          bankName: 'CAPITAL ONE, N.A.',
          accountNumber: '*************3355',
        },
        {
          payCheckDt: '2018-11-09T00:00:00.000-06:00',
          payCheckAmount: '$3,532.76',
          payCheckType: 'Compensation & Pension - Retroactive',
          paymentMethod: 'Direct Deposit',
          bankName: 'NEIGHBORS CREDIT UNION',
          accountNumber: '******6666',
        },
      ];

      const result = normalizePaymentData(payments);

      expect(result[0].payCheckDt).to.equal('2019-04-01T00:00:00.000-05:00');
      expect(result[0].payCheckAmount).to.equal('$3,261.10');
      expect(result[0].bankName).to.equal('CAPITAL ONE, N.A.');
      expect(result[1].bankName).to.equal('NEIGHBORS CREDIT UNION');
    });

    it('should handle payments with bank names in date field', () => {
      const input = [
        {
          payCheckDt: 'WELLS FARGO BANK',
        },
      ];

      const result = normalizePaymentData(input);

      expect(result[0]).to.deep.equal({
        payCheckDt: null,
        payCheckAmount: null,
        payCheckType: null,
        paymentMethod: null,
        bankName: null,
        accountNumber: null,
      });
    });

    it('should detect various bank name patterns in misaligned fields', () => {
      const testCases = [
        { payCheckDt: 'NAVY FEDERAL CREDIT UNION' },
        { payCheckDt: 'USAA FEDERAL SAVINGS BANK' },
        { payCheckDt: 'CAPITAL ONE, N.A.' },
        { payCheckDt: 'TRUIST BANK' },
        { payCheckDt: 'FIRST NATIONAL BANK' },
        { payCheckDt: 'CITIZENS SAVINGS AND LOAN' },
        { payCheckDt: 'TD BANK NATIONAL ASSOCIATION' },
      ];

      testCases.forEach(testCase => {
        const result = normalizePaymentData([testCase]);
        expect(result[0].payCheckDt).to.be.null;
        expect(result[0]).to.include.all.keys([
          'payCheckDt',
          'payCheckAmount',
          'payCheckType',
          'paymentMethod',
          'bankName',
          'accountNumber',
        ]);
      });
    });
  });
});
