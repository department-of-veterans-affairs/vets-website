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
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it\'s added to your record. VA lab results will be available 3 calendar days after they\'ve been verified.',
        },
        {
          value: 'vapathology',
          label: 'VA Pathology Reports',
          hold: 14,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it\'s added to your record. VA pathology reports will be available 14 calendar days after they\'ve been completed. Studies done at a non-VA facility may not be available or may not include an interpretation.',
        },
        {
          value: 'varadiology',
          label: 'VA Radiology Reports',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it\'s added to your record. VA radiology reports will be available 3 calendar days after they\'ve been completed. Studies done at a non-VA facility may not be available or may not include an interpretation.',
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
          holdExplanation: 'Your VA problem list contains active health problems that your VA health care team is helping you manage. This information will be available 3 days after it\'s been entered.',
        },
        {
          value: 'vaadmissionsanddischarges',
          label: 'VA Admissions and Discharges',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it\'s added to your record. Discharge summaries will be available 3 days after they\'re completed.',
        },
        {
          value: 'vaprogressnotes',
          label: 'VA Notes from Jan 01, 2013 forward',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it\'s added to your record. VA notes starting from Jan 1, 2013 will be available 3 days after they\'ve been completed and signed by all required members of your VA health care team.',
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
