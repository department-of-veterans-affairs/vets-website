import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import BenefitsProfileStatement from '../components/BenefitsProfileStatement';
import RemainingBenefits from '../components/RemainingBenefits';
import BenefitsExpirationDate from '../components/BenefitsExpirationDate';
import PayeeInformationWrapper from './PayeeInformationWrapper';
import PendingDocumentsWrapper from './PendingDocumentsWrapper';
import PageLink from '../components/PageLink';
import {
  VERIFICATION_RELATIVE_URL,
  VERIFICATION_PROFILE_URL,
} from '../constants';
import { useData } from '../hooks/useData';
import { useScrollToTop } from '../hooks/useScrollToTop';

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
            <PayeeInformationWrapper
              loading={loading}
              applicantChapter={applicantChapter}
              applicantName={applicantName}
            />
            <ChangeOfAddressWrapper
              loading={loading}
              mailingAddress={{
                street: `${addressLine3} ${addressLine2}`,
                city: addressLine4,
                state: addressLine5,
                zip: addressLine6,
              }}
            />
            <ChangeOfDirectDepositWrapper />
            <PendingDocumentsWrapper
              loading={loading}
              pendingDocuments={pendingDocuments}
            />
            <RemainingBenefits />
            <BenefitsExpirationDate date={date} loading={loading} />
            <PageLink
              linkText="See your enrollment verifications"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
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
