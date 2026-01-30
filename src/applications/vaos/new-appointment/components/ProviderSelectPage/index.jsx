import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
import ProviderCard from './ProviderCard';
import BackendProviderServiceAlert from './BackendProviderServiceAlert';
import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';
import { useGetPatientRelationships } from '../../hooks/useGetPatientRelationships';
import {
  selectEligibility,
  selectTypeOfCare,
  selectChosenFacilityInfo,
} from '../../redux/selectors';
import { ELIGIBILITY_REASONS } from '../../../utils/constants';
import NoAvailableProvidersInfo from './NoAvailableProvidersInfo';

const pageKey = 'selectProvider';

export default function SelectProviderPage() {
  const typeOfCare = useSelector(selectTypeOfCare);
  const eligibility = useSelector(selectEligibility);
  const selectedFacility = useSelector(selectChosenFacilityInfo);

  const isEligibleForDirect = eligibility?.direct;

  const {
    loading,
    patientRelationshipsError,
    patientProviderRelationships,
  } = useGetPatientRelationships({ skip: !isEligibleForDirect });

  // page header setup
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const singleProviderTitle = `Your ${typeOfCare.name.toLowerCase()} provider`;
  const cantScheduleTitle = "You can't schedule this appointment online";
  const hasProviders = (patientProviderRelationships?.length || 0) > 0;

  // eligibility issues
  const isEligibleForRequest = eligibility?.request;
  const overRequestLimit =
    eligibility.requestReasons[0] === ELIGIBILITY_REASONS.overRequestLimit;
  const requestEligibilityError =
    eligibility.requestReasons[0] === ELIGIBILITY_REASONS.error;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  const pageHeader = useMemo(
    () => {
      // Providers endpoint returns with an error
      if (patientRelationshipsError) return pageTitle;

      // Single provider header, no error
      if (patientProviderRelationships?.length === 1)
        return singleProviderTitle;

      // No provider header, no error
      if (!hasProviders) return cantScheduleTitle;

      // return default pageTitle
      return pageTitle;
    },
    [
      patientRelationshipsError,
      pageTitle,
      patientProviderRelationships,
      singleProviderTitle,
      hasProviders,
      cantScheduleTitle,
    ],
  );

  function TypeOfCareAndFacilityInfo() {
    return (
      <>
        <div>
          <strong>Type of care:</strong> {typeOfCare?.name}
          <br />
          <strong>Facility:</strong> {selectedFacility?.name}
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading-indicator">
        <va-loading-indicator message="Loading the list of providers..." />
      </div>
    );
  }

  return (
    <div>
      <h1
        data-testid="page-header-provider-select"
        className="vads-u-font-size--h2"
      >
        {pageHeader}
      </h1>

      {/* Error state, an error is returned, no providers returned */}
      {patientRelationshipsError &&
        !hasProviders && (
          <>
            <TypeOfCareAndFacilityInfo />
            <BackendProviderServiceAlert
              selectedFacility={selectedFacility}
              isEligibleForRequest={isEligibleForRequest}
              overRequestLimit={overRequestLimit}
            />
          </>
        )}

      {/* No providers returned, no error returned */}
      {!patientRelationshipsError &&
        !hasProviders && (
          <NoAvailableProvidersInfo
            isEligibleForRequest={isEligibleForRequest}
            overRequestLimit={overRequestLimit}
            selectedFacility={selectedFacility}
            typeOfCareName={typeOfCare?.name}
          />
        )}

      {/* Has providers returned, no errors */}
      {hasProviders && isEligibleForDirect ? (
        <>
          <TypeOfCareAndFacilityInfo />
          {patientProviderRelationships.map((provider, index) => (
            <ProviderCard key={index} provider={provider} />
          ))}
        </>
      ) : null}

      <ScheduleWithDifferentProvider
        requestEligibilityError={requestEligibilityError}
        isEligibleForRequest={isEligibleForRequest}
        overRequestLimit={overRequestLimit}
        selectedFacility={selectedFacility}
        hasProviders={hasProviders}
        patientRelationshipsError={patientRelationshipsError}
      />
    </div>
  );
}
