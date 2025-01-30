import { expect } from 'chai';
import { resultMapper } from '../../utils/resultMapper';
import CCProviderResult from '../../components/search-results-items/CCProviderResult';
import Covid19Result from '../../components/search-results-items/Covid19Result';
import EmergencyCareResult from '../../components/search-results-items/EmergencyCareResult';
import PharmacyResult from '../../components/search-results-items/PharmacyResult';
import UrgentCareResult from '../../components/search-results-items/UrgentCareResult';
import VaFacilityResult from '../../components/search-results-items/VaFacilityResult';

describe('resultMapper', () => {
  it('should return a Covid19Result when the matching attributes are given', () => {
    // Facility type: VA health
    // Service type: COVID-19 vaccines
    const result = resultMapper(
      { id: 0 },
      {
        serviceType: 'Covid19Vaccine',
        facilityType: 'health',
      },
      0,
    );

    expect(result.type).to.equal(Covid19Result);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA health
    // Service type: All VA health services
    const result = resultMapper(
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
    const result = resultMapper(
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
    const result = resultMapper(
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
    const result = resultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'urgent_care',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });

  it('should return an UrgentCareResult when the matching attributes are given', () => {
    // Facility type: Community providers (in VA's network)
    // Service type: Clinic/Center - Urgent Care
    const result = resultMapper(
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
    const result = resultMapper(
      { id: 0 },
      {
        serviceType: '261QE0002X',
        facilityType: 'provider',
      },
      0,
    );

    expect(result.type).to.equal(EmergencyCareResult);
  });

  it('should return a PharmacyResult when the matching attributes are given', () => {
    // Facility type: Community pharmacies (in VA's network)
    // Service type: N/A
    const result = resultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'pharmacy',
      },
      0,
    );

    expect(result.type).to.equal(PharmacyResult);
  });

  it('should return a VaFacilityResult when the matching attributes are given', () => {
    // Facility type: VA benefits
    // Service type: N/A - All VA benefit services
    const result = resultMapper(
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
    const result = resultMapper(
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
    const result = resultMapper(
      { id: 0 },
      {
        serviceType: null,
        facilityType: 'vet_center',
      },
      0,
    );

    expect(result.type).to.equal(VaFacilityResult);
  });
});
