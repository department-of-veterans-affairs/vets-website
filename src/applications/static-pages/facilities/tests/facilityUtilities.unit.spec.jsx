import { expect } from 'chai';
import { formatHours } from '../facilityUtilities';

describe('formatHours', () => {
  it('Should return a formatted hour string 6:20 p.m.', () => {
    expect(formatHours(1820)).to.equal('6:20 p.m.');
  });

  it('Should return a formatted hour string 7:00 a.m.', () => {
    expect(formatHours(700)).to.equal('7:00 a.m.');
  });

  it('Should return a formatted hour string 5:00 p.m.', () => {
    expect(formatHours(1700)).to.equal('5:00 p.m.');
  });

  it('Should return a null value for 9000', () => {
    expect(formatHours(9000)).to.equal(null);
  });

  it('Should return a null value 0', () => {
    expect(formatHours(0)).to.equal(null);
  });

  it('Should return a null value 44', () => {
    expect(formatHours(44)).to.equal(null);
  });

  it('Should return a formatted hour string 12:00 p.m.', () => {
    expect(formatHours(1200)).to.equal('12:00 p.m.');
  });

  it('Should return a formatted hour string 12:00 a.m.', () => {
    expect(formatHours(2400)).to.equal('12:00 a.m.');
  });
});
