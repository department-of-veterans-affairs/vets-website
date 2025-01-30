import React from 'react';
import CCProviderResult from '../components/search-results-items/CCProviderResult';
import Covid19Result from '../components/search-results-items/Covid19Result';
import EmergencyCareResult from '../components/search-results-items/EmergencyCareResult';
import PharmacyResult from '../components/search-results-items/PharmacyResult';
import UrgentCareResult from '../components/search-results-items/UrgentCareResult';
import VaFacilityResult from '../components/search-results-items/VaFacilityResult';
import {
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  Covid19Vaccine,
  EMERGENCY_CARE_SERVICES,
} from '../constants';
import { isHealthAndHealthConnect } from './phoneNumbers';

export const resultMapper = (result, searchQuery, index) => {
  const showHealthConnectNumber = isHealthAndHealthConnect(result, searchQuery);
  // const showHealthConnectNumber = isHealthAndHealthConnect(result, query);

  switch (searchQuery.facilityType) {
    case 'health':
    case 'cemetery':
    case 'benefits':
    case 'vet_center':
      return searchQuery.serviceType === Covid19Vaccine ? (
        <Covid19Result location={result} key={result.id} index={index} />
      ) : (
        <VaFacilityResult
          location={result}
          query={searchQuery}
          key={result.id}
          index={index}
          showHealthConnectNumber={showHealthConnectNumber}
        />
      );
    case 'provider':
      // Support non va urgent care search through ccp option
      if (searchQuery.serviceType === CLINIC_URGENTCARE_SERVICE) {
        return (
          <UrgentCareResult
            provider={result}
            query={searchQuery}
            key={result.id}
          />
        );
      }

      if (searchQuery.serviceType === PHARMACY_RETAIL_SERVICE) {
        return (
          <PharmacyResult
            provider={result}
            query={searchQuery}
            key={result.id}
          />
        );
      }

      if (EMERGENCY_CARE_SERVICES.includes(searchQuery.serviceType)) {
        return (
          <EmergencyCareResult
            provider={result}
            query={searchQuery}
            key={result.id}
          />
        );
      }

      return (
        <CCProviderResult
          provider={result}
          query={searchQuery}
          key={result.id}
        />
      );
    case 'pharmacy':
      return (
        <PharmacyResult provider={result} query={searchQuery} key={result.id} />
      );
    case 'emergency_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <EmergencyCareResult
            provider={result}
            query={searchQuery}
            key={result.id}
          />
        );
      }

      return (
        <VaFacilityResult
          location={result}
          query={searchQuery}
          key={result.id}
          index={index}
        />
      );
    case 'urgent_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <UrgentCareResult
            provider={result}
            query={searchQuery}
            key={result.id}
          />
        );
      }

      return (
        <VaFacilityResult
          location={result}
          query={searchQuery}
          key={result.id}
          index={index}
        />
      );
    default:
      return null;
  }
};
