import React from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe, isProfileLoading } from '../selectors';
import MedicalRecords from '../components/MedicalRecords';

const MedicalRecordsContainer = () => {
  const loading = useSelector(isProfileLoading);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const blueButtonUrl = mhvUrl(ssoe, 'download-my-data');

  return loading ? (
    <va-loading-indicator />
  ) : (
    <MedicalRecords blueButtonUrl={blueButtonUrl} />
  );
};

export default MedicalRecordsContainer;
