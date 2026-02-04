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
  const cernerPilotFlag = false;
  const v2StatusMappingFlag = false;

  it('should map all prescriptions to a list', () => {
    const pdfList = buildPrescriptionsPDFList(
      prescriptions,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfList.length).to.equal(prescriptions.length);
  });

  it('should contain a header with prescription name', () => {
    const pdfList = buildPrescriptionsPDFList(
      prescriptions,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfList[0].header).to.equal(prescriptions[0].prescriptionName);
  });

  it('should handle blank non-required fields', () => {
    const blankPrescriptions = [
      {
        prescriptionId: 123456,
      },
    ];
    const pdfList = buildPrescriptionsPDFList(
      blankPrescriptions,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

    expect(pdfList[0].sections[0].items[2].value).to.equal(
      `${FIELD_NONE_NOTED} - ${pdfDefaultStatusDefinition[0].value}`,
    );
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is NewOrder', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'NewOrder';
    const pdfList = buildPrescriptionsPDFList(
      prescriptions,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
    expect(items).to.not.include('Prescription number:');
    expect(pdfList[0].sections[0].items.length).to.equal(11);
  });

  it('should NOT display "Last filled on" or "Prescription number" if rx prescription source is PD and dispStatus is Renew', () => {
    prescriptions[0].prescriptionSource = 'PD';
    prescriptions[0].dispStatus = 'Renew';
    const pdfList = buildPrescriptionsPDFList(
      prescriptions,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

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
  const cernerPilotFlag = false;
  const v2StatusMappingFlag = false;

  it('should create "Most recent prescription" section', () => {
    const pdfGen = buildVAPrescriptionPDFList(
      prescriptionDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[0].header).to.equal('Most recent prescription');
  });

  it('should create "Refill history" section if there is 1 record with dispensedDate NOT undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should NOT create "Refill history" section if there is 1 record with dispensedDate undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const pdfGen = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[1]).to.not.exist;
  });

  it('should NOT create "Refill history" section if there are NO records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[1]).to.not.exist;
  });

  it('should create "Refill history" section if there are NO records but original fill record is created', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.rxRfRecords = [];
    const pdfGen = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should create "Refill history" section if there are 2 records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [
      { ...rxDetails.rxRfRecords[0] },
      { ...rxDetails.rxRfRecords[0] },
    ];
    const pdfGen = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    expect(pdfGen[1].header).to.equal('Refill history');
  });

  it('should handle single name provider', () => {
    const blankPrescription = {
      providerLastName: 'test',
    };
    const pdfList = buildVAPrescriptionPDFList(
      blankPrescription,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    const testVal =
      pdfList[0].sections[0].items[pdfList[0].sections[0].items.length - 1]
        .value;
    expect(testVal).to.equal('test');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
    const items = pdfList[0].sections[0].items.map(item => item.label);
    expect(items).to.not.include('Last filled on:');
  });

  it('should display PendingMed status description if NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
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

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );
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

  describe('Cerner pilot and V2 status mapping feature flags enabled', () => {
    const cernerPilotFlag = true;
    const v2StatusMappingFlag = true;

    describe('VA Prescription config', () => {
      const rxDetails = { ...prescriptionDetails.data.attributes };
      const pdfGen = buildVAPrescriptionPDFList(
        rxDetails,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );
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
      const pdfGen = buildNonVAPrescriptionPDFList(
        nonVAPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );
      const items = pdfGen[0].sections[0].items.map(item => item.title);

      it('should NOT show "Reason for Use" field', () => {
        expect(items).to.not.include('Reason for use:');
      });
    });
  });
});

describe('Grouped medications with missing prescription number', () => {
  const cernerPilotFlag = false;
  const v2StatusMappingFlag = false;

  it('displays "Not available" when prescription number is null', () => {
    const rxDetails = {
      ...prescriptionDetails.data.attributes,
      groupedMedications: [
        {
          prescriptionNumber: null,
          sortedDispensedDate: '2024-01-15',
          quantity: 30,
          orderedDate: '2024-01-10',
          providerFirstName: 'John',
          providerLastName: 'Doe',
        },
      ],
    };

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

    // The grouped medications section should be the second item in the array
    const groupedSection = pdfList.find(
      section => section.header === 'Previous prescriptions',
    );
    expect(groupedSection).to.exist;
    expect(groupedSection.sections[1].header).to.equal(
      'Prescription number: Not available',
    );
  });

  it('displays "Not available" when prescription number is undefined', () => {
    const rxDetails = {
      ...prescriptionDetails.data.attributes,
      groupedMedications: [
        {
          // prescriptionNumber is intentionally omitted
          sortedDispensedDate: '2024-01-15',
          quantity: 30,
          orderedDate: '2024-01-10',
          providerFirstName: 'John',
          providerLastName: 'Doe',
        },
      ],
    };

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

    const groupedSection = pdfList.find(
      section => section.header === 'Previous prescriptions',
    );
    expect(groupedSection).to.exist;
    expect(groupedSection.sections[1].header).to.equal(
      'Prescription number: Not available',
    );
  });

  it('displays actual prescription number when present', () => {
    const rxDetails = {
      ...prescriptionDetails.data.attributes,
      groupedMedications: [
        {
          prescriptionNumber: '1234567',
          sortedDispensedDate: '2024-01-15',
          quantity: 30,
          orderedDate: '2024-01-10',
          providerFirstName: 'John',
          providerLastName: 'Doe',
        },
      ],
    };

    const pdfList = buildVAPrescriptionPDFList(
      rxDetails,
      cernerPilotFlag,
      v2StatusMappingFlag,
    );

    const groupedSection = pdfList.find(
      section => section.header === 'Previous prescriptions',
    );
    expect(groupedSection).to.exist;
    expect(groupedSection.sections[1].header).to.equal(
      'Prescription number: 1234567',
    );
  });
});

describe('Feature flag tests for status formatting', () => {
  const createTestPrescription = (
    dispStatus,
    prescriptionSource = 'VA',
    refillStatus = null,
  ) => [
    {
      prescriptionId: 12345,
      prescriptionName: 'Test Med',
      dispStatus,
      refillStatus,
      prescriptionSource,
    },
  ];

  describe('Both CernerPilot and V2StatusMapping flags disabled', () => {
    const cernerPilotFlag = false;
    const v2StatusMappingFlag = false;

    it('uses V1 status format for Active: Refill in Process', () => {
      const testPrescriptions = createTestPrescription(
        'Active: Refill in Process',
        'VA',
        'refillinprocess',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Refill in Process');
      expect(statusItem.value).to.not.include('In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Non-VA');
    });

    it('uses V1 status for single prescription Active: Refill in Process', () => {
      const testPrescription = {
        ...prescriptionDetails.data.attributes,
        dispStatus: 'Active: Refill in Process',
        refillStatus: 'refillinprocess',
      };
      const pdfList = buildVAPrescriptionPDFList(
        testPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Refill in Process');
      expect(statusItem.value).to.not.include('In progress');
    });
  });

  describe('Only cernerPilot flag enabled', () => {
    const cernerPilotFlag = true;
    const v2StatusMappingFlag = false;

    it('uses V1 status format for Active: Refill in Process', () => {
      const testPrescriptions = createTestPrescription(
        'Active: Refill in Process',
        'VA',
        'refillinprocess',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Refill in Process');
      expect(statusItem.value).to.not.include('In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Non-VA');
    });
  });

  describe('Only v2StatusMapping flag enabled', () => {
    const cernerPilotFlag = false;
    const v2StatusMappingFlag = true;

    it('uses V1 status format for Active: Refill in Process', () => {
      const testPrescriptions = createTestPrescription(
        'Active: Refill in Process',
        'VA',
        'refillinprocess',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Refill in Process');
      expect(statusItem.value).to.not.include('In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Non-VA');
    });
  });

  describe('Both cernerPilot and v2StatusMapping flags enabled', () => {
    const cernerPilotFlag = true;
    const v2StatusMappingFlag = true;

    it('uses V2 status format for In progress', () => {
      const testPrescriptions = createTestPrescription(
        'In progress',
        'VA',
        'inprogress',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('In progress');
      expect(statusItem.value).to.include(
        'A new prescription or a prescription you’ve requested',
      );
      expect(statusItem.value).to.not.include('Active: Refill in Process');
    });

    it('uses V2 definition for Active status', () => {
      const testPrescriptions = createTestPrescription(
        'Active',
        'VA',
        'active',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active');
      expect(statusItem.value).to.include(
        'A prescription you can fill at a local VA pharmacy',
      );
    });

    it('uses V2 definition for In progress status', () => {
      const testPrescriptions = createTestPrescription(
        'In progress',
        'VA',
        'inprogress',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('In progress');
      expect(statusItem.value).to.include(
        'A new prescription or a prescription you’ve requested a refill or renewal for',
      );
    });

    it('uses V2 definition for Inactive status', () => {
      const testPrescriptions = createTestPrescription(
        'Inactive',
        'VA',
        'inactive',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Inactive');
      expect(statusItem.value).to.include(
        'A prescription you can no longer fill',
      );
    });

    it('uses V2 definition for Transferred status', () => {
      const testPrescriptions = createTestPrescription(
        'Transferred',
        'VA',
        'transferred',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Transferred');
      expect(statusItem.value).to.include(
        'A prescription moved to VA’s new electronic health record',
      );
    });

    it('uses V2 definition for Status not available', () => {
      const testPrescriptions = createTestPrescription(
        'Status not available',
        'VA',
        'statusNotAvailable',
      );
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Status not available');
      expect(statusItem.value).to.include('There’s a problem with our system');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const pdfList = buildPrescriptionsPDFList(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Active: Non-VA');
    });

    it('uses V2 status for single prescription In progress', () => {
      const testPrescription = {
        ...prescriptionDetails.data.attributes,
        dispStatus: 'In progress',
        refillStatus: 'inprogress',
      };
      const pdfList = buildVAPrescriptionPDFList(
        testPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('In progress');
      expect(statusItem.value).to.include(
        'A new prescription or a prescription you’ve requested a refill or renewal for.',
      );
    });

    it('handles single prescription Status not available', () => {
      const testPrescription = {
        ...prescriptionDetails.data.attributes,
        dispStatus: 'Status not available',
        refillStatus: 'statusNotAvailable',
      };
      const pdfList = buildVAPrescriptionPDFList(
        testPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      const statusItem = pdfList[0].sections[0].items.find(
        item => item.title === 'Status',
      );
      expect(statusItem).to.exist;
      expect(statusItem.value).to.include('Status not available');
      expect(statusItem.value).to.include('There’s a problem with our system');
    });
  });
});
