import {
  formatBestTimeToCall,
  formatTypeOfCare,
  formatOperatingHours,
} from '../../utils/formatters';

describe('VAOS formatters', () => {
  describe('formatBestTimeToCall', () => {
    test('should return single time', () => {
      const result = formatBestTimeToCall({
        morning: true,
      });

      expect(result).toBe('Morning');
    });
    test('should return two times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
      });

      expect(result).toBe('Morning or Afternoon');
    });
    test('should return message for all times', () => {
      const result = formatBestTimeToCall({
        morning: true,
        afternoon: true,
        evening: true,
      });

      expect(result).toBe('Anytime during the day');
    });
  });
  describe('formatTypeOfCare', () => {
    test('should not lower case MOVE', () => {
      const result = formatTypeOfCare('MOVE! weight management');

      expect(result).toBe('MOVE! weight management');
    });
    test('should lower case regular types of care', () => {
      const result = formatTypeOfCare('Primary care');

      expect(result).toBe('primary care');
    });
  });
  describe('formatOperatingHours', () => {
    test('should return if falsy', () => {
      const result = formatOperatingHours(false);

      expect(result).toBe(false);
    });
    test('should convert sunrise - sunset to All day', () => {
      const result = formatOperatingHours('sunrise-sunset');

      expect(result).toBe('All Day');
    });
    test('should return closed', () => {
      const result = formatOperatingHours('close');

      expect(result).toBe('Closed');
    });
    test('should format hmmA times', () => {
      const result = formatOperatingHours('800AM-1000AM');

      expect(result).toBe('8:00a.m. - 10:00a.m.');
    });
    test('should format h:mmA times', () => {
      const result = formatOperatingHours('8:00AM-10:00PM');

      expect(result).toBe('8:00a.m. - 10:00p.m.');
    });
    test('should skip invalid date', () => {
      const result = formatOperatingHours('whatever-whatever');

      expect(result).toBe('whatever-whatever');
    });
  });
});
