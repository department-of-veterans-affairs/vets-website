import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ErrorMessage from '../../../components/ErrorMessage';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
import ProviderCard from './ProviderCard';

import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';
import { useGetPatientRelationships } from '../../hooks/useGetPatientRelationships';

const pageKey = 'selectProvider';

export default function SelectProviderPage() {
  // const dispatch = useDispatch();

  const { loading, patientRelationshipsError } = useGetPatientRelationships();

  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  if (patientRelationshipsError) {
    return <ErrorMessage level={1} />;
  }

  if (loading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading-indicator">
        <va-loading-indicator message="Loading the list of providers..." />
      </div>
    );
  }

  // const {
  //   // patientProviderRelationships,
  //   patientProviderRelationshipsStatus,
  // } = useSelector(selectPatientProviderRelationships, shallowEqual);

  const patientProviderRelationships = [];

  // const singleProviderTitle = 'Your nutrition and food provider';
  // const pageHeader =
  //   patientProviderRelationships.length > 1 ? pageTitle : singleProviderTitle;

  const pageHeader = 'Your nutrition and food provider';

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageHeader}</h1>
      <div>
        <strong>Type of care:</strong> Nutrition and Food <br />
        <strong>Facility:</strong> Grove City VA Clinic
      </div>

      {patientProviderRelationships.map((provider, index) => (
        <ProviderCard key={index} provider={provider} />
      ))}

      <ScheduleWithDifferentProvider />
    </div>
  );
}
