import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationPageWrapper from './EnrollmentVerificationPageWrapper';

import BenefitsProfileWrapper from './BenefitsProfilePageWrapper';
import { useData } from '../hooks/useData';

export default function App({ children }) {
  const {
    loading = false,
    expirationDate = '',
    updated = '',
    month = '',
    day = '',
    indicator: applicantChapter = '',
    pendingDocuments = [],
    latestAddress = '',
    claimantId = '',
    fullName = '',
    indicator = '',
    enrollmentVerifications = [],
  } = useData();
  return (
    <>
      <EnrollmentVerificationPageWrapper
        data={{
          expirationDate,
          updated,
          month,
          day,
          loading,
          indicator,
          enrollmentVerifications,
          claimantId,
        }}
      >
        {children}
      </EnrollmentVerificationPageWrapper>
      <BenefitsProfileWrapper
        data={{
          loading,
          expirationDate,
          updated,
          month,
          day,
          indicator: applicantChapter,
          pendingDocuments,
          latestAddress,
          claimantId,
          fullName,
        }}
      >
        {children}
      </BenefitsProfileWrapper>
    </>
  );
}

App.propTypes = {
  children: PropTypes.any,
};
