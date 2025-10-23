import { expect } from 'chai';
import { toLocalISOString } from '../../helpers';

describe('toLocalISOString', () => {
  it('should formats the date correctly to local ISO string', () => {
    const date = new Date('2023-05-28T14:35:22.123Z');
    const localISOString = toLocalISOString(date);
    const expectedISOString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}T${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}.${date
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;

    expect(localISOString).to.equal(expectedISOString);
  });

  it('should handles single digit month, day, hour, minute, second correctly', () => {
    const date = new Date(2023, 0, 1, 9, 5, 3, 45);
    const localISOString = toLocalISOString(date);
    const expectedISOString = '2023-01-01T09:05:03.045';

    expect(localISOString).to.equal(expectedISOString);
  });

  it('should pad singles digit month, day, hour, minute, second correctly', () => {
    const date = new Date(2023, 3, 7, 4, 6, 8, 9);
    const localISOString = toLocalISOString(date);
    const expectedISOString = '2023-04-07T04:06:08.009';

    expect(localISOString).to.equal(expectedISOString);
  });

  it('should formats date with zero milliseconds correctly', () => {
    const date = new Date(2023, 10, 15, 12, 30, 45, 0);
    const localISOString = toLocalISOString(date);
    const expectedISOString = '2023-11-15T12:30:45.000';

    expect(localISOString).to.equal(expectedISOString);
  });
});
