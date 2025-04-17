import React from 'react';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import { isLOA3, isVAPatient } from '../selectors';

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
