module.exports = {
  reportTypes: {
    appointments: {
      title: 'Appointments',
      children: [
        {
          value: 'futureappointment',
          label: 'Future VA Appointments',
        },
        {
          value: 'pastappointment',
          label: 'Past VA Appointments (limited to past 2 years)',
        },
      ],
    },
    medications: {
      title: 'Medications (automatically includes Allergy information)',
      children: [
        {
          value: 'prescription',
          label: 'VA Medication History',
        },
        {
          value: 'medication',
          label: 'Medications and Supplements, Self-Reported',
        },
      ],
    },
    labs: {
      title: 'Labs and Tests',
      children: [
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
    },
    ehr: {
      title: 'VA Electronic Health Record History and Wellness Reminders',
      children: [
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
    },
    allergies: {
      title: 'Allergies',
      children: [
        {
          value: 'vaallergie',
          label: 'VA Allergies',
        },
        {
          value: 'seiallergie',
          label: 'Allergies, Self-Reported',
        },
      ],
    },
    immunizations: {
      title: 'Immunizations',
      children: [
        {
          value: 'vaimmunization',
          label: 'VA Immunizations',
        },
        {
          value: 'seiimmunization',
          label: 'Immunizations, Self-Reported',
        },
      ],
    },
    vitals: {
      title: 'Vitals and Readings',
      children: [
        {
          value: 'vitalsandreading',
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
    },
    food: {
      title: 'Food and Activity Journals',
      children: [
        {
          value: 'seiactivityjourna',
          label: 'Activity Journal, Self-Reported',
        },
        {
          value: 'seifoodjourna',
          label: 'Food Journal, Self-Reported',
        },
      ],
    },
    goals: {
      title: 'Goals',
      children: [
        {
          value: 'seimygoalscurren',
          label: 'My Goals: Current Goals, Self-Reported',
        },
        {
          value: 'seimygoalscomplete',
          label: 'My Goals: Completed Goals, Self-Reported',
        },
      ],
    },
    demographics: {
      title: 'Demographics and Health Insurance',
      children: [
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
    },
    dod: {
      title: 'Department of Defense',
      children: [
        {
          value: 'dodmilitaryservic',
          label: 'Military Service Information',
        },
      ]
    },
  }
};
