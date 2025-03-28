import { expect } from 'chai';
import { isDateThirtyDaysOld } from '../utilities';

describe('isDateThirtyDaysOld', () => {
  it('should return true if the date of calculation is more than 30 days from the term start date', () => {
    const dateOfCalculation = '2022-01-01';
    const termStartDate = '2021-12-01';
    expect(isDateThirtyDaysOld(dateOfCalculation, termStartDate)).to.be.true;
  });
  it('should return false if the date of calculation is less than 30 days from the term start date', () => {
    const dateOfCalculation = '2021-12-01';
    const termStartDate = '2021-12-01';
    expect(isDateThirtyDaysOld(dateOfCalculation, termStartDate)).to.be.false;
  });
});
