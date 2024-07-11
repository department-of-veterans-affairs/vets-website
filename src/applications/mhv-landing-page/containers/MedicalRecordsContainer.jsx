import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import titleCase from '@department-of-veterans-affairs/platform-utilities/titleCase';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe, isProfileLoading } from '../selectors';
import MedicalRecords from '../components/MedicalRecords';

const Placeholder = () => <div style={{ height: '555px' }} />;

const pageHeading = 'Medical records';

const MedicalRecordsContainer = () => {
  const {
    loading: featureTogglesLoading,
    mhvTransitionalMedicalRecordsLandingPage,
  } = useSelector(state => state.featureToggles);
  const profileLoading = useSelector(isProfileLoading);

  useEffect(() => {
    document.title = `${titleCase(pageHeading)} | Veterans Affairs`;
  }, []);

  useEffect(
    () => {
      // For accessibility purposes.
      focusElement('h1');
    },
    [featureTogglesLoading, profileLoading],
  );

  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const blueButtonUrl = mhvUrl(ssoe, 'download-my-data');

  if (featureTogglesLoading) return <Placeholder />;

  if (!mhvTransitionalMedicalRecordsLandingPage) return <PageNotFound />;

  return profileLoading ? (
    <Placeholder />
  ) : (
    <>
      <MhvSecondaryNav />
      <MedicalRecords blueButtonUrl={blueButtonUrl} pageHeading={pageHeading} />
    </>
  );
};

export default MedicalRecordsContainer;
