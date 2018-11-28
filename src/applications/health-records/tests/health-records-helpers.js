const mock = require('../../../platform/testing/e2e/mock-helpers');

const eligibleDataClasses = {
  data: {
    attributes: {
      dataClasses: [
        'seiactivityjournal',
        'seiallergies',
        'seidemographics',
        'familyhealthhistory',
        'seifoodjournal',
        'healthcareproviders',
        'healthinsurance',
        'seiimmunizations',
        'labsandtests',
        'medicalevents',
        'medications',
        'militaryhealthhistory',
        'seimygoalscurrent',
        'seimygoalscompleted',
        'treatmentfacilities',
        'vitalsandreadings',
        'prescriptions',
        'vaallergies',
        'vaadmissionsanddischarges',
        'futureappointments',
        'pastappointments',
        'vademographics',
        'vaekg',
        'vaimmunizations',
        'vachemlabs',
        'vaprogressnotes',
        'vapathology',
        'vaproblemlist',
        'varadiology',
        'vahth',
        'wellness',
        'dodmilitaryservice',
      ],
    },
  },
};

const extractStatuses = {
  data: [
    {
      extractType: 'ChemistryHematology',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:50 EST',
      status: 'OK',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'ImagingStudy',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:49 EST',
      status: 'ERROR',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'VPR',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:59 EST',
      status: 'OK',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'DodMilitaryService',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:48 EST',
      status: 'OK',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'WellnessReminders',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:58 EST',
      status: 'OK',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'Allergy',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:52 EST',
      status: 'OK',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
    {
      extractType: 'Appointments',
      lastUpdated: 'Thu, 19 Jan 2017 14:37:48 EST',
      status: 'ERROR',
      createdOn: 'Thu, 19 Jan 2017 14:37:47 EST',
      stationNumber: '',
    },
  ],
};

// Create API routes
function initApplicationMock(token) {
  mock(token, {
    path: '/v0/health_records/refresh',
    verb: 'get',
    value: extractStatuses,
  });

  mock(token, {
    path: '/v0/health_records/eligible_data_classes',
    verb: 'get',
    value: eligibleDataClasses,
  });
}

module.exports = {
  initApplicationMock,
};
