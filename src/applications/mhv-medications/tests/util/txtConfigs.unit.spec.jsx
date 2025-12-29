import { expect } from 'chai';
import {
  buildPrescriptionsTXT,
  buildAllergiesTXT,
  buildVAPrescriptionTXT,
  buildNonVAPrescriptionTXT,
} from '../../util/txtConfigs';
import prescriptions from '../fixtures/prescriptions.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import nonVAPrescription from '../fixtures/nonVaPrescription.json';
import { validateField, convertHtmlForDownload } from '../../util/helpers';
import { DOWNLOAD_FORMAT } from '../../util/constants';

describe('Prescriptions List Txt Config', () => {
  it('Should show all rxs with prescription name', () => {
    const txt = buildPrescriptionsTXT(prescriptions);
    prescriptions.filter(rx => !!rx.prescriptionName).forEach(rx => {
      expect(txt).to.include(rx.prescriptionName);
    });
  });
  it('Should show "Provider name not available" if provider name is not provided', () => {
    const firstPrescriptionWithoutProviderName = [
      {
        ...prescriptions[0],
        providerFirstName: null,
        providerLastName: null,
      },
    ];
    const txt = buildPrescriptionsTXT(firstPrescriptionWithoutProviderName);
    expect(txt).to.include('Prescribed by: Provider name not available');
  });
});

describe('Allergies List Config', () => {
  const allergies = [
    {
      id: 1234,
      type: 'Medication',
      name: 'Penicillin',
      date: 'January 1, 2024',
      reaction: ['Abdominal pain', 'headaches'],
      location: 'SLC10 TEST LAB',
      observedOrReported:
        'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
      notes: 'Unit test',
    },
    {
      id: 1234,
      type: 'Medication',
      name: 'Penicillin',
      date: 'January 1, 2024',
      reaction: [],
      location: 'SLC10 TEST LAB',
      observedOrReported:
        'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
      notes: 'Unit test',
    },
  ];
  it('should handle no allergies', () => {
    const txt = buildAllergiesTXT([]);
    const msg =
      'There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.';
    expect(txt).to.include(msg);
  });
  it('should show all allergy names', () => {
    const txt = buildAllergiesTXT(allergies);
    allergies.filter(allergy => !!allergy.name).forEach(allergy => {
      expect(txt).to.include(allergy.name);
    });
  });
  it('should show try again message when allergies is falsy', () => {
    const txt = buildAllergiesTXT(null);
    const msg =
      'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.';
    expect(txt).to.include(msg);
  });
});

describe('VA prescription Config', () => {
  it('should create "Most recent prescription" section', () => {
    const txt = buildVAPrescriptionTXT(prescriptionDetails.data.attributes);
    expect(txt).to.include('Most recent prescription');
    expect(txt).to.include(
      prescriptionDetails.data.attributes.prescriptionName,
    );
  });

  it('should show refill information', () => {
    const txt = buildVAPrescriptionTXT(prescriptionDetails.data.attributes);
    expect(txt).to.include('Refill history\n');
    expect(txt).to.include('Medication description:');
    expect(txt).to.include(
      'Note: If the medication you’re taking doesn’t match this description',
    );
    expect(txt).to.include('Shape: Hexagon');
    expect(txt).to.include('Color: Purple');
  });

  it('should not show refill history if there is 1 record with dispensedDate undefined', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.not.include('Refill history\n');
  });

  it('should not show refill history if there are no records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [];
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.not.include('Refill history\n');
  });

  it('should show refill history if there are no records but original fill record is created', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.rxRfRecords = [];
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.include('Refill history\n');
  });

  it('should show refill history if there are 2 records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined;
    rxDetails.rxRfRecords = [
      { ...rxDetails.rxRfRecords[0] },
      { ...rxDetails.rxRfRecords[0] },
    ];
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.include('Refill history\n');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and dispStatus is NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.prescriptionSource = 'PD';
    rxDetails.dispStatus = 'NewOrder';
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.not.include('Last filled on:');
  });

  it('should NOT display "Last filled on" if rx prescription source is PD and the disp status is Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.prescriptionSource = 'PD';
    rxDetails.dispStatus = 'Renew';
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.not.include('Last filled on:');
  });

  it('should display PendingMed status description if NewOrder', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'NewOrder';
    rxDetails.prescriptionSource = 'PD';
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.match(
      /Status: This is a new prescription from your provider/,
    );
  });

  it('should display PendingMed status description if Renew', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispStatus = 'Renew';
    rxDetails.prescriptionSource = 'PD';
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.match(/Status: This is a renewal you requested/);
  });

  it('should include previous prescriptions section when grouped medications exist', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.groupedMedications = [
      {
        prescriptionNumber: '44444',
        sortedDispensedDate: '2023-12-01',
        quantity: 90,
        orderedDate: '2023-10-15',
      },
      {
        prescriptionNumber: '55555',
        sortedDispensedDate: '2023-09-01',
        quantity: 60,
        orderedDate: '2023-08-01',
      },
    ];

    const txt = buildVAPrescriptionTXT(rxDetails);

    expect(txt).to.include('Previous prescriptions');
    expect(txt).to.include('Showing 2 prescriptions, from newest to oldest');
    expect(txt).to.include('Prescription number: 44444');
    expect(txt).to.include('Prescription number: 55555');
  });

  it('should handle single previous prescription without plural wording', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.groupedMedications = [
      {
        prescriptionNumber: '10101',
        sortedDispensedDate: '2024-07-01',
        quantity: 30,
        orderedDate: '2024-06-01',
      },
    ];

    const txt = buildVAPrescriptionTXT(rxDetails);

    expect(txt).to.include('Showing 1 prescription');
    expect(txt).to.not.include('prescriptions, from newest to oldest');
  });

  it('should handle empty groupedMedications array', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.groupedMedications = [];

    const txt = buildVAPrescriptionTXT(rxDetails);

    expect(txt).to.not.include('Previous prescriptions');
  });
});

describe('Non VA prescription Config', () => {
  // config rx object to cover all scenarios in function.
  const nonVaRx = {
    ...nonVAPrescription.data.attributes,
    dispStatus: 'Active',
    providerFirstName: null,
  };

  it('should list the prescription name', () => {
    const txt = buildNonVAPrescriptionTXT({
      ...nonVaRx,
      prescriptionName: 'YOUR PRESCRIPTION NAME HERE',
      orderableItem: 'YOUR ITEM NAME HERE',
    });
    expect(txt).to.include('YOUR PRESCRIPTION NAME HERE');
    expect(txt).to.not.include('YOUR ITEM NAME HERE');
  });

  it('should list the orderableItem property when prescriptionName is not provided', () => {
    const txt = buildNonVAPrescriptionTXT({
      ...nonVaRx,
      prescriptionName: null,
      orderableItem: 'YOUR ITEM NAME HERE',
    });
    expect(txt).to.include('YOUR ITEM NAME HERE');
  });

  it('should contain facility name', () => {
    const txt = buildNonVAPrescriptionTXT(nonVaRx);
    expect(txt).to.include(
      `Documented at this facility: ${validateField(nonVaRx.facilityName)}`,
    );
  });

  it('should display none noted if no provide name is given', () => {
    const nonVaRxWithoutProviderName = {
      ...nonVaRx,
      providerLastName: null,
    };

    const txt = buildNonVAPrescriptionTXT(nonVaRxWithoutProviderName);
    expect(txt).to.include('Documented by: Provider name not available');
  });
});

describe('Medication Information Config', () => {
  it('should convert HTML to text (string) for TXT', async () => {
    const htmlContent = `<div><p>Test\n</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;

    const txt = await convertHtmlForDownload(htmlContent);
    expect(txt).to.include('- Item 1');
    expect(txt).to.include('- Item 2');
    expect(txt).to.include('Test\n');
  });

  it('should convert HTML to text (array) for PDF', async () => {
    const htmlContent = `<div><p>Test\n</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`;

    const txt = await convertHtmlForDownload(htmlContent, DOWNLOAD_FORMAT.PDF);
    expect(txt).to.be.a('array');
  });

  describe('Cerner pilot and V2 status mapping feature flags enabled', () => {
    const cernerPilotFlag = true;
    const v2StatusMappingFlag = true;

    describe('VA Prescription config', () => {
      const rxDetails = { ...prescriptionDetails.data.attributes };
      const txt = buildVAPrescriptionTXT(
        rxDetails,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      it('should NOT show "Reason for Use" field', () => {
        expect(txt).to.not.include('Reason for use:');
      });

      it('should show "Pharmacy contact information" field', () => {
        expect(txt).to.include(
          'Pharmacy contact information: Check your prescription label or contact your VA facility.',
        );
      });

      it('should NOT create "Refill history" section', () => {
        expect(txt).to.not.include('Refill history\n');
      });
    });

    describe('Non-VA Prescription config', () => {
      const txt = buildNonVAPrescriptionTXT(
        nonVAPrescription.data.attributes,
        { includeSeparators: true },
        cernerPilotFlag,
      );

      it('should NOT show "Reason for Use" field', () => {
        expect(txt).to.not.include('Reason for use:');
      });
    });
  });
});

describe('CernerPilot and V2StatusMapping Feature flag tests for status formatting', () => {
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
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Refill in Process');
      expect(txt).to.not.include('Status: In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Non-VA');
    });

    it('preserves Active: Refill in Process status', () => {
      const testPrescriptions = createTestPrescription(
        'Active: Refill in Process',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Refill in Process');
    });

    it('preserves Active: Parked status', () => {
      const testPrescriptions = createTestPrescription('Active: Parked');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Parked');
    });

    it('preserves Active: Submitted status', () => {
      const testPrescriptions = createTestPrescription('Active: Submitted');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Submitted');
    });

    it('preserves Active: On Hold status', () => {
      const testPrescriptions = createTestPrescription('Active: On Hold');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: On Hold');
    });

    it('preserves Expired status', () => {
      const testPrescriptions = createTestPrescription('Expired');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Expired');
    });

    it('preserves Discontinued status', () => {
      const testPrescriptions = createTestPrescription('Discontinued');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Discontinued');
    });

    it('preserves Transferred status', () => {
      const testPrescriptions = createTestPrescription('Transferred');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Transferred');
    });

    it('uses V1 status for single prescription Active: Refill in Process', () => {
      const testPrescription = {
        ...prescriptionDetails,
        dispStatus: 'Active: Refill in Process',
        refillStatus: 'refillinprocess',
      };
      const txt = buildVAPrescriptionTXT(
        testPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Refill in Process');
      expect(txt).to.not.include('In progress');
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
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Refill in Process');
      expect(txt).to.not.include('Status: In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Non-VA');
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
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Refill in Process');
      expect(txt).to.not.include('Status: In progress');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Non-VA');
    });
  });

  describe('Both CernerPilot and V2StatusMapping flags enabled', () => {
    const cernerPilotFlag = true;
    const v2StatusMappingFlag = true;

    it('uses V2 status format for In progress', () => {
      const testPrescriptions = createTestPrescription(
        'In progress',
        'VA',
        'inprogress',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: In progress');
      expect(txt).to.not.include('Active: Refill in Process');
    });

    it('includes V2 definition for Active status', () => {
      const testPrescriptions = createTestPrescription(
        'Active',
        'VA',
        'active',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active');
      expect(txt).to.include(
        'A prescription you can fill at a local VA pharmacy',
      );
    });

    it('includes V2 definition for In progress status', () => {
      const testPrescriptions = createTestPrescription(
        'In progress',
        'VA',
        'inprogress',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: In progress');
      expect(txt).to.include(
        'A new prescription or a prescription you’ve requested a refill or renewal for',
      );
    });

    it('includes V2 definition for Transferred status', () => {
      const testPrescriptions = createTestPrescription(
        'Transferred',
        'VA',
        'transferred',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Transferred');
      expect(txt).to.include(
        'A prescription moved to VA’s new electronic health record',
      );
    });

    it('includes V2 definition for Status not available', () => {
      const testPrescriptions = createTestPrescription(
        'Status not available',
        'VA',
        'statusNotAvailable',
      );
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Status not available');
      expect(txt).to.include('There’s a problem with our system');
    });

    it('preserves Active: Non-VA status', () => {
      const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
      const txt = buildPrescriptionsTXT(
        testPrescriptions,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: Active: Non-VA');
    });

    it('uses V2 status for single prescription In progress', () => {
      const testPrescription = {
        ...prescriptionDetails,
        dispStatus: 'In progress',
        refillStatus: 'inprogress',
      };
      const txt = buildVAPrescriptionTXT(
        testPrescription,
        cernerPilotFlag,
        v2StatusMappingFlag,
      );

      expect(txt).to.include('Status: In progress');
    });
  });
});
