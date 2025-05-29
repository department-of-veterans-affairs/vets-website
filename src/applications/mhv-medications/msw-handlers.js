import allergies from 'platform/mhv/api/mocks/medical-records/allergies';
import {
  createGetHandler,
  createPatchHandler,
  jsonResponse,
  errorResponse,
} from 'platform/testing/unit/msw-adapter';
import prescriptions from './mocks/api/mhv-api/prescriptions';
import tooltips from './mocks/api/tooltips';
import featureToggles from './mocks/api/feature-toggles';
import user from './mocks/api/user';

const NETWORK_DELAY = {
  FAST: 500,
  MEDIUM: 1000,
  SLOW: 2250,
  VERY_SLOW: 3000,
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const createErrorResponse = (status, message) => {
  return new Response(
    JSON.stringify({
      errors: [{ title: 'Error', detail: message }],
    }),
    { status },
  );
};

const shouldSimulateError = (errorRate = 0.1) => Math.random() < errorRate;

// Add request logging for development debugging
const logRequest = (req, errorRate) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MSW] ${req.method} ${req.url}`);
    if (errorRate) console.log(`[MSW] Error simulation rate: ${errorRate}`);
  }
};

// Enhanced error simulation with specific error types
const ERROR_TYPES = {
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: 'Service temporarily unavailable',
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'Authorization required',
  },
  TIMEOUT: {
    status: 408,
    message: 'Request timeout',
  },
  BAD_REQUEST: {
    status: 400,
    message: 'Invalid request parameters',
  },
};

const getRandomError = () => {
  const errors = Object.values(ERROR_TYPES);
  return errors[Math.floor(Math.random() * errors.length)];
};

const simulateNetworkConditions = async () => {
  // Simulate random network conditions
  const conditions = [
    {
      delay: NETWORK_DELAY.FAST,
      probability: 0.4,
    },
    {
      delay: NETWORK_DELAY.MEDIUM,
      probability: 0.3,
    },
    {
      delay: NETWORK_DELAY.SLOW,
      probability: 0.2,
    },
    {
      delay: NETWORK_DELAY.VERY_SLOW,
      probability: 0.1,
    },
  ];

  const random = Math.random();
  let sum = 0;
  for (const { delay, probability } of conditions) {
    sum += probability;
    if (random <= sum) {
      return delay; // Return delay instead of awaiting
    }
  }
  return NETWORK_DELAY.MEDIUM; // Default delay
};

// Update prescription status based on business rules
const updatePrescriptionStatus = prescription => {
  const now = new Date();
  const dispensedDate = new Date(prescription.attributes.dispensedDate);
  const daysElapsed = Math.floor(
    (now - dispensedDate) / (1000 * 60 * 60 * 24),
  );

  // Apply business rules for status transitions
  if (daysElapsed > 180) {
    return 'Expired';
  }

  if (prescription.attributes.refillRemaining === 0) {
    return 'NoRefillsRemaining';
  }

  if (
    prescription.attributes.refillSubmitDate &&
    !prescription.attributes.dispensedDate
  ) {
    return 'Submitted';
  }

  return prescription.attributes.dispStatus || 'Active';
};

export const handlers = [
  // User endpoint
  createGetHandler('/v0/user', async () => {
    await delay(NETWORK_DELAY.FAST);
    if (shouldSimulateError(0.05)) {
      return createErrorResponse(503, 'User service is temporarily unavailable');
    }
    return jsonResponse(user.defaultUser);
  }),

  // Feature toggles
  createGetHandler('/v0/feature_toggles', async () => {
    await delay(NETWORK_DELAY.FAST);
    if (shouldSimulateError(0.05)) {
      return createErrorResponse(503, 'Feature toggles service unavailable');
    }
    return jsonResponse(
      featureToggles.generateFeatureToggles({
        mhvMedicationsToVaGovRelease: true,
        mhvMedicationsDisplayRefillContent: true,
        mhvMedicationsDisplayDocumentationContent: true,
      }),
    );
  }),

  // Medical Records endpoints
  createGetHandler('/my_health/v1/medical_records/allergies', async () => {
    await delay(NETWORK_DELAY.MEDIUM);
    if (shouldSimulateError()) {
      return createErrorResponse(503, 'Allergies service unavailable');
    }
    return jsonResponse(allergies.all);
  }),

  // Enhanced prescription list handler with pagination and status updates
  createGetHandler('/my_health/v1/prescriptions', async req => {
    const networkDelay = await simulateNetworkConditions();
    await delay(networkDelay);

    if (shouldSimulateError(0.1)) {
      const error = getRandomError();
      return createErrorResponse(
        error.status,
        error.message,
      );
    }

    const searchParams = new URLSearchParams(new URL(req.url).search);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '10', 10);

    const allPrescriptions = prescriptions.generateMockPrescriptions(100);
    const total = allPrescriptions.data.length;

    // Update status for each prescription
    allPrescriptions.data = allPrescriptions.data.map(prescription => ({
      ...prescription,
      attributes: {
        ...prescription.attributes,
        dispStatus: updatePrescriptionStatus(prescription),
      },
    }));

    // Apply pagination
    const start = (page - 1) * perPage;
    const paginatedData = {
      data: allPrescriptions.data.slice(start, start + perPage),
      meta: {
        ...allPrescriptions.meta,
        pagination: {
          currentPage: page,
          perPage,
          totalPages: Math.ceil(total / perPage),
          totalEntries: total,
        },
      },
    };

    return jsonResponse(paginatedData);
  }),

  createGetHandler(
    '/my_health/v1/prescriptions/list_refillable_prescriptions',
    async () => {
      await delay(NETWORK_DELAY.SLOW);
      if (shouldSimulateError()) {
        return createErrorResponse(503, 'Refillable prescriptions service unavailable');
      }
      return jsonResponse(prescriptions.mockRefillablePrescriptions());
    },
  ),

  // Enhanced refill handler with more realistic behavior
  createPatchHandler(
    '/my_health/v1/prescriptions/refill_prescriptions',
    async req => {
      const networkDelay = await simulateNetworkConditions();
      await delay(networkDelay);

      const url = new URL(req.url);
      const ids = url.searchParams.getAll('ids');

      if (shouldSimulateError(0.15)) {
        const error = getRandomError();
        return createErrorResponse(
          error.status,
          error.message,
        );
      }

      // Simulate different refill scenarios
      const results = ids.map(id => {
        const random = Math.random();
        if (random < 0.8) {
          // 80% success rate
          return {
            id,
            success: true,
          };
        }

        if (random < 0.9) {
          // 10% no refills remaining
          return {
            id,
            success: false,
            reason: 'No refills remaining',
          };
        }

        // 10% other errors
        return {
          id,
          success: false,
          reason: 'Prescription cannot be refilled at this time',
        };
      });

      const response = {
        successfulIds: results.filter(r => r.success).map(r => r.id),
        failedIds: results.filter(r => !r.success).map(r => r.id),
        errors: results
          .filter(r => !r.success)
          .map(r => ({
            prescriptionId: r.id,
            message: r.reason,
          })),
      };

      return jsonResponse(response);
    },
  ),

  createGetHandler(
    '/my_health/v1/prescriptions/:id/documentation',
    async () => {
      await delay(NETWORK_DELAY.VERY_SLOW);
      if (shouldSimulateError()) {
        return createErrorResponse(503, 'Documentation service unavailable');
      }
      return jsonResponse({
        data: {
          attributes: {
            id: '',
            type: 'prescription_documentation',
            html: prescriptions.mockPrescriptionDocumentation(),
          },
        },
      });
    },
  ),

  createGetHandler('/my_health/v1/prescriptions/:id', async ({ params }) => {
    await delay(NETWORK_DELAY.SLOW);
    const { id } = params;
    
    if (shouldSimulateError()) {
      return createErrorResponse(503, 'Prescription details service unavailable');
    }
    
    return jsonResponse({
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
        failedStationList: null,
      },
    });
  }),

  // Static endpoints
  createGetHandler('/data/cms/vamc-ehr.json', () =>
    jsonResponse(require('./mocks/api/vamc-ehr.json')),
  ),

  createGetHandler('/v0/profile/personal_information', () =>
    jsonResponse(require('./mocks/api/user/personal-information.json')),
  ),

  createGetHandler('/my_health/v1/messaging/folders', () =>
    jsonResponse(
      require('./mocks/api/mhv-api/messaging/folders/index')
        .allFoldersWithUnreadMessages,
    ),
  ),

  createGetHandler('/my_health/v1/tooltips', () =>
    jsonResponse(tooltips.getMockTooltips()),
  ),
];