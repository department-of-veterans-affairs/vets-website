import { expect } from 'chai';
import { transformDates } from './data-processors';

describe('Data Processors - Form data transformation', () => {
  describe('transformDates', () => {
    it('converts date objects to strings', () => {
      const formData = {
        birthDate: { year: 2000, month: 1, day: 15 },
        otherField: 'value',
      };

      const result = transformDates(formData, ['birthDate']);
      expect(result.birthDate).to.equal('2000-01-15');
      expect(result.otherField).to.equal('value');
    });

    it('handles partial dates', () => {
      const formData = {
        monthYear: { year: 2024, month: 3 },
      };

      const result = transformDates(formData, ['monthYear']);
      expect(result.monthYear).to.equal('2024-03-01');
    });

    it('handle Date objects', () => {
      const date = new Date('2024-06-15T10:30:00');
      const formData = {
        appointmentDate: date,
      };

      const result = transformDates(formData, ['appointmentDate']);
      expect(result.appointmentDate).to.equal('2024-06-15');
    });

    it('use custom formatter when provided', () => {
      const formData = {
        customDate: { year: 2024, month: 6, day: 15 },
      };

      const customFormatter = dateObj =>
        `${dateObj.month}/${dateObj.day}/${dateObj.year}`;
      const result = transformDates(formData, ['customDate'], customFormatter);
      expect(result.customDate).to.equal('6/15/2024');
    });

    it('handle null formData', () => {
      const result = transformDates(null, ['field']);
      expect(result).to.be.null;
    });

    it('skip non-object fields', () => {
      const formData = {
        stringDate: '2024-01-01',
        numberDate: 20240101,
      };

      const result = transformDates(formData, ['stringDate', 'numberDate']);
      expect(result.stringDate).to.equal('2024-01-01');
      expect(result.numberDate).to.equal(20240101);
    });

    it('handle multiple date fields', () => {
      const formData = {
        startDate: { year: 2024, month: 1, day: 1 },
        endDate: { year: 2024, month: 12, day: 31 },
      };

      const result = transformDates(formData, ['startDate', 'endDate']);
      expect(result.startDate).to.equal('2024-01-01');
      expect(result.endDate).to.equal('2024-12-31');
    });

    it('pad single digit months and days', () => {
      const formData = {
        date: { year: 2024, month: 3, day: 5 },
      };

      const result = transformDates(formData, ['date']);
      expect(result.date).to.equal('2024-03-05');
    });
  });
});
