import { expect } from 'chai';
import { getPrescriptionDetailUrl } from '../../../util/helpers';

describe('getPrescriptionDetailUrl', () => {
  it('should return empty string when prescription is null', () => {
    expect(getPrescriptionDetailUrl(null)).to.equal('');
  });

  it('should return empty string when prescription is undefined', () => {
    expect(getPrescriptionDetailUrl(undefined)).to.equal('');
  });

  it('should return empty string when prescriptionId is missing', () => {
    expect(getPrescriptionDetailUrl({})).to.equal('');
  });

  it('should build basic path with prescriptionId only', () => {
    const prescription = { prescriptionId: '12345' };
    expect(getPrescriptionDetailUrl(prescription)).to.equal(
      '/prescription/12345',
    );
  });

  it('should include station_number query param when stationNumber is provided', () => {
    const prescription = { prescriptionId: '12345', stationNumber: '688' };
    expect(getPrescriptionDetailUrl(prescription)).to.equal(
      '/prescription/12345?station_number=688',
    );
  });

  it('should append suffix to the path', () => {
    const prescription = { prescriptionId: '12345' };
    expect(getPrescriptionDetailUrl(prescription, '/documentation')).to.equal(
      '/prescription/12345/documentation',
    );
  });

  it('should include station_number with suffix', () => {
    const prescription = { prescriptionId: '12345', stationNumber: '688' };
    expect(getPrescriptionDetailUrl(prescription, '/documentation')).to.equal(
      '/prescription/12345/documentation?station_number=688',
    );
  });

  it('should handle numeric prescriptionId', () => {
    const prescription = { prescriptionId: 12345 };
    expect(getPrescriptionDetailUrl(prescription)).to.equal(
      '/prescription/12345',
    );
  });

  it('should handle numeric stationNumber', () => {
    const prescription = { prescriptionId: '12345', stationNumber: 688 };
    expect(getPrescriptionDetailUrl(prescription)).to.equal(
      '/prescription/12345?station_number=688',
    );
  });
});
