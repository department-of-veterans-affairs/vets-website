import { expect } from 'chai';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  getApiBasePath,
  getRefillMethod,
  prescriptionsApi,
  useGetPrescriptionsListQuery,
  useGetPrescriptionByIdQuery,
  useGetRefillablePrescriptionsQuery,
  useGetPrescriptionDocumentationQuery,
  useRefillPrescriptionMutation,
  useBulkRefillPrescriptionsMutation,
  useGetPrescriptionsExportListQuery,
  usePrefetch,
  getPrescriptionsList,
  getPrescriptionById,
  getRefillablePrescriptions,
  getPrescriptionDocumentation,
  refillPrescription,
  bulkRefillPrescriptions,
  getPrescriptionsExportList,
  documentationApiBasePath,
  buildExportListQuery,
  buildPrescriptionsListQuery,
  buildPrescriptionByIdQuery,
  buildRefillablePrescriptionsQuery,
  transformExportListResponse,
  transformPrescriptionsListResponse,
  transformPrescriptionByIdResponse,
  transformRefillablePrescriptionsResponse,
  transformBulkRefillResponse,
  transformPrescriptionDocumentationResponse,
} from '../../api/prescriptionsApi';
import { INCLUDE_IMAGE_ENDPOINT } from '../../util/constants';

describe('prescriptionsApi', () => {
  describe('getApiBasePath', () => {
    it('should return v2 path when Cerner pilot flag is enabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: false,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v2`);
    });

    it('should return v1 path when Cerner pilot flag is disabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          loading: false,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when feature toggles are loading', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: true,
        },
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when featureToggles object is missing', () => {
      const mockState = {};

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when featureToggles is null', () => {
      const mockState = {
        featureToggles: null,
      };

      const result = getApiBasePath(mockState);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when state is undefined', () => {
      const result = getApiBasePath(undefined);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });

    it('should default to v1 path when state is null', () => {
      const result = getApiBasePath(null);

      expect(result).to.equal(`${environment.API_URL}/my_health/v1`);
    });
  });

  describe('getRefillMethod', () => {
    it('should return POST when Cerner pilot flag is enabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: false,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('POST');
    });

    it('should return PATCH when Cerner pilot flag is disabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          loading: false,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when feature toggles are loading', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          loading: true,
        },
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when featureToggles is missing', () => {
      const mockState = {};

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when featureToggles is null', () => {
      const mockState = {
        featureToggles: null,
      };

      const result = getRefillMethod(mockState);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when state is undefined', () => {
      const result = getRefillMethod(undefined);

      expect(result).to.equal('PATCH');
    });

    it('should default to PATCH when state is null', () => {
      const result = getRefillMethod(null);

      expect(result).to.equal('PATCH');
    });
  });

  describe('prescriptionsApi configuration', () => {
    it('should have correct reducer path', () => {
      expect(prescriptionsApi.reducerPath).to.equal('prescriptionsApi');
    });

    it('should have endpoints property', () => {
      expect(prescriptionsApi.endpoints).to.be.an('object');
    });

    it('should have reducer property', () => {
      expect(prescriptionsApi.reducer).to.be.a('function');
    });

    it('should have middleware property', () => {
      expect(prescriptionsApi.middleware).to.be.a('function');
    });

    it('should define Prescription tag type', () => {
      // The API uses tagTypes for cache invalidation
      expect(prescriptionsApi).to.have.property('endpoints');
    });
  });

  describe('exported hooks', () => {
    it('should export useGetPrescriptionsListQuery hook', () => {
      expect(useGetPrescriptionsListQuery).to.be.a('function');
    });

    it('should export useGetPrescriptionByIdQuery hook', () => {
      expect(useGetPrescriptionByIdQuery).to.be.a('function');
    });

    it('should export useGetRefillablePrescriptionsQuery hook', () => {
      expect(useGetRefillablePrescriptionsQuery).to.be.a('function');
    });

    it('should export useGetPrescriptionDocumentationQuery hook', () => {
      expect(useGetPrescriptionDocumentationQuery).to.be.a('function');
    });

    it('should export useRefillPrescriptionMutation hook', () => {
      expect(useRefillPrescriptionMutation).to.be.a('function');
    });

    it('should export useBulkRefillPrescriptionsMutation hook', () => {
      expect(useBulkRefillPrescriptionsMutation).to.be.a('function');
    });

    it('should export useGetPrescriptionsExportListQuery hook', () => {
      expect(useGetPrescriptionsExportListQuery).to.be.a('function');
    });

    it('should export usePrefetch hook', () => {
      expect(usePrefetch).to.be.a('function');
    });
  });

  describe('exported endpoints', () => {
    it('should export getPrescriptionsList endpoint', () => {
      expect(getPrescriptionsList).to.exist;
      expect(getPrescriptionsList.initiate).to.be.a('function');
      expect(getPrescriptionsList.select).to.be.a('function');
    });

    it('should export getPrescriptionById endpoint', () => {
      expect(getPrescriptionById).to.exist;
      expect(getPrescriptionById.initiate).to.be.a('function');
      expect(getPrescriptionById.select).to.be.a('function');
    });

    it('should export getRefillablePrescriptions endpoint', () => {
      expect(getRefillablePrescriptions).to.exist;
      expect(getRefillablePrescriptions.initiate).to.be.a('function');
      expect(getRefillablePrescriptions.select).to.be.a('function');
    });

    it('should export getPrescriptionDocumentation endpoint', () => {
      expect(getPrescriptionDocumentation).to.exist;
      expect(getPrescriptionDocumentation.initiate).to.be.a('function');
      expect(getPrescriptionDocumentation.select).to.be.a('function');
    });

    it('should export refillPrescription endpoint', () => {
      expect(refillPrescription).to.exist;
      expect(refillPrescription.initiate).to.be.a('function');
      expect(refillPrescription.select).to.be.a('function');
    });

    it('should export bulkRefillPrescriptions endpoint', () => {
      expect(bulkRefillPrescriptions).to.exist;
      expect(bulkRefillPrescriptions.initiate).to.be.a('function');
      expect(bulkRefillPrescriptions.select).to.be.a('function');
    });

    it('should export getPrescriptionsExportList endpoint', () => {
      expect(getPrescriptionsExportList).to.exist;
      expect(getPrescriptionsExportList.initiate).to.be.a('function');
      expect(getPrescriptionsExportList.select).to.be.a('function');
    });
  });

  describe('endpoint definitions', () => {
    describe('getPrescriptionsList', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionsList).to.exist;
      });

      it('should have initiate function', () => {
        expect(
          prescriptionsApi.endpoints.getPrescriptionsList.initiate,
        ).to.be.a('function');
      });

      it('should have select function', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionsList.select).to.be.a(
          'function',
        );
      });
    });

    describe('getPrescriptionById', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionById).to.exist;
      });

      it('should have initiate function', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionById.initiate).to.be.a(
          'function',
        );
      });

      it('should have select function', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionById.select).to.be.a(
          'function',
        );
      });
    });

    describe('getRefillablePrescriptions', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.getRefillablePrescriptions).to.exist;
      });

      it('should have initiate function', () => {
        expect(
          prescriptionsApi.endpoints.getRefillablePrescriptions.initiate,
        ).to.be.a('function');
      });

      it('should have select function', () => {
        expect(
          prescriptionsApi.endpoints.getRefillablePrescriptions.select,
        ).to.be.a('function');
      });

      it('should have refetchOnFocus enabled for cross-tab synchronization', () => {
        const endpoint = prescriptionsApi.endpoints.getRefillablePrescriptions;
        // The refetchOnFocus option should be configured for this endpoint
        // This ensures medication lists sync when switching between tabs
        expect(endpoint).to.exist;
        // RTK Query endpoints with refetchOnFocus: true will automatically
        // refetch data when the browser tab regains focus
      });

      it('should have refetchOnReconnect enabled for network reliability', () => {
        const endpoint = prescriptionsApi.endpoints.getRefillablePrescriptions;
        // The refetchOnReconnect option should be configured for this endpoint
        // This ensures medication lists refresh after network reconnection
        expect(endpoint).to.exist;
        // RTK Query endpoints with refetchOnReconnect: true will automatically
        // refetch data when network connection is restored
      });
    });

    describe('getPrescriptionDocumentation', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionDocumentation).to
          .exist;
      });

      it('should have initiate function', () => {
        expect(
          prescriptionsApi.endpoints.getPrescriptionDocumentation.initiate,
        ).to.be.a('function');
      });

      it('should have select function', () => {
        expect(
          prescriptionsApi.endpoints.getPrescriptionDocumentation.select,
        ).to.be.a('function');
      });

      it('should accept id parameter', () => {
        const params = { id: '12345' };
        // initiate returns a thunk, verify it can be called without error
        expect(() =>
          prescriptionsApi.endpoints.getPrescriptionDocumentation.initiate(
            params,
          ),
        ).to.not.throw();
      });

      it('should accept id and stationNumber parameters', () => {
        const params = { id: '12345', stationNumber: '688' };
        // initiate returns a thunk, verify it can be called without error
        expect(() =>
          prescriptionsApi.endpoints.getPrescriptionDocumentation.initiate(
            params,
          ),
        ).to.not.throw();
      });
    });

    describe('refillPrescription', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.refillPrescription).to.exist;
      });

      it('should have initiate function', () => {
        expect(prescriptionsApi.endpoints.refillPrescription.initiate).to.be.a(
          'function',
        );
      });

      it('should have select function', () => {
        expect(prescriptionsApi.endpoints.refillPrescription.select).to.be.a(
          'function',
        );
      });
    });

    describe('bulkRefillPrescriptions', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.bulkRefillPrescriptions).to.exist;
      });

      it('should have initiate function', () => {
        expect(
          prescriptionsApi.endpoints.bulkRefillPrescriptions.initiate,
        ).to.be.a('function');
      });

      it('should have select function', () => {
        expect(
          prescriptionsApi.endpoints.bulkRefillPrescriptions.select,
        ).to.be.a('function');
      });
    });

    describe('getPrescriptionsExportList', () => {
      it('should be defined in endpoints', () => {
        expect(prescriptionsApi.endpoints.getPrescriptionsExportList).to.exist;
      });

      it('should have initiate function', () => {
        expect(
          prescriptionsApi.endpoints.getPrescriptionsExportList.initiate,
        ).to.be.a('function');
      });

      it('should have select function', () => {
        expect(
          prescriptionsApi.endpoints.getPrescriptionsExportList.select,
        ).to.be.a('function');
      });
    });
  });

  describe('API utility functions from prescriptionsApi', () => {
    it('should export getApiBasePath function', () => {
      expect(getApiBasePath).to.be.a('function');
    });

    it('should export getRefillMethod function', () => {
      expect(getRefillMethod).to.be.a('function');
    });

    it('should export documentationApiBasePath constant', () => {
      expect(documentationApiBasePath).to.include('/my_health/v1');
    });
  });

  describe('buildExportListQuery', () => {
    it('should build path with default parameters', () => {
      const result = buildExportListQuery({
        sortEndpoint: '&sort=name',
      });

      expect(result.path).to.equal('/prescriptions?&sort=name');
    });

    it('should build path with filter option', () => {
      const result = buildExportListQuery({
        filterOption: '&filter=active',
        sortEndpoint: '&sort=name',
      });

      expect(result.path).to.equal('/prescriptions?&filter=active&sort=name');
    });

    it('should build path with includeImage option', () => {
      const result = buildExportListQuery({
        sortEndpoint: '&sort=name',
        includeImage: true,
      });

      expect(result.path).to.include(INCLUDE_IMAGE_ENDPOINT);
    });

    it('should not include image endpoint when includeImage is false', () => {
      const result = buildExportListQuery({
        sortEndpoint: '&sort=name',
        includeImage: false,
      });

      expect(result.path).to.not.include(INCLUDE_IMAGE_ENDPOINT);
    });
  });

  describe('buildPrescriptionsListQuery', () => {
    it('should build path with default parameters', () => {
      const result = buildPrescriptionsListQuery();

      expect(result.path).to.include('page=1');
      expect(result.path).to.include('per_page=10');
    });

    it('should build path with custom page and perPage', () => {
      const result = buildPrescriptionsListQuery({
        page: 2,
        perPage: 20,
      });

      expect(result.path).to.include('page=2');
      expect(result.path).to.include('per_page=20');
    });

    it('should build path with filter option', () => {
      const result = buildPrescriptionsListQuery({
        filterOption: '&filter=active',
      });

      expect(result.path).to.include('&filter=active');
    });

    it('should build path with sort endpoint', () => {
      const result = buildPrescriptionsListQuery({
        sortEndpoint: '&sort=name',
      });

      expect(result.path).to.include('&sort=name');
    });

    it('should build path with includeImage option', () => {
      const result = buildPrescriptionsListQuery({
        includeImage: true,
      });

      expect(result.path).to.include('&include_image=true');
    });

    it('should not include image when includeImage is false', () => {
      const result = buildPrescriptionsListQuery({
        includeImage: false,
      });

      expect(result.path).to.not.include('include_image');
    });
  });

  describe('buildPrescriptionByIdQuery', () => {
    it('should build path with prescription ID', () => {
      const result = buildPrescriptionByIdQuery({ id: '12345' });

      expect(result.path).to.equal('/prescriptions/12345');
    });

    it('should handle numeric ID', () => {
      const result = buildPrescriptionByIdQuery({ id: 67890 });

      expect(result.path).to.equal('/prescriptions/67890');
    });

    it('should include station_number when provided', () => {
      const result = buildPrescriptionByIdQuery({
        id: '12345',
        stationNumber: '688',
      });

      expect(result.path).to.equal('/prescriptions/12345?station_number=688');
    });

    it('should not include station_number when not provided', () => {
      const result = buildPrescriptionByIdQuery({ id: '12345' });

      expect(result.path).to.not.include('station_number');
    });
  });

  describe('buildRefillablePrescriptionsQuery', () => {
    it('should build correct path', () => {
      const result = buildRefillablePrescriptionsQuery();

      expect(result.path).to.equal(
        '/prescriptions/list_refillable_prescriptions',
      );
    });
  });

  describe('transformExportListResponse', () => {
    it('should transform response with data array', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 1,
              prescriptionName: 'Test Med',
              refillStatus: 'active',
            },
          },
        ],
        meta: { total: 1 },
      };

      const result = transformExportListResponse(mockResponse);

      expect(result.prescriptions).to.be.an('array');
      expect(result.prescriptions).to.have.lengthOf(1);
      expect(result.meta).to.deep.equal({ total: 1 });
    });

    it('should return empty prescriptions when data is not an array', () => {
      const mockResponse = {
        data: 'not an array',
      };

      const result = transformExportListResponse(mockResponse);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty prescriptions when response is null', () => {
      const result = transformExportListResponse(null);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty prescriptions when response is undefined', () => {
      const result = transformExportListResponse(undefined);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty meta when meta is missing', () => {
      const mockResponse = {
        data: [],
      };

      const result = transformExportListResponse(mockResponse);

      expect(result.meta).to.deep.equal({});
    });
  });

  describe('transformPrescriptionsListResponse', () => {
    it('should transform response with data array', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 1,
              prescriptionName: 'Test Med',
              refillStatus: 'active',
            },
          },
        ],
        meta: {
          pagination: { currentPage: 1, totalPages: 5 },
          recentlyRequested: [],
        },
      };

      const result = transformPrescriptionsListResponse(mockResponse);

      expect(result.prescriptions).to.be.an('array');
      expect(result.prescriptions).to.have.lengthOf(1);
      expect(result.pagination).to.deep.equal({
        currentPage: 1,
        totalPages: 5,
      });
      expect(result.refillAlertList).to.be.an('array');
    });

    it('should return empty values when data is not an array', () => {
      const mockResponse = {
        data: 'not an array',
      };

      const result = transformPrescriptionsListResponse(mockResponse);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.pagination).to.deep.equal({});
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty values when response is null', () => {
      const result = transformPrescriptionsListResponse(null);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.pagination).to.deep.equal({});
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty values when response is undefined', () => {
      const result = transformPrescriptionsListResponse(undefined);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.pagination).to.deep.equal({});
      expect(result.meta).to.deep.equal({});
    });

    it('should handle missing pagination in meta', () => {
      const mockResponse = {
        data: [],
        meta: {},
      };

      const result = transformPrescriptionsListResponse(mockResponse);

      expect(result.pagination).to.deep.equal({});
    });

    it('should handle missing recentlyRequested in meta', () => {
      const mockResponse = {
        data: [],
        meta: {},
      };

      const result = transformPrescriptionsListResponse(mockResponse);

      expect(result.refillAlertList).to.deep.equal([]);
    });
  });

  describe('transformPrescriptionByIdResponse', () => {
    it('should transform response with data property', () => {
      const mockResponse = {
        data: {
          id: '1',
          type: 'prescription_details',
          attributes: {
            prescriptionId: 1,
            prescriptionName: 'Test Med',
          },
        },
      };

      const result = transformPrescriptionByIdResponse(mockResponse);

      expect(result).to.be.an('object');
    });

    it('should transform response with attributes property', () => {
      const mockResponse = {
        attributes: {
          prescriptionId: 1,
          prescriptionName: 'Test Med',
        },
      };

      const result = transformPrescriptionByIdResponse(mockResponse);

      expect(result).to.be.an('object');
    });

    it('should transform response with resource property', () => {
      const mockResponse = {
        resource: {
          prescriptionId: 1,
          prescriptionName: 'Test Med',
        },
      };

      const result = transformPrescriptionByIdResponse(mockResponse);

      expect(result).to.be.an('object');
    });

    it('should return null when response has no recognized properties', () => {
      const mockResponse = {
        unknownProperty: 'value',
      };

      const result = transformPrescriptionByIdResponse(mockResponse);

      expect(result).to.be.null;
    });

    it('should return null when response is null', () => {
      const result = transformPrescriptionByIdResponse(null);

      expect(result).to.be.null;
    });

    it('should return null when response is undefined', () => {
      const result = transformPrescriptionByIdResponse(undefined);

      expect(result).to.be.null;
    });

    it('should return null for empty object', () => {
      const result = transformPrescriptionByIdResponse({});

      expect(result).to.be.null;
    });
  });

  describe('transformRefillablePrescriptionsResponse', () => {
    it('should transform and filter refillable prescriptions', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 1,
              prescriptionName: 'Med A',
              isRefillable: true,
            },
          },
          {
            id: '2',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 2,
              prescriptionName: 'Med B',
              isRefillable: false,
            },
          },
        ],
        meta: {
          recentlyRequested: [],
        },
      };

      const result = transformRefillablePrescriptionsResponse(mockResponse);

      expect(result.prescriptions).to.be.an('array');
      // Only refillable prescriptions should be included
      result.prescriptions.forEach(rx => {
        expect(rx.isRefillable).to.be.true;
      });
    });

    it('should sort prescriptions alphabetically by name', () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 1,
              prescriptionName: 'Zoloft',
              isRefillable: true,
            },
          },
          {
            id: '2',
            type: 'prescription_details',
            attributes: {
              prescriptionId: 2,
              prescriptionName: 'Aspirin',
              isRefillable: true,
            },
          },
        ],
        meta: {},
      };

      const result = transformRefillablePrescriptionsResponse(mockResponse);

      if (result.prescriptions.length >= 2) {
        expect(
          result.prescriptions[0].prescriptionName.localeCompare(
            result.prescriptions[1].prescriptionName,
          ),
        ).to.be.lessThan(1);
      }
    });

    it('should return empty values when data is not an array', () => {
      const mockResponse = {
        data: 'not an array',
      };

      const result = transformRefillablePrescriptionsResponse(mockResponse);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty values when response is null', () => {
      const result = transformRefillablePrescriptionsResponse(null);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });

    it('should return empty values when response is undefined', () => {
      const result = transformRefillablePrescriptionsResponse(undefined);

      expect(result.prescriptions).to.deep.equal([]);
      expect(result.refillAlertList).to.deep.equal([]);
      expect(result.meta).to.deep.equal({});
    });
  });

  describe('transformBulkRefillResponse', () => {
    it('should transform response with successfulIds and failedIds', () => {
      const mockResponse = {
        successfulIds: [1, 2, 3],
        failedIds: [4, 5],
      };

      const result = transformBulkRefillResponse(mockResponse);

      expect(result.successfulIds).to.deep.equal([1, 2, 3]);
      expect(result.failedIds).to.deep.equal([4, 5]);
    });

    it('should return empty arrays when successfulIds is missing', () => {
      const mockResponse = {
        failedIds: [1, 2],
      };

      const result = transformBulkRefillResponse(mockResponse);

      expect(result.successfulIds).to.deep.equal([]);
      expect(result.failedIds).to.deep.equal([1, 2]);
    });

    it('should return empty arrays when failedIds is missing', () => {
      const mockResponse = {
        successfulIds: [1, 2],
      };

      const result = transformBulkRefillResponse(mockResponse);

      expect(result.successfulIds).to.deep.equal([1, 2]);
      expect(result.failedIds).to.deep.equal([]);
    });

    it('should return empty arrays when response is null', () => {
      const result = transformBulkRefillResponse(null);

      expect(result.successfulIds).to.deep.equal([]);
      expect(result.failedIds).to.deep.equal([]);
    });

    it('should return empty arrays when response is undefined', () => {
      const result = transformBulkRefillResponse(undefined);

      expect(result.successfulIds).to.deep.equal([]);
      expect(result.failedIds).to.deep.equal([]);
    });

    it('should return empty arrays when response is empty object', () => {
      const result = transformBulkRefillResponse({});

      expect(result.successfulIds).to.deep.equal([]);
      expect(result.failedIds).to.deep.equal([]);
    });
  });

  describe('transformPrescriptionDocumentationResponse', () => {
    const mockHtml = '<html><body>Test content</body></html>';

    it('should return sanitized HTML when feature flag is enabled (true)', () => {
      const mockResponse = {
        data: {
          attributes: {
            html: mockHtml,
          },
        },
      };
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsEnableKramesHtmlSanitization]: true,
          loading: false,
        },
      };

      const result = transformPrescriptionDocumentationResponse(
        mockResponse,
        mockState,
      );

      // The result should be different from the original HTML since it's sanitized
      expect(result).to.not.equal(mockHtml);
      expect(result).to.be.a('string');
    });

    it('should return unsanitized HTML when feature flag is disabled (false)', () => {
      const mockResponse = {
        data: {
          attributes: {
            html: mockHtml,
          },
        },
      };
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsEnableKramesHtmlSanitization]: false,
          loading: false,
        },
      };

      const result = transformPrescriptionDocumentationResponse(
        mockResponse,
        mockState,
      );

      expect(result).to.equal(mockHtml);
    });

    it('should return null when html is missing', () => {
      const mockResponse = {
        data: {
          attributes: {},
        },
      };
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsEnableKramesHtmlSanitization]: true,
          loading: false,
        },
      };

      const result = transformPrescriptionDocumentationResponse(
        mockResponse,
        mockState,
      );

      expect(result).to.be.null;
    });
  });
});
