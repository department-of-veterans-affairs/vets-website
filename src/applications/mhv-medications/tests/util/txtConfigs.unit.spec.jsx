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
    expect(txt).to.include('Quantity: 30');
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
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    rxDetails.rxRfRecords[0].dispensedDate = undefined;
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.not.include('Refill history\n');
  });

  it('should not show refill history if there are no records', () => {
    const rxDetails = { ...prescriptionDetails.data.attributes };
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
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
    rxDetails.dispensedDate = undefined; // this is to skip createOriginalFillRecord
    rxDetails.rxRfRecords = [
      { ...rxDetails.rxRfRecords[0] },
      { ...rxDetails.rxRfRecords[0] },
    ];
    const txt = buildVAPrescriptionTXT(rxDetails);
    expect(txt).to.include('Refill history\n');
  });
});

describe('Non VA prescription Config', () => {
  // config rx object to cover all scenarios in function.
  const nonVaRx = {
    ...nonVAPrescription.data.attributes,
    dispStatus: 'Active',
    providerFirstName: null,
  };

  it('should contain prescription name', () => {
    const txt = buildNonVAPrescriptionTXT(nonVaRx);
    const name = `${nonVaRx.prescriptionName ||
      (nonVaRx.dispStatus === 'Active: Non-VA' ? nonVaRx.orderableItem : '')}`;
    expect(txt).to.include(name);
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
});
