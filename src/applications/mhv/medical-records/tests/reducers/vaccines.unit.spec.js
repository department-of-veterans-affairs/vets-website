import { expect } from 'chai';
import { convertVaccine } from '../../reducers/vaccines';

describe('vaccine reducer', () => {
  it('convertVaccine function should return null if it is not passed an argument', () => {
    expect(convertVaccine()).to.eq(null);
  });
});
