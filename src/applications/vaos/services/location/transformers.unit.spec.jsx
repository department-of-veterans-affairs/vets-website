import { expect } from 'chai';
import {
  transformFacilityV2,
  transformSettingsV2,
  setSupportedSchedulingMethods,
  transformCommunityProviders,
  transformParentFacilitiesV2,
  transformFacilitiesV2,
} from './transformers';
import { VHA_FHIR_ID, TYPE_OF_CARE_IDS } from '../../utils/constants';

describe('vaos/services/location/transformers', () => {
  describe('transformFacilityV2', () => {
    it('should transform a facility object into a Location resource', () => {
      const facility = {
        id: '983',
        vistaSite: '983',
        name: 'Cheyenne VA Medical Center',
        phone: { main: '307-778-7550' },
        long: -104.8,
        lat: 41.1,
        physicalAddress: {
          line: ['2360 East Pershing Boulevard'],
          city: 'Cheyenne',
          state: 'WY',
          postalCode: '82001-5356',
        },
        website: 'https://www.va.gov/cheyenne-health-care',
      };

      const result = transformFacilityV2(facility);

      expect(result.resourceType).to.equal('Location');
      expect(result.id).to.equal('983');
      expect(result.vistaId).to.equal('983');
      expect(result.name).to.equal('Cheyenne VA Medical Center');
      expect(result.telecom[0].value).to.equal('307-778-7550');
      expect(result.position.longitude).to.equal(-104.8);
      expect(result.position.latitude).to.equal(41.1);
      expect(result.address.city).to.equal('Cheyenne');
      expect(result.website).to.equal(
        'https://www.va.gov/cheyenne-health-care',
      );
    });

    it('should handle physical_address (snake_case) format', () => {
      const facility = {
        id: '983',
        vistaSite: '983',
        name: 'Test Facility',
        physicalAddress: {
          line: ['123 Test St'],
          city: 'Test City',
          state: 'TC',
          postalCode: '12345',
        },
      };

      const result = transformFacilityV2(facility);

      expect(result.vistaId).to.equal('983');
      expect(result.address.line).to.deep.equal(['123 Test St']);
      expect(result.address.city).to.equal('Test City');
    });
  });

  describe('transformSettingsV2', () => {
    const settingsMock = [
      {
        id: '983',
        vaServices: [
          {
            clinicalServiceId: 'primaryCare',
            bookedAppointments: true,
            direct: { enabled: true },
          },
          {
            clinicalServiceId: 'audiology',
            bookedAppointments: false,
            direct: { enabled: false },
          },
        ],
        services: [
          { id: 'primaryCare', direct: { enabled: true } },
          { id: 'audiology', direct: { enabled: false } },
        ],
      },
    ];

    it('should use services when useVpg is false', () => {
      const result = transformSettingsV2(settingsMock, false);

      expect(result[0].services.length).to.equal(2);
      // getTypeOfCareIdFromV2 maps 'primaryCare' to TYPE_OF_CARE_IDS.PRIMARY_CARE
      expect(result[0].services[0]).to.have.property(
        'id',
        TYPE_OF_CARE_IDS.PRIMARY_CARE,
      );
      expect(result[0].services[1]).to.have.property(
        'id',
        TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
      );
    });

    it('should use vaServices when useVpg is true', () => {
      const result = transformSettingsV2(settingsMock, true);

      expect(result[0].services.length).to.equal(2);
      // getTypeOfCareIdFromV2 maps 'primaryCare' to TYPE_OF_CARE_IDS.PRIMARY_CARE
      expect(result[0].services[0]).to.have.property(
        'id',
        TYPE_OF_CARE_IDS.PRIMARY_CARE,
      );
      expect(result[0].services[0]).to.have.property(
        'bookedAppointments',
        true,
      );
      expect(result[0].services[1]).to.have.property(
        'id',
        TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
      );
    });

    it('should default useVpg to false', () => {
      const result = transformSettingsV2(settingsMock);

      expect(result[0].services.length).to.equal(2);
      expect(result[0].services[0]).to.have.property(
        'id',
        TYPE_OF_CARE_IDS.PRIMARY_CARE,
      );
    });
  });

  describe('setSupportedSchedulingMethods', () => {
    const settingsMock = [
      {
        id: '983',
        services: [
          {
            id: TYPE_OF_CARE_IDS.PRIMARY_CARE,
            direct: { enabled: true },
            bookedAppointments: true,
          },
          {
            id: TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
            direct: { enabled: false },
            bookedAppointments: false,
          },
        ],
      },
    ];

    const locationMock = {
      id: '983',
      identifier: [
        {
          system: VHA_FHIR_ID,
          value: '983',
        },
      ],
      name: 'Test Location',
    };

    it('should use services array to populate legacyVAR.settings', () => {
      const result = setSupportedSchedulingMethods({
        location: { ...locationMock },
        settings: settingsMock,
      });

      expect(result.legacyVAR.settings).to.have.property(
        TYPE_OF_CARE_IDS.PRIMARY_CARE,
      );
      expect(result.legacyVAR.settings).to.have.property(
        TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
      );
      expect(
        result.legacyVAR.settings[TYPE_OF_CARE_IDS.PRIMARY_CARE].direct.enabled,
      ).to.equal(true);
    });

    it('should include VPG format fields when present in services', () => {
      const result = setSupportedSchedulingMethods({
        location: { ...locationMock },
        settings: settingsMock,
      });

      expect(result.legacyVAR.settings).to.have.property(
        TYPE_OF_CARE_IDS.PRIMARY_CARE,
      );
      expect(
        result.legacyVAR.settings[TYPE_OF_CARE_IDS.PRIMARY_CARE]
          .bookedAppointments,
      ).to.equal(true);
    });

    it('should add VHA identifier if not present', () => {
      const locationWithoutVHA = {
        id: '983',
        identifier: [],
        name: 'Test Location',
      };

      const result = setSupportedSchedulingMethods({
        location: locationWithoutVHA,
        settings: settingsMock,
      });

      expect(result.identifier).to.have.lengthOf(1);
      expect(result.identifier[0].system).to.equal(VHA_FHIR_ID);
      expect(result.identifier[0].value).to.equal('983');
    });

    it('should return empty settings when facility not found in settings', () => {
      const result = setSupportedSchedulingMethods({
        location: { ...locationMock, id: '999' },
        settings: settingsMock,
      });

      expect(result.legacyVAR.settings).to.deep.equal({});
    });
  });

  describe('transformCommunityProviders', () => {
    it('should transform an array of PPMS providers into Location resources', () => {
      const providers = [
        {
          id: 'provider1',
          uniqueId: '12345',
          firstName: 'John',
          lastName: 'Doe',
          practiceName: 'Test Practice',
          address: {
            street: '123 Main St',
            city: 'Test City',
            state: 'TC',
            zip: '12345',
          },
          long: -100.0,
          lat: 40.0,
          caresitePhone: '555-1234',
        },
      ];

      const result = transformCommunityProviders(providers);

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal('provider1');
      expect(result[0].resourceType).to.equal('Location');
      expect(result[0].providerName).to.equal('John Doe');
      expect(result[0].practiceName).to.equal('Test Practice');
      expect(result[0].address.city).to.equal('Test City');
      expect(result[0].telecom[0].value).to.equal('555-1234');
    });

    it('should handle providers without lastName', () => {
      const providers = [
        {
          id: 'provider1',
          uniqueId: '12345',
          practiceName: 'Test Practice',
          address: {
            street: '123 Main St',
            city: 'Test City',
            state: 'TC',
            zip: '12345',
          },
        },
      ];

      const result = transformCommunityProviders(providers);

      expect(result[0].providerName).to.be.undefined;
    });
  });

  describe('transformParentFacilitiesV2', () => {
    it('should filter facilities where id equals vastParent', () => {
      const facilities = [
        {
          id: '983',
          vastParent: '983',
          name: 'Parent Facility',
          vistaSite: '983',
        },
        {
          id: '983GC',
          vastParent: '983',
          name: 'Child Facility',
          vistaSite: '983',
        },
      ];

      const result = transformParentFacilitiesV2(facilities);

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal('983');
      expect(result[0].name).to.equal('Parent Facility');
    });
  });

  describe('transformFacilitiesV2', () => {
    it('should transform a list of facilities into Location resources', () => {
      const facilities = [
        {
          id: '983',
          vistaSite: '983',
          name: 'Facility 1',
        },
        {
          id: '984',
          vistaSite: '984',
          name: 'Facility 2',
        },
      ];

      const result = transformFacilitiesV2(facilities);

      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal('983');
      expect(result[1].id).to.equal('984');
    });
  });
});
