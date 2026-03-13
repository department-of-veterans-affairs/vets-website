export const vaEvidence = [
  {
    treatmentMonthYear: '2000-01',
    treatmentBefore2005: 'Y',
    vaTreatmentLocation: 'Midwest Alabama VA Facility',
  },
  {
    treatmentBefore2005: 'N',
    vaTreatmentLocation: 'South Texas VA Facility',
  },
  {
    treatmentBefore2005: 'N',
    vaTreatmentLocation: 'Northeast Kentucky VA Medical Center',
  },
];

export const privateEvidence = [
  {
    treatmentStart: '2019-10-10',
    treatmentEnd: '2019-10-11',
    issues: {
      Hypertension: true,
      Impotence: true,
    },
    privateTreatmentLocation: 'Edith Nourse Rogers Memorial',
    address: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '123 Main Street',
      street2: 'Street address 2',
      city: 'San Antonio',
      state: 'TX',
      postalCode: '78258',
    },
  },
  {
    treatmentStart: '2025-05-05',
    treatmentEnd: '2025-05-06',
    issues: {
      Hypertension: true,
      Impotence: true,
    },
    privateTreatmentLocation: 'Northeast Methodist Hospital',
    address: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '456 Elm',
      city: 'San Antonio',
      state: 'TX',
      postalCode: '78258',
    },
  },
  {
    treatmentStart: '1997-08-01',
    treatmentEnd: '2025-05-06',
    issues: {
      Hypertension: true,
      'Tendonitis, left ankle': true,
      Impotence: false,
    },
    privateTreatmentLocation: 'Meadows Neighborhood Hospital',
    address: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '901 N.W. 45th St',
      city: 'San Diego',
      state: 'CA',
      postalCode: '90231',
    },
  },
];
