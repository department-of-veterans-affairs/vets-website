import React, { useEffect } from 'react';
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

  const {
    loading,
    patientRelationshipsError,
    patientProviderRelationships,
  } = useGetPatientRelationships();

  // page header setup
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const singleProviderTitle = `Your ${typeOfCare.name.toLowerCase()} provider`;
  const cantScheduleTitle = "You can't schedule this appointment online";
  const hasProviders = (patientProviderRelationships?.length || 0) > 0;

  // eligibility issues
  const isEligibleForRequest = eligibility?.request;
  const overRequestLimit =
    eligibility.requestReasons[0] === ELIGIBILITY_REASONS.overRequestLimit;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  const pageHeader = () => {
    // Providers endpoint returns with an error
    if (patientRelationshipsError) return pageTitle;

    // Single provider header
    if (patientProviderRelationships?.length === 1) return singleProviderTitle;

    // No provider header, no error
    if ((patientProviderRelationships?.length || 0) === 0)
      // coerce this to 0
      return cantScheduleTitle;

    // return default pageTitle
    return pageTitle;
  };

  const ProviderInfo = () => (
    <>
      <div>
        <strong>Type of care:</strong> {typeOfCare?.name}
        <br />
        <strong>Facility:</strong> {selectedFacility?.name}
      </div>
      {patientProviderRelationships.map((provider, index) => (
        <ProviderCard key={index} provider={provider} />
      ))}
    </>
  );

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
        {pageHeader()}
      </h1>

      {/* Error state, an error is returned, no providers returned */}
      {patientRelationshipsError &&
        !hasProviders && (
          <>
            <ProviderInfo />
            <BackendProviderServiceAlert
              selectedFacility={selectedFacility}
              isEligibleForRequest={isEligibleForRequest}
              overRequestLimit={overRequestLimit}
            />
          </>
        )}

      {/* No providers returned, no error returned */}
      {!hasProviders &&
        !patientRelationshipsError && (
          <NoAvailableProvidersInfo
            isEligibleForRequest={isEligibleForRequest}
            overRequestLimit={overRequestLimit}
            selectedFacility={selectedFacility}
            typeOfCareName={typeOfCare?.name}
          />
        )}

      {/* Has providers returned, no errors */}
      {hasProviders ? <ProviderInfo /> : null}

      <ScheduleWithDifferentProvider
        isEligibleForRequest={isEligibleForRequest}
        overRequestLimit={overRequestLimit}
        selectedFacility={selectedFacility}
        hasProviders={hasProviders}
        patientRelationshipsError={patientRelationshipsError}
      />
    </div>
  );
}
