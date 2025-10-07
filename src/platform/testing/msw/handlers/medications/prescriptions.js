import { rest } from 'msw';

/**
 * Generate a mock prescription object
 * @param {number} id - Prescription ID
 * @param {object} attrs - Override attributes
 * @returns {object} Prescription object
 */
export const createPrescription = (id = 0, attrs = {}) => {
  const isRefillable = id % 3 === 0;
  const refillRemaining = isRefillable ? Math.ceil(Math.log(id + 1)) : 0;
  
  return {
    id: `fake-${id}`,
    type: 'prescriptions',
    attributes: {
      prescriptionId: id,
      prescriptionNumber: `${id}`,
      prescriptionName: attrs.prescriptionName || `Medication ${id}`,
      refillStatus: attrs.refillStatus || 'active',
      refillSubmitDate: '2024-02-21T10:30:00-05:00',
      refillDate: '2024-02-28T10:30:00-05:00',
      refillRemaining: attrs.refillRemaining ?? refillRemaining,
      facilityName: attrs.facilityName || 'VA Medical Center',
      orderedDate: '2024-02-23T10:30:00-05:00',
      quantity: attrs.quantity || '30',
      expirationDate: attrs.expirationDate || '2099-01-02T10:30:00-05:00',
      dispensedDate: attrs.dispensedDate || '2024-02-25T10:30:00-05:00',
      stationNumber: '001',
      isRefillable: attrs.isRefillable ?? isRefillable,
      isTrackable: attrs.isTrackable ?? null,
      sig: attrs.sig || 'Take one tablet by mouth daily',
      cmopDivisionPhone: attrs.cmopDivisionPhone || '(555) 555-5555',
      inCernerTransition: null,
      dialCmopDivisionPhone: '5555555555',
      dispStatus: attrs.dispStatus || 'Active',
      ...attrs,
    },
  };
};

/**
 * Generate an array of mock prescriptions
 * @param {object} options - Configuration options
 * @returns {array} Array of prescriptions
 */
export const generatePrescriptions = (options = {}) => {
  const {
    count = 10,
    status = 'active',
    refillable = null,
    ...attrs
  } = options;

  return Array.from({ length: count }, (_, i) => {
    const prescription = createPrescription(i + 1, attrs);
    
    if (status) {
      prescription.attributes.dispStatus = status;
    }
    
    if (refillable !== null) {
      prescription.attributes.isRefillable = refillable;
      prescription.attributes.refillRemaining = refillable ? 3 : 0;
    }
    
    return prescription;
  });
};

/**
 * MSW handler for GET /my_health/v1/prescriptions
 * Uses wildcard to match both relative and absolute URLs in Node/browser
 */
export const prescriptionsHandler = (options = {}) => {
  return rest.get('*/my_health/v1/prescriptions', (req, res, ctx) => {
    const prescriptions = generatePrescriptions(options);
    
    return res(
      ctx.delay(options.delay ?? 500),
      ctx.json({
        data: prescriptions,
        meta: {
          sort: {
            dispStatus: 'DESC',
            dispensedDate: 'DESC',
            prescriptionName: 'DESC',
          },
          pagination: {
            currentPage: 1,
            perPage: 999,
            totalPages: 1,
            totalEntries: prescriptions.length,
          },
          updatedAt: new Date().toUTCString(),
          failedStationList: null,
        },
      }),
    );
  });
};

/**
 * MSW handler for GET /my_health/v1/prescriptions/:id
 * Uses wildcard to match both relative and absolute URLs
 */
export const prescriptionDetailsHandler = (options = {}) => {
  return rest.get('*/my_health/v1/prescriptions/:id', (req, res, ctx) => {
    const { id } = req.params;
    const prescription = createPrescription(parseInt(id, 10), options);
    
    return res(
      ctx.delay(options.delay ?? 500),
      ctx.json({
        data: prescription,
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
          updatedAt: new Date().toUTCString(),
          failedStationList: null,
        },
      }),
    );
  });
};

/**
 * MSW handler for refillable prescriptions list
 * Uses wildcard to match both relative and absolute URLs
 */
export const refillablePrescriptionsHandler = (options = {}) => {
  return rest.get(
    '*/my_health/v1/prescriptions/list_refillable_prescriptions',
    (req, res, ctx) => {
      const prescriptions = generatePrescriptions({
        count: options.count ?? 5,
        refillable: true,
        ...options,
      });
      
      return res(
        ctx.delay(options.delay ?? 500),
        ctx.json({
          data: prescriptions,
          meta: {
            updatedAt: new Date().toUTCString(),
          },
        }),
      );
    },
  );
};

/**
 * MSW handler for prescription refill
 * Uses wildcard to match both relative and absolute URLs
 */
export const refillPrescriptionHandler = (options = {}) => {
  return rest.patch(
    '*/my_health/v1/prescriptions/refill_prescriptions',
    (req, res, ctx) => {
      const url = new URL(req.url);
      const ids = url.searchParams.getAll('ids');
      
      // Emulate success for first ID, failure for rest (configurable)
      const successfulIds = options.allSuccess 
        ? ids 
        : ids.slice(0, 1);
      const failedIds = options.allSuccess 
        ? [] 
        : ids.slice(1);
      
      return res(
        ctx.delay(options.delay ?? 500),
        ctx.status(200),
        ctx.json({
          successfulIds,
          failedIds,
        }),
      );
    },
  );
};

/**
 * MSW handler for prescription documentation
 * Uses wildcard to match both relative and absolute URLs
 */
export const prescriptionDocumentationHandler = (options = {}) => {
  return rest.get(
    '*/my_health/v1/prescriptions/:id/documentation',
    (req, res, ctx) => {
      const html = options.html || '<div>Mock prescription documentation</div>';
      
      return res(
        ctx.delay(options.delay ?? 500),
        ctx.json({
          data: {
            attributes: {
              id: '',
              type: 'prescription_documentation',
              html,
            },
          },
        }),
      );
    },
  );
};

/**
 * Error handler for prescriptions
 * Uses wildcard to match both relative and absolute URLs
 */
export const prescriptionsErrorHandler = (statusCode = 500) => {
  return rest.get('*/my_health/v1/prescriptions', (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json({
        errors: [
          {
            status: `${statusCode}`,
            title: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
            detail: 'An error occurred while processing your request.',
          },
        ],
      }),
    );
  });
};
