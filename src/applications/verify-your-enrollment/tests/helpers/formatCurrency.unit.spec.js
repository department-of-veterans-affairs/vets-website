import { expect } from 'chai';
import { formatCurrency } from '../../helpers';

describe('formatCurrency', () => {
  it('correctly formats numeric strings into USD currency format', () => {
    expect(formatCurrency('1234')).to.equal('$1,234.00');
    expect(formatCurrency('1234.56')).to.equal('$1,234.56');
    expect(formatCurrency('0.99')).to.equal('$0.99');
    expect(formatCurrency('123456789')).to.equal('$123,456,789.00');
  });

  it('handles invalid input appropriately', () => {
    expect(formatCurrency('abc')).to.equal('Invalid input');
    expect(formatCurrency('1234abc')).to.equal('Invalid input');
  });
});
