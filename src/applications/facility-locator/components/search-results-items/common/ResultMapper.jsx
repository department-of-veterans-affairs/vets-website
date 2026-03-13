import React from 'react';
import CCProviderResult from '../CCProviderResult';
import EmergencyCareResult from '../EmergencyCareResult';
import PharmacyResult from '../PharmacyResult';
import UrgentCareResult from '../UrgentCareResult';
import VaFacilityResult from '../VaFacilityResult';
import {
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  EMERGENCY_CARE_SERVICES,
} from '../../../constants';

export const isHealthAndHealthConnect = (apiResult, query) => {
  return !!(
    query?.facilityType === LocationType.HEALTH &&
    apiResult?.attributes?.phone?.healthConnect
  );
};

// Receives a single result and returns the
// proper data structure / listing (e.g. VA health, VBA, Urgent care)
export const ResultMapper = (result, searchQuery, index, isMobile = false) => {
  const showHealthConnectNumber = isHealthAndHealthConnect(result, searchQuery);

  switch (searchQuery.facilityType) {
    case LocationType.HEALTH:
    case LocationType.CEMETERY:
    case LocationType.BENEFITS:
    case LocationType.VET_CENTER:
      return (
        <VaFacilityResult
          index={index}
          isMobile={isMobile}
          key={result.id}
          location={result}
          query={searchQuery}
          showHealthConnectNumber={showHealthConnectNumber}
          isCemetery={searchQuery.facilityType === LocationType.CEMETERY}
        />
      );
    case LocationType.CC_PROVIDER:
      // Support non va urgent care search through ccp option
      if (searchQuery.serviceType === CLINIC_URGENTCARE_SERVICE) {
        return (
          <UrgentCareResult
            isMobile={isMobile}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      if (searchQuery.serviceType === PHARMACY_RETAIL_SERVICE) {
        return (
          <PharmacyResult
            isMobile={isMobile}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      if (EMERGENCY_CARE_SERVICES.includes(searchQuery.serviceType)) {
        return (
          <EmergencyCareResult
            isMobile={isMobile}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <CCProviderResult
          isMobile={isMobile}
          key={result.id}
          provider={result}
          query={searchQuery}
        />
      );
    case LocationType.URGENT_CARE_PHARMACIES:
      return (
        <PharmacyResult
          isMobile={isMobile}
          key={result.id}
          provider={result}
          query={searchQuery}
        />
      );
    case LocationType.EMERGENCY_CARE:
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <EmergencyCareResult
            isMobile={isMobile}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <VaFacilityResult
          index={index}
          isMobile={isMobile}
          key={result.id}
          location={result}
          query={searchQuery}
          isCemetery={false}
        />
      );
    case LocationType.URGENT_CARE:
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <UrgentCareResult
            isMobile={isMobile}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <VaFacilityResult
          index={index}
          isMobile={isMobile}
          key={result.id}
          location={result}
          query={searchQuery}
          isCemetery={false}
        />
      );
    default:
      return null;
  }
};
