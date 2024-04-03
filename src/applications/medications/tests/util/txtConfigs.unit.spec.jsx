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
import { validateField } from '../../util/helpers';

describe('Prescriptions List Txt Config', () => {
  it('Should show all rxs with prescription name', () => {
    const txt = buildPrescriptionsTXT(prescriptions);
    prescriptions.filter(rx => !!rx.prescriptionName).forEach(rx => {
      expect(txt).to.include(rx.prescriptionName);
    });
  });
  it('Should show None noted if provider name is not provided', () => {
    const txt = buildPrescriptionsTXT(prescriptions);
    expect(txt).to.include('Prescribed by: None noted');
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
      'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, email us at vamhvfeedback@va.gov.';
    expect(txt).to.include(msg);
  });
});

describe('VA prescription Config', () => {
  it('should create "About your prescription" section', () => {
    const txt = buildVAPrescriptionTXT(prescriptionDetails.data.attributes);
    expect(txt).to.include('About your prescription');
    expect(txt).to.include(
      prescriptionDetails.data.attributes.prescriptionName,
    );
  });

  it('should create "About this medication or supply" section', () => {
    const txt = buildVAPrescriptionTXT(prescriptionDetails);
    expect(txt).to.include('About this medication or supply');
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
    expect(txt).to.include('Documented by: None noted');
  });
});
