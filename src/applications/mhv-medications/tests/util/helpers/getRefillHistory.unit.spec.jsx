import { expect } from 'chai';
import { getRefillHistory } from '../../../util/helpers';
import { RX_SOURCE } from '../../../util/constants';

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

  it('should include partial fill records when there are rxRfRecords with partial fills', () => {
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
          prescriptionSource: RX_SOURCE.REFILL,
          prescriptionNumberIndex: 'RF1',
        },
        {
          backImprint: 'back789',
          cmopDivisionPhone: '345-678-9012',
          cmopNdcNumber: '34567-8901-23',
          dispensedDate: '2023-03-01',
          prescriptionSource: RX_SOURCE.PARTIAL_FILL,
          prescriptionNumberIndex: 'PF1',
          quantity: '10',
        },
      ],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(3);

    // First record should be the first rxRfRecord (RF)
    expect(result[0]).to.deep.equal(prescription.rxRfRecords[0]);
    expect(result[0].prescriptionSource).to.equal(RX_SOURCE.REFILL);

    // Second record should be the partial fill (PF)
    expect(result[1]).to.deep.equal(prescription.rxRfRecords[1]);
    expect(result[1].prescriptionSource).to.equal(RX_SOURCE.PARTIAL_FILL);
    expect(result[1].prescriptionNumberIndex).to.equal('PF1');
    expect(result[1].quantity).to.equal('10');

    // Third record should be the original fill
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

  it('should handle prescription with only partial fills and no dispensed date', () => {
    const prescription = {
      backImprint: 'back123',
      cmopNdcNumber: '12345-6789-01',
      prescriptionId: '123456',
      prescriptionName: 'Test Medication',
      prescriptionSource: 'RX',
      rxRfRecords: [
        {
          backImprint: 'back456',
          cmopDivisionPhone: '234-567-8901',
          cmopNdcNumber: '23456-7890-12',
          dispensedDate: '2023-02-01',
          prescriptionSource: RX_SOURCE.PARTIAL_FILL,
          prescriptionNumberIndex: 'PF1',
          quantity: '5',
        },
      ],
    };

    const result = getRefillHistory(prescription);
    expect(result.length).to.equal(1);
    expect(result[0]).to.deep.equal(prescription.rxRfRecords[0]);
    expect(result[0].prescriptionSource).to.equal(RX_SOURCE.PARTIAL_FILL);
    expect(result[0].prescriptionNumberIndex).to.equal('PF1');
    expect(result[0].quantity).to.equal('5');
  });
});
