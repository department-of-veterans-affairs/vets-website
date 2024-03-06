import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import BenefitsProfileStatement from '../components/BenefitsProfileStatement';
import PayeeInformationWrapper from './PayeeInformationWrapper';
import PendingDocuments from '../components/PendingDocuments';
import PageLink from '../components/PageLink';
import {
  VERIFICATION_RELATIVE_URL,
  VERIFICATION_PROFILE_URL,
} from '../constants';
import { useData } from '../hooks/useData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';

const BenefitsProfileWrapper = ({ children }) => {
  useScrollToTop();
  const {
    loading,
    date,
    addressLine2,
    addressLine3,
    addressLine4,
    addressLine5,
    addressLine6,
    indicator: applicantChapter,
    fullName: applicantName,
    pendingDocuments,
  } = useData();

  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <BenefitsProfileStatement />
            <CurrentBenefitsStatus
              updated="12/04/2023"
              remainingBenefits="33 Months, 0 Days"
              expirationDate={date}
            />
            <PayeeInformationWrapper
              loading={loading}
              applicantChapter={applicantChapter}
              applicantName={applicantName}
            />
            <ChangeOfAddressWrapper
              loading={loading}
              applicantName={applicantName}
              mailingAddress={{
                street: `${addressLine3} ${addressLine2}`,
                city: addressLine4,
                state: addressLine5,
                zipCode: addressLine6,
              }}
            />
            <ChangeOfDirectDepositWrapper applicantName={applicantName} />
            <PendingDocuments
              loading={loading}
              pendingDocuments={pendingDocuments}
            />
            <PageLink
              linkText="See your enrollment verifications"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
              color="green"
              margin="2"
            />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

BenefitsProfileWrapper.propTypes = {
  children: PropTypes.any,
};

export default BenefitsProfileWrapper;
