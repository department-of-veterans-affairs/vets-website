import { expect } from 'chai';
import { formatDate } from '../../utilities/helpers';

describe('formatDate', () => {
  it('should format a valid date in provided format', () => {
    const result = formatDate('1990-01-02', 'l');
    expect(result).to.equal('1/2/1990');
  });

  it('should default to LL format', () => {
    const result = formatDate('1990-01-02');
    expect(result).to.equal('January 2, 1990');
  });

  it('should return "Unknown" when the date is invalid', () => {
    const result = formatDate('1990-13-40');
    expect(result).to.equal('Unknown');
  });

  it('should return "Unknown" when no date provided', () => {
    const result = formatDate();
    expect(result).to.equal('Unknown');
  });
});
