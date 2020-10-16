import { expect } from 'chai';

import { getMedicalCenterNameByID } from './medical-centers';

describe('getMedicalCenterNameByID', () => {
  it('should return an empty string if it is passed null', () => {
    expect(getMedicalCenterNameByID(null)).to.equal('');
  });
  it('should return an empty string if it is passed undefined', () => {
    expect(getMedicalCenterNameByID(undefined)).to.equal('');
  });
  it('should return an empty string if it is passed nothing', () => {
    expect(getMedicalCenterNameByID()).to.equal('');
  });
  it('should return an empty string if it is passed a number', () => {
    expect(getMedicalCenterNameByID(123)).to.equal('');
  });
  it('should return the name if the id is a known id', () => {
    expect(getMedicalCenterNameByID('463 - ABC')).to.equal(
      'Anchorage VA Medical Center',
    );
  });
  it('should return the name if the id is a known id', () => {
    expect(getMedicalCenterNameByID('463')).to.equal(
      'Anchorage VA Medical Center',
    );
  });
  it('should return the id if the id is not a known id', () => {
    expect(getMedicalCenterNameByID('46333 - NOT A VALID ID')).to.equal(
      '46333 - NOT A VALID ID',
    );
  });
});
