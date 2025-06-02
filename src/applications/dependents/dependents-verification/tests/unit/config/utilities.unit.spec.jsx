import { format } from 'date-fns';
import { expect } from 'chai';
import { parseDateToDateObj } from '../../../config/utilities';

describe('parseDateToDateObj', () => {
  it('parses ISO 8601 string with time', () => {
    const dateStr = '2023-05-10T00:00:00Z';
    const result = parseDateToDateObj(dateStr);
    expect(format(result, 'yyyy-MM-dd')).to.equal('2023-05-10');
  });

  it('parses string with custom template', () => {
    const dateStr = '10/05/2023';
    const result = parseDateToDateObj(dateStr, 'dd/MM/yyyy');
    expect(format(result, 'yyyy-MM-dd')).to.equal('2023-05-10');
  });

  it('returns valid date object when given a valid Date instance', () => {
    const inputDate = new Date('2023-05-10T00:00:00Z');
    const result = parseDateToDateObj(inputDate);
    expect(result).to.be.a('date');
    expect(Number.isNaN(result.getTime())).to.be.false;
  });

  it('returns null when given an invalid date string', () => {
    const result = parseDateToDateObj('invalid-date');
    expect(result).to.be.null;
  });

  it('returns null for invalid date object', () => {
    const result = parseDateToDateObj(new Date('invalid-date'));
    expect(result).to.be.null;
  });

  it('returns null when string date is not valid and no template is provided', () => {
    const result = parseDateToDateObj('10-05-2023');
    expect(result).to.be.null;
  });

  it('returns null when input is undefined', () => {
    const result = parseDateToDateObj(undefined);
    expect(result).to.be.null;
  });

  it('returns null when input is null', () => {
    const result = parseDateToDateObj(null);
    expect(result).to.be.null;
  });

  it('returns the same number if input is a valid number (note: this may not be a real Date)', () => {
    const result = parseDateToDateObj(20230510);
    expect(result).to.equal(20230510);
  });
});
