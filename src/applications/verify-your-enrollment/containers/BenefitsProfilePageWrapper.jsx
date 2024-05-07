import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
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
import LoginAlert from '../components/LoginAlert';

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
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(
    TOGGLE_NAMES.toggleVyeAdressDirectDepositForms,
  );
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: {
            attributes: { profile },
          },
        } = await apiRequest('/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUserData(profile);
      } catch (error) {
        throw new Error(error);
      }
    };
    getUserData();
  }, []);

  const { signIn } = userData;

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
            {toggleValue || window.isProduction ? (
              <>
                <ChangeOfAddressWrapper
                  loading={loading}
                  applicantName={applicantName}
                  mailingAddress={{
                    street: `${addressLine3} ${addressLine2}`,
                    city: addressLine4,
                    stateCode: addressLine5,
                    zipCode: addressLine6,
                  }}
                />
                {signIn?.serviceName === 'idme' ||
                signIn?.serviceName === 'logingov' ? (
                  <ChangeOfDirectDepositWrapper applicantName={applicantName} />
                ) : (
                  <LoginAlert />
                )}
              </>
            ) : null}
            <PendingDocuments
              loading={loading}
              pendingDocuments={pendingDocuments}
            />
            {children}
            <MoreInfoCard
              marginTop="7"
              linkText="Montgomery GI Bill Enrollment Verification"
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
