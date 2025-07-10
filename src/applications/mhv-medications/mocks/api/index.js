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
const refillablePrescriptionsFixture = require('../../tests/e2e/fixtures/list-refillable-prescriptions.json');
const allergies = require('../../../../platform/mhv/api/mocks/medical-records/allergies');
const tooltips = require('./tooltips/index');

const delaySingleResponse = (cb, delayInMs = 1000) => {
  setTimeout(() => {
    cb();
  }, delayInMs);
};

const responses = {
  ...commonResponses,
  'GET /v0/user': (_req, res) => {
    delaySingleResponse(() => res.json(user.defaultUser), 750);
  },
  'GET /v0/feature_toggles': (_req, res) => {
    const toggles = featureToggles.generateFeatureToggles({
      mhvMedicationsDisplayRefillContent: true,
      mhvMedicationsDisplayDocumentationContent: true,
    });

    delaySingleResponse(() => res.json(toggles), 500);
  },
  // VAMC facility data that apps query for on startup
  'GET /data/cms/vamc-ehr.json': vamcEhr,
  // Personal information like preferredName
  'GET /v0/profile/personal_information': personalInformation,
  // MHV Messaging - folders endpoint powers the red dot on mhv-landing-page
  'GET /my_health/v1/messaging/folders': folders.allFoldersWithUnreadMessages,
  // MHV Medications endpoints below
  'GET /my_health/v1/medical_records/allergies': allergies.all,
  'GET /my_health/v1/prescriptions': (_req, res) => {
    delaySingleResponse(
      () => res.json(prescriptions.generateMockPrescriptions()),
      2250,
    );
  },
  // 'GET /my_health/v1/prescriptions': prescriptionsFixture,
  'GET /my_health/v1/prescriptions/list_refillable_prescriptions': (
    _req,
    res,
  ) => {
    delaySingleResponse(() => res.json(refillablePrescriptionsFixture), 2250);
  },
  'PATCH /my_health/v1/prescriptions/refill_prescriptions': (req, res) => {
    // Get requested IDs from query params.
    const { ids } = req.query;
    // Emulate a successful refill for the first ID and failed refill for subsequent IDs
    const successfulIds = ids[0] ? [ids[0]] : [];
    const failedIds = ids[1] ? ids.slice(1) : [];
    return res.status(200).json({
      successfulIds,
      failedIds,
    });
  },
  /**
  'GET /my_health/v1/medical_records/allergies': (req, res) => {
    // Emulate a 500 error
    return res.status(500).json({
      errors: [
        {
          status: '500',
          title: 'Internal Server Error',
          detail: 'An error occurred while processing your request.',
        },
      ],
    });
  },
  */
  'GET /my_health/v1/tooltips': (_req, res) => {
    return res.json(tooltips.getMockTooltips());
  },
  'GET /my_health/v1/prescriptions/:id/documentation': (req, res) => {
    // use `req.query.ndc` to get the NDC number
    const data = {
      data: {
        attributes: {
          id: '',
          type: 'prescription_documentation',
          html: prescriptions.mockPrescriptionDocumentation(),
        },
      },
    };
    delaySingleResponse(() => res.json(data), 3000);
  },
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
    delaySingleResponse(() => res.json(data), 2250);
  },
};

module.exports = delay(responses, 0);
