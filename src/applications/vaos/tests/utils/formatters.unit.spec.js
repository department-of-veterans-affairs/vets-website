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

      expect(result).toBe('Morning');
    });
    it('should return two times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
      });

      expect(result).toBe('Morning or Afternoon');
    });
    it('should return message for all times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
        evening: true,
      });

      expect(result).toBe('Anytime during the day');
    });
  });
  describe('formatTypeOfCare', () => {
    it('should not lower case MOVE', () => {
      const result = formatTypeOfCare('MOVE! weight management');

      expect(result).toBe('MOVE! weight management');
    });
    it('should lower case regular types of care', () => {
      const result = formatTypeOfCare('Primary care');

      expect(result).toBe('primary care');
    });
  });
  describe('formatOperatingHours', () => {
    it('should return if falsy', () => {
      const result = formatOperatingHours(false);

      expect(result).toBe(false);
    });
    it('should convert sunrise - sunset to All day', () => {
      const result = formatOperatingHours('sunrise-sunset');

      expect(result).toBe('All Day');
    });
    it('should return closed', () => {
      const result = formatOperatingHours('close');

      expect(result).toBe('Closed');
    });
    it('should format hmmA times', () => {
      const result = formatOperatingHours('800AM-1000AM');

      expect(result).toBe('8:00a.m. - 10:00a.m.');
    });
    it('should format h:mmA times', () => {
      const result = formatOperatingHours('8:00AM-10:00PM');

      expect(result).toBe('8:00a.m. - 10:00p.m.');
    });
    it('should skip invalid date', () => {
      const result = formatOperatingHours('whatever-whatever');

      expect(result).toBe('whatever-whatever');
    });
  });
});
