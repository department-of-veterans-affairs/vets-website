import { enUS as en, es } from 'date-fns/locale';
import { expect } from 'chai';
import { dateFormatInterpolators } from './i18n';

const locales = { en, es };

// Generate tests for date formatting interpolators
describe('Date formatting interpolators', () => {
  const expectedDates = {
    en: {
      long: 'March 12, 2024',
      longAtTime: 'March 12, 2024 at 10:38 a.m.',
      mdY: '03/12/2024',
      time: '10:38 a.m.',
      day: 'Tuesday',
      monthDay: 'March 12',
      dayOfWeek: 'Tuesday',
    },
    es: {
      long: '12 de marzo de 2024',
      longAtTime: '12 de marzo de 2024 a las 10:38:00 GMT-4',
      mdY: '12/3/2024',
      time: '10:38 a.m.',
      day: 'martes',
      monthDay: 'marzo 12',
      dayOfWeek: 'martes',
    },
  };
  ['en', 'es'].forEach(lng => {
    Object.entries(dateFormatInterpolators).forEach(
      ([format, interpolator]) => {
        if (format === 'default') {
          return;
        }
        it(`should format a date with the ${format} interpolator in ${lng}`, () => {
          const date = new Date('2024-03-12T10:38:00');
          const locale = locales[lng];
          const result = interpolator(date, format, lng, locale);
          expect(result).to.equal(expectedDates[lng][format]);
        });
      },
    );
  });
});
