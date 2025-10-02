import { expect } from 'chai';
import transformForSubmit from '../../config/submit-transformer';

// Import test fixtures
import testDataComplete from '../fixtures/test-data-complete.json';
import testDataNotRemarried from '../fixtures/test-data-not-remarried.json';
import testDataOver57 from '../fixtures/test-data-over-57.json';
import testDataTerminated from '../fixtures/test-data-terminated.json';
import testDataVeteranVAFile from '../fixtures/test-data.json';
import testDataVAFileOnly from '../fixtures/test-data-va-file-only.json';

describe('21P-0537 submit transformer', () => {
  const mockFormConfig = {
    formId: '21P-0537',
  };

  describe('complete remarried scenario', () => {
    it('should transform complete remarried data correctly', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataComplete),
      );

      // Test basic structure
      expect(result).to.have.property('formNumber', '21P-0537');
      expect(result).to.have.property('veteran');
      expect(result).to.have.property('recipient');
      expect(result).to.have.property('remarriage');
      expect(result).to.have.property('inReplyReferTo');
      expect(result).to.have.property('hasRemarried', true);

      // Test veteran information
      expect(result.veteran.fullName).to.deep.equal({
        first: 'Robert',
        middle: 'James',
        last: 'Martinez',
      });
      expect(result.veteran.ssn).to.deep.equal({
        first3: '434',
        middle2: '35',
        last4: '3347',
      });
      expect(result.veteran.vaFileNumber).to.equal('987654321');

      // Test recipient information
      expect(result.recipient.phone.daytime).to.deep.equal({
        areaCode: '555',
        prefix: '123',
        lineNumber: '4567',
      });
      expect(result.recipient.email).to.equal('jane.spouse@example.com');
      expect(result.recipient.statementOfTruthSignature).to.equal(
        'Jane M Spouse',
      );

      // Should prioritize SSN for inReplyReferTo
      expect(result.inReplyReferTo).to.equal('434353347');

      // Test remarriage information
      expect(result.remarriage.dateOfMarriage).to.deep.equal({
        month: '06',
        day: '15',
        year: '2023',
      });
      expect(result.remarriage.spouseName).to.deep.equal({
        first: 'Michael',
        middle: 'James',
        last: 'Smith',
      });
      expect(result.remarriage.spouseIsVeteran).to.equal(true);
      expect(result.remarriage.hasTerminated).to.equal(true);
      expect(result.remarriage.terminationReason).to.equal('Death');

      // Test spouse veteran ID (both SSN and VA file number)
      expect(result.remarriage.spouseSSN).to.deep.equal({
        first3: '999',
        middle2: '88',
        last4: '8777',
      });
      expect(result.remarriage.spouseVAFileNumber).to.equal('555666777');
    });
  });

  describe('not remarried scenario', () => {
    it('should transform not remarried data correctly', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataNotRemarried),
      );

      expect(result.hasRemarried).to.equal(false);
      expect(result.inReplyReferTo).to.equal('434353346');

      // Should include empty remarriage structure
      expect(result.remarriage.dateOfMarriage).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      expect(result.remarriage.spouseIsVeteran).to.equal(false);
      expect(result.remarriage.hasTerminated).to.equal(false);
      expect(result.remarriage.spouseSSN).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });

      // Test recipient with only daytime phone
      expect(result.recipient.phone.evening).to.deep.equal({
        areaCode: '',
        prefix: '',
        lineNumber: '',
      });
    });
  });

  describe('remarried over 57 scenario', () => {
    it('should transform remarried over 57 data correctly', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataOver57),
      );

      expect(result.hasRemarried).to.equal(true);
      expect(result.remarriage.ageAtMarriage).to.equal('62');
      expect(result.remarriage.spouseIsVeteran).to.equal(true);
      expect(result.remarriage.hasTerminated).to.equal(false);

      // Spouse veteran with SSN only
      expect(result.remarriage.spouseSSN).to.deep.equal({
        first3: '777',
        middle2: '88',
        last4: '8999',
      });
      expect(result.remarriage.spouseVAFileNumber).to.equal('');

      // Test spouse name with empty middle name
      expect(result.remarriage.spouseName).to.deep.equal({
        first: 'Michael',
        middle: '',
        last: 'Davis',
      });
    });
  });

  describe('terminated marriage scenario', () => {
    it('should transform terminated marriage data correctly', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataTerminated),
      );

      expect(result.hasRemarried).to.equal(true);
      expect(result.remarriage.hasTerminated).to.equal(true);
      expect(result.remarriage.terminationReason).to.equal('Divorce');
      expect(result.remarriage.spouseIsVeteran).to.equal(false);

      expect(result.remarriage.terminationDate).to.deep.equal({
        month: '03',
        day: '15',
        year: '2024',
      });

      // Non-veteran spouse should have empty veteran ID fields
      expect(result.remarriage.spouseSSN).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });
      expect(result.remarriage.spouseVAFileNumber).to.equal('');

      // Test spouse name with suffix
      expect(result.remarriage.spouseName).to.deep.equal({
        first: 'Robert',
        middle: 'James',
        last: 'Williams',
      });
    });
  });

  describe('spouse veteran with VA file number only scenario', () => {
    it('should transform spouse veteran with VA file number only', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataVeteranVAFile),
      );

      expect(result.remarriage.spouseIsVeteran).to.equal(true);
      expect(result.remarriage.hasTerminated).to.equal(false);

      // Spouse veteran with VA file number only
      expect(result.remarriage.spouseVAFileNumber).to.equal('555666777');
      expect(result.remarriage.spouseSSN).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });
    });
  });

  describe('VA file number only scenario', () => {
    it('should use VA file number when SSN is not provided', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataVAFileOnly),
      );

      expect(result.inReplyReferTo).to.equal('123456789');
      expect(result.veteran.vaFileNumber).to.equal('123456789');
      expect(result.veteran.ssn).to.deep.equal({
        first3: '',
        middle2: '',
        last4: '',
      });

      // Test recipient signature
      expect(result.recipient.statementOfTruthSignature).to.equal('Jane Doe');
    });
  });

  describe('date formatting', () => {
    it('should handle ISO date format correctly', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataComplete),
      );

      expect(result.remarriage.dateOfMarriage).to.deep.equal({
        month: '06',
        day: '15',
        year: '2023',
      });

      expect(result.remarriage.spouseDateOfBirth).to.deep.equal({
        month: '03',
        day: '20',
        year: '1965',
      });
    });
  });

  describe('phone number formatting', () => {
    it('should handle various phone number formats', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataOver57),
      );

      expect(result.recipient.phone.daytime).to.deep.equal({
        areaCode: '571',
        prefix: '555',
        lineNumber: '7890',
      });

      expect(result.recipient.phone.evening).to.deep.equal({
        areaCode: '571',
        prefix: '555',
        lineNumber: '4321',
      });
    });
  });

  describe('signature date', () => {
    it('should generate current date for signature', () => {
      const result = JSON.parse(
        transformForSubmit(mockFormConfig, testDataComplete),
      );

      // Signature date should be today's date
      expect(result.recipient.signatureDate).to.have.property('month');
      expect(result.recipient.signatureDate).to.have.property('day');
      expect(result.recipient.signatureDate).to.have.property('year');

      // Verify it's a valid date format
      expect(result.recipient.signatureDate.month).to.match(/^\d{2}$/);
      expect(result.recipient.signatureDate.day).to.match(/^\d{2}$/);
      expect(result.recipient.signatureDate.year).to.match(/^\d{4}$/);
    });
  });
});
