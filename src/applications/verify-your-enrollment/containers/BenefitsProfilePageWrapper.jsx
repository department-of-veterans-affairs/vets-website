import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import BenefitsProfileStatement from '../components/BenefitsProfileStatement';
import PayeeInformationWrapper from './PayeeInformationWrapper';
import PendingDocuments from '../components/PendingDocuments';
import {
  VERIFICATION_RELATIVE_URL,
  VERIFICATION_PROFILE_URL,
} from '../constants';
import { useData } from '../hooks/useData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';
import Loader from '../components/Loader';

const BenefitsProfileWrapper = ({ children }) => {
  useScrollToTop();
  const {
    loading,
    expirationDate,
    updated,
    month,
    day,
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
            {loading ? (
              <Loader />
            ) : (
              <CurrentBenefitsStatus
                updated={updated}
                remainingBenefits={`${month} Months, ${day} Days`}
                expirationDate={expirationDate}
              />
            )}
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
            {children}
            <MoreInfoCard
              marginTop="7"
              linkText="Mongomery GI Bill Enrollment Verification"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
              className="vads-u-font-family--sans vads-u-font-weight--bold"
              linkDescription="Verify your enrollment and view past verifications for the Montgomery GI Bill."
            />
            <NeedHelp />
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
