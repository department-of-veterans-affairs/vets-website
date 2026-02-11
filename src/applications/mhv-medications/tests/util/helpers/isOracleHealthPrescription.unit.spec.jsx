import { expect } from 'chai';
import { isOracleHealthPrescription } from '../../../util/helpers/isOracleHealthPrescription';
import prescriptionsList from '../../fixtures/prescriptionsList.json';

describe('isOracleHealthPrescription', () => {
  const cernerFacilityIds = ['668', '687', '692', '757'];

  // Get Oracle Health prescription (stationNumber: 668) and VistA prescription (stationNumber: 989) from fixtures
  const oracleHealthRx = prescriptionsList.data.find(
    rx => rx.attributes.stationNumber === '668',
  )?.attributes;
  const vistaRx = prescriptionsList.data.find(
    rx => rx.attributes.stationNumber === '989',
  )?.attributes;

  describe('sourceEhr-based detection (primary)', () => {
    it('returns true when sourceEhr is OH', () => {
      const rx = { sourceEhr: 'OH' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.true;
    });

    it('returns true when sourceEhr is OH even without stationNumber', () => {
      const rx = { sourceEhr: 'OH', stationNumber: null };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.true;
    });

    it('returns true when sourceEhr is OH even with empty cernerFacilityIds', () => {
      const rx = { sourceEhr: 'OH' };
      expect(isOracleHealthPrescription(rx, [])).to.be.true;
    });

    it('returns false when sourceEhr is vista', () => {
      const rx = { sourceEhr: 'vista' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });

    it('returns false when sourceEhr is vista even with Cerner stationNumber', () => {
      const rx = { sourceEhr: 'vista', stationNumber: '668' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });
  });

  describe('stationNumber-based detection (fallback)', () => {
    it('returns true when prescription stationNumber matches a Cerner facility ID', () => {
      const rx = { stationNumber: '668' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.true;
    });

    it('returns true for Oracle Health prescription from fixture', () => {
      expect(isOracleHealthPrescription(oracleHealthRx, cernerFacilityIds)).to
        .be.true;
    });

    it('returns true for different Cerner facility ID', () => {
      const rx = { stationNumber: '757' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.true;
    });

    it('returns false when prescription stationNumber does not match any Cerner facility ID', () => {
      const rx = { stationNumber: '989' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });

    it('returns false for VistA prescription from fixture', () => {
      expect(isOracleHealthPrescription(vistaRx, cernerFacilityIds)).to.be
        .false;
    });
  });

  describe('edge cases', () => {
    it('returns false when prescription is null', () => {
      expect(isOracleHealthPrescription(null, cernerFacilityIds)).to.be.false;
    });

    it('returns false when prescription is undefined', () => {
      expect(isOracleHealthPrescription(undefined, cernerFacilityIds)).to.be
        .false;
    });

    it('returns false when prescription has no stationNumber or sourceEhr', () => {
      const rx = { prescriptionId: 12345 };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });

    it('returns false when stationNumber is null and no sourceEhr', () => {
      const rx = { stationNumber: null };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });

    it('returns false when cernerFacilityIds is empty array and no sourceEhr', () => {
      const rx = { stationNumber: '668' };
      expect(isOracleHealthPrescription(rx, [])).to.be.false;
    });

    it('returns false when cernerFacilityIds is not provided and no sourceEhr', () => {
      const rx = { stationNumber: '668' };
      expect(isOracleHealthPrescription(rx)).to.be.false;
    });

    it('returns false when cernerFacilityIds is null and no sourceEhr', () => {
      const rx = { stationNumber: '668' };
      expect(isOracleHealthPrescription(rx, null)).to.be.false;
    });

    it('returns false when cernerFacilityIds is not an array and no sourceEhr', () => {
      const rx = { stationNumber: '668' };
      expect(isOracleHealthPrescription(rx, '668')).to.be.false;
    });

    it('handles VistA facility correctly (returns false)', () => {
      const rx = { stationNumber: '979' };
      expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
    });
  });
});
