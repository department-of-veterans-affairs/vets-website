import { expect } from 'chai';
import {
  isOver65,
  setDefaultIsOver65,
} from '../../../../config/chapters/01-veteran-information/helpers';

describe('isOver65', () => {
  it('should return true if the veteran is over 65', () => {
    const formData = {
      veteranDateOfBirth: '1950-01-01',
    };
    const result = isOver65(formData, new Date('2020-01-02'));
    expect(result).to.be.true;
  });

  it('should return false if the veteran is under 65', () => {
    const formData = {
      veteranDateOfBirth: '2000-01-01',
    };
    const result = isOver65(formData, new Date('2020-01-02'));
    expect(result).to.be.false;
  });

  it('should return undefined for an invalid date', () => {
    const formData = {
      veteranDateOfBirth: 'invalid-date',
    };
    const result = isOver65(formData, new Date('2020-01-02'));
    expect(result).to.be.undefined;
  });

  it('should create new date if no currentDate is provided', () => {
    const formData = {
      veteranDateOfBirth: '1950-01-01',
    };
    const result = isOver65(formData);
    expect(result).to.be.true;
  });
});

describe('setDefaultIsOver65', () => {
  it('should set isOver65 when veteranDateOfBirth changes', () => {
    const oldData = {
      veteranDateOfBirth: '2000-01-01',
    };
    const newData = {
      veteranDateOfBirth: '1950-01-01',
    };
    const result = setDefaultIsOver65(oldData, newData, new Date('2020-01-02'));
    expect(result.isOver65).to.be.true;
  });

  it('should not change isOver65 when veteranDateOfBirth does not change', () => {
    const oldData = {
      veteranDateOfBirth: '1950-01-01',
      isOver65: true,
    };
    const newData = {
      veteranDateOfBirth: '1950-01-01',
    };
    const result = setDefaultIsOver65(oldData, newData, new Date('2020-01-02'));
    expect(result.isOver65).to.be.undefined;
  });

  it('should create new date if no currentDate is provided', () => {
    const oldData = {
      veteranDateOfBirth: '2000-01-01',
    };
    const newData = {
      veteranDateOfBirth: '1950-01-01',
    };
    const result = setDefaultIsOver65(oldData, newData);
    expect(result.isOver65).to.be.true;
  });
});
