module.exports = {
  reportTypes: {
    appointments: [
      {
        value: 'futureappointment',
        label: 'Future VA Appointments',
      },
      {
        value: 'pastappointment',
        label: 'Past VA Appointments (limited to past 2 years)',
      },
    ],
    medications: [
      {
        value: 'prescription',
        label: 'VA Medication History',
      },
      {
        value: 'medication',
        label: 'Medications and Supplements, Self-Reported',
      },
    ],
    labs: [
      {
        value: 'labsandtest',
        label: 'VA Laboratory Results',
        hold: 3,
      },
      {
        value: 'vapatholog',
        label: 'VA Pathology Reports',
        hold: 14,
      },
      {
        value: 'varadiolog',
        label: 'VA Radiology Reports',
        hold: 3,
      },
      {
        value: 'vaek',
        label: 'VA Electrocardiogram (EKG) History performed at VA Treating Facilities',
      },
      {
        value: '',
        label: 'Labs and Tests, Self-Reported',
      },
    ],
    ehr: [
      {
        value: 'vaproblemlis',
        label: 'VA Problem List',
        hold: 3,
      },
      {
        value: 'vaadmissionsanddischarge',
        label: 'VA Admissions and Discharges',
        hold: 3,
      },
      {
        value: 'vaprogressnote',
        label: 'VA Notes from Jan 01, 2013 forward',
        hold: 3,
      },
      {
        value: 'wellnes',
        label: 'VA Wellness Reminders',
      },
    ],
    allergies: [
      {
        value: 'vaallergie',
        label: 'VA Allergies',
      },
      {
        value: 'seiallergie',
        label: 'Allergies, Self-Reported',
      },
    ],
    immunizations: [
      {
        value: 'vaimmunization',
        label: 'VA Immunizations',
      },
      {
        value: 'seiimmunization',
        label: 'Immunizations, Self-Reported',
      },
    ],
    vitals: [
      {
        value: 'vitalsandreading',
        label: 'VA Vitals and Readings',
      },
      {
        value: '',
        label: 'Vitals and Readings, Self-Reported',
      },
    ],
    selfReported: [
      {
        value: 'medicalevent',
        label: 'Medical Events, Self-Reported',
      },
      {
        value: 'familyhealthhistor',
        label: 'Family Health History, Self-Reported',
      },
      {
        value: 'militaryhealthhistor',
        label: 'Military Health History, Self-Reported',
      },
      {
        value: 'treatmentfacilitie',
        label: 'Treatment Facilities, Self-Reported',
      },
      {
        value: 'healthcareprovider',
        label: 'Health Care Providers, Self-Reported',
      },
    ],
    food: [
      {
        value: 'seiactivityjourna',
        label: 'Activity Journal, Self-Reported',
      },
      {
        value: 'seifoodjourna',
        label: 'Food Journal, Self-Reported',
      },
    ],
    goals: [
      {
        value: 'seimygoalscurren',
        label: 'My Goals: Current Goals, Self-Reported',
      },
      {
        value: 'seimygoalscomplete',
        label: 'My Goals: Completed Goals, Self-Reported',
      },
    ],
    demographics: [
      {
        value: 'vademographic',
        label: 'VA Demographics from VA Treating Facilities in the last 3 years',
      },
      {
        value: 'seidemographic',
        label: 'Demographics, Self-Reported',
      },
      {
        value: 'healthinsuranc',
        label: 'Health Insurance, Self-Reported',
      },
    ],
    dod: [
      {
        value: 'dodmilitaryservic',
        label: 'Military Service Information',
      },
    ]
  }
};
