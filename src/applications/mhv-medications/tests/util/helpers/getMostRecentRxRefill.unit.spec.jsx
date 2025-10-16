import { expect } from 'chai';
import { getMostRecentRxRefill } from '../../../util/helpers';

describe('getMostRecentRxRefill function', () => {
  it('should return empty string when rx is null', () => {
    expect(getMostRecentRxRefill(null)).to.equal('');
  });

  it('should return empty string when rx is undefined', () => {
    expect(getMostRecentRxRefill(undefined)).to.equal('');
  });

  it('should return the most recent prescription with the latest sortedDispensedDate', () => {
    const a = {
      prescriptionName: 'A',
      sortedDispensedDate: '2024-06-15T00:00:00.000',
    };
    const b = {
      prescriptionName: 'B',
      sortedDispensedDate: '2024-06-15T01:01:01.001',
    };
    const c = {
      prescriptionName: 'C',
      sortedDispensedDate: '2023-12-31T23:59:59.000',
    };
    const rx = { groupedMedications: [a, b, c] };

    const mostRecent = getMostRecentRxRefill(rx);
    expect(mostRecent).to.equal(b);
  });

  it('should return the first item when dates are equal', () => {
    const a = {
      prescriptionName: 'A',
      sortedDispensedDate: '2024-06-15T00:00:00.000',
    };
    const b = {
      prescriptionName: 'B',
      sortedDispensedDate: '2024-06-15T00:00:00.000',
    };
    const c = {
      prescriptionName: 'C',
      sortedDispensedDate: '2023-12-31T23:59:59.000',
    };
    const rx = { groupedMedications: [a, b, c] };

    const mostRecent = getMostRecentRxRefill(rx);
    expect(mostRecent).to.equal(a);
  });
});
