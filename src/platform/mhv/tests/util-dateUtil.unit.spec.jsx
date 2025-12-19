import { expect } from 'chai';
import sinon from 'sinon';
import { formatBirthDateLong, formatBirthDateShort } from '../util/dateUtil';

describe('formatBirthDate', () => {
  it('formats a valid date in long format', () => {
    expect(formatBirthDateLong('2025-12-25')).to.equal('December 25, 2025');
  });

  it('strips leading zero from single-digit days', () => {
    expect(formatBirthDateLong('2025-01-05')).to.equal('January 5, 2025');
  });

  it('handles all months correctly', () => {
    expect(formatBirthDateLong('2025-01-15')).to.equal('January 15, 2025');
    expect(formatBirthDateLong('2025-02-15')).to.equal('February 15, 2025');
    expect(formatBirthDateLong('2025-03-15')).to.equal('March 15, 2025');
    expect(formatBirthDateLong('2025-04-15')).to.equal('April 15, 2025');
    expect(formatBirthDateLong('2025-05-15')).to.equal('May 15, 2025');
    expect(formatBirthDateLong('2025-06-15')).to.equal('June 15, 2025');
    expect(formatBirthDateLong('2025-07-15')).to.equal('July 15, 2025');
    expect(formatBirthDateLong('2025-08-15')).to.equal('August 15, 2025');
    expect(formatBirthDateLong('2025-09-15')).to.equal('September 15, 2025');
    expect(formatBirthDateLong('2025-10-15')).to.equal('October 15, 2025');
    expect(formatBirthDateLong('2025-11-15')).to.equal('November 15, 2025');
    expect(formatBirthDateLong('2025-12-15')).to.equal('December 15, 2025');
  });

  it('calls fallback for non-matching format', () => {
    const fallback = sinon.stub().returns('fallback result');
    const result = formatBirthDateLong('12/25/2025', fallback);

    expect(fallback.calledOnce).to.be.true;
    expect(fallback.calledWith('12/25/2025')).to.be.true;
    expect(result).to.equal('fallback result');
  });

  it('calls fallback for ISO datetime strings', () => {
    const fallback = sinon.stub().returns('fallback result');
    formatBirthDateLong('2025-12-25T00:00:00Z', fallback);

    expect(fallback.calledOnce).to.be.true;
  });

  it('calls fallback for empty string', () => {
    const fallback = sinon.stub().returns('fallback result');
    formatBirthDateLong('', fallback);

    expect(fallback.calledOnce).to.be.true;
  });

  it('throws error for invalid month', () => {
    expect(() => formatBirthDateLong('2025-13-25')).to.throw(
      'Invalid month in date string',
    );
    expect(() => formatBirthDateLong('2025-00-25')).to.throw(
      'Invalid month in date string',
    );
  });

  it('throws error for invalid day', () => {
    expect(() => formatBirthDateLong('2025-12-00')).to.throw(
      'Invalid day in date string',
    );
    expect(() => formatBirthDateLong('2025-12-32')).to.throw(
      'Invalid day in date string',
    );
  });
});

describe('formatBirthDateShort', () => {
  it('formats a valid date in short format', () => {
    expect(formatBirthDateShort('2025-12-25')).to.equal('12/25/2025');
  });

  it('strips leading zeros from single-digit months and days', () => {
    expect(formatBirthDateShort('2025-01-05')).to.equal('1/5/2025');
  });

  it('strips leading zero from month only when needed', () => {
    expect(formatBirthDateShort('2025-05-15')).to.equal('5/15/2025');
  });

  it('strips leading zero from day only when needed', () => {
    expect(formatBirthDateShort('2025-12-05')).to.equal('12/5/2025');
  });

  it('handles double-digit months and days', () => {
    expect(formatBirthDateShort('2025-10-10')).to.equal('10/10/2025');
    expect(formatBirthDateShort('2025-11-30')).to.equal('11/30/2025');
  });

  it('calls fallback for non-matching format', () => {
    const fallback = sinon.stub().returns('fallback result');
    const result = formatBirthDateShort('December 25, 2025', fallback);

    expect(fallback.calledOnce).to.be.true;
    expect(fallback.calledWith('December 25, 2025')).to.be.true;
    expect(result).to.equal('fallback result');
  });

  it('calls fallback for ISO datetime strings', () => {
    const fallback = sinon.stub().returns('fallback result');
    formatBirthDateShort('2025-12-25T00:00:00Z', fallback);

    expect(fallback.calledOnce).to.be.true;
  });

  it('calls fallback for empty string', () => {
    const fallback = sinon.stub().returns('fallback result');
    formatBirthDateShort('', fallback);

    expect(fallback.calledOnce).to.be.true;
  });

  it('throws error for invalid month', () => {
    expect(() => formatBirthDateShort('2025-13-25')).to.throw(
      'Invalid month in date string',
    );
    expect(() => formatBirthDateShort('2025-00-25')).to.throw(
      'Invalid month in date string',
    );
  });

  it('throws error for invalid day', () => {
    expect(() => formatBirthDateShort('2025-12-00')).to.throw(
      'Invalid day in date string',
    );
    expect(() => formatBirthDateShort('2025-12-32')).to.throw(
      'Invalid day in date string',
    );
  });
});
