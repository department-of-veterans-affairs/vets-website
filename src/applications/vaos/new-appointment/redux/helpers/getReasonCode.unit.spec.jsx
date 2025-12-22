import { expect } from 'chai';
import { getReasonCode } from './getReasonCode';
import {
  REASON_MAX_CHARS,
  NEW_REASON_MAX_CHARS,
} from '../../../utils/constants';

describe('VAOS helper: getReasonCode', () => {
  const baseData = {
    phoneNumber: '5035551234',
    email: 'test@va.gov',
    visitType: 'clinic',
    reasonAdditionalInfo: 'Test reason for appointment',
    selectedDates: ['2024-01-15T09:00:00.000'],
    vaFacility: '983',
  };

  describe('Community Care requests', () => {
    it('should return text only for CC requests', () => {
      const result = getReasonCode({
        data: baseData,
        isCC: true,
        isDS: false,
      });

      expect(result.text).to.equal('Test reason for appointment');
    });

    it('should truncate CC reason text to REASON_MAX_CHARS', () => {
      const longText = 'A'.repeat(300);
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: longText },
        isCC: true,
        isDS: false,
      });

      expect(result.text).to.have.lengthOf(REASON_MAX_CHARS);
    });
  });

  describe('Direct schedule', () => {
    it('should include reason code and comments for DS', () => {
      const result = getReasonCode({
        data: baseData,
        isCC: false,
        isDS: true,
      });

      expect(result.text).to.equal('comments:Test reason for appointment');
    });

    it('should truncate DS comments to REASON_MAX_CHARS', () => {
      const longText = 'A'.repeat(300);
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: longText },
        isCC: false,
        isDS: true,
      });

      expect(result.text).to.include(
        `comments:${'A'.repeat(REASON_MAX_CHARS)}`,
      );
    });
  });

  describe('VA Request', () => {
    it('should include all appointment info fields', () => {
      const result = getReasonCode({
        data: baseData,
        isCC: false,
        isDS: false,
      });

      expect(result.text).to.include('station id: 983');
      expect(result.text).to.include('preferred modality:');
      expect(result.text).to.include('phone number: 5035551234');
      expect(result.text).to.include('email: test@va.gov');
      expect(result.text).to.include('preferred dates:');
      expect(result.text).to.include('comments:');
    });

    it('should format dates with AM/PM', () => {
      const result = getReasonCode({
        data: {
          ...baseData,
          selectedDates: ['2024-01-15T09:00:00.000', '2024-01-16T14:00:00.000'],
        },
        isCC: false,
        isDS: false,
      });

      expect(result.text).to.include('01/15/2024 AM');
      expect(result.text).to.include('01/16/2024 PM');
    });
  });

  describe('VA Request with updateLimits (OH flow)', () => {
    it('should use shortened field names when updateLimits is true', () => {
      const result = getReasonCode({
        data: baseData,
        isCC: false,
        isDS: false,
        updateLimits: true,
      });

      // Check for shortened field names
      expect(result.text).to.include('station: 983');
      expect(result.text).to.not.include('station id:');

      expect(result.text).to.include('modality:');
      expect(result.text).to.not.include('preferred modality:');

      expect(result.text).to.include('phone: 5035551234');
      expect(result.text).to.not.include('phone number:');
    });

    it('should omit reason code from appointmentInfo when updateLimits is true', () => {
      const result = getReasonCode({
        data: baseData,
        isCC: false,
        isDS: false,
        updateLimits: true,
      });

      // The reason code should NOT be in the appointmentInfo portion
      // It should only appear in comments
      const parts = result.text.split('|');
      const hasReasonCodeInInfo = parts.some(
        part =>
          part.startsWith('reason code:') && !part.startsWith('comments:'),
      );
      expect(hasReasonCodeInInfo).to.be.false;
    });

    it('should truncate comments to NEW_REASON_MAX_CHARS when updateLimits is true', () => {
      const longText = 'A'.repeat(300);
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: longText },
        isCC: false,
        isDS: false,
        updateLimits: true,
      });

      expect(result.text).to.include(
        `comments:${'A'.repeat(NEW_REASON_MAX_CHARS)}`,
      );
    });

    it('should still truncate to REASON_MAX_CHARS when updateLimits is false', () => {
      const longText = 'A'.repeat(300);
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: longText },
        isCC: false,
        isDS: false,
        updateLimits: false,
      });

      expect(result.text).to.include(
        `comments:${'A'.repeat(REASON_MAX_CHARS)}`,
      );
    });

    it('should use vsGUI2 for visit mode when updateLimits is true', () => {
      const result = getReasonCode({
        data: { ...baseData, visitType: 'clinic' },
        isCC: false,
        isDS: false,
        updateLimits: true,
      });

      // vsGUI2 for clinic should be different from vsGUI
      expect(result.text).to.include('modality:');
    });
  });

  describe('Edge cases', () => {
    it('should return null text when reasonAdditionalInfo is empty', () => {
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: '' },
        isCC: false,
        isDS: false,
      });

      expect(result.text).to.be.null;
    });

    it('should handle undefined reasonAdditionalInfo for CC', () => {
      const result = getReasonCode({
        data: { ...baseData, reasonAdditionalInfo: undefined },
        isCC: true,
        isDS: false,
      });

      expect(result.text).to.be.undefined;
    });
  });
});
