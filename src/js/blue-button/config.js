module.exports = {
  reportTypes: {
    appointments: {
      title: 'Appointments',
      children: [
        {
          value: 'futureappointments',
          label: 'Future VA Appointments',
        },
        {
          value: 'pastappointments',
          label: 'Past VA Appointments (limited to past 2 years)',
        },
      ],
    },
    medications: {
      title: 'Medications (automatically includes Allergy information)',
      children: [
        {
          value: 'prescriptions',
          label: 'VA Medication History',
        },
        {
          value: 'medications',
          label: 'Medications and Supplements, Self-Reported',
        },
      ],
    },
    labs: {
      title: 'Labs and Tests',
      children: [
        {
          value: 'labsandtests',
          label: 'VA Laboratory Results',
          hold: 3,
          holdExplanation: 'VA Laboratory Results are available 3 calendar days after they have been verified. Depending on the type of tests, some of your laboratory results may not be available right away.',
        },
        {
          value: 'vapathology',
          label: 'VA Pathology Reports',
          hold: 14,
          holdExplanation: 'VA Pathology Reports are available 14 calendar days after they have been completed. Some studies done at a non-VA facility may not be available or they may not necessarily include an interpretation.',
        },
        {
          value: 'varadiology',
          label: 'VA Radiology Reports',
          hold: 3,
          holdExplanation: 'VA Radiology Reports are available 3 calendar days after they have been completed. Some studies done at a non-VA facility may not be available or they may not necessarily include an interpretation.',
        },
        {
          value: 'vaekg',
          label: 'VA Electrocardiogram (EKG) History performed at VA Treating Facilities',
        },
        {
          value: '',
          label: 'Labs and Tests, Self-Reported',
        },
      ],
    },
    ehr: {
      title: 'VA Electronic Health Record History and Wellness Reminders',
      children: [
        {
          value: 'vaproblemlist',
          label: 'VA Problem List',
          hold: 3,
          holdExplanation: 'Your VA Problem List contains active health problems your VA providers are helping you to manage. This information is available 3 calendar days after it has been entered. It may not contain active problems managed by non-VA health care providers.',
        },
        {
          value: 'vaadmissionsanddischarges',
          label: 'VA Admissions and Discharges',
          hold: 3,
          holdExplanation: 'Discharge Summaries are available 3 calendar days after they are completed.',
        },
        {
          value: 'vaprogressnotes',
          label: 'VA Notes from Jan 01, 2013 forward',
          hold: 3,
          holdExplanation: 'VA Notes written from January 1, 2013 forward are available 3 calendar days after they have been completed and signed by all required members of your VA health care team.',
        },
        {
          value: 'wellness',
          label: 'VA Wellness Reminders',
        },
      ],
    },
    allergies: {
      title: 'Allergies',
      children: [
        {
          value: 'vaallergies',
          label: 'VA Allergies',
        },
        {
          value: 'seiallergies',
          label: 'Allergies, Self-Reported',
        },
      ],
    },
    immunizations: {
      title: 'Immunizations',
      children: [
        {
          value: 'vaimmunizations',
          label: 'VA Immunizations',
        },
        {
          value: 'seiimmunizations',
          label: 'Immunizations, Self-Reported',
        },
      ],
    },
    vitals: {
      title: 'Vitals and Readings',
      children: [
        {
          value: 'vitalsandreadings',
          label: 'VA Vitals and Readings',
        },
        {
          value: '',
          label: 'Vitals and Readings, Self-Reported',
        },
      ],
    },
    selfReported: {
      title: 'Self-Reported Health History',
      children: [
        {
          value: 'medicalevents',
          label: 'Medical Events, Self-Reported',
        },
        {
          value: 'familyhealthhistory',
          label: 'Family Health History, Self-Reported',
        },
        {
          value: 'militaryhealthhistory',
          label: 'Military Health History, Self-Reported',
        },
        {
          value: 'treatmentfacilities',
          label: 'Treatment Facilities, Self-Reported',
        },
        {
          value: 'healthcareproviders',
          label: 'Health Care Providers, Self-Reported',
        },
      ],
    },
    food: {
      title: 'Food and Activity Journals',
      children: [
        {
          value: 'seiactivityjournal',
          label: 'Activity Journal, Self-Reported',
        },
        {
          value: 'seifoodjournal',
          label: 'Food Journal, Self-Reported',
        },
      ],
    },
    goals: {
      title: 'Goals',
      children: [
        {
          value: 'seimygoalscurrent',
          label: 'My Goals: Current Goals, Self-Reported',
        },
        {
          value: 'seimygoalscompleted',
          label: 'My Goals: Completed Goals, Self-Reported',
        },
      ],
    },
    demographics: {
      title: 'Demographics and Health Insurance',
      children: [
        {
          value: 'vademographics',
          label: 'VA Demographics from VA Treating Facilities in the last 3 years',
        },
        {
          value: 'seidemographics',
          label: 'Demographics, Self-Reported',
        },
        {
          value: 'healthinsurance',
          label: 'Health Insurance, Self-Reported',
        },
      ],
    },
    dod: {
      title: 'Department of Defense',
      children: [
        {
          value: 'dodmilitaryservice',
          label: 'Military Service Information',
        },
      ]
    },
  }
};
