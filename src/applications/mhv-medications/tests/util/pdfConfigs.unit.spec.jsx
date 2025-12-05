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
  DOWNLOAD_FORMAT,
  FIELD_NONE_NOTED,
  pdfDefaultStatusDefinition,
} from '../../util/constants';
import { convertHtmlForDownload } from '../../util/helpers';

describe('Prescriptions List Config', () => {
  it('should map all prescriptions to a list', () => {
    const pdfList = buildPrescriptionsPDFList(prescriptions);
    expect(pdfList.length).to.equal(prescriptions.length);
  });

  it('should contain 13 values', () => {
    const pdfList = buildPrescriptionsPDFList(prescriptions);
    expect(pdfList[0].sections[0].items.length).to.equal(13);
  });

  it('should contain a header with prescription name', () => {
    const pdfList = buildPrescriptionsPDFList(prescriptions);
    expect(pdfList[0].header).to.equal(prescriptions[0].prescriptionName);
  });

  it('should handle blank non-required fields', () => {
    const blankPrescriptions = [
      {
        prescriptionId: 123456,
      },
    ];
    const pdfList = buildPrescriptionsPDFList(blankPrescriptions);

    expect(pdfList[0].sections[0].items[2].value).to.equal(
      `${FIELD_NONE_NOTED} - ${pdfDefaultStatusDefinition[0].value}`,
    );
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is NewOrder', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'NewOrder';
    const pdfList = buildPrescriptionsPDFList(prescriptions);

    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
    expect(items).to.not.include('Prescription number:');
    expect(pdfList[0].sections[0].items.length).to.equal(11);
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is Renew', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'Renew';
    const pdfList = buildPrescriptionsPDFList(prescriptions);

    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
    expect(items).to.not.include('Prescription number:');
    expect(pdfList[0].sections[0].items.length).to.equal(11);
  });
});

describe('Allergies List Config', () => {
  it('should map all allergies to a list', () => {
    const pdfList = buildAllergiesPDFList(allergies.entry);
    expect(pdfList.length).to.equal(allergies.entry.length);
  });

  it('should contain 3 values', () => {
    const pdfList = buildAllergiesPDFList(allergies.entry);
    expect(pdfList[0].sections[0].items.length).to.equal(3);
  });
});

describe('VA prescription Config', () => {
  it('should create "Most recent prescription" section', () => {
    const pdfGen = buildVAPrescriptionPDFList(prescriptionDetails);
    expect(pdfGen[0].header).to.equal('Most recent prescription');
  });

  it('should create "Refill history" section if there is 1 record with dispensedDate NOT undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should NOT create "Refill history" section if there is 1 record with dispensedDate undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(rxDetails);
    expect(pdfGen[1]).to.not.exist;
  });

  it('should NOT create "Refill history" section if there are NO records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
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
    rxDetails.dispensedDate = undefined;
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
    const testVal =
      pdfList[0].sections[0].items[pdfList[0].sections[0].items.length - 1]
        .value;
    expect(testVal).to.equal('test');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails);
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails);
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should display PendingMed status description if NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails);
    const status = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(status.value).to.match(
      /This is a new prescription from your provider/,
    );
  });

  it('should display PendingMed status description if Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails);
    const status = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(status.value).to.match(/This is a renewal you requested/);
  });
});

describe('Non VA prescription Config', () => {
  it('should contain 7 values', () => {
    const pdfGen = buildNonVAPrescriptionPDFList(nonVAPrescription);
    expect(pdfGen[0].sections[0].items.length).to.equal(7);
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildNonVAPrescriptionPDFList(blankPrescription);
    expect(pdfList[0].sections[0].items[5].value).to.equal('test');
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

describe('CernerPilot feature flag tests', () => {
  it('should use V1 status definitions when CernerPilot is disabled', () => {
    const testPrescriptions = [
      {
        prescriptionId: 12345,
        prescriptionName: 'Test Med',
        dispStatus: 'Active: Refill in Process',
        refillStatus: 'refillinprocess',
        prescriptionSource: 'VA',
      },
    ];
    const pdfList = buildPrescriptionsPDFList(testPrescriptions, false);

    // Should use original V1 status without transformation
    const statusItem = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('Active: Refill in Process');
    expect(statusItem.value).to.not.include('In progress');
  });

  it('should use V2 status definitions when CernerPilot is enabled', () => {
    const testPrescriptions = [
      {
        prescriptionId: 12345,
        prescriptionName: 'Test Med',
        dispStatus: 'Active: Refill in Process',
        refillStatus: 'refillinprocess',
        prescriptionSource: 'VA',
      },
    ];
    const pdfList = buildPrescriptionsPDFList(testPrescriptions, true);

    // Should transform to V2 status and use V2 definitions
    const statusItem = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('In progress');
    expect(statusItem.value).to.include(
      'A new prescription or a prescription you’ve requested a refill or renewal for.',
    );
    expect(statusItem.value).to.not.include('Active: Refill in Process');
  });

  it('should map various V1 statuses to V2 equivalents when CernerPilot is enabled', () => {
    const testCases = [
      { v1Status: 'Active: Submitted', v2Expected: 'In progress' },
      { v1Status: 'Expired', v2Expected: 'Inactive' },
      { v1Status: 'Discontinued', v2Expected: 'Inactive' },
      { v1Status: 'Active: On Hold', v2Expected: 'Inactive' },
      { v1Status: 'Active: Parked', v2Expected: 'Active' },
      { v1Status: 'Transferred', v2Expected: 'Transferred' },
    ];

    testCases.forEach(({ v1Status, v2Expected }) => {
      const testPrescriptions = [
        {
          prescriptionId: 12345,
          prescriptionName: 'Test Med',
          dispStatus: v1Status,
          prescriptionSource: 'VA',
        },
      ];
      const pdfList = buildPrescriptionsPDFList(testPrescriptions, true);
      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include(
        v2Expected,
        `Failed for status: ${v1Status}`,
      );
    });
  });

  it('should use V2 status definitions for single prescription PDF when CernerPilot is enabled', () => {
    const testPrescription = {
      ...prescriptionDetails.data.attributes,
      dispStatus: 'Active: Refill in Process',
      refillStatus: 'refillinprocess',
    };
    const pdfList = buildVAPrescriptionPDFList(testPrescription, true);

    // Should use V2 definitions with more descriptive text
    const statusItem = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('In progress');
    expect(statusItem.value).to.include(
      'A new prescription or a prescription you’ve requested a refill or renewal for.',
    );
  });

  it('should use V1 status definitions for single prescription PDF when CernerPilot is disabled', () => {
    const testPrescription = {
      ...prescriptionDetails.data.attributes,
      dispStatus: 'Active: Refill in Process',
      refillStatus: 'refillinprocess',
    };
    const pdfList = buildVAPrescriptionPDFList(testPrescription, false);

    // Should use original V1 status
    const statusItem = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('Active: Refill in Process');
    expect(statusItem.value).to.not.include('In progress');
  });

  it('should handle edge cases with unknown statuses when CernerPilot is enabled', () => {
    const testPrescriptions = [
      {
        prescriptionId: 12345,
        prescriptionName: 'Test Med',
        dispStatus: 'Unknown Status',
        prescriptionSource: 'VA',
      },
    ];
    const pdfList = buildPrescriptionsPDFList(testPrescriptions, true);

    // Unknown statuses should map to "Status not available"
    const statusItem = pdfList[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('Status not available');
  });

  it('should preserve Active: Non-VA status regardless of CernerPilot flag', () => {
    const testPrescriptions = [
      {
        prescriptionId: 12345,
        prescriptionName: 'Test Med',
        dispStatus: 'Active: Non-VA',
        prescriptionSource: 'NV',
      },
    ];

    // Test both CernerPilot enabled and disabled
    const pdfListV1 = buildPrescriptionsPDFList(testPrescriptions, false);
    const pdfListV2 = buildPrescriptionsPDFList(testPrescriptions, true);

    const statusItemV1 = pdfListV1[0].sections[0].items.find(
      item => item.title === 'Status',
    );
    const statusItemV2 = pdfListV2[0].sections[0].items.find(
      item => item.title === 'Status',
    );

    // Both should show Active: Non-VA
    expect(statusItemV1).to.exist;
    expect(statusItemV1.value).to.include('Active: Non-VA');
    expect(statusItemV2).to.exist;
    expect(statusItemV2.value).to.include('Active: Non-VA');
  });
});
