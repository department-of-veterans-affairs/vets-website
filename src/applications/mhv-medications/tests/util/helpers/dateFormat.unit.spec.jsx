import { expect } from 'chai';
import { DATETIME_FORMATS, FIELD_NONE_NOTED } from '../../../util/constants';
import { dateFormat } from '../../../util/helpers';

describe('Date Format function', () => {
  it("should return 'None noted' when no values are passed", () => {
    expect(dateFormat()).to.equal(FIELD_NONE_NOTED);
  });

  it("should return 'noDateMessage' when no values are passed", () => {
    const message = 'No date found';
    expect(dateFormat(null, null, message)).to.equal(message);
  });

  it('should return a formatted date (default format)', () => {
    expect(dateFormat('2023-10-26T22:18:00.000Z')).to.equal('October 26, 2023');
  });

  it('should handle a date object', () => {
    expect(
      dateFormat(new Date('1987-11-12T22:00:00Z'), null, null, null, null),
    ).to.equal('November 12, 1987');
  });

  it('should handle a date-only string', () => {
    expect(dateFormat('2024-02-29', 'M/d/yyyy')).to.equal('2/29/2024');
  });

  it('should return a formatted date (provided format)', () => {
    expect(
      dateFormat(
        '2023-10-26T12:18:00-05:00',
        "~~   QQQQ: 'literal text:M' M d *yy*~~",
      ),
    ).to.equal('~~   4th quarter: literal text:M 10 26 *23*~~');
  });

  it('should handle RFC 2822-styled timestamps', () => {
    expect(
      dateFormat(
        'Mon, 24 Feb 2025 03:39:11 EST',
        DATETIME_FORMATS.filename,
        null,
        null,
        'America/New_York',
      ),
    ).to.equal('2-24-2025_33911am');
  });

  it('should handle timeZone conversion', () => {
    expect(
      dateFormat(
        'Mon, 24 Feb 2025 23:39:11 PST',
        DATETIME_FORMATS.filename,
        null,
        null,
        'America/Chicago',
      ),
    ).to.equal('2-25-2025_13911am');
  });

  it('should prefix the formatted date with "dateWithMessage" if provided', () => {
    expect(
      dateFormat(
        '2023-10-26T22:18:00.000Z',
        DATETIME_FORMATS.longMonthDate,
        null,
        'Foo: ',
      ),
    ).to.equal('Foo: October 26, 2023');
  });

  it('should return "Invalid date" when an invalid date is provided', () => {
    expect(dateFormat('2024-02-30')).to.equal('Invalid date');
  });

  it('should return "Invalid date" when an invalid type is provided', () => {
    expect(dateFormat({ iAmNot: 'valid' })).to.equal('Invalid date');
  });

  it('should return "Invalid date" for a correctly formatted RFC 2822-styled timestamp with an invalid date', () => {
    expect(
      dateFormat('Mon, 24 Foo 2025 03:39:11 EST', DATETIME_FORMATS.filename),
    ).to.equal('Invalid date');
  });

  it('should return Invalid date for invalid timezone', () => {
    expect(
      dateFormat(
        '2025-02-15T12:00:00Z',
        DATETIME_FORMATS.longMonthDate,
        null,
        null,
        'Bad/Zone',
      ),
    ).to.equal('Invalid date');
  });
});
