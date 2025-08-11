import { expect } from 'chai';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
  buildVAPrescriptionPDFList,
  buildNonVAPrescriptionPDFList,
  buildMedicationInformationPDF,
} from '../../util/pdfConfigs';
import prescriptions from '../fixtures/prescriptions.json';
import allergies from '../fixtures/allergies.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import nonVAPrescription from '../fixtures/nonVaPrescription.json';
import { DOWNLOAD_FORMAT, FIELD_NONE_NOTED } from '../../util/constants';
import { convertHtmlForDownload } from '../../util/helpers';

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
    expect(pdfList[0].sections[0].items[2].value).to.equal(FIELD_NONE_NOTED);
  });
});

describe('Allergies List Config', () => {
  it('should map all allergies to a list', () => {
    const pdfList = buildAllergiesPDFList(allergies.entry);
    expect(pdfList.length).to.equal(allergies.entry.length);
  });
});

describe('VA prescription Config', () => {
  it('should create "Most recent prescription" section', () => {
    const pdfGen = buildVAPrescriptionPDFList(prescriptionDetails);
    expect(pdfGen[0].header).to.equal('Most recent prescription');
  });

  it('should create "Refill history" section if there is 1 record with dispensedDate NOT undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should NOT create "Refill history" section if there is 1 record with dispensedDate undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1]).to.not.exist;
  });

  it('should NOT create "Refill history" section if there are NO records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1]).to.not.exist;
  });

  it('should create "Refill history" section if there are NO records but original fill record is created', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should create "Refill history" section if there are 2 records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    rxDetails.rxRfRecords = [
      { ...rxDetails.rxRfRecords[0] },
      { ...rxDetails.rxRfRecords[0] },
    ];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildVAPrescriptionPDFList(blankPrescription);
    expect(pdfList[0].sections[0].items[12].value).to.equal('test');
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
    expect(pdfList[0].sections[0].items[6].value).to.equal('test');
  });
});

describe('Medication Information Config', () => {
  it('should create PDF config using HTML string', async () => {
    const htmlContent = `<div><h2>Test</h2><ul><li>Item 1</li><li>Item 2</li></ul><h2>Test 2</h2><p>Paragraph</p></div>`;
    const txt = await convertHtmlForDownload(htmlContent, DOWNLOAD_FORMAT.PDF);
    const pdfData = buildMedicationInformationPDF(txt);
    expect(pdfData.sections.length).to.equal(2);
    expect(pdfData.sections[0].header).to.equal('Test');
    expect(pdfData.sections[0].items[0].value).to.eql([
      { value: ['Item 1', 'Item 2'] },
    ]);
    expect(pdfData.sections[1].header).to.equal('Test 2');
    expect(pdfData.sections[1].items[0].value).to.equal('Paragraph');
  });
});
