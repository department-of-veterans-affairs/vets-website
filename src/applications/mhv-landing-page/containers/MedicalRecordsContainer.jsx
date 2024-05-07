import React from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe, isProfileLoading } from '../selectors';
import MedicalRecords from '../components/MedicalRecords';

const Placeholder = () => <div style={{ height: '555px' }} />;

const MedicalRecordsContainer = () => {
  const {
    loading: featureTogglesLoading,
    mhvTransitionalMedicalRecordsLandingPage,
  } = useSelector(state => state.featureToggles);
  const profileLoading = useSelector(isProfileLoading);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const blueButtonUrl = mhvUrl(ssoe, 'download-my-data');

  if (featureTogglesLoading) return <Placeholder />;

  if (!mhvTransitionalMedicalRecordsLandingPage) return <PageNotFound />;

  return profileLoading ? (
    <Placeholder />
  ) : (
    <>
      <MhvSecondaryNav />
      <MedicalRecords blueButtonUrl={blueButtonUrl} />
    </>
  );
};

export default MedicalRecordsContainer;
