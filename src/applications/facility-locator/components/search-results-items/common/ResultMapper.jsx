import React from 'react';
import CCProviderResult from '../CCProviderResult';
import Covid19Result from '../Covid19Result';
import EmergencyCareResult from '../EmergencyCareResult';
import PharmacyResult from '../PharmacyResult';
import UrgentCareResult from '../UrgentCareResult';
import VaFacilityResult from '../VaFacilityResult';
import {
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  Covid19Vaccine,
  EMERGENCY_CARE_SERVICES,
} from '../../../constants';
import { isHealthAndHealthConnect } from '../../../utils/phoneNumbers';

// Receives a single result and returns the
// proper data structure / listing (e.g. VA health, VBA, Urgent care)
export const ResultMapper = (result, searchQuery, index, headerRef = null) => {
  const showHealthConnectNumber = isHealthAndHealthConnect(result, searchQuery);

  switch (searchQuery.facilityType) {
    case 'health':
    case 'cemetery':
    case 'benefits':
    case 'vet_center':
      return searchQuery.serviceType === Covid19Vaccine ? (
        <Covid19Result
          headerRef={headerRef}
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
        />
      ) : (
        <VaFacilityResult
          headerRef={headerRef}
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
          showHealthConnectNumber={showHealthConnectNumber}
        />
      );
    case 'provider':
      // Support non va urgent care search through ccp option
      if (searchQuery.serviceType === CLINIC_URGENTCARE_SERVICE) {
        return (
          <UrgentCareResult
            headerRef={headerRef}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      if (searchQuery.serviceType === PHARMACY_RETAIL_SERVICE) {
        return (
          <PharmacyResult
            headerRef={headerRef}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      if (EMERGENCY_CARE_SERVICES.includes(searchQuery.serviceType)) {
        return (
          <EmergencyCareResult
            headerRef={headerRef}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <CCProviderResult
          headerRef={headerRef}
          key={result.id}
          provider={result}
          query={searchQuery}
        />
      );
    case 'pharmacy':
      return (
        <PharmacyResult
          headerRef={headerRef}
          key={result.id}
          provider={result}
          query={searchQuery}
        />
      );
    case 'emergency_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <EmergencyCareResult
            headerRef={headerRef}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <VaFacilityResult
          headerRef={headerRef}
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
        />
      );
    case 'urgent_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <UrgentCareResult
            headerRef={headerRef}
            key={result.id}
            provider={result}
            query={searchQuery}
          />
        );
      }

      return (
        <VaFacilityResult
          headerRef={headerRef}
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
        />
      );
    default:
      return null;
  }
};
