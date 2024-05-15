import { expect } from 'chai';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
  buildVAPrescriptionPDFList,
  buildNonVAPrescriptionPDFList,
} from '../../util/pdfConfigs';
import prescriptions from '../fixtures/prescriptions.json';
import allergies from '../fixtures/allergies.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import nonVAPrescription from '../fixtures/nonVaPrescription.json';
import { pdfDefaultStatusDefinition } from '../../util/constants';

describe('Prescriptions List Config', () => {
  it('should map all prescriptions to a list', () => {
    const pdfList = buildPrescriptionsPDFList(prescriptions);
    expect(pdfList.length).to.equal(prescriptions.length);
  });

  it('should handle blank non-required fields', () => {
    const blankPrescriptions = [
      {
        prescriptionId: 123456,
      },
    ];
    const pdfList = buildPrescriptionsPDFList(blankPrescriptions);
    expect(pdfList[0].sections[0].items[2].value).to.equal(
      pdfDefaultStatusDefinition,
    );
  });
});

describe('Allergies List Config', () => {
  it('should map all allergies to a list', () => {
    const pdfList = buildAllergiesPDFList(allergies.entry);
    expect(pdfList.length).to.equal(allergies.entry.length);
  });
});

describe('VA prescription Config', () => {
  it('should create "About your prescription" section', () => {
    const pdfGen = buildVAPrescriptionPDFList(prescriptionDetails);
    expect(pdfGen[0].header).to.equal('About your prescription');
  });

  it('should create "About this medication or supply" section', () => {
    const pdfGen = buildVAPrescriptionPDFList(prescriptionDetails);
    expect(pdfGen[1].header).to.equal('About this medication or supply');
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildVAPrescriptionPDFList(blankPrescription);
    expect(pdfList[0].sections[0].items[7].value).to.equal('test, ');
  });
});

describe('Non VA prescription Config', () => {
  it('should contain 9 values', () => {
    const pdfGen = buildNonVAPrescriptionPDFList(nonVAPrescription);
    expect(pdfGen[0].sections[0].items.length).to.equal(9);
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildNonVAPrescriptionPDFList(blankPrescription);
    expect(pdfList[0].sections[0].items[6].value).to.equal('test, ');
  });
});
