/**
 * @module tests/constants.unit.spec
 * @description Unit tests for application constants
 */

import { expect } from 'chai';
import {
  TITLE,
  SUBTITLE,
  BENEFIT_TYPES,
  ADL_OPTIONS,
  LOCOMOTION_AIDS,
  DISTANCE_OPTIONS,
} from './constants';

describe('Constants', () => {
  describe('Form Title and Subtitle', () => {
    it('should have correct title', () => {
      expect(TITLE).to.exist;
      expect(TITLE).to.be.a('string');
      expect(TITLE).to.include('Housebound');
      expect(TITLE).to.include('Aid and Attendance');
    });

    it('should have correct subtitle', () => {
      expect(SUBTITLE).to.exist;
      expect(SUBTITLE).to.include('VA Form 21-2680');
    });
  });

  describe('Benefit Types', () => {
    it('should have benefit types object', () => {
      expect(BENEFIT_TYPES).to.be.an('object');
    });

    it('should have SMC benefit type', () => {
      expect(BENEFIT_TYPES.SMC).to.equal('smc');
    });

    it('should have SMP benefit type', () => {
      expect(BENEFIT_TYPES.SMP).to.equal('smp');
    });

    it('should have exactly 2 benefit types', () => {
      expect(Object.keys(BENEFIT_TYPES)).to.have.lengthOf(2);
    });
  });

  describe('ADL Options', () => {
    it('should have ADL options object', () => {
      expect(ADL_OPTIONS).to.be.an('object');
    });

    it('should have BATHING option', () => {
      expect(ADL_OPTIONS.BATHING).to.equal('bathing');
    });

    it('should have TOILETING option', () => {
      expect(ADL_OPTIONS.TOILETING).to.equal('toileting');
    });

    it('should have TRANSFERRING option', () => {
      expect(ADL_OPTIONS.TRANSFERRING).to.equal('transferring');
    });

    it('should have EATING option', () => {
      expect(ADL_OPTIONS.EATING).to.equal('eating_self_feeding');
    });

    it('should have DRESSING option', () => {
      expect(ADL_OPTIONS.DRESSING).to.equal('dressing');
    });

    it('should have HYGIENE option', () => {
      expect(ADL_OPTIONS.HYGIENE).to.equal('hygiene');
    });

    it('should have AMBULATING option', () => {
      expect(ADL_OPTIONS.AMBULATING).to.equal('ambulating_in_home');
    });

    it('should have MEDICATION option', () => {
      expect(ADL_OPTIONS.MEDICATION).to.equal('medication_management');
    });

    it('should have OTHER option', () => {
      expect(ADL_OPTIONS.OTHER).to.equal('other');
    });

    it('should have exactly 9 ADL options', () => {
      expect(Object.keys(ADL_OPTIONS)).to.have.lengthOf(9);
    });
  });

  describe('Locomotion Aids', () => {
    it('should have locomotion aids object', () => {
      expect(LOCOMOTION_AIDS).to.be.an('object');
    });

    it('should have CANES option', () => {
      expect(LOCOMOTION_AIDS.CANES).to.equal('canes');
    });

    it('should have BRACES option', () => {
      expect(LOCOMOTION_AIDS.BRACES).to.equal('braces');
    });

    it('should have CRUTCHES option', () => {
      expect(LOCOMOTION_AIDS.CRUTCHES).to.equal('crutches');
    });

    it('should have ASSISTANCE_PERSON option', () => {
      expect(LOCOMOTION_AIDS.ASSISTANCE_PERSON).to.equal(
        'assistance_of_another_person',
      );
    });

    it('should have exactly 4 locomotion aid options', () => {
      expect(Object.keys(LOCOMOTION_AIDS)).to.have.lengthOf(4);
    });
  });

  describe('Distance Options', () => {
    it('should have distance options object', () => {
      expect(DISTANCE_OPTIONS).to.be.an('object');
    });

    it('should have ONE_BLOCK option', () => {
      expect(DISTANCE_OPTIONS.ONE_BLOCK).to.equal('1_block');
    });

    it('should have FIVE_SIX_BLOCKS option', () => {
      expect(DISTANCE_OPTIONS.FIVE_SIX_BLOCKS).to.equal('5_6_blocks');
    });

    it('should have ONE_MILE option', () => {
      expect(DISTANCE_OPTIONS.ONE_MILE).to.equal('1_mile');
    });

    it('should have OTHER option', () => {
      expect(DISTANCE_OPTIONS.OTHER).to.equal('other');
    });

    it('should have exactly 4 distance options', () => {
      expect(Object.keys(DISTANCE_OPTIONS)).to.have.lengthOf(4);
    });
  });

  describe('Constant Values Format', () => {
    it('should use lowercase for benefit type values', () => {
      Object.values(BENEFIT_TYPES).forEach(value => {
        expect(value).to.match(/^[a-z]+$/);
      });
    });

    it('should use snake_case or lowercase for ADL option values', () => {
      Object.values(ADL_OPTIONS).forEach(value => {
        expect(value).to.match(/^[a-z]+(_[a-z]+)*$/);
      });
    });

    it('should use snake_case or lowercase for locomotion aids', () => {
      Object.values(LOCOMOTION_AIDS).forEach(value => {
        expect(value).to.match(/^[a-z]+(_[a-z]+)*$/);
      });
    });

    it('should use snake_case or numbers with underscores for distance options', () => {
      Object.values(DISTANCE_OPTIONS).forEach(value => {
        expect(value).to.match(/^[0-9a-z]+(_[0-9a-z]+)*$/);
      });
    });
  });

  describe('Constant Exports', () => {
    it('should export all constants', () => {
      expect(TITLE).to.exist;
      expect(SUBTITLE).to.exist;
      expect(BENEFIT_TYPES).to.exist;
      expect(ADL_OPTIONS).to.exist;
      expect(LOCOMOTION_AIDS).to.exist;
      expect(DISTANCE_OPTIONS).to.exist;
    });

    it('should have non-empty constant values', () => {
      expect(TITLE.length).to.be.greaterThan(0);
      expect(SUBTITLE.length).to.be.greaterThan(0);
      expect(Object.keys(BENEFIT_TYPES).length).to.be.greaterThan(0);
      expect(Object.keys(ADL_OPTIONS).length).to.be.greaterThan(0);
      expect(Object.keys(LOCOMOTION_AIDS).length).to.be.greaterThan(0);
      expect(Object.keys(DISTANCE_OPTIONS).length).to.be.greaterThan(0);
    });
  });
});
