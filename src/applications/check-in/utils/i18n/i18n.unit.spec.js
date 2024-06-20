import { enUS as en, es } from 'date-fns/locale';
import { format as formatDate, zonedTimeToUtc } from 'date-fns-tz';
import { expect } from 'chai';
import { dateFormatInterpolators } from './i18n';

const locales = { en, es };
const languageCodes = Object.keys(locales);

// Generate tests for date formatting interpolators
describe('Date formatting interpolators', () => {
  const expectedDateStrings = {
    en: {
      long: 'March 12, 2024',
      longAtTime: 'March 12, 2024 at 10:38 a.m.',
      mdY: '03/12/2024',
      time: '10:38 a.m.',
      day: 'Tuesday',
      monthDay: 'March 12',
      dayOfWeek: 'Tuesday',
      dayWithTime: 'March 12, 2024, 10:38 a.m.',
    },
    es: {
      long: '12 de marzo de 2024',
      longAtTime: '12 de marzo de 2024 a las 10:38:00 ',
      mdY: '12/3/2024',
      time: '10:38 a.m.',
      day: 'martes',
      monthDay: 'marzo 12',
      dayOfWeek: 'martes',
      dayWithTime: 'marzo 12, 2024, 10:38 a.m.',
    },
  };
  languageCodes.forEach(lng => {
    Object.entries(dateFormatInterpolators).forEach(
      ([format, interpolator]) => {
        if (format === 'default') {
          return;
        }
        let expected = expectedDateStrings[lng][format];
        it(`should format a date with the "${format}" format in "${lng}"`, () => {
          const now = new Date();
          // March 12, 2024 at 10:38:00 AM EDT
          const dateString = '2024-03-12T10:38:00.000';
          const correctedDateString = `${dateString}${formatDate(
            now,
            'XXX',
            process.env.TZ,
          )}`;
          const date = new Date(correctedDateString);
          const utcDate = zonedTimeToUtc(date, process.env.TZ);
          const locale = locales[lng];
          let actual;
          if (format !== 'dayWithTime') {
            actual = interpolator(utcDate, format, lng, locale);
          } else {
            actual = interpolator(
              { date: utcDate, timezone: process.env.TZ },
              format,
              lng,
              locale,
            );
          }
          if (format === 'longAtTime' && lng === 'es') {
            expected = `${expected}${formatDate(now, 'O', process.env.TZ)}`;
          }
          expect(actual).to.equal(expected);
        });
      },
    );
  });
});
