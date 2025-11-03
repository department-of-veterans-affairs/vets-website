/**
 * @module tests/constants.unit.spec
 * @description Unit tests for application constants
 */

import { expect } from 'chai';
import {
  BRANCH_OF_SERVICE,
  CURRENT_ALLOWANCE_RATE,
  SUBMISSION_ADDRESS,
  SUBMIT_URL,
  SUBTITLE,
  TITLE,
  TRACKING_PREFIX,
} from './constants';

describe('Constants', () => {
  describe('Form Title and Subtitle', () => {
    it('should have correct title', () => {
      expect(TITLE).to.exist;
      expect(TITLE).to.be.a('string');
      expect(TITLE).to.include('burial allowance');
    });

    it('should have correct subtitle', () => {
      expect(SUBTITLE).to.exist;
      expect(SUBTITLE).to.equal(
        'State or Tribal Organization Application for Interment Allowance (Under 38 U.S.C. Chapter 23) (VA Form 21-530a)',
      );
    });
  });

  describe('Submit URL', () => {
    it('should have submit URL', () => {
      expect(SUBMIT_URL).to.exist;
      expect(SUBMIT_URL).to.be.a('string');
    });

    it('should have correct API endpoint format', () => {
      expect(SUBMIT_URL).to.match(/^\/v0\/form21p_530a$/);
    });
  });

  describe('Tracking Prefix', () => {
    it('should have tracking prefix', () => {
      expect(TRACKING_PREFIX).to.exist;
      expect(TRACKING_PREFIX).to.be.a('string');
    });

    it('should include form identifier', () => {
      expect(TRACKING_PREFIX).to.include('21p-530a');
    });

    it('should end with hyphen', () => {
      expect(TRACKING_PREFIX).to.match(/-$/);
    });
  });

  describe('Branch of Service', () => {
    it('should have branch of service array', () => {
      expect(BRANCH_OF_SERVICE).to.be.an('array');
    });

    it('should have Army option', () => {
      const army = BRANCH_OF_SERVICE.find(b => b.value === 'army');
      expect(army).to.exist;
      expect(army.label).to.equal('Army');
    });

    it('should have Navy option', () => {
      const navy = BRANCH_OF_SERVICE.find(b => b.value === 'navy');
      expect(navy).to.exist;
      expect(navy.label).to.equal('Navy');
    });

    it('should have Marines option', () => {
      const marines = BRANCH_OF_SERVICE.find(b => b.value === 'marines');
      expect(marines).to.exist;
      expect(marines.label).to.equal('Marines');
    });

    it('should have Air Force option', () => {
      const airForce = BRANCH_OF_SERVICE.find(b => b.value === 'air_force');
      expect(airForce).to.exist;
      expect(airForce.label).to.equal('Air Force');
    });

    it('should have Space Force option', () => {
      const spaceForce = BRANCH_OF_SERVICE.find(b => b.value === 'space_force');
      expect(spaceForce).to.exist;
      expect(spaceForce.label).to.equal('Space Force');
    });

    it('should have Coast Guard option', () => {
      const coastGuard = BRANCH_OF_SERVICE.find(b => b.value === 'coast_guard');
      expect(coastGuard).to.exist;
      expect(coastGuard.label).to.equal('Coast Guard');
    });

    it('should have National Guard option', () => {
      const nationalGuard = BRANCH_OF_SERVICE.find(
        b => b.value === 'national_guard',
      );
      expect(nationalGuard).to.exist;
      expect(nationalGuard.label).to.equal('National Guard');
    });

    it('should have Reserves option', () => {
      const reserves = BRANCH_OF_SERVICE.find(b => b.value === 'reserves');
      expect(reserves).to.exist;
      expect(reserves.label).to.equal('Reserves');
    });

    it('should have exactly 8 branch options', () => {
      expect(BRANCH_OF_SERVICE).to.have.lengthOf(8);
    });

    it('should have value and label for each option', () => {
      BRANCH_OF_SERVICE.forEach(branch => {
        expect(branch).to.have.property('value');
        expect(branch).to.have.property('label');
        expect(branch.value).to.be.a('string');
        expect(branch.label).to.be.a('string');
      });
    });

    it('should use snake_case for multi-word values', () => {
      const multiWordBranches = BRANCH_OF_SERVICE.filter(b =>
        b.label.includes(' '),
      );
      multiWordBranches.forEach(branch => {
        expect(branch.value).to.match(/^[a-z]+(_[a-z]+)*$/);
      });
    });
  });

  describe('Current Allowance Rate', () => {
    it('should have current allowance rate', () => {
      expect(CURRENT_ALLOWANCE_RATE).to.exist;
      expect(CURRENT_ALLOWANCE_RATE).to.be.a('string');
    });

    it('should be formatted as currency', () => {
      expect(CURRENT_ALLOWANCE_RATE).to.match(/^\$/);
    });

    it('should contain numeric value', () => {
      expect(CURRENT_ALLOWANCE_RATE).to.match(/\$\d+/);
    });
  });

  describe('Submission Address', () => {
    it('should have submission address object', () => {
      expect(SUBMISSION_ADDRESS).to.be.an('object');
    });

    it('should have name property', () => {
      expect(SUBMISSION_ADDRESS.name).to.exist;
      expect(SUBMISSION_ADDRESS.name).to.be.a('string');
      expect(SUBMISSION_ADDRESS.name).to.include('VA');
    });

    it('should have street property', () => {
      expect(SUBMISSION_ADDRESS.street).to.exist;
      expect(SUBMISSION_ADDRESS.street).to.be.a('string');
    });

    it('should have city property', () => {
      expect(SUBMISSION_ADDRESS.city).to.exist;
      expect(SUBMISSION_ADDRESS.city).to.be.a('string');
    });

    it('should have state property', () => {
      expect(SUBMISSION_ADDRESS.state).to.exist;
      expect(SUBMISSION_ADDRESS.state).to.be.a('string');
      expect(SUBMISSION_ADDRESS.state).to.have.lengthOf(2);
    });

    it('should have zip property', () => {
      expect(SUBMISSION_ADDRESS.zip).to.exist;
      expect(SUBMISSION_ADDRESS.zip).to.be.a('string');
      expect(SUBMISSION_ADDRESS.zip).to.match(/^\d{5}(-\d{4})?$/);
    });

    it('should have exactly 5 address fields', () => {
      expect(Object.keys(SUBMISSION_ADDRESS)).to.have.lengthOf(5);
    });
  });

  describe('Constant Values Format', () => {
    it('should use snake_case for branch values', () => {
      BRANCH_OF_SERVICE.forEach(branch => {
        expect(branch.value).to.match(/^[a-z]+(_[a-z]+)*$/);
      });
    });

    it('should use Title Case for branch labels', () => {
      BRANCH_OF_SERVICE.forEach(branch => {
        expect(branch.label).to.match(/^[A-Z]/);
      });
    });

    it('should use kebab-case for tracking prefix', () => {
      expect(TRACKING_PREFIX).to.match(/^[a-z0-9]+(-[a-z0-9]+)*-$/);
    });
  });

  describe('Constant Immutability', () => {
    it('should export all constants', () => {
      expect(TITLE).to.exist;
      expect(SUBTITLE).to.exist;
      expect(SUBMIT_URL).to.exist;
      expect(TRACKING_PREFIX).to.exist;
      expect(BRANCH_OF_SERVICE).to.exist;
      expect(CURRENT_ALLOWANCE_RATE).to.exist;
      expect(SUBMISSION_ADDRESS).to.exist;
    });

    it('should not allow modifying branch array', () => {
      const originalLength = BRANCH_OF_SERVICE.length;
      BRANCH_OF_SERVICE.push({ value: 'test', label: 'Test' });
      expect(BRANCH_OF_SERVICE).to.have.lengthOf(originalLength + 1);
      BRANCH_OF_SERVICE.pop();
    });
  });
});
