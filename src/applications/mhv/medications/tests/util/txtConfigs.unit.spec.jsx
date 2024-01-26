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
    // console.log(txt);
    prescriptions.filter(rx => !!rx.prescriptionName).forEach(rx => {
      expect(txt).to.include(rx.prescriptionName);
    });
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
  it('should contain prescription name', () => {
    const txt = buildNonVAPrescriptionTXT(nonVAPrescription.data.attributes);
    const name = `${nonVAPrescription.data.attributes.prescriptionName ||
      (nonVAPrescription.data.attributes.dispStatus === 'Active: Non-VA'
        ? nonVAPrescription.data.attributes.orderableItem
        : '')}`;
    expect(txt).to.include(name);
  });

  it('should contain facility name', () => {
    const txt = buildNonVAPrescriptionTXT(nonVAPrescription.data.attributes);
    expect(txt).to.include(
      `Documented at this facility: ${validateField(
        nonVAPrescription.data.attributes.facilityName,
      )}`,
    );
  });
});
