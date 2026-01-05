export const vaEvidence = [
  {
    treatmentMonthYear: '2000-01',
    treatmentBefore2005: 'Y',
    issuesVa: {
      Hypertension: true,
      Impotence: true,
      'Left Knee Instability': true,
    },
    treatmentLocation: 'Midwest Alabama VA Facility',
  },
  {
    treatmentBefore2005: 'N',
    issuesVa: {
      Impotence: true,
      'Left Knee Instability': true,
    },
    treatmentLocation: 'South Texas VA Facility',
  },
  {
    treatmentBefore2005: 'N',
    issuesVa: {
      Hypertension: true,
      'Sleep apnea': true,
    },
    treatmentLocation: 'Northeast Kentucky VA Medical Center',
  },
];

export const privateEvidence = [
  {
    treatmentStart: '2019-10-10',
    treatmentEnd: '2019-10-11',
    issuesPrivate: {
      Hypertension: true,
      Impotence: true,
    },
    treatmentLocation: 'Edith Nourse Rogers Memorial',
    address: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '123 Main Street',
      street2: 'Street address 2',
      city: 'San Antonio',
      state: 'TX',
      postalCode: '78258',
    },
    authorization: true,
    lcDetails: 'Testing limited consent',
    lcPrompt: 'Y',
  },
  {
    treatmentStart: '2025-05-05',
    treatmentEnd: '2025-05-06',
    issuesPrivate: {
      Hypertension: true,
      Impotence: true,
    },
    treatmentLocation: 'Northeast Methodist Hospital',
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
    issuesPrivate: {
      Hypertension: true,
      'Tendonitis, left ankle': true,
      Impotence: false,
    },
    treatmentLocation: 'Meadows Neighborhood Hospital',
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
