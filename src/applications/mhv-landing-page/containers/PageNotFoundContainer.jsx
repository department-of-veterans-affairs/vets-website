import React from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { isLOA3, isVAPatient } from '../selectors';

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

  return (
    <>
      {isVerified && isAPatient && <MhvSecondaryNav />}
      <PageNotFound />
    </>
  );
};

export default PageNotFoundContainer;
