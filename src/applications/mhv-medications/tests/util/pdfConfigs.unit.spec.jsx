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
    const pdfList = buildPrescriptionsPDFList(prescriptions, false, false);
    expect(pdfList.length).to.equal(prescriptions.length);
  });

  it('should contain a header with prescription name', () => {
    const pdfList = buildPrescriptionsPDFList(prescriptions, false, false);
    expect(pdfList[0].header).to.equal(prescriptions[0].prescriptionName);
  });

  it('should handle blank non-required fields', () => {
    const blankPrescriptions = [
      {
        prescriptionId: 123456,
      },
    ];
    const pdfList = buildPrescriptionsPDFList(blankPrescriptions, false, false);

    expect(pdfList[0].sections[0].items[2].value).to.equal(
      `${FIELD_NONE_NOTED} - ${pdfDefaultStatusDefinition[0].value}`,
    );
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is NewOrder', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'NewOrder';
    const pdfList = buildPrescriptionsPDFList(prescriptions, false, false);

    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
    expect(items).to.not.include('Prescription number:');
    expect(pdfList[0].sections[0].items.length).to.equal(11);
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is Renew', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'Renew';
    const pdfList = buildPrescriptionsPDFList(prescriptions, false, false);

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
    const pdfGen = buildVAPrescriptionPDFList(prescriptionDetails, false, false);
    expect(pdfGen[0].header).to.equal('Most recent prescription');
  });

  it('should create "Refill history" section if there is 1 record with dispensedDate NOT undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(rxDetails, false, false);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should NOT create "Refill history" section if there is 1 record with dispensedDate undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(rxDetails, false, false);
    expect(pdfGen[1]).to.not.exist;
  });

  it('should NOT create "Refill history" section if there are NO records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails, false, false);
    expect(pdfGen[1]).to.not.exist;
  });

  it('should create "Refill history" section if there are NO records but original fill record is created', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails, false, false);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should create "Refill history" section if there are 2 records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [
      { ...rxDetails.rxRfRecords[0] },
      { ...rxDetails.rxRfRecords[0] },
    ];
    const pdfGen = buildVAPrescriptionPDFList(rxDetails, false, false);
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildVAPrescriptionPDFList(blankPrescription, false, false);
    const testVal =
      pdfList[0].sections[0].items[pdfList[0].sections[0].items.length - 1]
        .value;
    expect(testVal).to.equal('test');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails, false, false);
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails, false, false);
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should display PendingMed status description if NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(rxDetails, false, false);
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

    const pdfList = buildVAPrescriptionPDFList(rxDetails, false, false);
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

  describe('Cerner pilot feature flag', () => {
    describe('VA Prescription config', () => {
      const rxDetails = { ...prescriptionDetails.data.attributes };
      const pdfGen = buildVAPrescriptionPDFList(rxDetails, true, true);
      const items = pdfGen[0].sections[0].items.map(item => item.title);

      it('should NOT show "Reason for Use" field', () => {
        expect(items).to.not.include('Reason for use:');
      });
      it('should show "Pharmacy contact information" field', () => {
        const status = pdfGen[0].sections[0].items.find(
          item => item.title === 'Pharmacy contact information',
        );
        expect(status.value).to.match(
          /Check your prescription label or contact your VA facility./,
        );
      });
      it('should NOT create "Refill history" section', () => {
        expect(pdfGen[1]).to.not.exist;
      });
    });

    describe('Non-VA Prescription config', () => {
      const pdfGen = buildNonVAPrescriptionPDFList(nonVAPrescription, true, true);
      const items = pdfGen[0].sections[0].items.map(item => item.title);

      it('should NOT show "Reason for Use" field', () => {
        expect(items).to.not.include('Reason for use:');
      });
    });
  });
});

describe('CernerPilot feature flag tests', () => {
  const FLAG_COMBINATIONS = [
    { cernerPilot: false, v2StatusMapping: false, useV2: false, desc: 'both flags disabled' },
    { cernerPilot: true, v2StatusMapping: false, useV2: false, desc: 'only cernerPilot enabled' },
    { cernerPilot: false, v2StatusMapping: true, useV2: false, desc: 'only v2StatusMapping enabled' },
    { cernerPilot: true, v2StatusMapping: true, useV2: true, desc: 'both flags enabled' },
  ];

  const V1_TO_V2_STATUS_MAPPINGS = [
    { v1Status: 'Active: Submitted', v2Expected: 'In progress' },
    { v1Status: 'Expired', v2Expected: 'Inactive' },
    { v1Status: 'Discontinued', v2Expected: 'Inactive' },
    { v1Status: 'Active: On Hold', v2Expected: 'Inactive' },
    { v1Status: 'Active: Parked', v2Expected: 'Active' },
    { v1Status: 'Transferred', v2Expected: 'Transferred' },
  ];

  const createTestPrescription = (dispStatus, prescriptionSource = 'VA') => [{
    prescriptionId: 12345,
    prescriptionName: 'Test Med',
    dispStatus,
    prescriptionSource,
  }];
  describe('dual flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`uses ${useV2 ? 'V2' : 'V1'} status definitions when ${desc}`, () => {
        const testPrescriptions = createTestPrescription('Active: Refill in Process');
        testPrescriptions[0].refillStatus = 'refillinprocess';
        const pdfList = buildPrescriptionsPDFList(testPrescriptions, cernerPilot, v2StatusMapping);

        const statusItem = pdfList[0].sections[0].items.find(item => item.title === 'Status');
        expect(statusItem).to.exist;

        if (useV2) {
          expect(statusItem.value).to.include('In progress');
          expect(statusItem.value).to.not.include('Active: Refill in Process');
        } else {
          expect(statusItem.value).to.include('Active: Refill in Process');
          expect(statusItem.value).to.not.include('In progress');
        }
      });
    });
  });

  describe('V1 to V2 status mappings when both flags enabled', () => {
    V1_TO_V2_STATUS_MAPPINGS.forEach(({ v1Status, v2Expected }) => {
      it(`maps ${v1Status} to ${v2Expected}`, () => {
        const testPrescriptions = createTestPrescription(v1Status);
        const pdfList = buildPrescriptionsPDFList(testPrescriptions, true, true);
        const statusItem = pdfList[0].sections[0].items.find(item => item.title === 'Status');
        expect(statusItem).to.exist;
        expect(statusItem.value).to.include(v2Expected);
      });
    });
  });

  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Active: Non-VA status when ${desc}`, () => {
        const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
        const pdfList = buildPrescriptionsPDFList(testPrescriptions, cernerPilot, v2StatusMapping);
        const statusItem = pdfList[0].sections[0].items.find(item => item.title === 'Status');
        expect(statusItem).to.exist;
        expect(statusItem.value).to.include('Active: Non-VA');
      });
    });
  });

  it('uses V2 status definitions for single prescription PDF when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const testPrescription = {
      ...prescriptionDetails.data.attributes,
      dispStatus: 'Active: Refill in Process',
      refillStatus: 'refillinprocess',
    };
    const pdfList = buildVAPrescriptionPDFList(testPrescription, true, true);

    const statusItem = pdfList[0].sections[0].items.find(item => item.title === 'Status');
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('In progress');
    expect(statusItem.value).to.include(
      'A new prescription or a prescription you’ve requested a refill or renewal for.',
    );
  });

  it('handles edge cases with unknown statuses when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const testPrescriptions = createTestPrescription('Unknown Status');
    const pdfList = buildPrescriptionsPDFList(testPrescriptions, true, true);

    const statusItem = pdfList[0].sections[0].items.find(item => item.title === 'Status');
    expect(statusItem).to.exist;
    expect(statusItem.value).to.include('Status not available');
  });
});
