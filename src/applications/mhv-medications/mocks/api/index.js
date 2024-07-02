/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');
const folders = require('./mhv-api/messaging/folders/index');
const vamcEhr = require('./vamc-ehr.json');
const personalInformation = require('./user/personal-information.json');
// prescriptions module generates mocks
const prescriptions = require('./mhv-api/prescriptions/index');
// You can user fixtures for mocks, if desired
// const prescriptionsFixture = require('../../tests/e2e/fixtures/prescriptions.json');
// const refillablePrescriptionsFixture = require('../../tests/e2e/fixtures/prescriptions.json');
const allergiesFixture = require('../../tests/e2e/fixtures/allergies.json');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({
    mhvMedicationsToVaGovRelease: true,
    mhvMedicationsDisplayRefillContent: true,
    mhvMedicationsDisplayDocumentationContent: true,
  }),
  // VAMC facility data that apps query for on startup
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  // Personal information like preferredName
  'GET /v0/profile/personal_information': personalInformation,
  // MHV Messaging - folders endpoint powers the red dot on mhv-landing-page
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  // MHV Medications endpoints below
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
  'GET /my_health/v1/prescriptions/:id/documentation': (req, res) => {
    // use `req.query.ndc` to get the NDC number
    const data = {
      data: prescriptions.mockPrescriptionDocumentation(),
    };
    return res.json(data);
  },
  // 'GET /my_health/v1/prescriptions': prescriptionsFixture,
  // 'GET /my_health/v1/prescriptions/list_refillable_prescriptions': refillablePrescriptionsFixture,
  'GET /my_health/v1/prescriptions/list_refillable_prescriptions': prescriptions.generateMockPrescriptions(),
  'GET /my_health/v1/medical_records/allergies': allergiesFixture,
};

module.exports = delay(responses, 1000);
