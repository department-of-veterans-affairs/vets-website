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

  it('returns true when prescription stationNumber matches a Cerner facility ID', () => {
    const rx = { stationNumber: '668' };
    expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.true;
  });

  it('returns true for Oracle Health prescription from fixture', () => {
    expect(isOracleHealthPrescription(oracleHealthRx, cernerFacilityIds)).to.be
      .true;
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
    expect(isOracleHealthPrescription(vistaRx, cernerFacilityIds)).to.be.false;
  });

  it('returns false when prescription is null', () => {
    expect(isOracleHealthPrescription(null, cernerFacilityIds)).to.be.false;
  });

  it('returns false when prescription is undefined', () => {
    expect(isOracleHealthPrescription(undefined, cernerFacilityIds)).to.be
      .false;
  });

  it('returns false when prescription has no stationNumber', () => {
    const rx = { prescriptionId: 12345 };
    expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
  });

  it('returns false when stationNumber is null', () => {
    const rx = { stationNumber: null };
    expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
  });

  it('returns false when cernerFacilityIds is empty array', () => {
    const rx = { stationNumber: '668' };
    expect(isOracleHealthPrescription(rx, [])).to.be.false;
  });

  it('returns false when cernerFacilityIds is not provided', () => {
    const rx = { stationNumber: '668' };
    expect(isOracleHealthPrescription(rx)).to.be.false;
  });

  it('returns false when cernerFacilityIds is null', () => {
    const rx = { stationNumber: '668' };
    expect(isOracleHealthPrescription(rx, null)).to.be.false;
  });

  it('returns false when cernerFacilityIds is not an array', () => {
    const rx = { stationNumber: '668' };
    expect(isOracleHealthPrescription(rx, '668')).to.be.false;
  });

  it('handles VistA facility correctly (returns false)', () => {
    const rx = { stationNumber: '979' };
    expect(isOracleHealthPrescription(rx, cernerFacilityIds)).to.be.false;
  });
});
