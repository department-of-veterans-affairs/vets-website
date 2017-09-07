module.exports = {
  reportTypes: {
    appointments: {
      title: 'Appointments',
      children: [
        {
          value: 'futureappointments',
          label: 'Upcoming VA appointments',
        },
        {
          value: 'pastappointments',
          label: 'VA appointment history (limited to the past 2 years)',
        },
      ],
    },
    medications: {
      title: 'Medications (includes allergy information)',
      children: [
        {
          value: 'prescriptions',
          label: 'VA Medication History',
        },
        {
          value: 'medications',
          label: 'Self-Reported Medications and Supplements',
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
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it’s added to your record. VA lab results will be available 3 calendar days after they’ve been verified.',
        },
        {
          value: 'vapathology',
          label: 'VA Pathology Reports',
          hold: 14,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it’s added to your record. VA pathology reports will be available 14 calendar days after they’ve been completed. Studies done at a non-VA facility may not be available or may not include an interpretation.',
        },
        {
          value: 'varadiology',
          label: 'VA Radiology Reports',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it’s added to your record. VA radiology reports will be available 3 calendar days after they’ve been completed. Studies done at a non-VA facility may not be available or may not include an interpretation.',
        },
        {
          value: 'vaekg',
          label: 'History of Electrocardiograms (EKGs) performed at VA facilities',
        },
        {
          value: 'vachemlabs',
          label: 'Self-Reported Labs and Tests',
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
          holdExplanation: 'Your VA problem list contains active health problems that your VA health care team is helping you manage. This information will be available 3 days after it’s been entered.',
        },
        {
          value: 'vaadmissionsanddischarges',
          label: 'VA Admissions and Discharges',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it’s added to your record. Discharge summaries will be available 3 days after they’re completed.',
        },
        {
          value: 'vaprogressnotes',
          label: 'VA Notes starting from Jan 01, 2013',
          hold: 3,
          holdExplanation: 'Some information may need to be reviewed by a member of your VA health care team before it’s added to your record. VA notes starting from Jan 1, 2013 will be available 3 days after they’ve been completed and signed by all required members of your VA health care team.',
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
          label: 'Self-Reported Allergies',
        },
      ],
    },
    immunizations: {
      title: 'Immunizations',
      children: [
        {
          value: 'vaimmunizations',
          label: 'Immunizations received through VA',
        },
        {
          value: 'seiimmunizations',
          label: 'Self-Reported Immunizations',
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
          value: 'vahth',
          label: 'Self-Reported Vitals and Readings',
        },
      ],
    },
    selfReported: {
      title: 'Self-Reported Health History',
      children: [
        {
          value: 'medicalevents',
          label: 'Medical Events',
        },
        {
          value: 'familyhealthhistory',
          label: 'Family Health History',
        },
        {
          value: 'militaryhealthhistory',
          label: 'Military Health History',
        },
        {
          value: 'treatmentfacilities',
          label: 'Treatment Facilities',
        },
        {
          value: 'healthcareproviders',
          label: 'Health Care Providers',
        },
      ],
    },
    food: {
      title: 'Food and Activity Journals',
      children: [
        {
          value: 'seiactivityjournal',
          label: 'Self-Reported Activity Journal',
        },
        {
          value: 'seifoodjournal',
          label: 'Self-Reported Food Journal',
        },
      ],
    },
    goals: {
      title: 'Goals',
      children: [
        {
          value: 'seimygoalscurrent',
          label: 'Self-Reported Current Goals',
        },
        {
          value: 'seimygoalscompleted',
          label: 'Self-Reported Completed Goals',
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
          label: 'Self-Reported Demographics',
        },
        {
          value: 'healthinsurance',
          label: 'Self-Reported Health Insurance',
        },
      ],
    },
    dod: {
      title: 'Department of Defense',
      children: [
        {
          value: 'dodmilitaryservice',
          label: 'Information from the Department of Defense',
        },
      ]
    },
  },

  errorCodes: {
    accountcreation: [
      'MHVAC1',
    ]
  }
};
