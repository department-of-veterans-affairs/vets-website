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

  describe('Cerner pilot feature flag', () => {
    describe('VA Prescription config', () => {
      const rxDetails = { ...prescriptionDetails.data.attributes };
      const txt = buildVAPrescriptionTXT(rxDetails, true);

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
        true,
      );

      it('should NOT show "Reason for Use" field', () => {
        expect(txt).to.not.include('Reason for use:');
      });
    });
  });
});

describe('CernerPilot and V2StatusMapping feature flag tests', () => {
  // Shared test data
  const FLAG_COMBINATIONS = [
    { cernerPilot: false, v2StatusMapping: false, useV2: false, desc: 'both flags disabled' },
    { cernerPilot: true, v2StatusMapping: false, useV2: false, desc: 'only cernerPilot enabled' },
    { cernerPilot: false, v2StatusMapping: true, useV2: false, desc: 'only v2StatusMapping enabled' },
    { cernerPilot: true, v2StatusMapping: true, useV2: true, desc: 'both flags enabled' },
  ];

  const V1_TO_V2_STATUS_MAPPINGS = [
    { v1Status: 'Active: Submitted', v2Expected: 'In progress' },
    { v1Status: 'Active: Refill in Process', v2Expected: 'In progress' },
    { v1Status: 'Expired', v2Expected: 'Inactive' },
    { v1Status: 'Discontinued', v2Expected: 'Inactive' },
    { v1Status: 'Active: On Hold', v2Expected: 'Inactive' },
    { v1Status: 'Active: Parked', v2Expected: 'Active' },
    { v1Status: 'Transferred', v2Expected: 'Transferred' },
    { v1Status: 'NewOrder', v2Expected: 'In progress' },
    { v1Status: 'Renew', v2Expected: 'In progress' },
    { v1Status: 'Unknown', v2Expected: 'Status not available' },
  ];

  const createTestPrescription = (dispStatus, prescriptionSource = 'VA') => [{
    prescriptionId: 12345,
    prescriptionName: 'Test Med',
    dispStatus,
    prescriptionSource,
  }];

  describe('CernerPilot and  V2StatusMapping flag requirement validation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, useV2, desc }) => {
      it(`uses ${useV2 ? 'V2' : 'V1'} status formatting when ${desc}`, () => {
        const testPrescriptions = createTestPrescription('Active: Refill in Process');
        const txt = buildPrescriptionsTXT(testPrescriptions, cernerPilot, v2StatusMapping);

        if (useV2) {
          expect(txt).to.include('Status: In progress');
          expect(txt).to.not.include('Active: Refill in Process');
        } else {
          expect(txt).to.include('Status: Active: Refill in Process');
          expect(txt).to.not.include('Status: In progress');
        }
      });
    });
  });

  describe('V1 to V2 status mappings when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    V1_TO_V2_STATUS_MAPPINGS.forEach(({ v1Status, v2Expected }) => {
      it(`maps ${v1Status} to ${v2Expected}`, () => {
        const prescriptionSource = ['NewOrder', 'Renew'].includes(v1Status) ? 'PD' : 'VA';
        const testPrescriptions = createTestPrescription(v1Status, prescriptionSource);
        const txt = buildPrescriptionsTXT(testPrescriptions, true, true);
        expect(txt).to.include(`Status: ${v2Expected}`);
      });
    });
  });

  describe('V2 status definitions when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const V2_DEFINITIONS = [
      { status: 'Active', includes: 'A prescription you can fill at a local VA pharmacy' },
      { status: 'In progress', includes: 'A new prescription or a prescription' },
      { status: 'Inactive', includes: 'A prescription that is expired' },
      { status: 'Transferred', includes: 'A prescription moved to VA' },
    ];

    V2_DEFINITIONS.forEach(({ status, includes }) => {
      it(`includes correct definition for ${status} status`, () => {
        const dispStatus = status === 'In progress' ? 'Active: Refill in Process' :
          status === 'Inactive' ? 'Expired' : status;
        const testPrescriptions = createTestPrescription(dispStatus);
        const txt = buildPrescriptionsTXT(testPrescriptions, true, true);
        expect(txt).to.include(includes);
      });
    });
  });

  describe('Non-VA status preservation', () => {
    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`preserves Active: Non-VA status when ${desc}`, () => {
        const testPrescriptions = createTestPrescription('Active: Non-VA', 'NV');
        const txt = buildPrescriptionsTXT(testPrescriptions, cernerPilot, v2StatusMapping);
        expect(txt).to.include('Status: Active: Non-VA');
      });
    });
  });

  describe('V1 status preservation when BOTH CernerPilot and  V2StatusMapping flags disabled', () => {
    const V1_STATUSES = [
      'Active: Refill in Process',
      'Active: Parked',
      'Active: Submitted',
      'Active: On Hold',
      'Expired',
      'Discontinued',
      'Transferred',
    ];

    V1_STATUSES.forEach(dispStatus => {
      it(`preserves ${dispStatus} status`, () => {
        const testPrescriptions = createTestPrescription(dispStatus);
        const txt = buildPrescriptionsTXT(testPrescriptions, false, false);
        expect(txt).to.include(`Status: ${dispStatus}`);
      });
    });
  });

  it('handles unknown statuses when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const testPrescriptions = createTestPrescription('Unknown Status');
    const txt = buildPrescriptionsTXT(testPrescriptions, true, true);
    expect(txt).to.include('Status: Status not available');
  });

  it('shows Status not available for null dispStatus when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const testPrescriptions = createTestPrescription(null);
    const txt = buildPrescriptionsTXT(testPrescriptions, true, true);
    expect(txt).to.include('Status: Status not available');
  });

  it('uses V2 status for single prescription TXT when BOTH CernerPilot and  V2StatusMapping flags enabled', () => {
    const testPrescription = {
      ...prescriptionDetails,
      dispStatus: 'Active: Refill in Process',
      refillStatus: 'refillinprocess',
    };
    const txt = buildVAPrescriptionTXT(testPrescription, true, true);
    expect(txt).to.include('Status: In progress');
    expect(txt).to.not.include('Active: Refill in Process');
  });

  it('uses V1 status for single prescription TXT when BOTH CernerPilot and  V2StatusMapping flags disabled', () => {
    const testPrescription = {
      ...prescriptionDetails,
      dispStatus: 'Active: Refill in Process',
      refillStatus: 'refillinprocess',
    };
    const txt = buildVAPrescriptionTXT(testPrescription, false, false);
    expect(txt).to.include('Status: Active: Refill in Process');
    expect(txt).to.not.include('In progress');
  });
});
