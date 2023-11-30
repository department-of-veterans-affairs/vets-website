import moment from 'moment';
import { expect } from 'chai';

import { isUnder65 } from '../../config/form';

describe('Pensions isUnder65', () => {
  moment.now = () => {
    return +new Date('2020-01-01T12:00:00.000Z');
  };

  it('should return false if date of birth and isOver65 indicate veteran is over 65', () => {
    const under65 = isUnder65({
      veteranDateOfBirth: '1950-01-01',
      isOver65: true,
    });
    expect(under65).to.be.false;
  });

  it('should return true if veteran is less than 65 according to date of birth', () => {
    const under65 = isUnder65({
      veteranDateOfBirth: '2000-01-01',
      isOver65: true,
    });
    expect(under65).to.be.true;
  });

  it('should return true if veteran is less than 65 according to isOver65', () => {
    const under65 = isUnder65({
      veteranDateOfBirth: '1950-01-01',
      isOver65: false,
    });
    expect(under65).to.be.true;
  });
});
