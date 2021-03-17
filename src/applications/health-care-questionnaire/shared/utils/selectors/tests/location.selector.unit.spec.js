import { expect } from 'chai';

import { location } from '../index';

describe('health care questionnaire -- utils -- get location type status --', () => {
  it('clinic is undefined', () => {
    const result = location.getType(undefined);
    expect(result).to.be.null;
  });
  it('clinic is does not have a type', () => {
    const clinic = {};
    const result = location.getType(clinic);
    expect(result).to.be.null;
  });
  it('type is an empty array', () => {
    const clinic = { type: [] };
    const result = location.getType(clinic);
    expect(result).to.be.null;
  });
  it('type does not have a coding', () => {
    const clinic = { type: [{}] };
    const result = location.getType(clinic);
    expect(result).to.be.null;
  });
  it('coding is an empty array', () => {
    const clinic = { type: [{ coding: [] }] };
    const result = location.getType(clinic);
    expect(result).to.be.null;
  });
  it('coding does not have a display', () => {
    const clinic = { type: [{ coding: [{}] }] };
    const result = location.getType(clinic);
    expect(result).to.be.null;
  });
  it('display exists', () => {
    const clinic = { type: [{ coding: [{ display: 'awesome type' }] }] };
    const result = location.getType(clinic);
    expect(result).to.equal('awesome type');
  });
  describe('options', () => {
    it('display exists is not converted to title case', () => {
      const clinic = { type: [{ coding: [{ display: 'AWESOME TYPE' }] }] };
      const result = location.getType(clinic, { titleCase: false });
      expect(result).to.equal('AWESOME TYPE');
    });
    it('display exists and is title case', () => {
      const clinic = { type: [{ coding: [{ display: 'AWESOME TYPE' }] }] };
      const result = location.getType(clinic, { titleCase: true });
      expect(result).to.equal('Awesome type');
    });
  });
});
