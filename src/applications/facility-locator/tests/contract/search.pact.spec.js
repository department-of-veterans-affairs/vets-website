import contractTest from 'platform/testing/contract';

import {
  fetchLocations,
  fetchVAFacility,
  getProviderSpecialties,
} from '../../actions';
import {
  decimal,
  eachLike,
  integer,
  string,
} from '@pact-foundation/pact/dsl/matchers';
import sinon from 'sinon';

const bounds = ['-112.54', '32.53', '-111.04', '34.03'];
const address = 'South Gilbert Road, Chandler, Arizona 85286, United States';

const ccpInteraction = {
  state: 'ccp data exists',
  uponReceiving: 'a request for ccp data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/ccp',
    headers: {
      'X-Key-Inflection': 'camel',
    },
    query: {
      address,
      'bbox[]': bounds,
      type: 'pharmacy',
      page: '1',
      // eslint-disable-next-line camelcase
      per_page: '10',
      trim: 'true',
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: string('1972660348'),
        type: 'provider',
        attributes: {
          address: {
            street: string('2750 E GERMANN RD'),
            city: string('CHANDLER'),
            state: string('AZ'),
            zip: string('85249'),
          },
          caresitePhone: string('4808122942'),
          lat: decimal(33.281291),
          long: decimal(-111.793486),
          name: string('WAL-MART'),
        },
      }),
    },
  },
};

const vaInteraction = {
  state: 'va data exists',
  uponReceiving: 'a request for va data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/va',
    headers: {
      'X-Key-Inflection': 'camel',
    },
    query: {
      'bbox[]': bounds,
      type: 'health',
      'services[]': 'PrimaryCare',
      page: '1',
      // eslint-disable-next-line camelcase
      per_page: '20',
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: string('1972660348'),
        type: 'facility',
        attributes: {
          address: {
            street: string('2750 E GERMANN RD'),
            city: string('CHANDLER'),
            state: string('AZ'),
            zip: string('85249'),
          },
          phone: {
            main: string('919-286-0411'),
            mentalHealthClinic: string('919-286-0411'),
          },
          lat: decimal(33.281291),
          long: decimal(-111.793486),
          name: string('WAL-MART'),
        },
      }),
      links: {
        first: string(
          'https://dev-api.va.gov/v1/facilities/va?bbox%5B%5D=-79.43&bbox%5B%5D=35.03&bbox%5B%5D=-77.93&bbox%5B%5D=36.53&page=1&per_page=20&services%5B%5D=PrimaryCare&type=health',
        ),
        last: string(
          'https://dev-api.va.gov/v1/facilities/va?bbox%5B%5D=-79.43&bbox%5B%5D=35.03&bbox%5B%5D=-77.93&bbox%5B%5D=36.53&page=1&per_page=20&services%5B%5D=PrimaryCare&type=health',
        ),
        next: null,
        prev: null,
        self: string(
          'https://staging-api.va.gov/v1/facilities/va?bbox%5B%5D=-79.43&bbox%5B%5D=35.03&bbox%5B%5D=-77.93&bbox%5B%5D=36.53&page=1&per_page=20&services%5B%5D=PrimaryCare&type=health',
        ),
      },
      meta: {
        pagination: {
          currentPage: integer(1),
          prevPage: null,
          nextPage: null,
          totalPages: integer(1),
        },
      },
    },
  },
};

const vaDetailInteraction = {
  state: 'va data exists',
  uponReceiving: 'a request for va facility data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/va/vha_123ABC',
    headers: {
      'X-Key-Inflection': 'camel',
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: 'vha_123ABC',
        type: 'facility',
        attributes: {
          address: {
            street: string('2750 E GERMANN RD'),
            city: string('CHANDLER'),
            state: string('AZ'),
            zip: string('85249'),
          },
          facilityType: 'va_health_facility',
          feedback: {
            health: {
              primaryCareRoutine: decimal(0.8500000238418579),
              primaryCareUrgent: decimal(0.8299999833106995),
              specialtyCareRoutine: decimal(0.8199999928474426),
              specialtyCareUrgent: decimal(0.6600000262260437),
            },
            effectiveDate: null,
          },
          hours: {
            monday: string('24/7'),
            tuesday: string('24/7'),
            wednesday: string('24/7'),
            thursday: string('24/7'),
            friday: string('24/7'),
            saturday: string('24/7'),
            sunday: string('24/7'),
          },
          lat: decimal(33.281291),
          long: decimal(-111.793486),
          name: string('WAL-MART'),
          operatingStatus: { code: string('NORMAL') },
          phone: {
            fax: string('919-286-6825'),
            main: string('919-286-0411'),
            mentalHealthClinic: string('919-286-0411 x 5418'),
            pharmacy: string('888-878-6890'),
          },
          services: {
            health: eachLike(string('Audiology')),
            lastUpdated: string('2020-09-28'),
            other: eachLike(string('Poetry Therapy')),
          },
          website: string('https://www.durham.va.gov/locations/directions.asp'),
        },
      }),
    },
  },
};

const ccpSpecialtiesInteraction = {
  state: 'ccp specialties data exists',
  uponReceiving: 'a request for ccp specialties data',
  withRequest: {
    method: 'GET',
    path: '/v1/facilities/ccp/specialties',
    headers: {
      'X-Key-Inflection': 'camel',
    },
  },
  willRespondWith: {
    status: 200,
    body: {
      data: eachLike({
        id: string('400VATAICX'),
        attributes: {
          classification: string(
            'Complementary and Integrative Healthcare Services CIHS',
          ),
          name: string(
            'Complementary and Integrative Healthcare Services CIHS - TaiChi ',
          ),
          specialtyCode: string('400VATAICX'),
          specialtyDescription: string(
            'Description: Tai Chi They involves certain postures and gentle movements with mental focus, breathing, and relaxation. The movements can be adapted or practiced while walking, standing, or sitting. Delivered by a certified Tai Chi instructor',
          ),
        },
      }),
    },
  },
};

const dispatch = sinon.stub();

// TODO enable test after backend support is available
// The pact that hasn’t been verified yet

contractTest('Facility Locator', 'VA.gov API', mockApi => {
  describe.skip('GET /v1/facilities/ccp', () => {
    context('facilities: ccp data exists', () => {
      it('responds appropriately', async () => {
        await mockApi().addInteraction(ccpInteraction);
        await fetchLocations(address, bounds, 'pharmacy', null, 1, dispatch);
      });
    });
  });

  describe.skip('GET /v1/facilities/ccp/specialties', () => {
    context('facilities: ccp specialties data exists', () => {
      it('responds appropriately', async () => {
        await mockApi().addInteraction(ccpSpecialtiesInteraction);
        await getProviderSpecialties()(dispatch);
      });
    });
  });

  describe.skip('GET /v1/facilities/va', () => {
    context('facilities: va data exists', () => {
      it('responds appropriately', async () => {
        await mockApi().addInteraction(vaInteraction);
        await fetchLocations(
          null,
          bounds,
          'health',
          'PrimaryCare',
          1,
          dispatch,
        );
      });
    });
  });

  describe.skip('GET /v1/facilities/va/:id', () => {
    context('facilities: va data exists', () => {
      it('responds appropriately', async () => {
        await mockApi().addInteraction(vaDetailInteraction);
        await fetchVAFacility('vha_123ABC')(dispatch);
      });
    });
  });
});
