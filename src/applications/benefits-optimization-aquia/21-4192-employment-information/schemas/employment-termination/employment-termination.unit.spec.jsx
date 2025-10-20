/**
 * @module tests/schemas/employment-termination.unit.spec
 * @description Unit tests for employment termination validation schemas
 */

import { expect } from 'chai';
import {
  terminationReasonSchema,
  dateLastWorkedSchema,
  employmentTerminationSchema,
} from './employment-termination';

describe('Employment Termination Schemas', () => {
  describe('terminationReasonSchema', () => {
    it('should validate empty string', () => {
      expect(terminationReasonSchema.safeParse('').success).to.be.true;
    });

    it('should validate termination reason text', () => {
      expect(terminationReasonSchema.safeParse('Retired on disability').success)
        .to.be.true;
    });

    it('should validate 1000 character string', () => {
      expect(terminationReasonSchema.safeParse('A'.repeat(1000)).success).to.be
        .true;
    });

    it('should reject over 1000 characters', () => {
      expect(terminationReasonSchema.safeParse('A'.repeat(1001)).success).to.be
        .false;
    });

    it('should validate undefined', () => {
      expect(terminationReasonSchema.safeParse(undefined).success).to.be.true;
    });

    it('should validate Star Trek themed reason', () => {
      expect(
        terminationReasonSchema.safeParse(
          'Medical discharge due to injuries sustained during deep space exploration mission',
        ).success,
      ).to.be.true;
    });

    it('should validate retirement reason', () => {
      expect(
        terminationReasonSchema.safeParse(
          'Retired after 30 years of service in Starfleet Command',
        ).success,
      ).to.be.true;
    });

    it('should validate detailed reason', () => {
      expect(
        terminationReasonSchema.safeParse(
          'Honorable medical discharge from Starfleet due to service-related injuries sustained in the line of duty',
        ).success,
      ).to.be.true;
    });
  });

  describe('dateLastWorkedSchema', () => {
    it('should validate empty string', () => {
      expect(dateLastWorkedSchema.safeParse('').success).to.be.true;
    });

    it('should validate past date', () => {
      expect(dateLastWorkedSchema.safeParse('2020-01-01').success).to.be.true;
    });

    it('should validate undefined', () => {
      expect(dateLastWorkedSchema.safeParse(undefined).success).to.be.true;
    });

    it('should reject invalid date', () => {
      expect(dateLastWorkedSchema.safeParse('invalid-date').success).to.be
        .false;
    });

    it('should reject malformed date', () => {
      expect(dateLastWorkedSchema.safeParse('2265-13-45').success).to.be.false;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      expect(dateLastWorkedSchema.safeParse(futureDateString).success).to.be
        .false;
    });

    it('should validate today date', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      expect(dateLastWorkedSchema.safeParse(todayString).success).to.be.true;
    });

    it('should validate yesterday date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      expect(dateLastWorkedSchema.safeParse(yesterdayString).success).to.be
        .true;
    });
  });

  describe('employmentTerminationSchema', () => {
    it('should validate complete schema', () => {
      const data = {
        terminationReason: 'Retired on disability',
        dateLastWorked: '2020-12-31',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate partial data', () => {
      const data = {
        terminationReason: 'Retired',
        dateLastWorked: '',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate empty object', () => {
      const data = {};
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate Star Trek themed data', () => {
      const data = {
        terminationReason:
          'Medical discharge from Starfleet due to service-related injuries',
        dateLastWorked: '2020-10-15',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should reject invalid date', () => {
      const data = {
        terminationReason: 'Retired',
        dateLastWorked: 'invalid',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.false;
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const data = {
        terminationReason: 'Retired',
        dateLastWorked: futureDateString,
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.false;
    });

    it('should reject overly long termination reason', () => {
      const data = {
        terminationReason: 'A'.repeat(1001),
        dateLastWorked: '',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.false;
    });

    it('should validate with only termination reason filled', () => {
      const data = {
        terminationReason: 'Laid off due to company restructuring',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate with only date last worked filled', () => {
      const data = {
        dateLastWorked: '2020-12-31',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate long detailed termination reason', () => {
      const data = {
        terminationReason:
          'Honorable medical discharge from Starfleet Command after sustaining injuries during a critical diplomatic mission in the Neutral Zone, resulting in permanent disability requiring ongoing medical treatment at Starfleet Medical',
        dateLastWorked: '2020-11-30',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate employment ending long ago', () => {
      const data = {
        terminationReason: 'Retired',
        dateLastWorked: '1990-01-01',
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });

    it('should validate recent termination', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      const data = {
        terminationReason: 'Position eliminated',
        dateLastWorked: yesterdayString,
      };
      expect(employmentTerminationSchema.safeParse(data).success).to.be.true;
    });
  });
});
