import { expect } from 'chai';
import transformForSubmit from '../../config/submit-transformer';
import testDataSpouse from '../e2e/fixtures/data/test-data-spouse.json';
import testDataMinimal from '../e2e/fixtures/data/minimal-test.json';

describe('21P-601 submit transformer', () => {
  const mockFormConfig = {
    formId: '21P-601',
  };

  describe('complete form data transformation', () => {
    it('should transform complete form data correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result).to.have.property('formNumber', '21P-601');
      expect(result).to.have.property('veteran');
      expect(result).to.have.property('beneficiary');
      expect(result).to.have.property('claimant');
      expect(result).to.have.property('survivingRelatives');
      expect(result).to.have.property('expenses');
      expect(result).to.have.property('remarks');
    });

    it('should transform veteran information correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.veteran.fullName).to.deep.equal({
        first: 'John',
        middle: 'A',
        last: 'Smith',
      });
      expect(result.veteran.ssn).to.deep.equal({
        first3: '123',
        middle2: '12',
        last4: '3123',
      });
      expect(result.veteran.vaFileNumber).to.equal('12345678');
    });

    it('should transform beneficiary information when not veteran', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.fullName).to.deep.equal({
        first: 'Mary',
        middle: 'J',
        last: 'Smith',
      });
      expect(result.beneficiary.dateOfDeath).to.deep.equal({
        month: '01',
        day: '15',
        year: '2024',
      });
      expect(result.beneficiary.isVeteran).to.be.false;
    });

    it('should use veteran name for beneficiary when beneficiary is veteran', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataSpouse)) };
      testData.data.beneficiaryIsVeteran = true;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.fullName).to.deep.equal({
        first: 'John',
        middle: 'A',
        last: 'Smith',
      });
      expect(result.beneficiary.isVeteran).to.be.true;
    });

    it('should transform claimant information correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.fullName).to.deep.equal({
        first: 'Robert',
        middle: 'L',
        last: 'Johnson',
      });
      expect(result.claimant.ssn).to.deep.equal({
        first3: '987',
        middle2: '65',
        last4: '4321',
      });
      expect(result.claimant.email).to.equal('robert.johnson@email.com');
      expect(result.claimant.relationshipToDeceased).to.equal('executor');
    });

    it('should transform claimant address correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address.street).to.equal('123 Main Street');
      expect(result.claimant.address.street2).to.equal('Apt 4B');
      expect(result.claimant.address.city).to.equal('Arlington');
      expect(result.claimant.address.state).to.equal('VA');
      expect(result.claimant.address.zipCode).to.deep.equal({
        first5: '22201',
        last4: '',
      });
    });

    it('should transform phone number correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.phone).to.deep.equal({
        areaCode: '703',
        prefix: '555',
        lineNumber: '1234',
      });
    });

    it('should set signature date to current date', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.signatureDate).to.have.property('month');
      expect(result.claimant.signatureDate).to.have.property('day');
      expect(result.claimant.signatureDate).to.have.property('year');
      expect(result.claimant.signatureDate.month).to.match(/^\d{2}$/);
      expect(result.claimant.signatureDate.day).to.match(/^\d{2}$/);
      expect(result.claimant.signatureDate.year).to.match(/^\d{4}$/);
    });

    it('should use SSN for inReplyReferTo', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.inReplyReferTo).to.equal('123123123');
    });

    it('should transform surviving relatives correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.survivingRelatives.hasSpouse).to.be.false;
      expect(result.survivingRelatives.hasChildren).to.be.true;
      expect(result.survivingRelatives.hasParents).to.be.false;
      expect(result.survivingRelatives.hasNone).to.be.false;

      expect(result.survivingRelatives.relatives).to.have.lengthOf(2);
      expect(result.survivingRelatives.relatives[0].fullName).to.deep.equal({
        first: 'Michael',
        middle: 'J',
        last: 'Smith',
      });
      expect(result.survivingRelatives.relatives[0].relationship).to.equal(
        'child',
      );
    });

    it('should include remarks', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.remarks).to.include(
        'Filing for accrued benefits as the executor',
      );
    });
  });

  describe('edge cases and missing data', () => {
    it('should handle missing middle names', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.veteran.fullName.middle).to.equal('');
    });

    it('should use VA file number for inReplyReferTo when no SSN', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataSpouse)) };
      delete testData.data.veteranIdentification.ssn;
      testData.data.veteranIdentification.vaFileNumber = '987654321';

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.inReplyReferTo).to.equal('987654321');
      expect(result.veteran.ssn).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });
    });

    it('should handle missing address street2', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address.street2).to.equal('Apt 1');
    });

    it('should handle empty expenses array', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.expenses.expensesList).to.deep.equal([]);
      expect(result.expenses.otherDebts).to.deep.equal([]);
    });

    it('should handle empty surviving relatives when hasNone is true', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.survivingRelatives.hasNone).to.be.true;
      expect(result.survivingRelatives.relatives).to.deep.equal([]);
    });

    it('should handle missing remarks', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.remarks).to.equal('');
    });

    it('should handle missing claimant identification', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.claimantIdentification;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.ssn).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });
      expect(result.claimant.vaFileNumber).to.equal('');
    });

    it('should handle missing date of birth', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.claimantDateOfBirth;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.dateOfBirth).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
    });
  });

  describe('date formatting', () => {
    it('should handle ISO date format correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.dateOfDeath).to.deep.equal({
        month: '01',
        day: '15',
        year: '2024',
      });
    });

    it('should split dates consistently', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.dateOfDeath).to.deep.equal({
        month: '03',
        day: '01',
        year: '2024',
      });
    });

    it('should handle date with different format', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.claimantDateOfBirth = '1990-12-25';

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.dateOfBirth.month).to.equal('12');
      expect(result.claimant.dateOfBirth.day).to.equal('25');
      expect(result.claimant.dateOfBirth.year).to.equal('1990');
    });
  });

  describe('helper functions', () => {
    it('should split phone numbers correctly', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.phone).to.deep.equal({
        areaCode: '757',
        prefix: '555',
        lineNumber: '1234',
      });
    });

    it('should split zip codes correctly', () => {
      const testData = { data: testDataMinimal };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address.zipCode).to.deep.equal({
        first5: '23510',
        last4: '',
      });
    });

    it('should handle undefined address when formatting', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.claimantAddress;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address).to.deep.equal({
        street: '',
        street2: '',
        city: '',
        state: '',
        country: '',
        zipCode: { first5: '', last4: '' },
      });
    });

    it('should handle missing survivor relatives array', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.survivingRelatives;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.survivingRelatives.relatives).to.deep.equal([]);
    });

    it('should handle missing other debts array', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.otherDebts;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.expenses.otherDebts).to.deep.equal([]);
    });

    it('should handle various date string formats', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.claimantDateOfBirth = '1990-12-25';

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.dateOfBirth.month).to.equal('12');
      expect(result.claimant.dateOfBirth.day).to.equal('25');
      expect(result.claimant.dateOfBirth.year).to.equal('1990');
    });

    it('should format names with all components present', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.fullName.first).to.equal('Robert');
      expect(result.claimant.fullName.middle).to.equal('L');
      expect(result.claimant.fullName.last).to.equal('Johnson');
    });

    it('should format relative addresses correctly', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.survivingRelatives.relatives[0].address.street).to.equal(
        '456 Oak Avenue',
      );
      expect(result.survivingRelatives.relatives[0].address.city).to.equal(
        'Falls Church',
      );
      expect(
        result.survivingRelatives.relatives[0].address.zipCode,
      ).to.deep.equal({
        first5: '22046',
        last4: '',
      });
    });

    it('should handle wantsToWaiveSubstitution flag', () => {
      const testData = { data: testDataSpouse };
      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.survivingRelatives.wantsToWaiveSubstitution).to.be.false;
    });

    it('should set isPaid to true for all expenses', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataSpouse)) };
      testData.data.expenses = [
        {
          provider: 'Test Hospital',
          expenseType: 'Medical',
          amount: '1000',
          paidBy: 'Self',
        },
      ];

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.expenses.expensesList[0].isPaid).to.be.true;
    });

    it('should handle null name object', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.claimantFullName = null;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.fullName).to.deep.equal({
        first: '',
        middle: '',
        last: '',
      });
    });

    it('should handle undefined name object', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.veteranFullName;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.veteran.fullName).to.deep.equal({
        first: '',
        middle: '',
        last: '',
      });
    });

    it('should handle null zip code', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.claimantAddress.postalCode = null;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address.zipCode).to.deep.equal({
        first5: '',
        last4: '',
      });
    });

    it('should handle undefined zip code', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.claimantAddress.postalCode;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.claimant.address.zipCode).to.deep.equal({
        first5: '',
        last4: '',
      });
    });

    it('should return vaFileNumber when SSN is missing', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataSpouse)) };
      delete testData.data.veteranIdentification.ssn;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.inReplyReferTo).to.equal('12345678');
    });

    it('should return empty string when both SSN and vaFileNumber are missing', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      delete testData.data.veteranIdentification.ssn;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.inReplyReferTo).to.equal('');
    });

    it('should handle invalid date string', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.beneficiaryDateOfDeath = 'invalid-date';

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.dateOfDeath.month).to.exist;
    });

    it('should handle null date string', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.beneficiaryDateOfDeath = null;

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.beneficiary.dateOfDeath).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
    });

    it('should handle otherDebts with missing fields', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.otherDebts = [
        { debtType: 'Credit Card' },
        { debtAmount: '500' },
      ];

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.expenses.otherDebts[0].debtType).to.equal('Credit Card');
      expect(result.expenses.otherDebts[0].debtAmount).to.equal('');
      expect(result.expenses.otherDebts[1].debtType).to.equal('');
      expect(result.expenses.otherDebts[1].debtAmount).to.equal('500');
    });

    it('should handle expenses with missing fields', () => {
      const testData = { data: JSON.parse(JSON.stringify(testDataMinimal)) };
      testData.data.expenses = [{ provider: 'Hospital' }, { amount: '100' }];

      const result = JSON.parse(transformForSubmit(mockFormConfig, testData));

      expect(result.expenses.expensesList[0].provider).to.equal('Hospital');
      expect(result.expenses.expensesList[0].amount).to.equal('');
      expect(result.expenses.expensesList[1].provider).to.equal('');
      expect(result.expenses.expensesList[1].amount).to.equal('100');
    });
  });
});
