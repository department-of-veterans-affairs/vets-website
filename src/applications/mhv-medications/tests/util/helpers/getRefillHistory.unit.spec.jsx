import { expect } from 'chai';
import {
  getRefillHistory,
  createOriginalFillRecord,
} from '../../../util/helpers';

describe('getRefillHistory function', () => {
  it('should return an empty array when prescription is null', () => {
    const result = getRefillHistory(null);
    expect(result).to.deep.equal([]);
  });

  it('should return an array with only the original fill record when there are no rxRfRecords', () => {
    const prescription = {
      backImprint: 'back123',
      cmopDivisionPhone: '123-456-7890',
      cmopNdcNumber: '12345-6789-01',
      color: 'white',
      dialCmopDivisionPhone: '123-456-7890',
      dispensedDate: '2023-01-01',
      frontImprint: 'front123',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      shape: 'round',
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(1);
    expect(result[0]).to.deep.equal(prescription);
  });

  it('should return an array with rxRfRecords and the original fill record', () => {
    const prescription = {
      backImprint: 'back123',
      cmopDivisionPhone: '123-456-7890',
      cmopNdcNumber: '12345-6789-01',
      color: 'white',
      dialCmopDivisionPhone: '123-456-7890',
      dispensedDate: '2023-01-01',
      frontImprint: 'front123',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      shape: 'round',
      rxRfRecords: [
        {
          backImprint: 'back456',
          cmopDivisionPhone: '234-567-8901',
          cmopNdcNumber: '23456-7890-12',
          dispensedDate: '2023-02-01',
        },
        {
          backImprint: 'back789',
          cmopDivisionPhone: '345-678-9012',
          cmopNdcNumber: '34567-8901-23',
          dispensedDate: '2023-03-01',
        },
      ],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(3);
    expect(result[0]).to.deep.equal(prescription.rxRfRecords[0]);
    expect(result[1]).to.deep.equal(prescription.rxRfRecords[1]);

    // Check that the original fill record is added as the last item
    const originalFill = result[2];
    expect(originalFill.backImprint).to.equal(prescription.backImprint);
    expect(originalFill.cmopDivisionPhone).to.equal(
      prescription.cmopDivisionPhone,
    );
    expect(originalFill.cmopNdcNumber).to.equal(prescription.cmopNdcNumber);
    expect(originalFill.dispensedDate).to.equal(prescription.dispensedDate);
    expect(originalFill.prescriptionSource).to.equal(
      prescription.prescriptionSource,
    );
  });

  it('should handle prescription with empty rxRfRecords array and dispensed date', () => {
    const prescription = {
      backImprint: 'back123',
      cmopNdcNumber: '12345-6789-01',
      dispensedDate: '2023-01-01',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      rxRfRecords: [],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(1);
    expect(result[0].prescriptionId).to.equal('123456');
    expect(result[0].prescriptionName).to.equal('Test Medication');
    expect(result[0].prescriptionSource).to.equal('RX');
  });

  it('should handle prescription with empty rxRfRecords array and no dispensed date', () => {
    const prescription = {
      backImprint: 'back123',
      cmopNdcNumber: '12345-6789-01',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      rxRfRecords: [],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(0);
  });
});

describe('createOriginalFillRecord function', () => {
  it('should include prescriptionSource in the returned object', () => {
    const prescription = {
      prescriptionId: 123456,
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      dispensedDate: '2023-08-04T04:00:00.000Z',
      backImprint: 'test-back',
      cmopDivisionPhone: '555-1234',
      cmopNdcNumber: '12345-678-90',
      color: 'white',
      dialCmopDivisionPhone: '555-1234',
      frontImprint: 'test-front',
      shape: 'round',
    };

    const result = createOriginalFillRecord(prescription);

    expect(result).to.have.property('prescriptionSource');
    expect(result.prescriptionSource).to.equal('RX');
  });

  it('should include all required fields from prescription', () => {
    const prescription = {
      prescriptionId: 123456,
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      dispensedDate: '2023-08-04T04:00:00.000Z',
      backImprint: 'test-back',
      cmopDivisionPhone: '555-1234',
      cmopNdcNumber: '12345-678-90',
      color: 'white',
      dialCmopDivisionPhone: '555-1234',
      frontImprint: 'test-front',
      shape: 'round',
    };

    const result = createOriginalFillRecord(prescription);

    expect(result).to.deep.include({
      prescriptionId: 123456,
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      dispensedDate: '2023-08-04T04:00:00.000Z',
      backImprint: 'test-back',
      cmopDivisionPhone: '555-1234',
      cmopNdcNumber: '12345-678-90',
      color: 'white',
      dialCmopDivisionPhone: '555-1234',
      frontImprint: 'test-front',
      shape: 'round',
    });
  });
});
