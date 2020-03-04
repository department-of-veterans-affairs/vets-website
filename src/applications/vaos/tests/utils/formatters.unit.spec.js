import { expect } from 'chai';

import {
  formatBestTimeToCall,
  formatTypeOfCare,
  formatOperatingHours,
} from '../../utils/formatters';

describe('VAOS formatters', () => {
  describe('formatBestTimeToCall', () => {
    it('should return single time', () => {
      const result = formatBestTimeToCall({
        morning: true,
      });

      expect(result).to.equal('Morning');
    });
    it('should return two times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
      });

      expect(result).to.equal('Morning or Afternoon');
    });
    it('should return message for all times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
        evening: true,
      });

      expect(result).to.equal('Anytime during the day');
    });
  });
  describe('formatTypeOfCare', () => {
    it('should not lower case MOVE', () => {
      const result = formatTypeOfCare('MOVE! weight management');

      expect(result).to.equal('MOVE! weight management');
    });
    it('should lower case regular types of care', () => {
      const result = formatTypeOfCare('Primary care');

      expect(result).to.equal('primary care');
    });
  });
  describe('formatOperatingHours', () => {
    it('should return if falsy', () => {
      const result = formatOperatingHours(false);

      expect(result).to.equal(false);
    });
    it('should convert sunrise - sunset to All day', () => {
      const result = formatOperatingHours('sunrise-sunset');

      expect(result).to.equal('All Day');
    });
    it('should return closed', () => {
      const result = formatOperatingHours('close');

      expect(result).to.equal('Closed');
    });
    it('should format hmmA times', () => {
      const result = formatOperatingHours('800AM-1000AM');

      expect(result).to.equal('8:00a.m. - 10:00a.m.');
    });
    it('should format h:mmA times', () => {
      const result = formatOperatingHours('8:00AM-10:00PM');

      expect(result).to.equal('8:00a.m. - 10:00p.m.');
    });
    it('should skip invalid date', () => {
      const result = formatOperatingHours('whatever-whatever');

      expect(result).to.equal('whatever-whatever');
    });
  });
});
