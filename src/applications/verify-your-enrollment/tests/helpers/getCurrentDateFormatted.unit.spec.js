import { expect } from 'chai';
import { getCurrentDateFormatted } from '../../helpers';

describe('getCurrentDateFormatted', () => {
  it('should return current Date in MM/DD/YYY formate ', () => {
    const today = new Date();

    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();

    const expectedDate = `${month}/${day}/${year}`;
    expect(getCurrentDateFormatted()).to.equal(expectedDate);
  });
});
