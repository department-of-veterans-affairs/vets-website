import { expect } from 'chai';
import CCProviderResult from '../../../../components/search-results-items/CCProviderResult';
import EmergencyCareResult from '../../../../components/search-results-items/EmergencyCareResult';
import PharmacyResult from '../../../../components/search-results-items/PharmacyResult';
import {
  isHealthAndHealthConnect,
  ResultMapper,
} from '../../../../components/search-results-items/common/ResultMapper';
import UrgentCareResult from '../../../../components/search-results-items/UrgentCareResult';
import VaFacilityResult from '../../../../components/search-results-items/VaFacilityResult';
import { PHARMACY_RETAIL_SERVICE } from '../../../../constants';

describe('ResultMapper', () => {
  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA health
    // Service type: All VA health services
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: 'null',
        facilityType: 'health',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA health
    // Service type: Gynecology
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: 'Gynecology',
        facilityType: 'health',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a CCProviderResult when the matching attributes are given', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Optometrist
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: '152W00000X',
        facilityType: 'provider',
      },
      0,
    );

    expect(result.type).to.equal(CCProviderResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: Urgent care
    // Service type: All in-network urgent care
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'urgent_care',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a UrgentCareResult when the matching attributes are given', () => {
    // Facility type: Urgent care
    // result: type: 'provider'
    const result = ResultMapper(
      { id: 0, type: 'provider' },
      {
        serviceType: null,
        facilityType: 'urgent_care',
      },
      0,
    );

    expect(result.type).to.equal(UrgentCareResult);
  });

  it('should return an UrgentCareResult when the matching attributes are given', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Clinic/Center - Urgent Care
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: '261QU0200X',
        facilityType: 'provider',
      },
      0,
    );

    expect(result.type).to.equal(UrgentCareResult);
  });

  it('should return an EmergencyCareResult when the matching attributes are given', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Clinic/Center - Emergency Care
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: '261QE0002X',
        facilityType: 'provider',
      },
      0,
    );

    expect(result.type).to.equal(EmergencyCareResult);
  });

  it('Should return CCP EmergencyCare result with a EmergencyCareResult type', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Optometrist
    const result = ResultMapper(
      { id: 0, type: 'provider' },
      {
        serviceType: '152W00000X',
        facilityType: 'emergency_care',
      },
      0,
    );

    expect(result.type).to.equal(EmergencyCareResult);
  });

  it('Should return CCP EmergencyCare result with a EmergencyCareResult type', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Optometrist
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: '152W00000X',
        facilityType: 'emergency_care',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a PharmacyResult when the matching attributes are given', () => {
    // Facility type: Community pharmacies (in VA's network)
    // Service type: N/A
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'pharmacy',
      },
      0,
    );

    expect(result.type).to.equal(PharmacyResult);
  });

  it('should return a PharmacyResult for provider', () => {
    // Facility type: Community pharmacies (in VA's network)
    // Service type: N/A
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: PHARMACY_RETAIL_SERVICE,
        facilityType: 'provider',
      },
      0,
    );

    expect(result.type).to.equal(PharmacyResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA benefits
    // Service type: N/A - All VA benefit services
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'benefits',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA cemeteries
    // Service type: N/A
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'cemetery',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: Vet Centers
    // Service type: N/A
    const result = ResultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'vet_center',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  describe('isHealthAndHealthConnect', () => {
    it('should return true for VA health if the health connect number exists', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.true;
    });

    it('should return false for VA health if the health connect number does not exist', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                fax: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.false;
    });

    it('should return false for VA health if the health connect number is empty', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '',
              },
            },
          },
          {
            facilityType: 'health',
          },
        ),
      ).to.be.false;
    });

    it('should return false for Vet Centers', () => {
      expect(
        isHealthAndHealthConnect(
          {
            attributes: {
              phone: {
                healthConnect: '123-456-7890',
              },
            },
          },
          {
            facilityType: 'vet_center',
          },
        ),
      ).to.be.false;
    });
  });
});
