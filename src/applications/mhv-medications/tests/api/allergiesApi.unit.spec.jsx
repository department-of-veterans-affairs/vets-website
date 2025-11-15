/* eslint-disable import/no-dynamic-require */
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';

const resolveFromSrc = relativePath =>
  path.resolve(process.cwd(), 'src', relativePath);

const ALLERGIES_API_PATH = resolveFromSrc(
  'applications/mhv-medications/api/allergiesApi.js',
);
const HELPERS_PATH = resolveFromSrc(
  'applications/mhv-medications/util/helpers/index.js',
);
const PLATFORM_EXPORTS_PATH = resolveFromSrc(
  'platform/utilities/exportsFile.js',
);
const CONSTANTS_PATH = resolveFromSrc(
  'applications/mhv-medications/util/constants.js',
);

describe('allergiesApi', () => {
  let sandbox;
  let recordedApi;
  let allergiesApiModule;
  let originalHelpersExports;
  let originalPlatformExports;
  let helpersModulePath;
  let platformExportsModulePath;
  let rtkModulePath;
  let originalCreateApiExports;
  let apiRequestStub;
  let formatDateLongStub;
  let extractContainedResourceStub;
  let getReactionsStub;
  let isArrayAndHasItemsStub;
  let baseApiUrl;
  let convertAllergy;
  let getAllergies;
  let getAllergyById;
  // eslint-disable-next-line no-unused-vars
  let allergyTypes;

  const loadAllergiesApi = () => {
    delete require.cache[ALLERGIES_API_PATH];
    allergiesApiModule = require(ALLERGIES_API_PATH);
    ({ convertAllergy, getAllergies, getAllergyById } = allergiesApiModule);
  };

  const restoreCreateApi = () => {
    if (originalCreateApiExports && rtkModulePath) {
      require.cache[rtkModulePath].exports = originalCreateApiExports;
      originalCreateApiExports = null;
    }
  };

  const createSampleAllergy = overrides => ({
    id: 'allergy-1',
    category: ['medication'],
    code: { text: 'Penicillin' },
    recordedDate: '2024-01-01',
    note: [{ text: 'First note' }],
    recorder: {
      extension: [
        {
          valueReference: {
            reference: '#org1',
          },
        },
      ],
    },
    extension: [
      {
        url: 'allergyObservedHistoric',
        valueCode: 'o',
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ({ allergyTypes } = require(CONSTANTS_PATH));

    helpersModulePath = require.resolve(HELPERS_PATH);
    platformExportsModulePath = require.resolve(PLATFORM_EXPORTS_PATH);

    if (!require.cache[helpersModulePath]) {
      require(helpersModulePath);
    }
    if (!require.cache[platformExportsModulePath]) {
      require(platformExportsModulePath);
    }

    originalHelpersExports = require.cache[helpersModulePath].exports;
    originalPlatformExports = require.cache[platformExportsModulePath].exports;

    extractContainedResourceStub = sandbox
      .stub()
      .callsFake((_allergy, _ref) => ({ name: 'Stubbed facility' }));
    getReactionsStub = sandbox.stub().returns(['reaction']);
    isArrayAndHasItemsStub = sandbox
      .stub()
      .callsFake(value => Array.isArray(value) && value.length > 0);

    require.cache[helpersModulePath].exports = {
      ...originalHelpersExports,
      extractContainedResource: extractContainedResourceStub,
      getReactions: getReactionsStub,
      isArrayAndHasItems: isArrayAndHasItemsStub,
    };

    apiRequestStub = sandbox.stub();
    formatDateLongStub = sandbox.stub().callsFake(date => `formatted:${date}`);

    require.cache[platformExportsModulePath].exports = {
      ...originalPlatformExports,
      apiRequest: apiRequestStub,
      formatDateLong: formatDateLongStub,
    };

    baseApiUrl =
      require.cache[platformExportsModulePath].exports.environment.API_URL;

    const rtkModule = require('@reduxjs/toolkit/query/react');
    rtkModulePath = require.resolve('@reduxjs/toolkit/query/react');
    originalCreateApiExports = require.cache[rtkModulePath].exports;

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
      ...rtkModule,
      createApi: createApiStub,
    };

    loadAllergiesApi();
  });

  afterEach(() => {
    sandbox.restore();
    delete require.cache[ALLERGIES_API_PATH];

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

  it('passes path and options to apiRequest and returns data', async () => {
    const responsePayload = { data: 'ok' };
    apiRequestStub.resolves(responsePayload);

    const result = await recordedApi.config.baseQuery({
      path: '/my-path',
      options: {
        method: 'POST',
        headers: { Accept: 'application/json' },
      },
    });

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.firstCall.args[0]).to.equal('/my-path');
    expect(apiRequestStub.firstCall.args[1]).to.deep.equal({
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    expect(result).to.deep.equal({ data: responsePayload });
  });

  it('returns formatted error when apiRequest rejects', async () => {
    apiRequestStub.rejects({ status: 404, message: 'Not found' });

    const result = await recordedApi.config.baseQuery({
      path: '/error',
    });

    expect(result).to.deep.equal({
      error: {
        status: 404,
        message: 'Not found',
      },
    });
  });

  it('builds correct query config for getAllergies', () => {
    const queryConfig = getAllergies.query();

    expect(queryConfig).to.deep.equal({
      path: `${baseApiUrl}/my_health/v1/medical_records/allergies`,
    });
  });

  it('transforms getAllergies responses into converted allergies', () => {
    const allergies = [
      createSampleAllergy({
        id: 'allergy-1',
        category: ['medication'],
        code: { text: 'Penicillin' },
        recordedDate: '2024-01-01',
        extension: [
          {
            url: 'allergyObservedHistoric',
            valueCode: 'o',
          },
        ],
      }),
      createSampleAllergy({
        id: 'allergy-2',
        category: ['food'],
        code: { text: 'Peanuts' },
        recordedDate: '2024-02-02',
        extension: [
          {
            url: 'allergyObservedHistoric',
            valueCode: 'h',
          },
        ],
      }),
    ];

    const expected = allergies.map(allergy => convertAllergy(allergy));

    extractContainedResourceStub.resetHistory();
    getReactionsStub.resetHistory();
    formatDateLongStub.resetHistory();
    isArrayAndHasItemsStub.resetHistory();

    const transformed = getAllergies.transformResponse({
      entry: allergies.map(resource => ({ resource })),
    });

    expect(transformed).to.deep.equal(expected);
    expect(getReactionsStub.callCount).to.equal(allergies.length);
    expect(formatDateLongStub.callCount).to.equal(allergies.length);
    expect(extractContainedResourceStub.callCount).to.equal(allergies.length);
  });

  it('returns an empty array when getAllergies response has no entries', () => {
    const transformed = getAllergies.transformResponse({});
    expect(transformed).to.deep.equal([]);
  });

  it('builds correct query config for getAllergyById', () => {
    const queryConfig = getAllergyById.query('123');

    expect(queryConfig).to.deep.equal({
      path: `${baseApiUrl}/my_health/v1/medical_records/allergies/123`,
    });
  });

  it('transforms getAllergyById responses when resource is top-level', () => {
    const resource = createSampleAllergy({
      id: 'top-level',
      code: { text: 'Latex' },
      recordedDate: '2024-03-03',
    });

    const expected = convertAllergy(resource);

    extractContainedResourceStub.resetHistory();
    getReactionsStub.resetHistory();
    formatDateLongStub.resetHistory();
    isArrayAndHasItemsStub.resetHistory();

    const transformed = getAllergyById.transformResponse({ resource });

    expect(transformed).to.deep.equal(expected);
    expect(getReactionsStub.calledOnce).to.be.true;
    expect(formatDateLongStub.calledOnce).to.be.true;
  });

  it('transforms getAllergyById responses when resource is inside entry array', () => {
    const resource = createSampleAllergy({
      id: 'entry-based',
      code: { text: 'Gluten' },
      recordedDate: '2024-04-04',
    });

    const expected = convertAllergy(resource);

    extractContainedResourceStub.resetHistory();
    getReactionsStub.resetHistory();
    formatDateLongStub.resetHistory();
    isArrayAndHasItemsStub.resetHistory();

    const transformed = getAllergyById.transformResponse({
      entry: [{ resource }],
    });

    expect(transformed).to.deep.equal(expected);
    expect(getReactionsStub.calledOnce).to.be.true;
    expect(formatDateLongStub.calledOnce).to.be.true;
  });

  it('returns original response when getAllergyById has no resource', () => {
    const response = { data: { unexpected: true } };
    const transformed = getAllergyById.transformResponse(response);

    expect(transformed).to.equal(response);
  });
});
