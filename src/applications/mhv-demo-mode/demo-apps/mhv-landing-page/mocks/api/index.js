const { generateFeatureToggles } = require('./feature-toggles/index');
const { USER_MOCKS } = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const personalInformation = require('../../tests/fixtures/personal-information.json');
const MHVAccountStatus = require('./user/mhvAccountStatus');

// medical records Blue Button
const militaryService = require('./mhv-api/medical-records/blue-button/military-service');
const patient = require('./mhv-api/medical-records/blue-button/patient');

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

const responses = (userMock = USER_MOCKS.DEFAULT) => ({
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/user': userMock,
  '/v0/feature_toggles(.*)': generateFeatureToggles(),
  // '/v0/feature_toggles(.*)': generateFeatureToggles({ enableAll: true }),
  '/my_health/v1/messaging/folders(.*)': folders.allFoldersWithUnreadMessages,
  'GET /v0/profile/personal_information': personalInformation,
  '/data/cms/vamc-ehr.json': '',

  'GET /v0/user/mhv_user_account': MHVAccountStatus.accountSuccess,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.eightZeroOne,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.eightZeroFive,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.fiveZeroZero,
  // 'GET /v0/user/mhv_user_account': MHVAccountStatus.multiError,

  // medical records Blue Button
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

  'PUT /v0/profile/email_addresses': {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_address_transactions',
      attributes: {
        transactionId: 'mock-transaction-id',
        transactionStatus: 'RECEIVED',
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
  'GET /v0/profile/status/mock-transaction-id': {
    data: {
      id: '',
      type: 'async_transaction_va_profile_email_address_transactions',
      attributes: {
        transactionId: 'mock-transaction-id',
        transactionStatus: 'COMPLETED_SUCCESS',
        type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
        metadata: [],
      },
    },
  },
});

module.exports = responses(USER_MOCKS.DEFAULT);
