import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from 'platform/utilities/ui';
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
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';
import Loader from '../components/Loader';
import LoginAlert from '../components/LoginAlert';

const BenefitsProfileWrapper = ({ children }) => {
  const {
    loading,
    expirationDate,
    updated,
    month,
    day,
    indicator: applicantChapter,
    pendingDocuments,
    latestAddress,
    indicator,
  } = useData();
  const applicantName = latestAddress?.veteranName;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(
    TOGGLE_NAMES.toggleVyeAddressDirectDepositForms,
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
  useEffect(
    () => {
      focusElement('h1');
    },
    [userData],
  );
  return (
    <>
      <div />
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
              <Loader aria-hidden="true" />
            ) : (
              <CurrentBenefitsStatus
                updated={updated}
                remainingBenefits={`${month} Months, ${day} Days`}
                expirationDate={expirationDate}
                indicator={indicator}
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
                    street: `${
                      latestAddress?.address1
                    } ${latestAddress?.address2 ?? ''}`,
                    city: latestAddress?.city,
                    stateCode: latestAddress?.state,
                    zipCode: latestAddress?.zipCode,
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
              linkText="Verify your school enrollment"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
              className="vads-u-font-family--sans vads-u-font-weight--bold"
              linkDescription="If you're using GI Bill benefits, you can verify your enrollment for school or training on VA.gov."
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
