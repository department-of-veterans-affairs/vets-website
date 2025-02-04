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
export const ResultMapper = (
  result,
  searchQuery,
  index,
  headerRef = null,
  headerHasFocus = null,
  setHeaderHasFocus = null,
) => {
  const showHealthConnectNumber = isHealthAndHealthConnect(result, searchQuery);
  const mobileMapProps = {
    headerRef,
    headerHasFocus,
    setHeaderHasFocus,
  };
  switch (searchQuery.facilityType) {
    case 'health':
    case 'cemetery':
    case 'benefits':
    case 'vet_center':
      return searchQuery.serviceType === Covid19Vaccine ? (
        <Covid19Result
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
          {...mobileMapProps}
        />
      ) : (
        <VaFacilityResult
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
          showHealthConnectNumber={showHealthConnectNumber}
          {...mobileMapProps}
        />
      );
    case 'provider':
      // Support non va urgent care search through ccp option
      if (searchQuery.serviceType === CLINIC_URGENTCARE_SERVICE) {
        return (
          <UrgentCareResult
            key={result.id}
            provider={result}
            query={searchQuery}
            {...mobileMapProps}
          />
        );
      }

      if (searchQuery.serviceType === PHARMACY_RETAIL_SERVICE) {
        return (
          <PharmacyResult
            key={result.id}
            provider={result}
            query={searchQuery}
            {...mobileMapProps}
          />
        );
      }

      if (EMERGENCY_CARE_SERVICES.includes(searchQuery.serviceType)) {
        return (
          <EmergencyCareResult
            key={result.id}
            provider={result}
            query={searchQuery}
            {...mobileMapProps}
          />
        );
      }

      return (
        <CCProviderResult
          key={result.id}
          provider={result}
          query={searchQuery}
          {...mobileMapProps}
        />
      );
    case 'pharmacy':
      return (
        <PharmacyResult
          key={result.id}
          provider={result}
          query={searchQuery}
          {...mobileMapProps}
        />
      );
    case 'emergency_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <EmergencyCareResult
            key={result.id}
            provider={result}
            query={searchQuery}
            {...mobileMapProps}
          />
        );
      }

      return (
        <VaFacilityResult
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
          {...mobileMapProps}
        />
      );
    case 'urgent_care':
      if (result.type === LocationType.CC_PROVIDER) {
        return (
          <UrgentCareResult
            key={result.id}
            provider={result}
            query={searchQuery}
            {...mobileMapProps}
          />
        );
      }

      return (
        <VaFacilityResult
          index={index}
          key={result.id}
          location={result}
          query={searchQuery}
          {...mobileMapProps}
        />
      );
    default:
      return null;
  }
};
