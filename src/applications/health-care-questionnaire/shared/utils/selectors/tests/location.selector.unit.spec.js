import { expect } from 'chai';

import { locationSelector as location } from '../index';

describe('health care questionnaire -- utils -- get location type status --', () => {
  describe('getType', () => {
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
  describe('getPhoneNumber', () => {
    it('location is undefined', () => {
      const result = location.getPhoneNumber(undefined);
      expect(result).to.be.null;
    });
    it('location is defined with no telecom', () => {
      const result = location.getPhoneNumber({});
      expect(result).to.be.null;
    });
    it('location is defined with empty telecom', () => {
      const result = location.getPhoneNumber({ telecom: [] });
      expect(result).to.be.null;
    });
    it('location is defined with telecom, but no phone', () => {
      const result = location.getPhoneNumber({
        telecom: [{ system: 'not-phone' }],
      });
      expect(result).to.be.null;
    });
    it('location is defined with telecom with a phone', () => {
      const result = location.getPhoneNumber({
        telecom: [{ system: 'phone', value: '1231231234' }],
      });
      expect(result).to.not.be.null;
      expect(result.number).to.equal('1231231234');
    });
    it('location is defined with telecom with many phones, returns the first phone', () => {
      const result = location.getPhoneNumber({
        telecom: [
          { system: 'phone', value: '1231231234' },
          { system: 'phone', value: '8908907890' },
        ],
      });
      expect(result).to.not.be.null;
      expect(result.number).to.equal('1231231234');
    });
    it('separate extensions', () => {
      const result = location.getPhoneNumber(
        {
          telecom: [{ system: 'phone', value: '1231231234 x1234' }],
        },
        { separateExtension: true },
      );
      expect(result).to.not.be.null;
      expect(result.number).to.equal('1231231234');
      expect(result.extension).to.equal('x1234');
    });
  });
  describe('getName', () => {
    it('location is undefined', () => {
      const result = location.getName(undefined);
      expect(result).to.be.null;
    });
    it('location is defined with no name', () => {
      const result = location.getName({});
      expect(result).to.be.null;
    });
    it('location is defined with name', () => {
      const result = location.getName({ name: 'hello world' });
      expect(result).to.equal('hello world');
    });
  });
});
