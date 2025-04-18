import React from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isLOA3, isProfileLoading, isVAPatient } from '../selectors';

/**
 * PageNotFoundContainer component.
 *
 * Renders a "Page Not Found" message with the MHV secondary navigation
 * if the user is verified (LOA3) and is a VA patient.
 *
 * @component
 * @returns {JSX.Element} The rendered PageNotFoundContainer component.
 */
const PageNotFoundContainer = () => {
  const isVerified = useSelector(isLOA3);
  const isAPatient = useSelector(isVAPatient);
  const loading = useSelector(isProfileLoading);

  if (loading) {
    return (
      <div className="vads-u-margin--5">
        <VaLoadingIndicator
          dataTestid="mhv-page-not-found--loading"
          message="Please wait..."
        />
      </div>
    );
  }
  return (
    <>
      {isVerified && isAPatient && <MhvSecondaryNav />}
      <PageNotFound />
    </>
  );
};

export default PageNotFoundContainer;
