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
import {
  pdfDefaultStatusDefinition,
  DOWNLOAD_FORMAT,
} from '../../util/constants';
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

describe('Medication Information Config', () => {
  it('should create PDF config using HTML string', () => {
    const htmlContent = `<div><h2>Test</h2><ul><li>Item 1</li><li>Item 2</li></ul><h2>Test 2</h2><p>Paragraph</p></div>`;
    const txt = convertHtmlForDownload(htmlContent, DOWNLOAD_FORMAT.PDF);
    const pdfData = buildMedicationInformationPDF(txt);
    expect(pdfData.sections.length).to.equal(2);
    expect(pdfData.sections[0].header).to.equal('Test');
    expect(pdfData.sections[0].items[0].value).to.equal(
      '    * Item 1\n    * Item 2\n\n',
    );
    expect(pdfData.sections[1].header).to.equal('Test 2');
    expect(pdfData.sections[1].items[0].value).to.equal('Paragraph\n\n');
  });
});
