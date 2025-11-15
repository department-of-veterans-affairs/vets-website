/* eslint-disable import/no-dynamic-require */
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';

const resolveFromSrc = relativePath =>
  path.resolve(process.cwd(), 'src', relativePath);

const PRESCRIPTIONS_API_PATH = resolveFromSrc(
  'applications/mhv-medications/api/prescriptionsApi.js',
);
const HELPERS_PATH = resolveFromSrc(
  'applications/mhv-medications/util/helpers/index.js',
);
const PLATFORM_EXPORTS_PATH = resolveFromSrc(
  'platform/utilities/exportsFile.js',
);

describe('prescriptionsApi', () => {
  let sandbox;
  let convertPrescriptionStub;
  let filterAlertsStub;
  let sanitizeHtmlStub;
  let platformExportsModule;
  let recordedApi;
  let originalCreateApiExports;
  let rtkModulePath;
  let prescriptionsApiModule;
  let baseApiUrl;
  let apiRequestStub;
  let helpersModulePath;
  let originalHelpersExports;
  let platformExportsModulePath;
  let originalPlatformExports;
  let rtkOriginalModule;
  let getPrescriptionsList;
  let getPrescriptionsExportList;
  let getPrescriptionById;
  let getRefillablePrescriptions;
  let getPrescriptionDocumentation;
  let bulkRefillPrescriptions;

  const loadPrescriptionsApi = () => {
    delete require.cache[PRESCRIPTIONS_API_PATH];
    prescriptionsApiModule = require(PRESCRIPTIONS_API_PATH);
    ({
      getPrescriptionsList,
      getPrescriptionsExportList,
      getPrescriptionById,
      getRefillablePrescriptions,
      getPrescriptionDocumentation,
      bulkRefillPrescriptions,
    } = prescriptionsApiModule);
  };

  const restoreCreateApi = () => {
    if (originalCreateApiExports && rtkModulePath) {
      require.cache[rtkModulePath].exports = originalCreateApiExports;
      originalCreateApiExports = null;
    }
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    helpersModulePath = require.resolve(HELPERS_PATH);
    platformExportsModulePath = require.resolve(PLATFORM_EXPORTS_PATH);

    if (!require.cache[helpersModulePath]) {
      require(helpersModulePath);
    }
    if (!require.cache[platformExportsModulePath]) {
      require(platformExportsModulePath);
    }

    originalHelpersExports = require.cache[helpersModulePath]?.exports;
    originalPlatformExports = require.cache[platformExportsModulePath]?.exports;

    global.sessionStorage = {
      getItem: sandbox.stub().returns('alphabeticallyByStatus'),
      setItem: sandbox.stub(),
      removeItem: sandbox.stub(),
      clear: sandbox.stub(),
    };

    convertPrescriptionStub = sandbox.stub().callsFake(prescription => {
      if (!prescription) return null;
      const source = prescription.attributes || prescription;
      return {
        ...source,
        source,
      };
    });
    filterAlertsStub = sandbox
      .stub()
      .callsFake(list => list.map(item => ({ ...item, flagged: true })));
    sanitizeHtmlStub = sandbox.stub().callsFake(html => `sanitized:${html}`);

    const patchedHelpersExports = {
      ...originalHelpersExports,
      convertPrescription: convertPrescriptionStub,
      filterRecentlyRequestedForAlerts: filterAlertsStub,
      sanitizeKramesHtmlStr: sanitizeHtmlStub,
    };
    require.cache[helpersModulePath].exports = patchedHelpersExports;

    apiRequestStub = sandbox.stub();
    platformExportsModule = {
      ...originalPlatformExports,
      apiRequest: apiRequestStub,
    };
    require.cache[platformExportsModulePath].exports = platformExportsModule;
    baseApiUrl = platformExportsModule.environment.API_URL;

    rtkOriginalModule = require('@reduxjs/toolkit/query/react');
    rtkModulePath = require.resolve('@reduxjs/toolkit/query/react');
    originalCreateApiExports = require.cache[rtkModulePath]?.exports || {
      ...rtkOriginalModule,
    };

    recordedApi = null;

    const createApiStub = config => {
      const endpoints = {};
      const endpointTypes = {};

      const builder = {
        query: definition => ({ ...definition, __endpointType: 'query' }),
        mutation: definition => ({ ...definition, __endpointType: 'mutation' }),
      };

      const definitions = config.endpoints(builder);

      Object.entries(definitions).forEach(([name, definitionWithType]) => {
        const { __endpointType, ...definition } = definitionWithType;
        const type = __endpointType || 'query';
        endpoints[name] = definition;
        endpointTypes[name] = type;
      });

      recordedApi = {
        config,
        endpoints,
        endpointTypes,
      };

      const apiObject = {
        reducerPath: config.reducerPath,
        keepUnusedDataFor: config.keepUnusedDataFor,
        tagTypes: config.tagTypes,
        baseQuery: config.baseQuery,
        endpoints,
        usePrefetch: sandbox.stub(),
      };

      Object.entries(endpointTypes).forEach(([name, type]) => {
        const capitalized = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const hookName =
          type === 'mutation'
            ? `use${capitalized}Mutation`
            : `use${capitalized}Query`;
        apiObject[hookName] = sandbox.stub();
      });

      return apiObject;
    };

    require.cache[rtkModulePath].exports = {
      ...rtkOriginalModule,
      createApi: createApiStub,
    };

    loadPrescriptionsApi();
  });

  afterEach(() => {
    sandbox.restore();
    delete require.cache[PRESCRIPTIONS_API_PATH];
    if (helpersModulePath && originalHelpersExports) {
      require.cache[helpersModulePath].exports = originalHelpersExports;
    }
    if (platformExportsModulePath && originalPlatformExports) {
      require.cache[
        platformExportsModulePath
      ].exports = originalPlatformExports;
    }
    restoreCreateApi();
  });

  it('passes options to apiRequest and returns data on success', async () => {
    const responsePayload = { data: 'ok' };
    apiRequestStub.resolves(responsePayload);

    const result = await recordedApi.config.baseQuery({
      path: '/my-path',
      options: {
        method: 'POST',
        headers: { Accept: 'application/json' },
      },
    });

    expect(platformExportsModule.apiRequest.calledOnce).to.be.true;
    expect(platformExportsModule.apiRequest.firstCall.args[0]).to.equal(
      '/my-path',
    );
    expect(platformExportsModule.apiRequest.firstCall.args[1]).to.deep.equal({
      headers: { Accept: 'application/json' },
      method: 'POST',
    });

    // When no headers are provided, default headers should be applied
    await recordedApi.config.baseQuery({ path: '/no-headers' });
    expect(platformExportsModule.apiRequest.secondCall.args[1]).to.deep.equal({
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).to.deep.equal({ data: responsePayload });
  });

  it('returns formatted error when baseQuery throws', async () => {
    apiRequestStub.rejects({
      errors: [{ status: 401, title: 'Unauthorized' }],
    });

    const result = await recordedApi.config.baseQuery({
      path: '/error',
    });

    expect(result).to.deep.equal({
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    });
  });

  it('builds default query params for getPrescriptionsList', () => {
    const queryConfig = getPrescriptionsList.query();

    expect(queryConfig).to.deep.equal({
      path: `${baseApiUrl}/my_health/v1/prescriptions?page=1&per_page=10&sort=alphabetical-status`,
    });
  });

  it('builds custom query params for getPrescriptionsList', () => {
    const queryConfig = getPrescriptionsList.query({
      page: 3,
      perPage: 5,
      filterOption: '&filter=test',
      sortEndpoint: '&sort=custom',
      includeImage: true,
    });

    expect(queryConfig.path).to.equal(
      `${baseApiUrl}/my_health/v1/prescriptions?page=3&per_page=5&filter=test&sort=custom&include_image=true`,
    );
  });

  it('transforms prescription list responses', () => {
    const transform = getPrescriptionsList.transformResponse;
    const response = {
      data: [
        { attributes: { prescriptionId: 1, prescriptionName: 'B' } },
        { attributes: { prescriptionId: 2, prescriptionName: 'A' } },
      ],
      meta: {
        recentlyRequested: [{ id: 'alert' }],
        pagination: { currentPage: 1 },
      },
    };

    const result = transform(response);

    expect(result.prescriptions).to.have.lengthOf(2);
    expect(result.refillAlertList).to.deep.equal([
      { id: 'alert', flagged: true },
    ]);
    expect(result.pagination).to.deep.equal({ currentPage: 1 });
    expect(convertPrescriptionStub.calledTwice).to.be.true;
    expect(filterAlertsStub.calledOnce).to.be.true;
  });

  it('returns defaults when prescription list response is empty', () => {
    const transform = getPrescriptionsList.transformResponse;
    const result = transform({});

    expect(result).to.deep.equal({
      prescriptions: [],
      refillAlertList: [],
      pagination: {},
      meta: {},
    });
  });

  it('builds export list query string', () => {
    const queryConfig = getPrescriptionsExportList.query({
      filterOption: '&filter=foo',
      sortEndpoint: '&sort=bar',
      includeImage: true,
    });

    expect(queryConfig.path).to.equal(
      `${baseApiUrl}/my_health/v1/prescriptions?&filter=foo&sort=bar&include_image=true`,
    );
  });

  it('transforms single prescription responses', () => {
    const transform = getPrescriptionById.transformResponse;
    const response = {
      data: { attributes: { prescriptionId: 123 } },
    };
    const result = transform(response);

    expect(result).to.deep.equal({
      prescriptionId: 123,
      source: { prescriptionId: 123 },
    });
    expect(convertPrescriptionStub.calledOnce).to.be.true;
  });

  it('transforms vanilla prescription responses without data wrapper', () => {
    const transform = getPrescriptionById.transformResponse;
    const response = { attributes: { prescriptionId: 999 } };
    const result = transform(response);

    expect(result).to.deep.equal({
      prescriptionId: 999,
      source: { prescriptionId: 999 },
    });
    expect(convertPrescriptionStub.called).to.be.true;
  });

  it('sanitizes documentation HTML', () => {
    const transform = getPrescriptionDocumentation.transformResponse;
    const htmlResponse = {
      data: {
        attributes: {
          html: '<p>unsafe</p>',
        },
      },
    };

    const result = transform(htmlResponse);

    expect(result).to.equal('sanitized:<p>unsafe</p>');
    expect(sanitizeHtmlStub.calledOnce).to.be.true;
  });

  it('filters and sorts refillable prescriptions', () => {
    const transform = getRefillablePrescriptions.transformResponse;
    const response = {
      data: [
        {
          attributes: {
            prescriptionId: 1,
            prescriptionName: 'Zed',
            isRefillable: true,
          },
        },
        {
          attributes: {
            prescriptionId: 2,
            prescriptionName: 'Alpha',
            isRefillable: false,
          },
        },
        {
          attributes: {
            prescriptionId: 3,
            prescriptionName: 'Beta',
            isRefillable: true,
          },
        },
      ],
      meta: {
        recentlyRequested: [{ id: 'alert' }],
      },
    };

    const result = transform(response);

    expect(result.prescriptions.map(rx => rx.prescriptionName)).to.deep.equal([
      'Beta',
      'Zed',
    ]);
    expect(result.refillAlertList).to.deep.equal([
      { id: 'alert', flagged: true },
    ]);
    expect(convertPrescriptionStub.callCount).to.be.greaterThan(0);
  });

  it('returns defaults when refillable prescription response is empty', () => {
    const transform = getRefillablePrescriptions.transformResponse;
    const result = transform({});

    expect(result).to.deep.equal({
      prescriptions: [],
      refillAlertList: [],
      meta: {},
    });
  });

  it('transforms bulk refill response', () => {
    const transform = bulkRefillPrescriptions.transformResponse;
    const result = transform({
      successfulIds: ['1', '2'],
      failedIds: ['3'],
    });

    expect(result).to.deep.equal({
      successfulIds: ['1', '2'],
      failedIds: ['3'],
    });
  });

  it('returns default arrays when bulk refill response is empty', () => {
    const transform = bulkRefillPrescriptions.transformResponse;
    const result = transform({});

    expect(result).to.deep.equal({
      successfulIds: [],
      failedIds: [],
    });
  });
});
