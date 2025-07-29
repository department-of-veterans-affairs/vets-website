/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const { generateFeatureToggles } = require('./feature-toggles/index');
const user = require('./user');
const vamcEhr = require('./vamc-ehr.json');
const personalInformation = require('./user/personal-information.json');
// prescriptions module generates mocks
const prescriptions = require('./mhv-api/medications/prescriptions/index');
// You can user fixtures for mocks, if desired
// const prescriptionsFixture = require('../../tests/e2e/fixtures/prescriptions.json');
// const refillablePrescriptionsFixture = require('../../tests/e2e/fixtures/prescriptions.json');

const maintenanceWindows = require('./maintenance-windows');

// medical records
const session = require('./mhv-api/medical-records/session');
const status = require('./mhv-api/medical-records/status');
const labsAndTests = require('./mhv-api/medical-records/labs-and-tests');
const acceleratedLabsAndTests = require('./mhv-api/medical-records/labs-and-tests/accelerated');
const mhvRadiology = require('./mhv-api/medical-records/mhv-radiology');
const careSummariesAndNotes = require('./mhv-api/medical-records/care-summaries-and-notes');
const healthConditions = require('./mhv-api/medical-records/health-conditions');
const allergies = require('./mhv-api/medical-records/allergies');
const acceleratedAllergies = require('./mhv-api/medical-records/allergies/full-example');
const vaccines = require('./mhv-api/medical-records/vaccines');
const acceleratedVaccines = require('./mhv-api/medical-records/vaccines/accelerated');
const vitals = require('./mhv-api/medical-records/vitals');
const downloads = require('./mhv-api/medical-records/downloads');

// medical records Blue Button
const appointments = require('./mhv-api/medical-records/blue-button/appointments');
const demographics = require('./mhv-api/medical-records/blue-button/demographics');
const militaryService = require('./mhv-api/medical-records/blue-button/military-service');
const patient = require('./mhv-api/medical-records/blue-button/patient');
const acceleratedVitals = require('./mhv-api/medical-records/vitals/accelerated');

// medical records self-entered
const seiActivityJournal = require('./mhv-api/medical-records/self-entered/seiActivityJournal');
const seiAllergies = require('./mhv-api/medical-records/self-entered/seiAllergies');
const seiFamilyHealthHistory = require('./mhv-api/medical-records/self-entered/seiFamilyHealthHistory');
const seiFoodJournal = require('./mhv-api/medical-records/self-entered/seiFoodJournal');
const seiHealthcareProviders = require('./mhv-api/medical-records/self-entered/seiHealthcareProviders');
const seiHealthInsurance = require('./mhv-api/medical-records/self-entered/seiHealthInsurance');
const seiLabs = require('./mhv-api/medical-records/self-entered/seiLabs');
const seiMedicalEvents = require('./mhv-api/medical-records/self-entered/seiMedicalEvents');
const seiMedications = require('./mhv-api/medical-records/self-entered/seiMedications');
const seiEmergencyContacts = require('./mhv-api/medical-records/self-entered/seiEmergencyContacts');
const seiMilitaryHealthHistory = require('./mhv-api/medical-records/self-entered/seiMilitaryHealthHistory');
const seiTreatmentFacilities = require('./mhv-api/medical-records/self-entered/seiTreatmentFacilities');
const seiVaccines = require('./mhv-api/medical-records/self-entered/seiVaccines');
const seiVitals = require('./mhv-api/medical-records/self-entered/seiVitals');
const seiAllDomains = require('./mhv-api/medical-records/self-entered/allDomains');

const imaging = require('./mhv-api/medical-records/mhv-radiology/imaging');
const imagingStatus = require('./mhv-api/medical-records/mhv-radiology/imaging-status');
const imagingRequest = require('./mhv-api/medical-records/mhv-radiology/imaging-request');
const imagingDownload = require('./mhv-api/medical-records/mhv-radiology/imaging-download');
const { getMockTooltips } = require('./tooltips/index');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.acceleratedCernerUser,
  'GET /v0/feature_toggles': generateFeatureToggles(),
  // 'GET /v0/feature_toggles': generateFeatureToggles({ enableAll: true }),

  // VAMC facility data that apps query for on startup
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  // Personal information like preferredName
  'GET /v0/profile/personal_information': personalInformation,
  'GET /my_health/v1/prescriptions': prescriptions.generateMockPrescriptions(),
  'GET /my_health/v1/prescriptions/:id': (req, res) => {
    const { id } = req.params;
    const data = {
      data: prescriptions.mockPrescription(id, {
        cmopNdcNumber: '00093721410',
      }),
      meta: {
        sort: {
          dispStatus: 'DESC',
          dispensedDate: 'DESC',
          prescriptionName: 'DESC',
        },
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalPages: 1,
          totalEntries: 1,
        },
        updatedAt: 'Wed, 28 Feb 2024 09:58:42 EST',
        failedStationList: 'string',
      },
    };
    return res.json(data);
  },
  // 'GET /my_health/v1/prescriptions': prescriptionsFixture,
  // 'GET /my_health/v1/prescriptions/list_refillable_prescriptions': refillablePrescriptionsFixture,
  'GET /my_health/v1/prescriptions/list_refillable_prescriptions': prescriptions.generateMockPrescriptions(),

  // medical records
  'GET /my_health/v1/medical_records/session/status':
    session.phrRefreshInProgressNoNewRecords,
  'GET /my_health/v1/medical_records/session':
    session.phrRefreshInProgressNoNewRecords,
  'POST /my_health/v1/medical_records/session': {},
  'GET /my_health/v1/medical_records/status': status.error,
  'GET /my_health/v1/medical_records/labs_and_tests': labsAndTests.all,
  'GET /my_health/v1/medical_records/labs_and_tests/:id': labsAndTests.single,
  'GET /my_health/v2/medical_records/labs_and_tests':
    acceleratedLabsAndTests.staging,
  'GET /my_health/v1/medical_records/radiology': mhvRadiology.empty,
  'GET /my_health/v1/medical_records/clinical_notes': careSummariesAndNotes.all,
  'GET /my_health/v1/medical_records/clinical_notes/:id':
    careSummariesAndNotes.single,
  'GET /my_health/v1/health_records/sharing/status': { status: 200 },
  'POST /my_health/v1/health_records/sharing/:endpoint': { status: 200 },
  'GET /my_health/v1/medical_records/conditions': healthConditions.all,
  'GET /my_health/v1/medical_records/conditions/:id': healthConditions.single,
  'GET /my_health/v1/medical_records/allergies': (req, res) => {
    const { use_oh_data_path } = req.query;
    if (use_oh_data_path === '1') {
      return res.json(acceleratedAllergies.all);
    }
    return res.json(allergies.all);
  },
  'GET /my_health/v1/medical_records/allergies/:id': (req, res) => {
    const { use_oh_data_path } = req.query;
    if (use_oh_data_path === '1') {
      return acceleratedAllergies.single(req, res);
    }
    return allergies.single(req, res);
  },
  'GET /my_health/v1/medical_records/vaccines': vaccines.all,
  'GET /my_health/v2/medical_records/immunizations': acceleratedVaccines.all,
  'GET /my_health/v1/medical_records/vaccines/:id': vaccines.single,
  'GET /my_health/v2/medical_records/immunizations/:id':
    acceleratedVaccines.single,
  'GET /my_health/v1/medical_records/ccd/generate': downloads.generateCCD,
  'GET /my_health/v1/medical_records/ccd/download': downloads.downloadCCD,
  'GET /my_health/v1/medical_records/vitals': (req, res) => {
    const { use_oh_data_path, from, to } = req.query;
    if (use_oh_data_path === '1') {
      const vitalsData = acceleratedVitals.all(from, to);
      return res.json(vitalsData);
    }
    return res.json(vitals.all);
  },

  // medical records Blue Button
  'GET /vaos/v2/appointments': appointments.appointments,
  'GET /my_health/v1/medical_records/patient/demographic':
    demographics.demographics,
  'GET /my_health/v1/medical_records/military_service':
    militaryService.militaryService,
  'GET /my_health/v1/medical_records/patient': patient.patient,

  // medical records self-entered data
  'GET /my_health/v1/medical_records/self_entered/activity_journal': seiActivityJournal,
  'GET /my_health/v1/medical_records/self_entered/allergies': seiAllergies,
  'GET /my_health/v1/medical_records/self_entered/family_history': seiFamilyHealthHistory,
  'GET /my_health/v1/medical_records/self_entered/food_journal': seiFoodJournal,
  'GET /my_health/v1/medical_records/self_entered/providers': seiHealthcareProviders,
  'GET /my_health/v1/medical_records/self_entered/health_insurance': seiHealthInsurance,
  'GET /my_health/v1/medical_records/self_entered/test_entries': seiLabs,
  'GET /my_health/v1/medical_records/self_entered/medical_events': seiMedicalEvents,
  'GET /my_health/v1/medical_records/self_entered/medications': seiMedications,
  'GET /my_health/v1/medical_records/self_entered/emergency_contacts': seiEmergencyContacts,
  'GET /my_health/v1/medical_records/self_entered/military_history': seiMilitaryHealthHistory,
  'GET /my_health/v1/medical_records/self_entered/treatment_facilities': seiTreatmentFacilities,
  'GET /my_health/v1/medical_records/self_entered/vaccines': seiVaccines,
  'GET /my_health/v1/medical_records/self_entered/vitals': seiVitals,
  'GET /my_health/v1/medical_records/self_entered': seiAllDomains,

  'GET /my_health/v1/medical_records/imaging': imaging,
  'GET /my_health/v1/medical_records/imaging/status': imagingStatus,
  'GET /my_health/v1/medical_records/imaging/:studyId/request': imagingRequest,
  'GET /my_health/v1/medical_records/imaging/:studyId/images': imagingDownload,

  'GET /my_health/v1/medical_records/bbmi_notification/status': { flag: false },

  'GET /my_health/v1/medical_records/imaging/:studyId/images/:month/:date': (
    req,
    res,
  ) => {
    const filePath =
      'src/platform/mhv/api/mocks/medical-records/mhv-radiology/01.jpeg';
    res.download(filePath);
  },

  'GET /v0/maintenance_windows': (_req, res) => {
    // three different scenarios for testing downtime banner
    // all service names/keys are available in src/platform/monitoring/DowntimeNotification/config/externalService.js
    // but couldn't be directly imported due to export default vs module.exports

    // return res.json(
    //   maintenanceWindows.createDowntimeApproachingNotification([
    //     maintenanceWindows.SERVICES.mhvSm,
    //   ]),
    // );

    // return res.json(
    //   maintenanceWindows.createDowntimeActiveNotification([
    //     maintenanceWindows.SERVICES.mhvSm,
    //   ]),
    // );

    return res.json(maintenanceWindows.noDowntime);
  },
  // 'GET /v0/maintenance_windows': { data: [] },

  'GET /my_health/v1/tooltips': (_req, res) => {
    return res.json(getMockTooltips());
  },

  'POST /my_health/v1/aal': (_req, res) => {
    return res.json({
      aal: {
        activityType: 'Medical Records Activity',
        action: 'View',
        performerType: 'Self',
        detailValue: null,
        status: 1,
      },
      product: 'mr',
      oncePerSession: true,
    });
  },

  'POST /v0/datadog_action': {},
};

module.exports = delay(responses, 750);
