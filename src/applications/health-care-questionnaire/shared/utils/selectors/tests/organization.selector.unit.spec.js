import { expect } from 'chai';

import { organization } from '../index';

describe('health care questionnaire -- utils -- organization selector --', () => {
  describe('getName', () => {
    it('organization is undefined', () => {
      const result = organization.getName(undefined);
      expect(result).to.be.null;
    });
    it('organization is defined with no name', () => {
      const result = organization.getName({});
      expect(result).to.be.null;
    });
    it('organization is defined with name', () => {
      const result = organization.getName({ name: 'hello world' });
      expect(result).to.equal('hello world');
    });
  });
  describe('getPhoneNumber', () => {
    it('organization is undefined', () => {
      const result = organization.getPhoneNumber(undefined);
      expect(result).to.be.null;
    });
    it('organization is defined with no telecom', () => {
      const result = organization.getPhoneNumber({});
      expect(result).to.be.null;
    });
    it('organization is defined with empty telecom', () => {
      const result = organization.getPhoneNumber({ telecom: [] });
      expect(result).to.be.null;
    });
    it('organization is defined with telecom, but no phone', () => {
      const result = organization.getPhoneNumber({
        telecom: [{ system: 'not-phone' }],
      });
      expect(result).to.be.null;
    });
    it('organization is defined with telecom with a phone', () => {
      const result = organization.getPhoneNumber({
        telecom: [{ system: 'phone', value: '1231231234' }],
      });
      expect(result).to.not.be.null;
      expect(result.number).to.equal('1231231234');
    });
    it('organization is defined with telecom with many phones, returns the first phone', () => {
      const result = organization.getPhoneNumber({
        telecom: [
          { system: 'phone', value: '1231231234' },
          { system: 'phone', value: '8908907890' },
        ],
      });
      expect(result).to.not.be.null;
      expect(result.number).to.equal('1231231234');
    });
    it('separate extensions', () => {
      const result = organization.getPhoneNumber(
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
  describe('getId', () => {
    it('organization is undefined', () => {
      const result = organization.getId(undefined);
      expect(result).to.be.null;
    });
    it('organization is defined with no id', () => {
      const result = organization.getId({});
      expect(result).to.be.null;
    });
    it('organization is defined with id', () => {
      const result = organization.getId({ id: 'hello world' });
      expect(result).to.equal('hello world');
    });
  });
  describe('getFacilityIdentifier', () => {
    it('organization is undefined', () => {
      const result = organization.getFacilityIdentifier(undefined);
      expect(result).to.be.null;
    });
    it('organization is defined with no identifier', () => {
      const result = organization.getFacilityIdentifier({});
      expect(result).to.be.null;
    });
    it('organization is defined with identifier, but with no facility identifier', () => {
      const result = organization.getFacilityIdentifier({ identifier: [] });
      expect(result).to.be.null;
    });

    it('organization is defined with identifier, does not have the facility identifier', () => {
      const result = organization.getFacilityIdentifier({
        identifier: [
          {
            system: 'not-the-identifer',
          },
        ],
      });
      expect(result).to.be.null;
    });
    it('organization is defined with identifier, but with facility identifier, but no value', () => {
      const result = organization.getFacilityIdentifier({
        identifier: [
          {
            system:
              'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
          },
        ],
      });
      expect(result).to.be.null;
    });
    it('organization is defined with identifier, but with facility identifier', () => {
      const result = organization.getFacilityIdentifier({
        identifier: [
          {
            system:
              'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
            value: '1234',
          },
        ],
      });
      expect(result).to.not.be.null;
      expect(result).to.equal('1234');
    });
  });
});
